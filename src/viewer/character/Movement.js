/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';

let target;

let blinkTimer;
let blinkToClose = true;

//Deprecated - use DatGuiComponent
function Movement(props) {
    const [blink, setBlink] = useState(true);
    const [showDetail, setShowDetail] = useState(props.showDetail);

    useEffect(() => {
        const parseRig = (bone) => {
            try {
                switch (bone.type) {
                    case "Mesh":
                    case "SkinnedMesh":
                        if (target.morphs[bone.name] !== undefined) {
                            return 'skip duplicated';
                        }

                        if (bone.morphTargetDictionary) {
                            console.log("*PROCESSED*" + bone.name + " MorphTarget", bone.morphTargetDictionary);
                            target.morphs[bone.name] = bone;
                        }
                        break;
                    case "Bone":
                        if (target.bones[bone.name] !== undefined) {
                            return 'skip duplicated';
                        }
                        target.bones[bone.name] = bone;
                        break;
                    default:
                        break;
                }
            } catch (e) { }
        }

        target = { bones: {}, morphs: {} };
        props.character.traverse(parseRig);
        return () => {
            blinkTimer && clearInterval(blinkTimer);
        }
    }, [props.character]);

    useEffect(() => {
        if (blink) {
            blinkTimer = setInterval(() => {
                try {
                    moveBlink();
                } catch (err) {
                    clearInterval(blinkTimer);
                }
            }, 100);
        } else {
            clearInterval(blinkTimer);
        }
    }, [blink]);

    const moveBlink = () => {
        const key = 'CC_Base_Body';
        const idx = target.morphs[key].morphTargetDictionary['Eye_Blink'];
        const r = target.morphs[key].morphTargetInfluences[idx];

        if (blinkToClose) {
            if (r < 1) {
                target.morphs[key].morphTargetInfluences[idx] += 0.2;
            } else {
                blinkToClose = false;
            }
        } else {
            if (r > 0) {
                target.morphs[key].morphTargetInfluences[idx] -= 0.2;
            } else {
                blinkToClose = true;
            }
        }
    }

    const testMorph = () => {
        const key = 'CC_Base_Body';
        const idx = target.morphs[key].morphTargetDictionary['Affricate'];
        const r = target.morphs[key].morphTargetInfluences[idx];
        target.morphs[key].morphTargetInfluences[idx] = r === 1 ? 0 : 1;
    }

    const testMovement = (value) => {
        target.bones['CC_Base_Hip']['rotation']['z'] += value * 3.14 / 180;
    }

    return (<>
        {showDetail ?
            <>
                <div style={{ background: 'rgba(235, 143, 52, 0.8)', padding: '1em' }}>
                    <h3>Character Test</h3>
                    <p>Please note that animation should be stopped to see the movement (except blink).</p>
                    <hr />
                    <Button outline onClick={() => testMovement(20)} style={{ margin: '1em' }}>Rotate Left</Button>
                    <Button outline onClick={() => testMovement(-20)} style={{ margin: '1em' }}>Rotate Right</Button>
                    <Button outline onClick={() => testMorph()} style={{ margin: '1em' }}>Morph Test</Button>
                    <Button outline onClick={() => setBlink(!blink)} style={{ margin: '1em' }}>Blink Test</Button>
                </div>
                <div style={{ position: 'abolute', bottom: 0, right: 0, color: 'black', background: 'rgba(235, 143, 52, 0.4)' }} onClick={() => setShowDetail(false)}><Icon.ChevronLeft /></div>
            </>
            :
            <div style={{ display: props.hideAll ? 'none' : 'block', background: 'rgba(235, 143, 52, 0.4)' }} onClick={() => setShowDetail(true)}>
                <Icon.ChevronRight />
            </div>
        }
    </>)
}

export default Movement;