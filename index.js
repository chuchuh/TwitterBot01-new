import { TwitterApi } from "twitter-api-v2";
import process from "process";


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

const greet = async () => {
  await client.v2.tweet("Hello World");
};

greet();