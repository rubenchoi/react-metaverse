/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import * as THREE from 'three';

let animationMixer;
let animations = [];
let animationAction;

function Animation(props) {
    useEffect(() => {
        //WARNING - animationMixer and animations cannot be applied to useState
        animationMixer = new THREE.AnimationMixer(props.character);
        animations = props.character.animations;
    }, []);

    useEffect(() => {
        animationMixer && animationMixer.update(props.delta);
    }, [props.delta]);

    useEffect(() => {
        const changeAnimation = (index) => {
            try {
                if (index < 0) {
                    animationAction.stop();
                    return;
                }

                if (animationAction !== undefined) {
                    animationAction.fadeOut(0.5);
                }

                let clip = animations[index];
                animationAction = animationMixer.clipAction(clip);
                animationAction.clampWhenFinished = true;
                animationAction.reset()
                    .setEffectiveTimeScale(1)
                    .setEffectiveWeight(1)
                    .fadeIn(0.5)
                    .play();
            } catch (err) {
                console.log('ERROR: failed to change animation');
            }
        }

        changeAnimation(props.animationIndex);
    }, [props.animationIndex]);

    return (<></>)
}

export default Animation;