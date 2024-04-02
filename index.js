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
      var random = Math.floor( Math.random() * 41 );
      pool.query(
        'SELECT * FROM public.newtable WHERE number = ' + random
    ).then(result => {
        // 結果データの表示
        if (result.rows) {
            // result.rows.forEach((row) => {
            //     if(row.number)
            //     console.log(row);
            // });
            client.v2.tweet(result.rows[0].url);
        }
    })
    .catch(err => {
        console.log('err: ', err);
    })
    .then(() => {
        console.log('切断');
        pool.end();
    });
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