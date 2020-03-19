import React, {useEffect, useState} from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, ScrollView, Slider, Picker  } from 'react-native';
import { Title,Text, Appbar, Caption, Portal, Provider,IconButton, Button, Snackbar } from "react-native-paper";
const width = Dimensions.get('window').width;
export default function HomeScreen() {


const [sockets, setsockets] = useState([
    //{
    //    ws:"wss://echo.websocket.org",
    //    status:'closed'
    //},
    {
        ws:"ws://192.168.4.67:8888",
        status:'closed'},
    {
        ws:"ws://192.168.4.66:8888",
        status:'closed'}
])
const [effects, seteffects] = useState(1)
const socketURL = "wss://echo.websocket.org";
const [remoteData, setremoteData] = useState({
    speed:0,
    volume:0,
    scale:0,
    effect:1,
})
const [visible, setvisible] = useState(false)
const [showReconnect, setshowReconnect] = useState(false)
const [refreshing, setrefreshing] = useState(false)
const [snackbar_message, setsnackbar_message] = useState('')
useEffect(() => {
    openConnection()


}, [])

const sendParams1 = (ws,key,value) =>{
    ws.send('volume' + data.from);
}



const openConnection = () => {
    
    sockets.forEach(socket => {
           createCallbacks(socket); 
    });
};

const sendParams = (value,key) =>{
    setremoteData({...remoteData,[key]:value})
    
    sockets.forEach(socket => {
        if(socket.status === 'opened'){
            socket.socket.send(`${key}${value}`)
        }
        
    });
}

const createCallbacks = (socket) => {
    let ws = new WebSocket(socket.ws)
    socket.status = "opening"
    socket.socket = ws

    ws.onopen = () => {
        setvisible(true),
        setshowReconnect(false),
        setrefreshing(false),
        setsnackbar_message("Соединение открыто")
        socket.status = "opened"
    };

    ws.onmessage = e => {
      //let data = JSON.parse(e.data);
      setvisible(true),
      setsnackbar_message(e.data)
      console.log("data: ",e.data);
    };

    ws.onerror = e => {
        setvisible(true),
        setshowReconnect(true),
        setrefreshing(false),
        setsnackbar_message("Ошибка соединения")
        socket.status = "error"

    };

    ws.onclose = e => {
      // connection closed
        socket.status = "closed"
      console.log(123, e.code, e.reason);
    };
  };
  
return (
    <View style={styles.container}>
        <View style={{
            height: 30,
            backgroundColor: '#161D27'
        }} />
        <Appbar style={{
                    elevation: 0,
                    backgroundColor:'#161D27'
                }}>
            <Appbar.Content title="Настройки" />
            <Appbar.Action icon="settings"/>
        </Appbar>

        <View style={styles.mainInfoContainer}>
        <TouchableOpacity style={styles.onButton}>
            <Text style={styles.onButtonText}>
            ВКЛ
            </Text>
        </TouchableOpacity>
        <View style={styles.mainStatsContainer}>
            <TouchableOpacity>
                <Title style={styles.title}>{remoteData.volume}%</Title>
                <Caption style={styles.caption}>яркость</Caption>
            </TouchableOpacity>
            <View>
                <Picker
                    selectedValue={remoteData.effect}
                    style={[{margin:0,padding:0,width:200,position:'relative',right:10,top:10},styles.title]}
                    onValueChange={(itemValue, itemIndex) =>
                        sendParams(itemValue,"effect")
                    }>  
                    <Picker.Item label="Конфетти" value="0"/>
                    <Picker.Item label="Огонь" value="1"/>
                    <Picker.Item label="Радуга верт" value="2"/>
                    <Picker.Item label="Радуга гориз." value="3"/>
                    <Picker.Item label="Смена цвета" value="4"/>
                    <Picker.Item label="Безумие 3D" value="5"/>
                    <Picker.Item label="Облака 3D" value="6"/>
                    <Picker.Item label="Лава 3D" value="7"/>
                    <Picker.Item label="Плазма 3D" value="8"/>
                    <Picker.Item label="Радуга 3D" value="9"/>
                    <Picker.Item label="Павлин 3D" value="10"/>
                    <Picker.Item label="Зебра 3D" value="11"/>
                    <Picker.Item label="Лес 3D" value="12"/>
                    <Picker.Item label="Океан 3D" value="13"/>
                    <Picker.Item label="Моноцвет" value="14"/>
                    <Picker.Item label="Снег" value="15" />
                    <Picker.Item label="Матрица" value="16"/>
                    <Picker.Item label="Светляки" value="17"/>
                </Picker>
                <Caption style={styles.caption}>режимы</Caption>
            </View>
        </View>
        
        </View>
        

        <ScrollView style={styles.settingsCardContainer}>
            <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Яркость</Text>
            <Slider step={1} maximumValue={100} onValueChange={data => sendParams(data,'volume')} minimumTrackTintColor="#fff" color="#fff" thumbTintColor='#fff' style={styles.slider}/>
            <Text style={styles.sliderValue}>{remoteData.volume}</Text>
            </View>
            <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Режимы</Text>
                <View style={styles.settingsItem}>
                <Text style={styles.settingSubTitle}>Масштаб</Text>
                <Slider step={1} maximumValue={100} onValueChange={data => sendParams(data,'scale')} minimumTrackTintColor="#fff" color="#fff" thumbTintColor='#fff' style={styles.slider}/>
                <Text style={styles.sliderValue}>{remoteData.scale}</Text>
            
            
                <Text style={styles.settingSubTitle}>Скорость</Text>
                <Slider step={1} maximumValue={100} onValueChange={data => sendParams(data,'speed')} minimumTrackTintColor="#fff" color="#fff" thumbTintColor='#fff' style={styles.slider}/>
                <Text style={styles.sliderValue}>{remoteData.speed}</Text>
            </View>


            </View>
        </ScrollView>
        <Snackbar
          visible={visible}
          onDismiss={() => setvisible(false)}
          action={{
            label: 'Окей',
            onPress: () => {
              // Do something
            },
          }}
        >
          {snackbar_message}
        </Snackbar>
    </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#161D27',
},
mainInfoContainer:{
  padding:20,
  flexDirection:'row'
},
title:{
  textAlign:'left',
  color:"#fff"
},
caption:{
  color:'#8F9192'
},
slider:{
  color:'#fff',
  marginTop:10,
},
settingsItem:{
  marginTop:15,
},
settingsCardContainer:{
  marginTop:15,
},
sliderValue:{
  color:'#fff',
  alignSelf:'flex-end',
  fontSize:12
},
settingsCard:{
  marginBottom:10,
  padding:19,
  backgroundColor:'#1D2733',

},
settingsTitle:{
  color:'#54A7E5',
  fontSize:14,
},
settingSubTitle:{
  color:'#fff',
  fontSize:12,
},
mainStatsContainer:{
  flex:1,
  paddingLeft:40,
  justifyContent:'center' 
},
onButton:{
  borderColor:'#54A7E5',
  borderWidth:8,
  justifyContent:'center',
  alignItems:'center',
  borderRadius: width / 2,
  height: width / 2,
  width: width / 2
},
onButtonText:{
  fontSize:30,
  color:'#fff'
},
});