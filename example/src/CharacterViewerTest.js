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
      <CharacterViewer character="sample.fbx" scale="0.1" canvas={canvasRef} />
    </>
  );
}

export default App
