var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
var multer  = require('multer')
var mysql = require('mysql')
var fs = require('fs')
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
        req.validation = {error : true , msg : 'File must be image'}
        cb(null, false)
    }
}


// STORAGE UNTUK MENGATUR PENYIMPANAN DAN NAMA FILE
// UNTUK FILTERING JENIS FILE
// UKURAN
var upload = multer({storage : storageConfig , fileFilter : filterConfig})


// UNTUK MEMBUAT FOLDER UPLOAD BISA DIAKSES PUBLIC
app.use('/uploads',express.static('uploads'))

// UNTUK MENERIMA DAATA DARI FE
app.use(bodyParser.json())

// CROSS ORIGIN
app.use(cors())



app.get('/', (req,res)=>{
    res.send('<h1> Selamat Datang di API Upload Image </h1>')
})


app.post('/image',upload.single('avatar') , (req,res) => {
    try{
        console.log(req.file)
        if(req.validation) throw req.validation
        if(req.file.size > 500000) throw {error : true , msg : 'Image too large'}



        // REQ.QUERY  ===> http://localhost:4000/addProduct?nama=fikri
        // REQ.PARAMS ===> http://localhost:4000/addProduct/fikri
        // REQ.BODY   ===> axios.post('http://localhost:4000/addProduct' , {username : fikri})
        // REQ.FILE




        var newData = JSON.parse(req.body.product)
        newData.product_image = req.file.path
        var sql = 'insert into manage_product set ?'
        conn.query(sql,newData, (err,result) => {
            if(err) throw err
            res.send('sukses')
        })
    }catch(err){
        res.send(err)
    }
        

   
    // REQ.FILE UNTUK MELIHAT DATA FILE YANG DIKIRIM FE
   
})

app.post('/images',upload.array('potoarray', 3) ,(req,res) => {
    console.log(req.files)
    res.send('sukses')
})

app.get('/getAllData' , (req,res) => {
    var sql = `select * from manage_product`
    conn.query(sql , (err,result) => {
        if (err) throw err
        res.send(result)
    })
})

app.put('/addProduct/:bebas', upload.single('edit') , (req,res) => {
    var id = req.params.bebas
    if(req.file){
        var data = JSON.parse(req.body.data)
        var dataNew = {product_name : data.product_name , product_price  : data.harga}


        // UNTUK MENAMBAHKAN PROPERTI BARU DI OBJECT DATA
        // {product_name , product_price, product_image}
        dataNew.product_image = req.file.path
        var sql2 = `update manage_product set ? where id = ${id}`
        conn.query(sql2, dataNew , (err,result) => {
            if(err) throw err
            res.send('Update Data Success')
            fs.unlinkSync(req.body.imageBefore)
        })

    }else{
        var sql = `update manage_product set 
                   product_name = '${req.body.product_name}',
                   product_price = ${req.body.harga} where id = ${id}` 
        conn.query(sql, (err , result) => {
            if(err) throw err
            res.send('Edit Data Success')
        })
    }
})


app.listen(port , ()=> console.log('Berjalan di Port ' + port))