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

function Character(props) {
    const [animationIndex, setAnimationIndex] = useState(-1);
    const [character, setCharacter] = useState(undefined);

    useEffect(() => {
        const loadModel = (fullpath) => {
            console.log("load character: ", fullpath);
            let manager = new THREE.LoadingManager();
            manager.addHandler(/\.tga$/i, new TGALoader());

            let isFBX = (fullpath.includes('fbx') || fullpath.includes('FBX'));
            let loader = isFBX ? new FBXLoader(manager) : new GLTFLoader();
            return new Promise((resolve, reject) =>
                loader.load(fullpath, (loaded) => {
                    let model = loaded.scene || loaded;
                    model.traverse(parseRig);
                    postprocess({ model: model, scale: props.scale });
                    setCharacter(model);
                    resolve(model);
                })
            );
        }

        async function init() {
            const model = await loadModel(Constant.BASE_URL + '/character/' + props.character);
            props.scene.add(model);
            console.log("onLoad: model", model);
            props.onLoad && props.onLoad('loaded');
        }

        init();
    }, []);

    const parseRig = (obj) => {
        try {
            switch (obj.type) {
                case "Mesh":
                case "SkinnedMesh":
                    obj.castShadow = true;
                    obj.receiveShadow = true;

                    const material = obj.material;
                    if (obj.name.includes('hair')) {
                        if (Array.isArray(material)) {
                            material.forEach(m => {
                                console.log("*PROCESSED*" + obj.name + " Material " + material.name + " depthWrite to false");
                                m.depthWrite = false;
                            })
                        }
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

    const postprocess = ({ model, position, rotation, scale }) => {
        if (position) {
            model.position.x += position.x;
            model.position.y += position.y;
            model.position.z += position.z;
        }

        if (rotation) {
            model.rotation.x += rotation.x;
            model.rotation.y += rotation.y;
            model.rotation.z += rotation.z;
        }

        model.scale.set(scale, scale, scale);
    }

    return (<>
        {character &&
            <>
                <div style={{ position: 'fixed', top: '5%', right: 0 }} >
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
                    />
                </div>
            </>
        }
    </>);
}

export default Character;