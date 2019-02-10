var express = require('express');
var router = express.Router();

var async = require('async');
var mongodb = require('mongodb').MongoClient;
var db_str = "mongodb://localhost:27017/runoob";

var ObjectId = require('mongodb').ObjectId; //为了转数组的的对象

/* GET home page. */

//注册
router.get('/register', (req, res) => {
	res.render('register', {});
});
//登录
router.get('/login', (req, res) => {
	res.render('login', {});
});
//重新登陆
router.get('/relogin', (req, res) => {
	req.session.destroy(function(err) {
		if(err) {
			console.log(err)
		} else {
			res.redirect("/")
		}
	})
})
//将后台的的数据传到页面里去以data的方式去传过去
router.get('/', (req, res) => {
	mongodb.connect(db_str, (err, database) => {

		//console.log("kkk")
		database.collection('message', (err, coll) => {
			//页码
			var pageNo = req.query.pageNo;
			pageNo = pageNo ? pageNo : 1
			//每页显示数量

			var size = 4;
			//总是量
			var count = 0;

			//总页数
			var page = 0;

			async.series([
				function(callback) {
					coll.find({}).toArray((err, data) => {
						count = data.length;
						page = Math.ceil(count / size)
						//下一页
						pageNo = pageNo > page ? page : pageNo;
						//上一页
						pageNo = pageNo < 1 ? 1 : pageNo;

					})
					callback(null, '')
				},
				function(callback) {

					coll.find().sort({
						_id: -1
					}).limit(size).skip((pageNo - 1) * size).toArray((err, data) => {
						callback(null, data)
					})
					//传过来的是页码1但是数据是数组012方式传过来的
				}
			], function(err, data) {
				//我们用的是data[1],因为他是数组的形式['',data]
				//console.log(data[1]);
				res.render('index', {
					data: data[1],
					pageNo: pageNo,
					page: page,
					count: count,
					name: req.session.name,
					title: 'Express'
				})
				database.close();
				//后端处理完后数据传到前端然后在前端接收数据
			})
		})
	})
})

//详情信息
router.get('/detail', (req, res) => {
	//console.log(req.query)
	//对象是个id{ id: '5c21f306d99d6938049a5b79' }转成这样的ObjectId("5c21f2172b1bad4da483bc55")
	id = ObjectId(req.query.id);

	mongodb.connect(db_str, (err, database) => {
		database.collection('message', (err, coll) => {
			coll.find({
				_id: id
			}).toArray((err, data) => {

				var mesg = {
					title: data[0].title,
					con: data[0].con,
					price: data[0].price,
				}
				//console.log(data)
				res.render('detail', mesg)
				//[ { _id: 5c21f306d99d6938049a5b79,
				//  title: '一加手机',
				//  con: '手机像素比较好',
				//  price: '2100￥',
				//  date: '2018年' } ]
				database.close()
			})
		})
	})
})
//搜索栏
router.get("/find", (req, res) => {
	//console.log(req.query);
	// console.log(req.query.keywords);
	mongodb.connect(db_str, (err, database) => {
		database.collection("message", (err, coll) => {
			coll.find({}).toArray((err, data) => {
				console.log(data);
				var brr = [];
				var reg = new RegExp(req.query.keywords);
				for(var i = 0; i < data.length; i++) {
					if(reg.test(data[i].title)) {
						brr.push(data[i]);
					}
				}
				console.log(brr);
				res.render("find", {
					data: brr,
					name: req.session.name,
					title: 'Express'
				})
				database.close();
			})
		})
	})
})

module.exports = router;