import express from "express";
import { TwitterApi } from "twitter-api-v2";
import process from "process";
import pg from 'pg';

// consumer keys - api key
const appKey = process.env.TWITTER_API_KEY;
// consumer keys - api key secret
const appSecret = process.env.TWITTER_API_SECRET;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const client = new TwitterApi({
  appKey,
  appSecret,
  accessToken,
  accessSecret,
});

client.readWrite;

const app = express();

const greet = async () => {
    const pool = new pg.Pool({
        // Render.comのDBの接続情報に変える
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
      
        // Render.comのDBではSSLが求められる
        ssl: {
          rejectUnauthorized: false, // 証明書の検証はいったん無しで
        },
        max: 10,
      });
      var count = await pool.query('SELECT count(*) FROM public.newtable').rows[0].count;
      console.log("count: " + count);
      if(count){
        var number = Math.floor(Math.random() * (count + 1));
        console.log("number: " + number);
        var result = await pool.query('SELECT * FROM public.newtable WHERE number = ' + number);
        if(result.rows){
            await client.v2.tweet(result.rows[0].url + " #PR" + " #Amazon");
        }
      }
      pool.end();
};

app.get("/tweet", (req, res) => {
    try{
        greet();
    } catch(err){
        console.log(err);
    }
    res.send('get');
});

app.get("/", (req, res) => {
    try{
        console.log("ログ定期実行")
    } catch(err){
        console.log(err);
    }
    res.send('get');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);