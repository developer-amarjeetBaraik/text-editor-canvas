import express from 'express'
import {fileURLToPath} from 'url'
import path from 'path';

const app = express()

const port = 3000;
const __filepath = fileURLToPath(import.meta.url)
const basePath = path.dirname(__filepath)


app.get('/', (req, res) => {
    res.sendFile(path.join(basePath, 'public', 'index.html'))
})

app.use(express.static("public"))

app.listen(port, () => {
    console.log(`Celebrare app is listening on port: ${port}`)
})