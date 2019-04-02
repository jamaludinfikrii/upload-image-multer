var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
var multer  = require('multer')
var mysql = require('mysql')
var port = 4000

const conn = mysql.createConnection({
    user : 'jamal' ,
    password :'jamaludin' ,
    host : 'localhost' ,
    database : 'upload_image' ,
    port : 3306
})

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



var upload = multer({storage : storageConfig , fileFilter : filterConfig, limits :{fileSize : 5 * 1000000}})

// UNTUK MEMBUAT FOLDER UPLOAD BISA DIAKSES PUBLIC
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.json())
app.use(cors())


app.get('/', (req,res)=>{
    res.send('<h1> Selamat Datang di API Upload Image </h1>')
})


app.post('/image',upload.single('avatar') , (req,res) => {
    console.log(req.file)
    var newData = JSON.parse(req.body.product)
    newData.product_image = req.file.path
    var sql = 'insert into manage_product set ?'
    conn.query(sql,newData, (err,result) => {
        if(err) throw err
        res.send('sukses')
    })
})

app.post('/images',upload.array('potoarray', 3) ,(req,res) => {
    console.log(req.files)
    res.send('sukses')
})

app.listen(port , ()=> console.log('Berjalan di Port ' + port))