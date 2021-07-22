/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';
import Constant from '../../Constant';

function World(props) {
    useEffect(() => {
        const loadModel = (fullpath) => {
            console.log("load world: ", fullpath);
            let manager = new THREE.LoadingManager();
            manager.addHandler(/\.tga$/i, new TGALoader());

            let isFBX = (fullpath.includes('fbx') || fullpath.includes('FBX'));
            let loader = isFBX ? new FBXLoader(manager) : new GLTFLoader();
            return new Promise((resolve, reject) =>
                loader.load(fullpath, (loaded) => {
                    let model = loaded.scene ? loaded.scene : loaded;
                    model.traverse(parseRig);
                    postprocess({ model: model, offsetScale: props.scale || 0.05, offsetPosition: { x: 0, y: -5, z: 0 } });
                    resolve(model);
                })
            );
        }

        async function init() {
            const model = await loadModel(Constant.BASE_URL + '/world/' + props.world);
            props.scene.add(model);
            props.onLoad && props.onLoad('loaded');
        }

        init();
    }, []);

    const parseRig = (obj) => {
        try {
            obj.frustumCulled = false;

            if (obj.type.indexOf('ight') > 0) {
                console.log("Remove included lights: " + obj.name);
                obj.intensity = 0
            }

            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;

                if (obj.material.map) {
                    obj.material.map.anisotropy = 8;
                }
            }
        } catch (e) { }
    }

    const postprocess = ({ model, offsetPosition, offsetRotation, offsetScale }) => {
        if (offsetPosition) {
            model.position.x += offsetPosition.x;
            model.position.y += offsetPosition.y;
            model.position.z += offsetPosition.z;
        }

        if (offsetRotation) {
            model.rotation.x += offsetRotation.x;
            model.rotation.y += offsetRotation.y;
            model.rotation.z += offsetRotation.z;
        }

        if (offsetScale) {
            model.scale.set(offsetScale, offsetScale, offsetScale);
        }
    }

    return (<>
    </>);
}

export default World;