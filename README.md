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
```

## License

MIT © [rubenchoi](https://github.com/rubenchoi)

## Reference

[Blog](https://rubenchoi.tistory.com/entry/metaverse-1?category=467531)
