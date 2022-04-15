import * as Speech from "expo-speech";

// Handler functions
const initiateReadOut = (contentObj) => {
	// console.log(contentObj);

	let speakContent = "Hello Driver. Alert Message. ";

	switch (contentObj.vehicleType.toLowerCase()) {
		case "ambulance":
			speakContent +=
				"There is an ambulance in close range. Please clear way as early as possible.";
			break;
		case "police":
			speakContent +=
				"There is a police patrol vehicle in close range. Please clear way as early as possible.";
			break;
		case "vip-escort":
			speakContent +=
				"There is a VIP escort vehicle in close range. Please clear way as early as possible.";
			break;
		case "fire-engine":
			speakContent +=
				"There is a Fire Emergency Vehicle in close range. Please clear way as early as possible.";
			break;
	}

	for (let i = 0; i < 3; i++) {
		// Read out 3 times
		Speech.speak(speakContent, { rate: 0.9, pitch: 1.2 });
	}
};

const ttsModule = {
	initiateReadOut,
};

export default ttsModule;
