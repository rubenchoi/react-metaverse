import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { WorldPage, CharacterPage, CharacterViewer, WorldViewer } from 'react-metaverse'
import { Button } from 'reactstrap';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/character' component={CharacterPage} />
        <Route path='/sampleCharacter' component={() => <CharacterViewer character={'0_man_LOD0.fbx'} scale={0.1} />} />
        <Route path='/sampleWorld' component={() => <WorldViewer world={'sample.fbx'} scale={0.05} hdri={'small_harbor_01_1k.hdr'} />} />
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
