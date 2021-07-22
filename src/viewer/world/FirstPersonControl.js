/* eslint-disable react-hooks/exhaustive-deps */
/* Reference: https://github.com/mrdoob/three.js/blob/dev/examples/misc_controls_pointerlock.html  */
import React, { Fragment, useEffect } from 'react';
import * as THREE from 'three';

const fp = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    canJump: false,
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    objects: [],
    intersectedObject: undefined,
    arrowHelper: undefined
}

function FirstPersonControl(props) {
    const raycaster = new THREE.Raycaster();

    useEffect(() => {
        const createKeyInput = () => {
            document.addEventListener('keydown', (event) => {
                switch (event.code) {
                    case 'ArrowUp':
                    case 'KeyW':
                        fp.moveForward = true;
                        break;
                    case 'ArrowLeft':
                    case 'KeyA':
                        fp.moveLeft = true;
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        fp.moveBackward = true;
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        fp.moveRight = true;
                        break;
                    case 'Space':
                        if (fp.canJump === true) {
                            fp.velocity.y += 150;
                        }
                        fp.canJump = false;
                        break;
                    default:
                        break;
                }
            });

            document.addEventListener('keyup', (event) => {
                switch (event.code) {
                    case 'ArrowUp':
                    case 'KeyW':
                        fp.moveForward = false;
                        break;

                    case 'ArrowLeft':
                    case 'KeyA':
                        fp.moveLeft = false;
                        break;

                    case 'ArrowDown':
                    case 'KeyS':
                        fp.moveBackward = false;
                        break;

                    case 'ArrowRight':
                    case 'KeyD':
                        fp.moveRight = false;
                        break;
                    default:
                        break;
                }
            })

            document.addEventListener('mousedown', () => {
                processRaycaster();
            });
        }

        createKeyInput();
    }, []);


    useEffect(() => {
        if (props.controls.isLocked === true) {

            drawRaycaster();

            fp.velocity.x -= fp.velocity.x * 10.0 * props.delta;
            fp.velocity.z -= fp.velocity.z * 10.0 * props.delta;

            fp.velocity.y -= 9.8 * 100.0 * props.delta; // 100.0 = mass

            fp.direction.z = Number(fp.moveForward) - Number(fp.moveBackward);
            fp.direction.x = Number(fp.moveRight) - Number(fp.moveLeft);
            fp.direction.normalize(); // this ensures consistent movements in all directions

            if (fp.moveForward || fp.moveBackward) fp.velocity.z -= fp.direction.z * 400.0 * props.delta;
            if (fp.moveLeft || fp.moveRight) fp.velocity.x -= fp.direction.x * 400.0 * props.delta;

            props.controls.moveRight(- fp.velocity.x * props.delta);
            props.controls.moveForward(- fp.velocity.z * props.delta);

            props.controls.getObject().position.y += (fp.velocity.y * props.delta); // new behavior

            if (props.controls.getObject().position.y < 10) {
                fp.velocity.y = 0;
                props.controls.getObject().position.y = 10;
                fp.canJump = true;
            }
        }

    }, [props.delta]);

    const processRaycaster = () => {
        const intersects = raycaster.intersectObjects(fp.objects);
        if (intersects.length > 0) {
            if (fp.intersectedObject) {
                fp.intersectedObject.material.color.setHex(0xffffff);
            }
            intersects[0].object.material.color.setHex(0xfff000);
            intersects[0].object.material.opacity = 1;
            fp.intersectedObject = intersects[0].object;

            if (props.onSelect) {
                props.controls.unlock();
                if (fp.intersectedObject) {
                    fp.intersectedObject.material.color.setHex(0xffffff);
                }
                fp.intersectedObject = undefined;
                raycaster.set(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
                props.onSelect(intersects[0].object.userData);
            }
        } else {
            if (fp.intersectedObject) {
                fp.intersectedObject.material.color.setHex(0xffffff);
            }
            fp.intersectedObject = undefined;
        }
    }

    const drawRaycaster = () => {
        raycaster.set(props.camera.getWorldPosition(new THREE.Vector3()), props.camera.getWorldDirection(new THREE.Vector3()));
        props.scene.remove(fp.arrowHelper);

        let o = raycaster.ray.origin;
        o.y -= 0.2;

        fp.arrowHelper = new THREE.ArrowHelper(raycaster.ray.direction, o, 300, 0xff0000);
        props.scene.add(fp.arrowHelper);
    }

    return (<>
    </>)
}

export default FirstPersonControl;
