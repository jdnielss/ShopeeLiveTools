const randomSleep = (min, max) => {
	console.log("[!]", new Date().toLocaleTimeString(), "Sleeping...");
	let rand = Math.random() * (max - min) + min;
	return new Promise((resolve) => setTimeout(resolve, rand));
};

const timestampTODate = (timestamp) => {
	let date = new Date(timestamp * 1000);
	let hours = date.getHours();
	let minutes = "0" + date.getMinutes();
	let seconds = "0" + date.getSeconds();
	return (
		hours + "j " + minutes.substr(-2) + "mnt " + seconds.substr(-2) + "dtk lalu"
	);
};

const logger = (message) => {
	console.log(`[${new Date().toLocaleTimeString()}]`, message);
};

module.exports = {
	randomSleep,
	timestampTODate,
	logger,
};
