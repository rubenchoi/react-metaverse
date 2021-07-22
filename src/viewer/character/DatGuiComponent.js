/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import dat from 'three/examples/js/libs/dat.gui.min.js';

const ROT_MIN = 0;
const ROT_MAX = 7;
const POS_MIN = -10;
const POS_MAX = 10;


function DatGuiComponent(props) {
    const ref = useRef(null);

    useEffect(() => {
        const gui = new dat.GUI();
        const guiCharacter = gui.addFolder('Character');
        const guiBone = guiCharacter.addFolder('Bone');
        const guiMorph = guiCharacter.addFolder('MorphTarget');
        const guiAnimation = guiCharacter.addFolder('Animation');

        const parseRig = (bone) => {
            try {
                switch (bone.type) {
                    case "Mesh":
                    case "SkinnedMesh":
                        if (bone.morphTargetDictionary) {
                            props.debug && console.log("*PROCESSED*" + bone.name + " MorphTarget", bone.morphTargetDictionary);
                            try {
                                Object.keys(bone.morphTargetDictionary).forEach((key, idx) => {
                                    props.debug && console.log(key + ":" + bone.morphTargetInfluences[idx]);
                                    let max = Math.ceil(bone.morphTargetInfluences[idx]);
                                    max = max === 0 ? 1 : max;
                                    guiMorph.add(bone.morphTargetInfluences, idx, 0, max).name(key + "[" + bone.name + "]");
                                })
                            } catch (err) {
                                props.debug && console.log(err);
                            }
                        }
                        break;
                    case "Bone":
                        let guiBoneCoord = guiBone.addFolder(bone.name);
                        ['x', 'y', 'z'].forEach(xyz =>
                            guiBoneCoord.add(bone.position, xyz, POS_MIN, POS_MAX).name(bone.name + "[pos_" + xyz + "]")
                        );
                        ['x', 'y', 'z'].forEach(xyz =>
                            guiBoneCoord.add(bone.rotation, xyz, ROT_MIN, ROT_MAX).name(bone.name + "[rot_" + xyz + "]")
                        );
                        break;
                    default:
                        break;
                }
            } catch (e) { }
        }

        const generateAnimations = (animations) => {
            try {
                animations.forEach((item, idx) => {
                    props.debug && console.log('generateAnimations', item, idx);
                    guiAnimation.add({ btn: () => props.onChangeAnimation(idx) }, 'btn').name(item.name);
                });
                guiAnimation.add({ btn: () => props.onChangeAnimation(-1) }, 'btn').name('stop');
            } catch (err) { }
        }

        props.character.traverse(parseRig);
        generateAnimations(props.animations || props.character.animations);

        ref.current.appendChild(gui.domElement);
    }, []);

    return (<div ref={ref} style={{ width: 'fit-content' }} />)
}

export default DatGuiComponent;