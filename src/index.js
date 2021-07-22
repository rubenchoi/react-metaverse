import React, { Fragment, useState } from 'react';
import './App.css';
import WorldViewer from './viewer/Viewer';
import CharacterViewer from './viewer/character/CharacterViewer';
import FileUpload from './util/FileUpload'
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

const DEFAULT_WORLD = 'sample.fbx';
const DEFAULT_HDRI = 'sample.hdr';
const DEFAULT_CHARACTER = 'sample.fbx';

export function WorldPage() {
  const [hdri, setHdri] = useState(undefined);
  const [world, setWorld] = useState(undefined);
  const [scale, setScale] = useState(0.05);
  const [enableDefault, setEnableDefault] = useState(false);

  const enterDefault = () => {
    setHdri(DEFAULT_HDRI);
    setWorld(DEFAULT_WORLD);
  }

  return (<>
    {(world && hdri) ?
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <WorldViewer
          world={world}
          scale={scale}
          hdri={hdri}
        />
        <Button color='info' outline onClick={() => setWorld(undefined)}
          style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 1 }}>
          World : {world}
        </Button>
      </div>
      :
      <div className="App">
        <FileUpload
          title={'건물'}
          dir={'/world'}
          onSelectTarget={r => setWorld(r)}
          onServerFailed={() => setEnableDefault(true)} />

        <hr />
        <label style={{ marginLeft: '2em', fontSize: '0.8em' }}>
          Scale: <input type="text" onChange={e => setScale(e.target.value)} style={{ margin: 'auto' }} value={scale} />
        </label>

        <hr />
        <FileUpload
          title={'배경'}
          dir={'/hdri'}
          onSelectTarget={r => setHdri(r)}
          onServerFailed={() => setEnableDefault(true)} />
        {enableDefault &&
          <div style={{ marginLeft: '2em' }}>
            <p style={{ color: 'red' }}>서버가 응답하지 않습니다. server$ npm start를 하셨나요?</p>
            <Button color="info" onClick={enterDefault}>샘플로 입장하기</Button>
          </div>
        }
      </div>
    }
  </>);
}

export function CharacterPage() {
  const [character, setCharacter] = useState(undefined);
  const [scale, setScale] = useState(0.1);
  const [enableDefault, setEnableDefault] = useState(false);

  return (<>
    {character ?
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <CharacterViewer
          character={character}
          scale={scale}
        />
        <div >
          <Button color='info' outline onClick={() => setCharacter(undefined)}
            style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 1 }}>
            Character : {character} (scale: {scale})
          </Button>
        </div>
      </div>
      :
      <div className="App">
        <FileUpload
          title={'캐릭터'}
          dir={'/character'}
          onSelectTarget={r => setCharacter(r)}
          onServerFailed={() => setEnableDefault(true)}
        />

        <hr />
        <label style={{ marginLeft: '2em', fontSize: '0.8em' }}>
          Scale: <input type="text" onChange={e => setScale(e.target.value)} style={{ margin: 'auto' }} value={scale} />
        </label>

        {enableDefault &&
          <div style={{ marginLeft: '2em' }}>
            <p style={{ color: 'red' }}>서버가 응답하지 않습니다. server$ npm start를 하셨나요?</p>
            <Button color="info" onClick={() => setCharacter(DEFAULT_CHARACTER)}>샘플로 입장하기</Button>
          </div>
        }
      </div>
    }
  </>);
}

export { CharacterViewer, WorldViewer }