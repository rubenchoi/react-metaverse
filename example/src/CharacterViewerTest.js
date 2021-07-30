import React from 'react';
import { CharacterViewer } from 'react-metaverse';

const App = () => {
  const canvasRef = React.useRef(null);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ width: '300px', height: '200px', border: '1px solid green' }}
        width='640px'
        height='480px'
      />
      <CharacterViewer character="sample.fbx" geo={{ scale: 0.1, position: { x: 0, y: -40, z: 0 } }} canvas={canvasRef} />
      {/* <CharacterViewer character="0_man_LOD0.fbx" geo={{ scale: 1.0, position: { x: 0, y: -160, z: 0 } }} canvas={canvasRef} /> */}
    </>
  );
}

export default App
