import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, ToastAndroid } from "react-native";
import BtFunctions from "./utils/btFunctions";

let manager;
let disconnectionSubscription;

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

			// Setup onDisconnected
			disconnectionSubscription = connectedDevice.onDisconnected(
				(err, device) => {
					console.log(
						"Device got disconnected...Resuming Scan Intervals..."
					);
					disconnectionSubscription.remove(); //Remove subscription to this disconnect listener as this device is no longer existing
					disconnectionSubscription = null;
					setConnectedDevice(null);
					setDevicePayloadMsg(null);
				}
			);

			// Obtain the payload characteristic message ---> Initiate TTS Read from there
			BtFunctions.readCharacteristicMsg(
				connectedDevice,
				setDevicePayloadMsg
			);
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
			<Text>
				Message Payload: {devicePayloadMsg ? devicePayloadMsg : "N/A"}
			</Text>
			{connectedDevice ? (
				<Button
					title="Force Disconnect"
					color="red"
					onPress={BtFunctions.disconnectDevices}
					style={styles.forceDisconnectBtn}
				/>
			) : (
				<></>
			)}
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
	forceDisconnectBtn: {
		marginVertical: 10,
	},
});
