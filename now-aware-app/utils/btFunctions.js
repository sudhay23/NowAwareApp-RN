import { BleManager } from "react-native-ble-plx";
import { Alert } from "react-native";
import base64 from "react-native-base64";
let manager;
let connectedDeviceInstance = null;

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

const disconnectDevices = () => {
	// manager.cancelDeviceConnection(connectedDeviceInstance.id);
	connectedDeviceInstance.cancelConnection();
	connectedDeviceInstance = null;
};

const connectDevice = async (device, setConnectedDevice) => {
	const myDevice = await device.connect();
	connectedDeviceInstance = device;
	setConnectedDevice(device);
};

const readCharacteristicMsg = async (connectedDevice, setDevicePayloadMsg) => {
	const deviceInstance =
		await connectedDevice.discoverAllServicesAndCharacteristics();
	const services = await deviceInstance.services();
	const myService = services[2];
	const characteristics = await myService.characteristics();
	const msg = await connectedDevice.readCharacteristicForService(
		characteristics[0].serviceUUID,
		characteristics[0].uuid
	);
	setDevicePayloadMsg(base64.decode(msg.value));
};

const fnObj = {
	initializeManager,
	startScanDevices,
	stopScanDevices,
	disconnectDevices,
	connectDevice,
	readCharacteristicMsg,
};

export default fnObj;
