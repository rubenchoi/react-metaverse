import React from 'react';
import { CharacterViewer } from 'react-metaverse';

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
    // character: 'Asian-PrimeHair-PBR.fbx',
    character: 'Cartoon.fbx',
    geo: {
      scale: 0.1, position: { x: 0, y: -10, z: 0 }
    },
    cam: {
      rotation: { x: 0.2, y: -0.05, z: 0 },
      position: { x: -0.3, y: 6, z: 6 },
      lookAt: { x: 0, y: 6, z: 0 },
    },
    canvas: {
      width: '300px',
      height: '300px'
    },
    hdri: 'small_harbor_01_1k.hdr',
  }
}

const App = () => {
  const [character, setCharacter] = React.useState('test');
  const [fullscreen,] = React.useState(true);

  const canvasRef = React.useRef(null);

  const p = settings[character];
  console.log(p);

  return (
    <>
      {fullscreen ||
        <div style={{ padding: '2em' }}>
          <p>Selected character: {character}</p>
          <select onChange={e => { console.log("e.target.value", e.target.value); setCharacter(e.target.value) }}>
            <option value='sample'>Sample</option>
            <option value='test'>Tester</option>
          </select>
          <hr />
        </div>
      }

      <canvas
        ref={canvasRef}
        style={
          fullscreen ? { width: '100%', height: '100%' } :
            { width: p.canvas ? p.canvas.width : '100%', height: p.canvas ? p.canvas.height : '100%', border: '1px solid green' }
        }
        width='640px'
        height='480px'
      />
      {/* <CharacterViewer {...p} canvas={canvasRef} hideAll={true} disableOrbit /> */}
      <CharacterViewer {...p} canvas={canvasRef} hideAll={fullscreen} />
    </>
  );
}

export default App
