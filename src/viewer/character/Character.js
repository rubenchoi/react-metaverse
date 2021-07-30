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

const ObjectsToDisableTransparency = [
    'Short_ponytail', 'Half_up', 'hair'
]

const MaterialsToDisableTransparency = [
    'Hair_Transparency'
]

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
                    postprocess({ model: model, geo: props.geo });
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

    const updateMaterial = (name, mat) => {
        MaterialsToDisableTransparency.forEach((item) => {
            if (mat.name.includes(item)) {
                console.log("::MATERIAL[" + name + "] " + mat.name + " transparent to false");
                mat.transparent = false;
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

                    // let isToChangeMaterial;
                    // ObjectsToDisableTransparency.forEach((m) => {
                    //     if (obj.name.includes(m)) {
                    //         isToChangeMaterial = true;
                    //         return;
                    //     }
                    // })
                    // if (isToChangeMaterial) 
                    {
                        const material = obj.material;
                        if (Array.isArray(material)) {
                            material.forEach(m => updateMaterial(obj.name, m));
                        } else {
                            updateMaterial(obj.name, material);
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

    const postprocess = ({ model, geo }) => {
        if (geo.position) {
            model.position.x += geo.position.x;
            model.position.y += geo.position.y;
            model.position.z += geo.position.z;
        }

        if (geo.rotation) {
            model.rotation.x += geo.rotation.x;
            model.rotation.y += geo.rotation.y;
            model.rotation.z += geo.rotation.z;
        }

        model.scale.set(geo.scale, geo.scale, geo.scale);
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