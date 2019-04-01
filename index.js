var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
var multer  = require('multer')
var upload = multer({dest : 'uploads/'})
var port = 4000

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req,res)=>{
    res.send('<h1> Selamat Datang di API Upload Image </h1>')
})


app.post('/image',upload.single('avatar') , (req,res) => {
    console.log(req.file)
})

app.listen(port , ()=> console.log('Berjalan di Port ' + port))