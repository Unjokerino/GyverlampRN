#include <WebSocketsServer.h>

WebSocketsServer webSocket = WebSocketsServer(81);

static void writeLED(bool);
static void writeLED2(bool);


// Commands sent through Web Socket
const char LEDON[] = "light1";
const char LEDOFF[] = "light0";

const char LEDON2[] = "ledon0";
const char LEDOFF2[] = "ledoff0";

const char LEDON3[] = "true";
const char LEDOFF3[] = "false";

// GPIO#0 is for Adafruit ESP8266 HUZZAH board. Your board LED might be on 13.
const int LEDPIN = D4;
const int LEDPIN2 = D0;
// Current LED status
bool LEDStatus;
bool LEDStatus2;
uint8_t klient;

static void writeLED(bool LEDon)
{
  LEDStatus = LEDon;
  // Note inverted logic for Adafruit HUZZAH board
  if (LEDon) {
    digitalWrite(LEDPIN, 0);
  }
  else {
    digitalWrite(LEDPIN, 1);
  }
}

static void writeLED2(bool LEDon2)
{
  LEDStatus2 = LEDon2;
  // Note inverted logic for Adafruit HUZZAH board
  if (LEDon2) {
    digitalWrite(LEDPIN2, 0);
  }
  else {
    digitalWrite(LEDPIN2, 1);
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length){
  //Serial.printf("webSocketEvent(%d, %d, ...)\r\n", num, type);
  
  klient = num;
  
  switch(type) {
    case WStype_DISCONNECTED:
     // Serial.printf("[%u] Disconnected!\r\n", num);
      break;
    case WStype_CONNECTED:
      {
        //IPAddress ip = webSocket.remoteIP(num);
        //Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\r\n", num, ip[0], ip[1], ip[2], ip[3], payload);

		configSetup = readFile("config.json", 4096);
		
		int effect = jsonReadtoInt(configSetup, "effect"); 
		webSocket.sendTXT(num,  String("effect") + effect);


		int volume = jsonReadtoInt(configSetup, "volume"); 
		webSocket.sendTXT(num,  String("volume") + volume);
        

		int speed = jsonReadtoInt(configSetup, "speed"); 
		webSocket.sendTXT(num,  String("speed") + speed);

		int scale = jsonReadtoInt(configSetup, "scale"); 
		webSocket.sendTXT(num,  String("scale") + scale);



        /*
		String ssidAP = jsonRead(configSetup, "ssidAP"); 
		String passwordAP = jsonRead(configSetup, "passwordAP"); 
		String ssid = jsonRead(configSetup, "ssid"); 
		String password = jsonRead(configSetup, "password"); 
        
		
		if(light == 1){
			webSocket.sendTXT(num, "light1", 6);
		}else{
			webSocket.sendTXT(num, "light0", 6);
        }
        
		webSocket.sendTXT(num, "color" + color, 6);

		if(dot == 1){
			webSocket.sendTXT(num, "doten", 5);
		}else{
			webSocket.sendTXT(num, "dotdis", 6);
        }
        
		webSocket.sendTXT(num, "effect" + effect, 7);
		webSocket.sendTXT(num, "doteffect" + doteffect, 10);
		webSocket.sendTXT(num, "timezone" + timezone, 10);
		webSocket.sendTXT(num, "brightness" + brightness, 11);
*/
        
        // Send the current LED status
        //if (LEDStatus) {
        //  webSocket.sendTXT(num, LEDON, strlen(LEDON));
        //}
       // else {
        //  webSocket.sendTXT(num, LEDOFF, strlen(LEDOFF));
        //}
        
       // if (LEDStatus2) {
        //  webSocket.sendTXT(num, LEDON2, strlen(LEDON2));
       // }
       // else {
        //  webSocket.sendTXT(num, LEDOFF2, strlen(LEDOFF2));
        //}        
       // Serial.print(num);
      
      }
      break;
    case WStype_TEXT:
      //Serial.printf("[%u] get Text: %s\r\n", num, payload);

      if (strcmp(LEDON, (const char *)payload) == 0) {
        writeLED(true);
      }
      else if (strcmp(LEDOFF, (const char *)payload) == 0) {
        writeLED(false);
      }
      
      if (strcmp(LEDON2, (const char *)payload) == 0) {
        writeLED2(true);
      }
      else if (strcmp(LEDON3, (const char *)payload) == 0) {
        writeLED2(true);
      }      
      else if (strcmp(LEDOFF3, (const char *)payload) == 0) {
        writeLED2(false);
      }   
      else if (strcmp(LEDOFF2, (const char *)payload) == 0) {
        writeLED2(false);
      }
      else {
      //  Serial.println("Unknown command");
      }
      // send data to all connected clients
      webSocket.broadcastTXT(payload, length);
      break;
    case WStype_BIN:
     // Serial.printf("[%u] get binary length: %u\r\n", num, length);
      hexdump(payload, length);

      // echo data back to browser
      webSocket.sendBIN(num, payload, length);
      break;
    default:
      Serial.printf("Invalid WStype [%d]\r\n", type);
      break;
  }
}
