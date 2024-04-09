import express from "express";
import { TwitterApi } from "twitter-api-v2";
import process from "process";
import pg from 'pg';
import https from 'https';

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
    // const pool = new pg.Pool({
    //     database: process.env.DATABASE,
    //     user: process.env.DATABASE_USER,
    //     password: process.env.DATABASE_PASSWORD,
    //     host: process.env.DATABASE_HOST,
    //     ssl: {
    //         rejectUnauthorized: false,
    //     },
    //     max: 10,
    // });
    https.get('https://amazon-explorer.onrender.com/search', (resp) =>{
        let data = ''; 
        // A chunk of data has been received. 
        resp.on('data', (chunk) => { 
            data += chunk; 
        }); 
    
        // The whole response has been received. Print out the result. 
        resp.on('end', () => {
            var body = JSON.parse(data)
            console.log(body); 
            console.log(body.length);
            if(body.length == 0){
                return false;
            }
            var random = Math.floor(Math.random() * (body.length + 1));
            console.log(random);
            var text = "【" + body[random].percentage +"%オフ" + "】"
            var url = body[random].url;
            var title = body[random].title;
            client.v2.tweet(text + " " + url + " " +title + " #セール" + " #Amazon");
            return true;
        }); 
    
    }).on("error", (err) => { 
        console.log("Error: " + err.message); 
    })


    // var random = 1000;

    // pool.query(
    //     'SELECT * FROM public.newtable'
    // ).then(result => {
    //     if (result.rows) {
    //         var count = result.rows.length;
    //         random = Math.floor(Math.random() * count) + 1;
    //     }
    // })
    //     .catch(err => {
    //         console.log('err: ', err);
    //     })
    //     .then(() => {
    //         var sql = 'SELECT * FROM public.newtable WHERE number = ' + random;
    //         pool.query(
    //             sql
    //         ).then(result => {
    //             if (result.rows) {
    //                 // result.rows.forEach((row) => {
    //                 //     if(row.number)
    //                 //     console.log(row);
    //                 // });
    //                 client.v2.tweet(result.rows[0].url + " #PR" + " #Amazon");
    //             }
    //         })
    //             .catch(err => {
    //                 console.log('err: ', err);
    //             })
    //             .then(() => {
    //                 console.log('切断');
    //                 pool.end();
    //             });
    //     });

};

app.get("/tweet", (req, res) => {
    try {
        var result = false;
        while(!result){
            result = greet();
        }
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/", (req, res) => {
    try {
        console.log("ログ定期実行")
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);