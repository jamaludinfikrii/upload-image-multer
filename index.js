var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
var multer  = require('multer')
var port = 4000

const storageConfig = multer.diskStorage({
    // FILE MAU DISIMPAN DIMANA
    destination : (req,file,cb) => {
        cb(null , './uploads')
    } ,
    // NAMA FILE
    filename : (req,file,cb) => {
        cb(null , 'PRD-' + Date.now() + '.' + file.mimetype.split('/')[1])
    } 
})

const filterConfig = (req, file, cb) => {
    if(file.mimetype.split('/')[1] === 'png' || file.mimetype.split('/')[1] === 'jpeg'){
        cb(null, true)
    }else{
        cb(new Error('Image must be Jpeg / Png'), false)
    }
}



var upload = multer({storage : storageConfig , fileFilter : filterConfig})


app.use(bodyParser.json())
app.use(cors())

app.get('/', (req,res)=>{
    res.send('<h1> Selamat Datang di API Upload Image </h1>')
})


app.post('/image',upload.single('avatar') , (req,res) => {
    console.log(req.file)
    res.send('sukses')
})

app.listen(port , ()=> console.log('Berjalan di Port ' + port))