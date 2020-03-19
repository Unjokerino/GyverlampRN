import * as React from 'react';
import * as Font from 'expo-font';
import { SplashScreen } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, TouchableOpacity, Dimensions, ScrollView, Slider  } from 'react-native';
import { Title,Text, Appbar, Caption, Portal, Provider,IconButton } from "react-native-paper";
const width = Dimensions.get('window').width;
import HomeScreen from './screens/HomeScreen'

export default function App(props) {

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          //'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);


  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <HomeScreen/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#161D27',
},
});