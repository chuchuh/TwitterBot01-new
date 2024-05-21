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

const execute = async (url) => {
    https.get(url, (resp) =>{
        let data = ''; 
        resp.on('data', (chunk) => { 
            data += chunk; 
        }); 
        resp.on('end', () => {
            var body = JSON.parse(data)
            var tweetText = body.tweetText;
            client.v2.tweet(tweetText);
            return true;
        }); 
    
    }).on("error", (err) => { 
        console.log("Error: " + err.message); 
        return false;
    })
};

// const select = async () => {
//     const pool = new pg.Pool({
//         database: process.env.DATABASE,
//         user: process.env.DATABASE_USER,
//         password: process.env.DATABASE_PASSWORD,
//         host: process.env.DATABASE_HOST,
//         ssl: {
//             rejectUnauthorized: false,
//         },
//         max: 10,
//     });

//     var random = 1000;

//     pool.query(
//         'SELECT * FROM public.amazon'
//     ).then(result => {
//         if (result.rows) {
//             var count = result.rows.length;
//             random = Math.floor(Math.random() * count) + 1;
//         }
//     })
//         .catch(err => {
//             console.log('err: ', err);
//         })
//         .then(() => {
//             var sql = 'SELECT * FROM public.amazon WHERE number = ' + random;
//             pool.query(
//                 sql
//             ).then(result => {
//                 if (result.rows) {
//                     client.v2.tweet(result.rows[0].content + " #PR #Amazon");
//                 }
//             })
//                 .catch(err => {
//                     console.log('err: ', err);
//                 })
//                 .then(() => {
//                     console.log('切断');
//                     pool.end();
//                 });
//         });
// }


// app.get("/db", (req, res) => {
//     try {
//         select();
//     } catch (err) {
//         console.log(err);
//     }
//     res.send('get');
// });

const rakuten = async () => {
    var args = [
        20,
        30,
        40
    ]
    var age = args[Math.floor(Math.random() * args.length)];
    var random = Math.floor(Math.random() * 34) + 1;
    var requestUrl = "https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?applicationId=" + process.env.RAKUTEN_APP_ID
        + "&age=" + age + "&sex=1&carrier=0&page=" + random + "&affiliateId=" + process.env.RAKUTEN_AFFILIATE_ID;
    console.log(requestUrl);
    await axios.get(requestUrl, {
    }).then(async (response) => {
        if (response.status !== 201) {
            var randomNo = Math.floor(Math.random() * (response.data.Items.length));
            var itemName = response.data.Items[randomNo].Item.itemName;
            var catchcopy = response.data.Items[randomNo].Item.catchcopy;
            var affiliateUrl = response.data.Items[randomNo].Item.affiliateUrl;
            console.log(itemName);
            console.log(catchcopy);
            console.log(affiliateUrl);
            var tweetText = itemName + catchcopy
            client.v2.tweet(tweetText.substring(0, 90) + " " + affiliateUrl + " #楽天ROOM #楽天 #楽天市場 #ad #PR");
            console.log("完了");

        }
    }).catch((error) => {
        console.log(error);
        return;
    });


};

app.get("/tiktok4500", (req, res) => {
    try {
        execute(process.env.TIKTOK_4500_API_URL);
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/tiktok5000", (req, res) => {
    try {
        execute(process.env.TIKTOK_5000_API_URL);
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/amazon", (req, res) => {
    try {
        execute(process.env.AMAZON_API_URL);
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/rakuten", (req, res) => {
    try {
        rakuten();
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/moppy", (req, res) => {
    try {
        execute(process.env.MOPPY_API_URL);
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/mercari", (req, res) => {
    try {
        execute(process.env.MERCARI_API_URL);
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/daiwa", (req, res) => {
    try {
        execute(process.env.DAIWA_API_URL);
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/olive", (req, res) => {
    try {
        execute(process.env.OLIVE_API_URL);
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