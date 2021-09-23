/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';
import Constant from '../../Constant';
import DatGuiComponent from './DatGuiComponent';
import Animation from './Animation';

const MaterialsToDisableTransparency = [
    'Hair_Transparency',
    'long_straight_Transparency'
]

let g_loader;

function Character(props) {
    const [animationIndex, setAnimationIndex] = useState(0);
    const [character, setCharacter] = useState(undefined);
    const [rigInfo, setRigInfo] = useState(undefined);


    useEffect(() => {
        return () => {
            try {
                props.debug && console.log("Character unmounted.");
                g_loader && g_loader.abort();
            } catch (err) { props.debug && console.log(err) }
        }
    }, []);

    useEffect(() => {
        const removeAllModels = () => {
            props.scene.children.forEach(m => {
                if (m.characterType === 'character') {
                    props.debug && console.log("removed character ", m.name);
                    props.scene.remove(m);
                }
            });
        }

        const loadModel = (fullpath) => {
            props.debug && console.log("load character: ", fullpath);
            let manager = new THREE.LoadingManager();
            manager.addHandler(/\.tga$/i, new TGALoader());

            let isFBX = (fullpath.includes('fbx') || fullpath.includes('FBX'));
            let loader = isFBX ? new FBXLoader(manager) : new GLTFLoader();
            return new Promise((resolve, reject) =>
                g_loader = loader.load(fullpath,
                    (loaded) => {
                        let model = loaded.scene || loaded;
                        model.name = fullpath;
                        model.characterType = 'character';
                        model.traverse(parseRig);
                        postprocess({ model: model, geo: props.geo });
                        setCharacter(model);
                        resolve(model);
                    },
                    (event) => {
                        const p = Math.floor(event.loaded * 100 / event.total);
                        props.debug && console.log("loading " + p + '%')
                        props.callbacks && props.callbacks.onProgress && props.callbacks.onProgress(p);
                    },
                    (err) => props.debug && console.log("error: ", err)
                )
            );
        }

        removeAllModels();

        loadModel(Constant.BASE_URL + '/character/' + props.character).then(model => {
            props.scene.add(model);
            props.debug && console.log("onLoad: model", model);
            props.callbacks && props.callbacks.onLoad && props.callbacks.onLoad('loaded');
        });

        props.debug && console.log("scene loaded:", props.scene);

    }, [props.character]);

    useEffect(() => {
        const moveBone = (arrays) => {
            props.debug && console.log("moveBone()", arrays);
            arrays.forEach((item, idx) => {
                for (const [key, value] of Object.entries(item)) {
                    let [name, positionOrRotate, axis, add] = key.split(':');
                    props.debug && console.log("moveBone[" + idx + "]", name, positionOrRotate, axis, value, add, rigInfo.bone);
                    if (add) {
                        rigInfo.bone[name][positionOrRotate === 'p' ? 'position' : 'rotation'][axis] += value;
                    } else {
                        rigInfo.bone[name][positionOrRotate === 'p' ? 'position' : 'rotation'][axis] = value;
                    }
                }
            });
        }

        const moveMorphTarget = (arrays) => {
            props.debug && console.log("moveTarget()", arrays);
            arrays.forEach((item) => {
                for (const [key, value] of Object.entries(item)) {
                    props.debug && console.log("moveTarget-" + key + " <= ", key, value);
                    let pair = rigInfo.morphTarget[key];
                    pair.bone.morphTargetInfluences[pair.index] = value;
                }
            });
        }

        try {
            if (props.rig.animation) {
                props.debug && console.log("animation: ", props.rig.animation);
                setAnimationIndex(props.rig.animation);
            }
            if (props.rig.bone) {
                moveBone(props.rig.bone);
            }
            if (props.rig.morphTarget) {
                moveMorphTarget(props.rig.morphTarget);
            }
        } catch (err) {
            props.debug && console.log(err);
        }
    }, [props.rig]);

    const updateMaterial = (name, mat) => {
        MaterialsToDisableTransparency.forEach((item) => {
            if (mat.name === item) {
                props.debug && console.log("::MATERIAL[" + name + "] " + mat.name + " transparent to false");
                mat.transparent = false;
                mat.alphaMap = null;
                return;
            }
        })
    }

    const parseRig = (obj) => {
        try {
            switch (obj.type) {
                case "Mesh":
                case "SkinnedMesh":
                    obj.castShadow = true;
                    obj.receiveShadow = true;

                    const material = obj.material;
                    if (Array.isArray(material)) {
                        material.forEach(m => updateMaterial(obj.name, m));
                    } else {
                        updateMaterial(obj.name, material);
                    }
                    break;
                case "Bone":
                default:
                    return;
            }

            obj.frustumCulled = false;

            //remove lights included in model file
            if (obj.type.indexOf('ight') > 0) {
                obj.intensity = 0
            }
        } catch (e) { }
    }

    const postprocess = ({ model, geo }) => {
        if (geo && geo.position) {
            model.position.x += geo.position.x;
            model.position.y += geo.position.y;
            model.position.z += geo.position.z;
        }

        if (geo && geo.rotation) {
            model.rotation.x += geo.rotation.x;
            model.rotation.y += geo.rotation.y;
            model.rotation.z += geo.rotation.z;
        }

        if (geo && geo.scale) {
            model.scale.set(geo.scale, geo.scale, geo.scale);
        }
    }

    return (<>
        {character &&
            <>
                <div style={{ position: 'fixed', top: '5%', right: 0 }} >
                    <DatGuiComponent
                        visible={!props.hideAll}
                        character={character}
                        callbacks={{
                            requestChangeAnimation: setAnimationIndex,
                            onLoad: (info) => {
                                setRigInfo(info);
                                props.callbacks && props.callbacks.onMoveInfo && props.callbacks.onMoveInfo(info);
                            }
                        }}
                        debug={false}
                    />
                </div>
                <Animation
                    character={character}
                    delta={props.delta}
                    animationIndex={animationIndex}
                />
            </>
        }
    </>);
}

export default Character;

