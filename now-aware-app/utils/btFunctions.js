import { BleManager } from "react-native-ble-plx";
import { Alert } from "react-native";
let manager;

// Handler Functions
const initializeManager = () => {
	manager = new BleManager();
	return manager;
};

const startScanDevices = (setConnectedDevice, scanIntervals) => {
	manager.startDeviceScan(null, null, (error, device) => {
		if (error) {
			// Handle error (scanning will be stopped automatically)
			clearInterval(scanIntervals);
			console.log("Stopped Scanning due to Error", error);
			Alert.alert("Error", `${error}. Restart App`, [{ text: "Okay" }]);
			return;
		}
		console.log(device.name);
		if (device.name != null) {
			if (device.name === "ESP32") {
				console.log(device.id);
				console.log("Setting State");
				clearInterval(scanIntervals);
				manager.stopDeviceScan();
				connectDevice(device, setConnectedDevice);
			}
		}
	});
};

const stopScanDevices = () => {
	manager.stopDeviceScan();
};

const disconnectDevices = () => {};

const connectDevice = async (device, setConnectedDevice) => {
	const myDevice = await device.connect();
	setConnectedDevice(device);
};

const readCharacteristicMsg = (connectedDevice, setDevicePayloadMsg) => {};

const fnObj = {
	initializeManager,
	startScanDevices,
	stopScanDevices,
	disconnectDevices,
	connectDevice,
	readCharacteristicMsg,
};

export default fnObj;
