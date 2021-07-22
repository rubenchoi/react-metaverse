/* https://github.com/saigowthamr/express-fileupload */

const PORT = 4000;
const PUBLIC_DIR = '../example/public'

const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const fs = require('fs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors());
app.use(fileUpload());
app.use(express.json());

app.post('/list', (req, res) => {
    const target = PUBLIC_DIR + req.body.dir;
    console.log("\n\nPOST/list\n\tdir=", target);
    fs.readdir(target, (error, filelist) => {
        !fs.existsSync(target) && fs.mkdirSync(target);
        if (error) {
            console.log("ERROR:", error);
            return res.status(500).send({ msg: 'unknown error' })
        } else {
            console.log("returns:\n\t", filelist);
            return res.status(200).send({ fileList: filelist });
        }
    })
})

app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: 'No file' })
    }

    const file = req.files.file;
    const filepath = __dirname + '/' + PUBLIC_DIR + req.body.dir + '/' + file.name;
    console.log("\n\nPOST/upload\n\tfile: " + file.name + "\n\tto: " + filepath);

    file.mv(filepath, (err) => {
        if (err) {
            console.log("ERROR:", err);
            return res.status(500).send({ msg: 'Error occurred' });
        } else {
            console.log("SUCCEEDED: ", file);
            return res.status(200).send({ name: file.name, path: `/${file.name}` });
        }
    });
})

app.listen(PORT, () => {
    console.log("server is running at port " + PORT);
})