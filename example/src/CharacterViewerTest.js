import React, { useState, useRef } from 'react';
import { CharacterViewer } from 'react-metaverse';
import { Button, Row, Col, Container } from 'reactstrap';

/**
 * character - string - [Required] a filename under public/character.
 * 
 * the rest of the paramteers are optional.
 * geo - object - {position, rotation, scale} (x, y, z) after a model is loaded
 * camera - object 
 */

const settings = {
  'sample': {
    character: 'sample.fbx',
    geo: { scale: 0.1, position: { x: 0, y: -40, z: -20 } }
  },
  'test': {
    character: 'Asian-PrimeHair-PBR.fbx',
    geo: {
      scale: 0.1, position: { x: 0, y: -10, z: 0 }
    },
    cam: {
      rotation: { x: 0.2, y: -0.05, z: 0 },
      position: { x: -0.3, y: 6, z: 6 },
      lookAt: { x: 0, y: 6, z: 0 },
    },
    canvas: {
      width: '640px',
      height: '480px'
    },
    hdri: 'small_harbor_01_1k.hdr',
  }
}

const App = () => {
  const [character,] = useState('test');
  const [fullscreen,] = useState(false);
  const [rig, setRig] = useState(undefined);

  const canvasRef = useRef(null);

  const p = settings[character];

  return (
    <>
      {fullscreen ||
        <Container style={{ padding: '2em', border: '1px solid gray', margin: '2em', width: 'fit-content', fontSize: '1em' }}>
          <Row>
            <Col xs='6'>Animation </Col>
            <Col xs='6'>
              <select onChange={e => setRig({ animation: e.target.value })}>
                <option value='-1'>Stop Animation</option>
                <option value='1'>Animation 1</option>
                <option value='2'>Animation 2</option>
              </select>
            </Col>
          </Row>
          <Row>
            <Col xs='6'>Head(Bone)</Col>
            <Col xs='2'>
              <Button color="warning" onClick={() => setRig({ bone: [{ 'CC_Base_Head:r:z:a': 0.3 }, { 'head:r:z:a': 0.3 }, { 'upperarm_r:r:x': 1.5 }] })}>&lt;</Button>
            </Col>
            <Col xs='2'>
              <Button color="warning" onClick={() => setRig({ bone: [{ 'CC_Base_Head:r:z:a': -0.3 }, { 'head:r:z:a': -0.3 }, { 'upperarm_r:r:x': 0 }] })}>&gt;</Button>
            </Col>
          </Row>
          <Row>
            <Col xs='6'>Face(MorphTarget)</Col>
            <Col xs='2'>
              <Button color="primary" onClick={() => setRig({
                morphTarget: [{ 'Explosive:CC_Game_Body': 1 }, { 'Eye_Blink:CC_Game_Body': 1 }, { 'Lip_Open:CC_Game_Body': 1 },
                { 'Explosive:CC_Base_Body': 1 }, { 'Eye_Blink:CC_Base_Body': 1 }, { 'Lip_Open:CC_Base_Body': 1 }]
              })}>A</Button>
            </Col>
            <Col xs='2'>
              <Button color="primary" onClick={() => setRig({
                morphTarget: [{ 'Explosive:CC_Game_Body': 0 }, { 'Eye_Blink:CC_Game_Body': 0 }, { 'Lip_Open:CC_Game_Body': 0 },
                { 'Explosive:CC_Base_Body': 0 }, { 'Eye_Blink:CC_Base_Body': 0 }, { 'Lip_Open:CC_Base_Body': 0 }]
              })}>B</Button>
            </Col>
          </Row>
        </Container>
      }

      <canvas
        ref={canvasRef}
        style={
          fullscreen ? { width: '100%', height: '100%' } :
            { width: p.canvas ? p.canvas.width : '100%', height: p.canvas ? p.canvas.height : '100%', border: '1px solid green' }
        }
        width={p.canvas.width}
        height={p.canvas.height}
      />
      <CharacterViewer
        {...p}
        canvas={canvasRef}
        hideAll={fullscreen}
        rig={rig}
      />
    </>
  );
}

export default App
