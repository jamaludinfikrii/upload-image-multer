var a = 20

try{
    if(a > 11) throw 'Lebih dari Sebelas'
    if( a < 10) throw ' Kecil'
    if(a >9) throw 'Lebih dari Sembilan '
}catch(err){
    console.log(err)
}