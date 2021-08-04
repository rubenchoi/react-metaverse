/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import * as THREE from 'three';

function Landmarker(props) {
    useEffect(() => {
        const addObject = (scene, objects, x, y, z, src, userData) => {
            const geo = new THREE.PlaneGeometry(10, 10, 1);
            const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.name = 'landmark';
            scene.add(mesh);
            mesh.position.set(x, y, z);
            mesh.userData = userData;

            const loader = new THREE.TextureLoader();
            loader.load(src, (texture) => {
                texture.encoding = THREE.sRGBEncoding;
                mat.map = texture;
                mat.needsUpdate = true;
            });

            objects && objects.push(mesh);
        }

        const addObjects = (scene, theme = 'boxes', objects = undefined) => {
            switch (theme) {
                case 'metaverse':
                    addObject(scene, objects, 20, 15, 25, 'textures/m_bbs.png', { type: 'bbs' });
                    addObject(scene, objects, -20, 15, 25, 'textures/m_restaurant.png', { type: 'url', url: 'http://10.177.194.42:8000' });
                    break;
                case 'boxes':
                    const k = 10;
                    const boxGeometry = new THREE.BoxGeometry(k, k, k);
                    for (let i = 0; i < 10; i++) {
                        const boxMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL((0 / 8, 1, .5)), opacity: 0.7, transparent: false });
                        const box = new THREE.Mesh(boxGeometry, boxMaterial);
                        box.position.x = Math.floor(Math.random() * k) * 2 * k;
                        box.position.y = Math.floor(Math.random() * k) * 2 * k + k;
                        box.position.z = Math.floor(Math.random() * k - k) * 2 * k;
                        // box.position.z = 0;

                        scene.add(box);
                        objects && objects.push(box);
                    }
                    break;
                default:
                    let geometry = new THREE.SphereGeometry(4, 12, 12);
                    let material = new THREE.MeshBasicMaterial({ color: 0xf2ce2e });
                    let sphere = new THREE.Mesh(geometry, material);
                    sphere.position.z = -15;
                    sphere.position.y = -2.5;
                    sphere.position.x = -0.25;
                    scene.add(sphere);
                    break;
            }
        }

        addObjects(props.scene);
    }, []);

    return (<>
    </>);
}

export default Landmarker;