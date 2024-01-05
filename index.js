const Table = require("cli-table");
const { logger, randomSleep } = require("./libs/utils");
const Action = require("./libs/action");

(async () => {
	console.log("SHOPEE LIVE BOT");
	console.log("Created by: an-halim");
	console.log(`Version: ${require("./package.json").version}`);
	console.log("Feature: ");
	console.log("1. Auto Pin Product");
	console.log("2. Auto Show Voucher");
	console.log("3. Auto Get Sales\n");

	let askedItems = "";

	const action = new Action();
	action.sessionID = await action.getSession();

	while (true) {
		try {
			logger("Geting Vouchers...");
			let vouchers = await action.getVochers();

			if (vouchers) {
				let table = new Table({
					head: ["Voucher Code", "Min Spend", "Discount", "Discount Cap"],
					colWidths: [25, 10, 10, 10],
				});

				let tableData = [];
				vouchers.data.shopee_vouchers.map((voucher, index) => {
					tableData.push([
						voucher.voucher_code,
						voucher.min_spend,
						voucher.discount_percentage,
						voucher.discount_cap,
					]);
				});
				table.push(...tableData);
				console.log(table.toString());

				logger("Show Vouchers...");
				let shopeeVoucher = vouchers.data.shopee_vouchers;

				if (shopeeVoucher.length > 0) {
					let voucher =
						shopeeVoucher[Math.floor(Math.random() * shopeeVoucher.length)];

					let table = new Table({
						head: ["Voucher Code", "Min Spend", "Discount", "Discount Cap"],
						colWidths: [25, 10, 10, 10],
					});

					table.push([
						voucher.voucher_code,
						voucher.min_spend,
						voucher.discount_percentage,
						voucher.discount_cap,
					]);
					console.log(table.toString());

					logger(`Show voucher ${voucher.voucher_code}...`);
					let showVoucherResponse = await action.showVoucher(
						JSON.stringify({
							session_id: 54977867,
							identifier: {
								promotion_id: voucher.promotion_id,
								voucher_code: voucher.voucher_code,
								signature: voucher.signature,
							},
							voucher: JSON.stringify(voucher),
						})
					);

					logger(showVoucherResponse.err_msg);
				}
			}

			logger("Geting Requested Items...");

			let requestedItems = await action.getRequestedItems();

			let table = new Table({
				head: ["Item Name", "Request By", "Request Count"],
				colWidths: [20, 15, 15],
			});

			table.push(
				...requestedItems.map((item) => {
					return [item.name, item.ask_username, item.ask_count];
				})
			);

			console.log(table.toString());

			let lastItemTime = requestedItems
				.map((item) => {
					return item.ask_time;
				})
				.sort((a, b) => {
					return b - a;
				})[0];

			let item = requestedItems.find((item) => {
				return item.ask_time === lastItemTime;
			});

			if (askedItems?.item_id !== item?.item_id) {
				logger("New Item Requested");
				askedItems = item;
				logger("Pin Item..." + item.name.slice(0, 20));
				let pinNewItem = await action.pinItem(JSON.stringify(item));
				logger(pinNewItem.err_msg);
			}
			await action.getSales();
			await randomSleep(60000, 100000);
		} catch (error) {
			logger(error);
		}
	}
})();
