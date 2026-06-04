require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI 부재. .env 파일 확인 바람.");
  process.exit(1);
}

const client = new MongoClient(uri);

const dbName = "ai_agents_study";
const collectionName = "car";

async function getCarList() {
  try {
    await client.connect();
    console.log("MongoDB Atlas 접속 성공");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const carList = await collection.find().toArray();

    console.log("car 목록:");
    console.log(carList);
  } catch (err) {
    console.error("car 목록 조회 실패:", err.message);
  } finally {
    await client.close();
  }
}

getCarList();