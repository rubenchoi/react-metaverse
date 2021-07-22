/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Spinner } from 'reactstrap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import Decorator from './Decorator';
import FirstPersonControl from './world/FirstPersonControl';
import Landmarker from './world/Landmarker';
import World from './world/World';

const Status = {
    INITIALIZING: 'initializing...',
    IDLE: 'idle'
}

function Viewer(props) {
    const [status, setStatus] = useState(Status.INITIALIZING);
    const [cg, setCg] = useState(undefined);
    const [delta, setDelta] = useState(0);
    const [userPlaying, setUserPlaying] = useState(false);

    const clock = new THREE.Clock();

    const canvasRef = useRef(null);

    useEffect(() => {
        const init = () => {
            const canvas = props.canvas || canvasRef.current;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            console.log("w:" + width + " h:" + height);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);

            const controls = new PointerLockControls(camera, canvas);
            controls.addEventListener('lock', () => setUserPlaying(true));
            controls.addEventListener('unlock', () => setUserPlaying(false));
            scene.add(controls.getObject());

            camera.position.set(10, 70, 50);
            camera.rotation.set(Math.PI / 2, Math.PI / 3, Math.PI / 3);
            camera.updateProjectionMatrix();

            const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true, canvas: canvas });
            renderer.shadowMap.enabled = true;
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0x000000, 0);

            const orbit = new OrbitControls(camera, renderer.domElement);
            orbit.enableZoom = true;
            orbit.enabled = true;

            setCg({ canvas: canvas, scene: scene, camera: camera, renderer: renderer, controls: controls });
        }

        init();
    }, []);

    useEffect(() => {
        if (!cg) {
            return;
        }

        const animate = () => {
            setDelta(clock.getDelta());
            cg.renderer.render(cg.scene, cg.camera);
            requestAnimationFrame(animate);
        }

        animate();
    }, [cg]);

    const enterFirstPerson = () => {
        cg.scene.fog = new THREE.Fog(0xffffff, 0, 750);
        cg.controls.lock();
    }

    return (<>
        {props.canvas || <canvas ref={canvasRef} style={{ width: '100%', height: '100%', border: '1px dashed gray' }} />}

        {status === Status.INITIALIZING &&
            <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', zIndex: 9, textAlign: "center", backgroundColor: 'rgba(255,255,255,0.8)' }}>
                <Spinner style={{ width: '3rem', height: '3rem', marginTop: '30%' }} />
            </div>
        }

        {cg && <>
            <Decorator
                hdri={props.hdri}
                scene={cg.scene}
                renderer={cg.renderer}
            />
            <World
                world={props.world}
                scene={cg.scene}
                scale={props.scale}
                onLoad={() => setStatus(Status.IDLE)}
            />
            <FirstPersonControl
                scene={cg.scene}
                controls={cg.controls}
                camera={cg.camera}
                delta={delta}
            />
            <Landmarker
                scene={cg.scene}
            />
        </>
        }
        {userPlaying ||
            <div style={{ position: 'absolute', zIndex: 1, top: '20%', width: '100%' }}>
                <div style={{ width: '100%', height: '100%', display: 'box', textAlign: 'center', background: 'rgba(255,255,255,0.3)', padding: '2em', color: '#e6ecf5', fontSize: '14px' }}>
                    <Button onClick={enterFirstPerson} color="primary">PLAY</Button>
                    <br /><br />fp.move: WASD<br />Jump: SPACE<br />Look: MOUSE
                </div>
            </div>
        }

    </>)
}

export default Viewer;
