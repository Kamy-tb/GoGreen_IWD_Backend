var express = require("express");
var app = express();
var mysql = require("mysql");
const bodyParser = require('body-parser');
const multer = require('multer')
app.use(express.static('images')) ;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Connect to mysql 
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database:'iwd',
});
connection.connect();

 // get user
 app.get('/getuser/:nom/:pwd',function(req,res){
    var data = null    
    var query="select * from user where nom=? and pwd=?"
    //var query=`select id,tel from user where tel=${tel} and pwd=${pwd}`
   
    connection.query(query,[req.params.nom,req.params.pwd],function(error,results){
       if (error) {
           console.log(error)
           res.status(500).json({message:"server error"}) 
       }
       if(results.length>0) {
           data = results[0]
       }
       res.status(200).json(data)
   })
   });

// Get feeds
app.get('/getfeeds',function(req,res){   
    var query="select f.img , u.nom from feed f join user u on f.user_id = u.user_id"

    connection.query(query,function(error,results){
       if (error) {
           console.log(error)
           res.status(500).json({message:"server error"}) 
       }
    
       res.status(200).json(results)
   })
});

// Get ranking
app.get('/getranking',function(req,res){   
    var query="select nom , pnts from user order by pnts DESC"
    connection.query(query,function(error,results){
       if (error) {
           console.log(error)
           res.status(500).json({message:"server error"}) 
       }
       res.status(200).json(results)
   })
});
   


// add user
app.post('/adduser',function(req,res){  
    var query="INSERT INTO user (nom , mail , pwd , pnts ) values (? ,? , ? ,?)"
    connection.query(query , [req.body.nom  , req.body.mail  , req.body.pwd , req.body.pnts ],function(error,results){
       if (error) {
           console.log(error)
           res.status(500).json({message:"server error"}) 
       }
       res.status(200).json("success")
   })
});


var server = app.listen(8082,function(){
    var host = server.address().address
    var port = server.address().port
});


