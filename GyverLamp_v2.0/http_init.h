void HTTP_init(void) {

  server.on("/config.json", HTTP_GET, []() {
    server.send(200, "application/json", configSetup);
  });

  server.on("/", HTTP_GET, [](){
    if(!handleFileRead("/index.htm")) server.send(404, "text/plain", "FileNotFound");
  });  //list directory
  
  server.on("/index.htm", HTTP_GET, [](){
    if(!handleFileRead("/index.htm")) server.send(404, "text/plain", "FileNotFound");
  });  //list directory
    
  server.on("/settings.htm", HTTP_GET, [](){
    if(!handleFileRead("/settings.htm")) server.send(404, "text/plain", "FileNotFound");
  }); 
  
  server.on("/sound.htm", HTTP_GET, [](){
    if(!handleFileRead("/sound.htm")) server.send(404, "text/plain", "FileNotFound");
  }); 
  
  server.on("/settings", HTTP_GET, [](){
    if(!handleFileRead("/settings.htm")) server.send(404, "text/plain", "FileNotFound");
  }); 
  
  server.on("/list", HTTP_GET, handleFileList);
  //load editor
  server.on("/edit", HTTP_GET, [](){
    if(!handleFileRead("/edit.htm")) server.send(404, "text/plain", "FileNotFound");
  });
  
  server.on("/ssid", HTTP_GET, []() {
  jsonWrite(configSetup, "ssid", server.arg("ssid"));
  jsonWrite(configSetup, "password", server.arg("password"));
  saveConfig();                 // Функция сохранения данных во Flash
  server.send(200, "text/plain", "OK"); // отправляем ответ о выполнении
  });
   // --------------------Получаем SSDP со страницы
  server.on("/ssidap", HTTP_GET, []() {
  jsonWrite(configSetup, "ssidAP", server.arg("ssidAP"));
  jsonWrite(configSetup, "passwordAP", server.arg("passwordAP"));
  saveConfig();                 // Функция сохранения данных во Flash
  server.send(200, "text/plain", "OK"); // отправляем ответ о выполнении
  });
 
  
  //create file
  server.on("/edit", HTTP_PUT, handleFileCreate);
  //delete file
  server.on("/edit", HTTP_DELETE, handleFileDelete);
  //first callback is called after the request has ended with all parsed arguments
  //second callback handles file uploads at that location
  server.on("/edit", HTTP_POST, [](){ server.send(200, "text/plain", ""); }, handleFileUpload);

  //called when the url is not defined here
  //use it to load content from SPIFFS
  server.onNotFound(handleNotFound);
  server.serveStatic("/font", SPIFFS, "/font","max-age=86400"); 
  server.serveStatic("/js",   SPIFFS, "/js"  ,"max-age=86400"); 
  server.serveStatic("/css",  SPIFFS, "/css" ,"max-age=86400"); 
  
  //get heap status, analog input value and all GPIO statuses in one json call
  server.on("/all", HTTP_GET, [](){
    String json = "{";
    json += "\"heap\":"+String(ESP.getFreeHeap());
    json += ", \"analog\":"+String(analogRead(A0));
    json += ", \"gpio\":"+String((uint32_t)(((GPI | GPO) & 0xFFFF) | ((GP16I & 0x01) << 16)));
    json += "}";
    server.send(200, "text/json", json);
    json = String();
  });
  server.begin();
  Serial.println("HTTP server started");

}
