#include<BLEDevice.h>
#include<BLEServer.h>
#include<BLEUtils.h>
#include<BLE2902.h>

BLECharacteristic *pCharacteristic;

//EXTRAS
BLEServer *pServer;


bool deviceConnected = false;
int txValue = 0;

#define SERVICE_UUID "87248916-3f42-40be-84c7-99d770a00263" 
#define CHARACTERISTIC_UUID_TX "87248920-3f42-40be-84c7-99d770a00263" 

class MyServerCallbacks: public BLEServerCallbacks
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



void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  BLEDevice::init("ESP32");

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());


  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService -> createCharacteristic(
                                      CHARACTERISTIC_UUID_TX,
                                      BLECharacteristic::PROPERTY_NOTIFY
                                    );

  pCharacteristic -> addDescriptor(new BLE2902());

  pService->start();

  pServer->getAdvertising()->start();

  Serial.println("Waiting for client connection to notify...");
  

}

void loop() {
  // put your main code here, to run repeatedly:
  if(deviceConnected)
  {
    txValue = 999777;
    
    char txString[8];
    dtostrf(txValue,1,2,txString);

    pCharacteristic -> setValue(txString);
//    pCharacteristic -> setValue("RhuthvikIsOurLeader");

    pCharacteristic->notify();
    Serial.println("Sent value = "+String(txString));
    delay(1000);
  }
  else
  {  
    pServer->getAdvertising()->start();
    Serial.println("Waiting.......");
    delay(4000);
  }

}
