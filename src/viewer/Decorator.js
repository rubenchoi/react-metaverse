/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const BASE_URL_HDRI = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/hdri/';

function Decorator(props) {
    useEffect(() => {
        const setLight = ({ scene }) => {
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
            dirLight.frustumCulled = true;
            dirLight.position.set(5, 10, 7.5)
            scene.add(dirLight);

            // const ambLight = new THREE.AmbientLight(0x222222);
            const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambLight);
        }

        const setBackground = (props) => {
            try {
                const filepath = BASE_URL_HDRI + props.hdri;
                props.debug && console.log('setBackground: loading... ' + filepath);

                new RGBELoader()
                    .setDataType(THREE.UnsignedByteType)
                    .load(filepath, (texture) => {
                        const pmremGenerator = new THREE.PMREMGenerator(props.renderer);
                        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                        pmremGenerator.compileEquirectangularShader();

                        props.scene.background = envMap;
                        props.scene.environment = envMap;

                        texture.dispose();
                        pmremGenerator.dispose();
                    })
            } catch (err) {
                props.debug && console.log("error:", err);

                props.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
                props.scene.fog = new THREE.Fog(props.scene.background, 500, 10000);
            }
        }

        const setGround = (props) => {
            let floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
            let floorMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff, opacity: 0.1, transparent: true
            });
            let floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -0.5 * Math.PI;
            floor.receiveShadow = true;
            floor.name = 'ground';
            props.scene.add(floor);
        }

        setLight(props);
        setBackground(props);
        setGround(props);
    }, []);

    return (<></>);
}

export default Decorator;