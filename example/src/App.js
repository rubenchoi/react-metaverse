import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { WorldPage, CharacterPage, CharacterViewer, WorldViewer } from 'react-metaverse'
import CharacterViewerTest from './CharacterViewerTest'
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

export default App
