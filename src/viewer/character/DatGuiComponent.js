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

        const riggings = { bone: {}, morphTarget: {}, animation: [] };

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
                                    guiMorph.add(bone.morphTargetInfluences, idx, 0, max).name(key + " [" + bone.name + "]");

                                    riggings.morphTarget[key + ':' + bone.name] = { bone: bone, index: idx };
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

                        riggings.bone[bone.name] = bone;
                        break;
                    default:
                        break;
                }
            } catch (e) {
                props.debug && console.log(e);
            }
        }

        const generateAnimations = (animations) => {
            try {
                animations.forEach((item, idx) => {
                    props.debug && console.log('generateAnimations', item, idx);
                    guiAnimation.add({ btn: () => props.requestChangeAnimation(idx) }, 'btn').name(item.name);
                    riggings.animation.push({ name: item.name, target: idx });
                });
                guiAnimation.add({ btn: () => props.requestChangeAnimation(-1) }, 'btn').name('stop');
                riggings.animation.push({ name: 'stop', target: -1 });
            } catch (err) { }
        }

        props.character.traverse(parseRig);
        generateAnimations(props.animations || props.character.animations);

        const dom = ref.current;
        if (dom.hasChildNodes()) {
            dom.removeChild(dom.firstChild);
        }
        dom.appendChild(gui.domElement);

        props.callbacks && props.callbacks.onLoad && props.callbacks.onLoad(riggings);
    }, [props.character]);

    return (<div ref={ref} style={{ display: props.visible ? 'block' : 'none', width: 'fit-content' }} />)
}

export default DatGuiComponent;