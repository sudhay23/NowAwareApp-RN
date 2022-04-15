import { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	Button,
	Alert,
	FlatList,
	ToastAndroid,
} from "react-native";
import BtFunctions from "./utils/btFunctions";

let manager;

export default function App() {
	const [connectedDevice, setConnectedDevice] = useState(null);
	const [devicePayloadMsg, setDevicePayloadMsg] = useState(null);
	let scanIntervals;

	// Initialize BleManager
	useEffect(() => {
		manager = BtFunctions.initializeManager();
	}, []);

	// Scan for devices every 10 seconds for 4 seconds searching for desired BLE Device
	// Also handle device disconnection event
	useEffect(() => {
		if (connectedDevice) {
			clearInterval(scanIntervals);
			BtFunctions.stopScanDevices();

			// Setup onDeviceDisconnected
			manager.onDeviceDisconnected(connectedDevice.id, (err, device) => {
				console.log(
					"Device got disconnected...Resuming Scan Intervals..."
				);
				setConnectedDevice(null);
			});
		} else {
			scanIntervals = setInterval(() => {
				BtFunctions.startScanDevices(setConnectedDevice, scanIntervals);
				setTimeout(() => {
					BtFunctions.stopScanDevices();
				}, 4000);
			}, 10000);
		}
	}, [connectedDevice]);

	return (
		<View style={styles.container}>
			<Text>
				Connected Device:{" "}
				{connectedDevice ? connectedDevice.name : "NONE"}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
