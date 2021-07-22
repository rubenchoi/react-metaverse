/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

const SERVER_PORT = 4000;
const BASE_URL = window.location.protocol + '//' + window.location.hostname + ':' + SERVER_PORT;

function FileUpload(props) {
    const [targetList, setTargetList] = useState(undefined);
    const [uploadFile, setUploadFile] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadResult, setUploadResult] = useState(undefined);

    const refInput = useRef(null);

    useEffect(() => {
        axios.post(BASE_URL + "/list",
            JSON.stringify({ dir: props.dir }),
            { headers: { 'Content-Type': 'application/json' } }
        )
            .then(res => {
                let r = res.data.fileList.filter((el) => { return el.indexOf('.md') < 0 });
                console.log(r);
                setTargetList(r);
            })
            .catch(error => {
                error.toString().includes('Network Error');
                setUploadResult("서버가 응답하지 않습니다. server$ npm start를 하셨나요?");
                props.onServerFailed && props.onServerFailed();
            })
    }, []);

    const onSelectTarget = (e) => {
        props.onSelectTarget && props.onSelectTarget(e.target.value);
    }

    const getSelectTarget = (items) => {
        return (
            <Form>
                <FormGroup>
                    <Label for={props.title}><h3>{props.title} 선택</h3></Label>
                    <Input
                        type="select"
                        name={props.title}
                        id={props.title + "Target"}
                        defaultValue='default'
                        // onChange={(e) => setTarget({ name: e.target.childNodes[e.target.selectedIndex].innerText, value: e.target.value })}>
                        onChange={onSelectTarget}>
                        <option disabled value='default'>원하는 {props.title}을 선택하세요.</option>
                        {items.map((item, idx) => (
                            <option key={idx} value={item}>
                                {item}
                            </option>
                        ))}
                    </Input>
                </FormGroup>
            </Form>
        )
    }

    const onChooseFile = (e) => {
        setUploadProgress(0);
        setUploadFile(e.target.files[0]);
        setUploadResult(undefined);
    }

    const upload = () => {
        const form = new FormData();
        form.append("file", uploadFile);
        form.append("dir", props.dir);
        axios.post(BASE_URL + "/upload",
            form,
            { onUploadProgress: (evt) => setUploadProgress(Math.round(evt.loaded / evt.total * 100) + '%') })
            .then(res => setUploadResult('Upload completed. Please Refresh.' + res))
            .catch(err => console.log("ERROR", err));
    }

    return (
        <div style={{ border: '3px solid #ababab', width: 'fit-content', padding: '1em', margin: '1em' }}>
            {targetList && getSelectTarget(targetList)}
            <hr />

            <p>{props.title}을 직접 업로드하려면, 파일 선택 후 업로드해 주세요.</p>
            <input type="file" ref={refInput} onChange={onChooseFile} style={{ margin: 'auto' }} />
            {uploadFile && <p><span style={{ color: 'blue' }}>{uploadFile.name}</span> is ready to upload.</p>}

            {uploadProgress > 0 &&
                <div style={{ width: uploadProgress, backgroundColor: 'blue' }}>
                    {uploadProgress}
                </div>
            }

            {uploadResult && <p style={{ color: 'red' }}>{uploadResult}</p>}
            {uploadFile && <Button color="primary" onClick={upload} >Upload</Button>}
        </div>
    )
}

export default FileUpload;