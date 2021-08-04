/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';
import Constant from '../../Constant';
import DatGuiComponent from './DatGuiComponent';
import Animation from './Animation';
import Movement from './Movement';
import ResourceTracker from './ResourceTracker';

const MaterialsToDisableTransparency = [
    'Hair_Transparency',
    'long_straight_Transparency'
]

const DISPOSE_WHEN_MODEL_CHANGED = true;

// let g_model;
let g_loader;

function Character(props) {
    const [animationIndex, setAnimationIndex] = useState(8);
    const [character, setCharacter] = useState(undefined);

    const resetManager = new ResourceTracker();

    useEffect(() => {
        return () => {
            try {
                // resetManager.dispose();
                console.log("Character unmounted.");
                g_loader && g_loader.abort();
            } catch (err) { console.log(err) }
        }
    }, []);

    useEffect(() => {
        const removeAllModels = () => {
            props.scene.children.forEach(m => {
                if (m.characterType === 'character') {
                    console.log("removed character ", m.name);
                    props.scene.remove(m);
                }
            });
        }

        const loadModel = (fullpath) => {
            console.log("load character: ", fullpath);
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
                        // g_model = model;
                        // const track = resetManager.track.bind(resetManager);
                        // const root = track()
                        resolve(model);
                    },
                    (event) => {
                        const p = Math.floor(event.loaded * 100 / event.total);
                        console.log("loading " + p + '%')
                        props.onProgress && props.onProgress(p);
                    },
                    (err) => console.log("error: ", err)
                )
            );
        }

        function init() {
            loadModel(Constant.BASE_URL + '/character/' + props.character).then(model => {
                props.scene.add(model);
                console.log("onLoad: model", model);
                props.onLoad && props.onLoad('loaded');
            });
        }

        console.log("---------------------------------------------character changed : ", props.scene);
        removeAllModels();
        init();
    }, [props.character]);

    const updateMaterial = (name, mat) => {
        MaterialsToDisableTransparency.forEach((item) => {
            if (mat.name === item) {
                console.log("::MATERIAL[" + name + "] " + mat.name + " transparent to false");
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
                <div style={{ display: props.hideAll ? 'none' : 'block', position: 'fixed', top: '5%', right: 0 }} >
                    <DatGuiComponent
                        character={character}
                        onChangeAnimation={setAnimationIndex}
                    />
                </div>
                <Animation
                    character={character}
                    delta={props.delta}
                    animationIndex={animationIndex}
                />
                <div style={{ position: 'fixed', bottom: '5%', left: 0 }}>
                    <Movement
                        character={character}
                        hideAll={props.hideAll}
                    />
                </div>
            </>
        }
    </>);
}

export default Character;

