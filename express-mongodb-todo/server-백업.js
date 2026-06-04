require("dotenv").config()
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI 부재. .env 파일 확인 바람.")
}
const client = new MongoClient(uri);
const dbClient = client;
const dbName = "ai_agents_study";
const collectionName = "car";

const http = require('http');
const express = require('express');
const app = express();
const path = require('path');

// view eingine 세팅
app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

// body-parser, static 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/", express.static(path.join(__dirname, "public")));

// 목록 출력
app.get('/car', async (req, res)=>{
    try{
        await dbClient.connect();
        const db = dbClient.db(dbName);
        const cars = db.collection(collectionName);
        const cursor = cars.find({},{sort:{name:1}, projection:{}});
        
        // for await (const doc of cursor) {
        //     console.log(doc);
        // }
        const carList = await cursor.toArray();
        req.app.render('CarList', {carList: carList}, (err, html)=>{
            if (err) throw err;
            res.end(html);
        });
    } finally {
        await dbClient.close();
    }
});

// DB에 데이터 저장
app.post('/car', async (req, res)=>{
    try{
        await dbClient.connect();
        // 전달 된 데이터를 body에서 가져오기
        // 받아온 데이터를 db에 저장
        // 저장 후 목록으로 redirect
        const db = dbClient.db(dbName);
        const cars = db.collection(collectionName);
        const {name, price, company, year} = req.body;
        await cars.insertOne({name, price, company, year});
        res.redirect("/car");
    } finally {
        dbClient.close();
    }
});

// DB에 데이터 수정
// bodyParser 미들웨어가 먼저 준비 되어야 합니다. 
app.post('/car/modify', async (req, res)=>{
    try{
        await dbClient.connect();
        const {id, name, price, company, year} = req.body;
        const db = dbClient.db(dbName);
        const cars = db.collection(collectionName);
        await cars.updateOne({_id: new ObjectId(id)}, {$set:{name, price, company, year}});
        res.redirect("/car");
    } finally {
        dbClient.close();
    }
});

const forward = (req, res,target, obj)=>{
    req.app.render(target, obj, (err, html) => {
        if(err) throw err;
        res.end(html);
    });
}

// 새 데이터 입력 페이지로 forward
app.get('/car/input', (req, res)=>{
    forward(req, res,'CarInput', {});
});

// 상세보기 페이지로 forward
app.get('/car/detail', async (req, res)=>{
    // 파라미터로 id를 받고 
    // id와 같은 car를 db에서 검색
    try{
        await dbClient.connect();
        const db = dbClient.db(dbName);
        const cars = db.collection(collectionName);
        const car = await cars.findOne({_id: new ObjectId(req.query.id)},{});
        forward (req, res, 'CarDetail', {car});
    } finally {
        await dbClient.close();
    }
});

// 상세보기 페이지로 forward
app.get('/car/modify', async (req, res)=>{
    try{
        await dbClient.connect();
        const db = dbClient.db(dbName);
        const cars = db.collection(collectionName);
        const car = await cars.findOne({_id: new ObjectId(req.query.id)},{});
        forward (req, res, 'CarModify', {car});
    } finally {
        await dbClient.close();
    }
});

// car 삭제 후 list로 redirection
app.get('/car/delete', async (req, res)=>{
    try{
        await dbClient.connect();
        const db = dbClient.db(dbName);
        const cars = db.collection(collectionName);
        await cars.deleteOne({_id: new ObjectId(req.query.id)});
        res.redirect("/car");
    } finally {
        await dbClient.close();
    }
});

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`서버 실행 중 http://localhost:${app.get('port')}`);
});

