/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Spinner, Progress } from 'reactstrap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Character from '../character/Character';
import Decorator from '../Decorator';

let stopped;

const Status = {
    INITIALIZING: 'initializing...',
    IDLE: 'idle'
}

function CharacterViewer(props) {
    const [status, setStatus] = useState(Status.INITIALIZING);
    const [cg, setCg] = useState(undefined);
    const [delta, setDelta] = useState(0);
    const [loading, setLoading] = useState(undefined);

    THREE.Cache.enabled = true;

    const clock = new THREE.Clock();

    const refCanvas = useRef(null);

    useEffect(() => {
        const init = () => {
            const canvas = props.canvas && props.canvas.current || refCanvas.current;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 1000);

            if (props.cam) {
                camera.position.set(props.cam.position.x, props.cam.position.y, props.cam.position.z);
                camera.rotation.set(props.cam.rotation.x, props.cam.rotation.y, props.cam.rotation.z);
            } else {
                camera.position.set(0, 10, 18);
                camera.rotation.set(-0.15, 0.03, 0);
            }
            camera.updateProjectionMatrix();

            console.log("w:" + width + " h:" + height, camera.position, camera.rotation);

            const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true, canvas: canvas });
            renderer.shadowMap.enabled = true;
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0x000000, 0);

            if (!props.disableOrbit) {
                const orbit = new OrbitControls(camera, renderer.domElement);
                orbit.enableZoom = true;
                orbit.enabled = true;
            }

            setCg({ canvas: canvas, scene: scene, camera: camera, renderer: renderer });
        }

        init();

        return () => {
            stopped = true;
        }
    }, []);

    useEffect(() => {
        if (!cg) {
            return;
        }

        const animate = () => {
            setDelta(clock.getDelta());
            if (props.cam && props.cam.lookAt) {
                cg.camera.lookAt(new THREE.Vector3(props.cam.lookAt.x, props.cam.lookAt.y, props.cam.lookAt.z));
            }
            cg.renderer.render(cg.scene, cg.camera);
            if (!stopped) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }, [cg]);

    useEffect(() => {
        setStatus(Status.INITIALIZING);
    }, [props.character]);

    return (<>
        <canvas ref={refCanvas} style={{ display: props.canvas ? 'none' : 'block', width: '100%', height: '100%', border: '1px dashed gray' }} />

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
                    geo={props.geo}
                    delta={delta}
                    hideAll={props.hideAll}
                    onProgress={p => setLoading(p)}
                    onLoad={() => { setStatus(Status.IDLE); props.onLoad && props.onLoad(refCanvas); }}
                />
            }

            {loading &&
                <div style={{ position: 'absolute', top: '50%', zIndex: 9, textAlign: "center", backgroundColor: 'rgba(255,255,255,0.8)' }}>
                    <Progress striped bar color="danger" value={loading} />
                </div>
            }
        </>
        }
    </>)
}

export default CharacterViewer;