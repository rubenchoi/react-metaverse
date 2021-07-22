/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Spinner } from 'reactstrap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Character from '../character/Character';
import Decorator from '../Decorator';

const Status = {
    INITIALIZING: 'initializing...',
    IDLE: 'idle'
}

function CharacterViewer(props) {
    const [status, setStatus] = useState(Status.INITIALIZING);
    const [cg, setCg] = useState(undefined);
    const [delta, setDelta] = useState(0);

    const clock = new THREE.Clock();

    const canvasRef = useRef(null);

    useEffect(() => {
        const init = () => {
            const canvas = props.canvas || canvasRef.current;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            console.log("w:" + width + " h:" + height);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 1000);

            camera.position.set(0, 10, 18);
            // camera.rotation.set(0.15, 0.02, -0.3);
            camera.updateProjectionMatrix();

            const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true, canvas: canvas });
            renderer.shadowMap.enabled = true;
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0x000000, 0);

            const orbit = new OrbitControls(camera, renderer.domElement);
            orbit.enableZoom = true;
            orbit.enabled = true;

            setCg({ canvas: canvas, scene: scene, camera: camera, renderer: renderer });
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

            {props.character &&
                <Character
                    scene={cg.scene}
                    character={props.character}
                    scale={props.scale}
                    delta={delta}
                    onLoad={() => setStatus(Status.IDLE)}
                />
            }
        </>
        }
    </>)
}

export default CharacterViewer;