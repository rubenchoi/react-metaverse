# React Metaverse Library

> React Metaverse Library 

[![NPM](https://img.shields.io/npm/v/react-metaverse.svg)](https://www.npmjs.com/package/react-metaverse) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-metaverse
```

## Usage

```jsx
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { WorldPage, CharacterPage, CharacterViewer, WorldViewer } from 'react-metaverse'
import { Button } from 'reactstrap';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/character' component={CharacterPage} />
        <Route path='/sampleCharacter' component={() => <CharacterViewer character={'sample.fbx'} geo={{ scale: 0.1, position: { x: 0, y: -40, z: 0 } }} />} />
        <Route path='/sampleWorld' component={() => <WorldViewer world={'sample.fbx'} scale={0.05} hdri={'small_harbor_01_1k.hdr'} />} />
        <Route path='/characterViewerTest' component={() => <CharacterViewerTest />} />
        <Route path='/' component={() => <>
          <WorldPage />
          <Button style={{ margin: '2em' }} color="info" onClick={() => window.location.href = '/character'}>Charater Viewer</Button>
          <Button style={{ margin: '2em' }} color="info" onClick={() => window.location.href = '/sampleWorld'}>Sample World</Button>
        </>} />
      </Switch>
    </Router>   
  );
}
```

## Direct Use of CharacterViewer

```jsx 
import React from 'react';
import { CharacterViewer } from 'react-metaverse';

const settings = {
  'sample': {
    character: 'sample.fbx',
    geo: { scale: 0.1, position: { x: 0, y: -40, z: -20 } }
  },
  'steve': {
    character: 'steve.fbx',
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
      <CharacterViewer {...p} canvas={canvasRef} hideAll={false} />
    </>
  );
}

export default App
```

## License

MIT © [rubenchoi](https://github.com/rubenchoi)

## Reference

[Blog](https://rubenchoi.tistory.com/entry/metaverse-1?category=467531)
