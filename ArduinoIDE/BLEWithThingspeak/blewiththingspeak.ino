#include <WiFi.h>
#include "ThingSpeak.h"
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>

const char *ssid = "kaushik";      // your network SSID (name)
const char *password = "hotpasss"; // your network password

WiFiClient client;

unsigned long myChannelNumber = 1;
const char *myWriteAPIKey = "8JYAMOKIX2RV5QVC";

// Timer variables
unsigned long lastTime = 0;
unsigned long timerDelay = 1000;

BLECharacteristic *pCharacteristic;

// EXTRAS
BLEServer *pServer;

bool deviceConnected = false;
// int txValue = 0;

#define SERVICE_UUID "87248916-3f42-40be-84c7-99d770a00263"
#define CHARACTERISTIC_UUID_TX "87248920-3f42-40be-84c7-99d770a00263"

class MyServerCallbacks : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
        deviceConnected = true;
    }

    void onDisconnect(BLEServer *pServer)
    {
        deviceConnected = false;
    }
};

void setup()
{
    Serial.begin(9600); // Initialize serial
    WiFi.mode(WIFI_STA);
    ThingSpeak.begin(client); // Initialize ThingSpeak

    BLEDevice::init("ESP32");

    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    BLEService *pService = pServer->createService(SERVICE_UUID);

    pCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_TX,
        BLECharacteristic::PROPERTY_READ |
            BLECharacteristic::PROPERTY_WRITE |
            BLECharacteristic::PROPERTY_NOTIFY |
            BLECharacteristic::PROPERTY_INDICATE);

    pCharacteristic->addDescriptor(new BLE2902());

    pService->start();

    pServer->getAdvertising()->start();

    Serial.println("Waiting for client connection to notify...");
}

void loop()
{

    // Connect or reconnect to WiFi
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.print("Attempting to connect");
        while (WiFi.status() != WL_CONNECTED)
        {
            WiFi.begin(ssid, password);
            delay(5000);
        }
        Serial.println("\nConnected.");
    }

    uint32_t connectedDevices = pServer->getConnectedCount();
    pServer->getAdvertising()->start();
    //    pCharacteristic -> setValue("RhuthvikIsOurLeader");
    pCharacteristic->setValue("{\"vehicleType\":\"Vip-Escort\",\"regNo\":\"KL38CD2558\"}");
    pCharacteristic->notify();
    Serial.printf("Sent Value...Multi connection mode...Connections = %d\n", connectedDevices);

    // Write to ThingSpeak. There are up to 8 fields in a channel, allowing you to store up to 8 different
    // pieces of information in a channel.  Here, we write to field 1.
    int x = ThingSpeak.writeField(myChannelNumber, 3, (int)connectedDevices, myWriteAPIKey);

    if (x == 200)
    {
        Serial.println("Channel update successful.");
    }
    else
    {
        //      Serial.println("Problem updating channel. HTTP error code " + String(x));
    }

    delay(1000);
}