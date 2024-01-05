const axiosInstance = require("./api");
const Table = require("cli-table");
const axios = require("axios");
const fs = require("fs");

class Action {
	constructor() {
		this.axiosInstance = axiosInstance;
		this.session = "";
	}

	get sessionID() {
		return this.session;
	}

	set sessionID(session) {
		this.session = session;
	}

	async getSession() {
		const cookie = fs.readFileSync("./cookie.txt", "utf8");

		const Axios = axios.create({
			headers: {
				authority: "creator.shopee.co.id",
				accept: "application/json",
				"accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
				"content-type": "application/json",
				cookie: cookie,
				language: "en",
				"sec-ch-ua":
					'"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"user-agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				"x-env": "live",
				"x-region": "id",
				"x-region-domain": "co.id",
				"x-region-timezone": "+0700",
			},
		});

		return await Axios.get(
			"https://creator.shopee.co.id/supply/api/lm/sellercenter/realtime/sessionList?page=1&pageSize=10&name="
		)
			.then((response) => {
				return response.data.data.list[0].sessionId;
			})
			.catch((error) => {
				console.log(error);
			});
	}

	getVochers = () => {
		return axiosInstance
			.get(`/session/${this.session}/voucher?scene=0`)
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				return null;
			});
	};

	pinItem = (data) => {
		return axiosInstance
			.post(`/session/${this.session}/show`, data)
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.log(error);
			});
	};

	getRequestedItems = () => {
		return axiosInstance
			.get(`/session/${this.session}/asked_items?ctx_id=&offset=0&limit=100`)
			.then((response) => {
				return response.data.data.items;
			})
			.catch((error) => {
				console.log(error);
			});
	};

	showVoucher = (data) => {
		return axiosInstance
			.post(`/session/${this.session}/voucher/show`, data)
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.log(error);
			});
	};

	getSales = () => {
		const cookie = fs.readFileSync("./cookie.txt", "utf8");

		const Axios = axios.create({
			headers: {
				authority: "creator.shopee.co.id",
				accept: "application/json",
				"accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
				"content-type": "application/json",
				cookie: cookie,
				language: "en",
				"sec-ch-ua":
					'"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"user-agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				"x-env": "live",
				"x-region": "id",
				"x-region-domain": "co.id",
				"x-region-timezone": "+0700",
			},
		});

		return Axios.get(
			`https://creator.shopee.co.id/supply/api/lm/sellercenter/realtime/dashboard/productList?sessionId=${this.session}&productName=&productListTimeRange=0&productListOrderBy=productClicks&sort=desc&page=1&pageSize=100`
		)
			.then(async (response) => {
				let data = response.data.data.list.filter(
					(product) => product.itemSold > 0
				);

				data.sort((a, b) => b.revenue - a.revenue);

				var table = new Table({
					head: ["ID", "Product Name", "Total Sold", "Total Revenue"],
					colWidths: [15, 30, 10, 20],
				});

				table.push(
					...data.map((product) => [
						product.itemId,
						product.title,
						product.itemSold,
						new Intl.NumberFormat("id-ID", {
							style: "currency",
							currency: "IDR",
						}).format(product.revenue),
					])
				);

				console.log(table.toString());

				var totalSold = data.reduce(
					(total, product) => total + product.itemSold,
					0
				);
				var totalRevenue = data.reduce(
					(total, product) => total + product.revenue,
					0
				);

				console.log(`Total Sold: ${totalSold}`);
				console.log(
					`Total Revenue: ${new Intl.NumberFormat("id-ID", {
						style: "currency",
						currency: "IDR",
					}).format(totalRevenue)}`
				);
			})
			.catch((error) => {
				console.log(error);
			});
	};
}

module.exports = Action;
