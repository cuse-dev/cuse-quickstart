import { Apps, Computer } from "@cusedev/core";

export const initComputer = async () => {
	const computer = new Computer({
		config: {
			baseUrl: "http://localhost:4242/quickstart-computer",
			display: {
				number: 1,
				width: 1024,
				height: 768,
			},
		},
		apps: {
			keychain: new Apps.Keychain(),
		},
	});

	await computer.boot();

	return computer;
};

export const setupComputer = async () => {
	const computer = new Computer({
		config: {
			baseUrl: "http://localhost:4242/quickstart-computer",
			display: {
				number: 1,
				width: 1024,
				height: 768,
			},
		},
		apps: {
			keychain: new Apps.Keychain(),
		},
	});

	await computer.setup();
	await computer.boot();

	await computer.apps.keychain.setKey("google", {
		password: "YzcA5NWd",
		email: "cusedev42@gmail.com",
		username: "cusedev42@gmail.com",
	});

	return computer;
};
