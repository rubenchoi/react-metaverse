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
    character: 'test.fbx',
    geo: {
      scale: 0.1, position: { x: 0, y: -10, z: 0 }
    },
    cam: {
      rotation: { x: 0.2, y: -0.05, z: 0 },
      position: { x: -0.3, y: 6, z: 4 },
      lookAt: { x: 0, y: 6, z: 0 }
    },
    canvas: {
      width: '300px',
      height: '300px'
    }
  }
}

const App = () => {
  const canvasRef = React.useRef(null);

  const p = settings['mirae'];

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ width: p.canvas ? p.canvas.width : '100%', height: p.canvas ? p.canvas.height : '100%', border: '1px solid green' }}
        width='640px'
        height='480px'
      />
      {/* <CharacterViewer {...p} canvas={canvasRef} hideAll={true} disableOrbit /> */}
      <CharacterViewer {...p} canvas={canvasRef} hideAll={false} />
    </>
  );
}

export default App
