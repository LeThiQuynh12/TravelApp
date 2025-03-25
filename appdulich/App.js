import { useCallback } from 'react';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomerInfo from './components/Reusable/CustomerInfo.jsx';
import HotelList from './components/Tiles/Hotels/HotelList.jsx';
import ReviewsList from './components/Tiles/Hotels/ReviewsList.jsx';
import SelectRoom from './components/Tiles/Hotels/SelectRoom.jsx';
import PlaceList from './components/Tiles/Place/PlaceList.jsx';
import BottomTabNavigation from './navigation/BottomTabNavigation';
import CountryDetails from './screens/details/CountryDetails.jsx';
import HotelDetails from './screens/details/HotelDetails.jsx';
import PlaceDetails from './screens/details/PlaceDetails.jsx';
import Recommended from './screens/details/Recommended.jsx';
import Onboarding from './screens/onboarding/Onboarding.jsx';
import HotelSearch from './screens/search/HotelSearch.jsx';
import Search from './screens/search/Search.jsx';

const Stack = createNativeStackNavigator();

// Ngăn splash screen tự động ẩn trước khi font được tải
//SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    regular: require('./assets/fonts/regular.ttf'),
    bold: require('./assets/fonts/bold.ttf'),
    light: require('./assets/fonts/light.ttf'),
    medium: require('./assets/fonts/medium.ttf'),
    xtrbold: require('./assets/fonts/xtrabold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Đợi fonts load xong rồi mới hiển thị UI
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Onboard' component={Onboarding} options={{headerShown: false}}/>
        <Stack.Screen name='Bottom' component={BottomTabNavigation} options={{headerShown: false}}/>
        <Stack.Screen name='Search' component={Search} options={{headerShown: false}}/>
        <Stack.Screen name='CountryDetails' component={CountryDetails} options={{headerShown: false}}/>
        <Stack.Screen name='PlaceList' component={PlaceList} options={{headerShown: false}}/>
        <Stack.Screen name='Recommended' component={Recommended} options={{headerShown: false}}/>
        <Stack.Screen name='PlaceDetails' component={PlaceDetails} options={{headerShown: false}}/>
        <Stack.Screen name='HotelDetails' component={HotelDetails} options={{headerShown: false}}/>
        <Stack.Screen name='HotelList' component={HotelList} options={{headerShown: false}}/>
        <Stack.Screen name='HotelSearch' component={HotelSearch} options={{headerShown: false}}/>
        <Stack.Screen name='ReviewsList' component={ReviewsList} options={{headerShown: false}}/>
        <Stack.Screen name='SelectRoom' component={SelectRoom} options={{headerShown: false}}/>
        <Stack.Screen name="CustomerInfo" component={CustomerInfo} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}