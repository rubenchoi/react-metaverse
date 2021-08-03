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

const MaterialsToDisableTransparency = [
    'Hair_Transparency',
    'long_straight_Transparency'
]

let g_model;

function Character(props) {
    const [animationIndex, setAnimationIndex] = useState(8);
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
                    g_model = model;
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

        return () => dispose(g_model);
    }, []);

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

    const dispose = (model) => {
        const disposeHierarchy = (node, callback) => {
            for (var i = node.children.length - 1; i >= 0; i--) {
                var child = node.children[i];
                disposeHierarchy(child, callback);
                callback(child);
            }
        }

        try {
            disposeHierarchy(model, (node) => {
                if (node instanceof THREE.Mesh || node instanceof THREE.SkinnedMesh) {
                    if (node.geometry) {
                        node.geometry.dispose();
                    }

                    if (node.material) {
                        if (node.material instanceof THREE.MeshFaceMaterial) {
                            $.each(node.material.materials, function (idx, mtrl) {
                                if (mtrl.map) mtrl.map.dispose();
                                if (mtrl.lightMap) mtrl.lightMap.dispose();
                                if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                                if (mtrl.normalMap) mtrl.normalMap.dispose();
                                if (mtrl.specularMap) mtrl.specularMap.dispose();
                                if (mtrl.envMap) mtrl.envMap.dispose();
                                if (mtrl.alphaMap) mtrl.alphaMap.dispose();
                                if (mtrl.aoMap) mtrl.aoMap.dispose();
                                if (mtrl.displacementMap) mtrl.displacementMap.dispose();
                                if (mtrl.emissiveMap) mtrl.emissiveMap.dispose();
                                if (mtrl.gradientMap) mtrl.gradientMap.dispose();
                                if (mtrl.metalnessMap) mtrl.metalnessMap.dispose();
                                if (mtrl.roughnessMap) mtrl.roughnessMap.dispose();

                                mtrl.dispose();
                            });
                        }
                        else {
                            if (node.material.map) node.material.map.dispose();
                            if (node.material.lightMap) node.material.lightMap.dispose();
                            if (node.material.bumpMap) node.material.bumpMap.dispose();
                            if (node.material.normalMap) node.material.normalMap.dispose();
                            if (node.material.specularMap) node.material.specularMap.dispose();
                            if (node.material.envMap) node.material.envMap.dispose();
                            if (node.material.alphaMap) node.material.alphaMap.dispose();
                            if (node.material.aoMap) node.material.aoMap.dispose();
                            if (node.material.displacementMap) node.material.displacementMap.dispose();
                            if (node.material.emissiveMap) node.material.emissiveMap.dispose();
                            if (node.material.gradientMap) node.material.gradientMap.dispose();
                            if (node.material.metalnessMap) node.material.metalnessMap.dispose();
                            if (node.material.roughnessMap) node.material.roughnessMap.dispose();

                            node.material.dispose();
                        }
                    }
                }
            })
        } catch (err) { console.log(err) };
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