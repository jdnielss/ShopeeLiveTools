const axios = require("axios");
const fs = require("fs");

const cookie = fs.readFileSync("./cookie.txt", "utf8");

let axiosInstance = axios.create({
	baseURL: "https://live.shopee.co.id/webapi/v1",
	headers: {
		authority: "live.shopee.co.id",
		accept: "application/json, text/plain, */*",
		"accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
		"client-info": "platform=9",
		cookie: cookie,
		"sec-ch-ua":
			'"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": '"Windows"',
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin",
		"user-agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	},
});

module.exports = axiosInstance;
