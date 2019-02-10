var express = require('express');
var router = express.Router();

var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/runoob";

var ObjectId = require('mongodb').ObjectId;//为了转数组的的对象



var upload = require('./upload');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.post('/register',(req,res)=>{
	console.log(req.body)
	mongodb.connect(db_str,(err,database)=>{//连接数据库地址
		 database.collection('zhuce',(err,coll)=>{//找集合
		 	coll.find({username:req.body.username}).toArray((err,data)=>{
		 		if(data.length>0){
		 			res.send('2')
		 			}else{
		 			coll.insert(req.body,()=>{//插入数据
			 		res.send('1')
			 		})
		 		}
		 		database.close()
		 		})
		 })
	})
})
//登陆
router.post('/login',(req,res)=>{
mongodb.connect(db_str,(err,database)=>{
	database.collection('zhuce',(err,coll)=>{
		coll.find(req.body).toArray((err,data)=>{
			if(data.length>0){
				//data[0].username
														req.session.name=data[0].username										
														res.send('1')
														database.close();
												}else{
														res.send('0')
														database.close();
												}
										})
								})
						})
})
//页面数据的保存在后台

router.post('/',(req,res)=>{
	
	mongodb.connect(db_str,(err,database)=>{
		database.collection('message',(err,coll)=>{
			coll.save(req.body,(err)=>{
				//console.log(req.body)
				res.send('1');
				database.close();
			})
		})
	})
})
//删除
router.post('/remove',(req,res)=>{
	mongodb.connect(db_str,(err,database)=>{
		database.collection('message',(err,coll)=>{
			coll.remove({_id:ObjectId(req.body.id)},()=>{
				res.send('1');
				database.close();
			})
		})
	})
})
//修改
//router.post('/update',(req,res)=>{
//	console.log(req.body)//{ id: '5c238dd8ae6e0aa0d42e1fb5/',title: 'ghg',con: 'ghhghg',price: 'ghhg',date: 'ghgh' }
//	mongodb.connect(db_str,(err,database)=>{
//		database.collection('message',(err,coll)=>{
////			var obj={
////				title:req.body.title,
////				con:req.body.con,
////				price:req.body.price,
////				date:req.body.date
////			}
//			coll.update({_id:ObjectId(req.body.id)},{$set:{title:req.body.title,con:req.body.con,price:req.body.price,date:req.body.date}},()=>{
//				res.send('1');
//				database.close();
//			})
//		})
//	})
//})
router.post('/update', function(req, res) {
	console.log(req.body)//
			   mongodb.connect(db_str,(err,database)=>{
			   database.collection('message',(err,coll)=>{
			   		console.log(coll)
				   coll.update({_id:ObjectId(req.body.id)},{$set: {title:req.body.title,con:req.body.con,price:req.body.price,date:req.body.date}},()=>{
					   res.send('1')
				   })
			   })
		})
});


















//富文本
router.post('/uploadImg', (req, res) => {
	upload(req, res);
})


module.exports = router;
