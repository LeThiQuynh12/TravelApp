import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import AsyncStorage
  from '@react-native-async-storage/async-storage'; // Thêm dòng này
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomerInfo from './components/Reusable/CustomerInfo.jsx';
import AirDetail from './components/Tiles/Air/AirDetail.jsx';
import AirList from './components/Tiles/Air/AirList.jsx';
import BusDetail from './components/Tiles/Bus/BusDetail.jsx';
import BusList from './components/Tiles/Bus/BusList.jsx';
import HotelList from './components/Tiles/Hotels/HotelList.jsx';
import ReviewsList from './components/Tiles/Hotels/ReviewsList.jsx';
import SelectRoom from './components/Tiles/Hotels/SelectRoom.jsx';
import PlaceList from './components/Tiles/Place/PlaceList.jsx';
import VerificationScreen from './components/VerificationScreen.jsx';
import BottomTabNavigation from './navigation/BottomTabNavigation';
import ForgotPass from './screens/authentication/ForgotPass.jsx';
import CountryDetails from './screens/details/CountryDetails.jsx';
import HotelDetails from './screens/details/HotelDetails.jsx';
import PlaceDetails from './screens/details/PlaceDetails.jsx';
import Recommended from './screens/details/Recommended.jsx';
import Onboarding from './screens/onboarding/Onboarding.jsx';
import AccountDetail from './screens/profile/AccountDetail.jsx';
import AddPaymentMethodScreen
  from './screens/profile/AddPaymentMethodScreen.jsx';
import Bank from './screens/profile/Bank.jsx';
import ChangePass from './screens/profile/ChangePass.jsx';
import Email from './screens/profile/Email.jsx';
import LinkSuccessScreen from './screens/profile/LinkSuccessScreen.jsx';
import PersonalInfoScreen from './screens/profile/PersonalInfoScreen.jsx';
import PhoneNumber from './screens/profile/PhoneNumber.jsx';
import Profile from './screens/profile/Profile.jsx';
import HotelSearch from './screens/search/HotelSearch.jsx';
import Search from './screens/search/Search.jsx';
import BookingDetails from './components/Tiles/Hotels/BookingDetails.jsx';
import NearbyLocations from './screens/details/NearbyLocations.jsx';
import Chat from './screens/chat/Chat.jsx';
import AskQuestion from './screens/chat/AskQuestion.jsx';
import Chatbot from './screens/chat/Chatbot.jsx';
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    regular: require('./assets/fonts/regular.ttf'),
    bold: require('./assets/fonts/bold.ttf'),
    light: require('./assets/fonts/light.ttf'),
    medium: require('./assets/fonts/medium.ttf'),
    xtrbold: require('./assets/fonts/xtrabold.ttf'),
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Onboard');

  // Kiểm tra trạng thái đăng nhập khi app khởi động
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsLoggedIn(true);
          setInitialRoute('Bottom');
        } else {
          setIsLoggedIn(false);
          setInitialRoute('Onboard');
        }
      } catch (error) {
        console.log('Lỗi kiểm tra token:', error);
      }
    };
    checkLoginStatus();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Onboard"
          component={Onboarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Bottom" options={{ headerShown: false }}>
          {(props) => (
            <BottomTabNavigation
              {...props}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
        <Stack.Screen
          name="CountryDetails"
          component={CountryDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="PlaceList" component={PlaceList} options={{ headerShown: false }} />
        <Stack.Screen
          name="Recommended"
          component={Recommended}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PlaceDetails"
          component={PlaceDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HotelDetails"
          component={HotelDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="HotelList" component={HotelList} options={{ headerShown: false }} />
        <Stack.Screen
          name="HotelSearch"
          component={HotelSearch}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReviewsList"
          component={ReviewsList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectRoom"
          component={SelectRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CustomerInfo"
          component={CustomerInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AirList" component={AirList} options={{ headerShown: false }} />
        <Stack.Screen name="AirDetail" component={AirDetail} options={{ headerShown: false }} />
        <Stack.Screen name="BusList" component={BusList} options={{ headerShown: false }} />
        <Stack.Screen name="BusDetail" component={BusDetail} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={{ headerShown: false }} />
        <Stack.Screen name="Email" component={Email} options={{ headerShown: false }} />
        <Stack.Screen name="Bank" component={Bank} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePass" component={ChangePass} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} options={{ headerShown: false }} />
        <Stack.Screen name="LinkSuccessScreen" component={LinkSuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddPaymentMethodScreen" component={AddPaymentMethodScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AccountDetail" component={AccountDetail} options={{ headerShown: false }} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} options={{ headerShown: false }} />
        <Stack.Screen name="NearbyLocations" component={NearbyLocations} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="AskQuestion" component={AskQuestion} options={{ headerShown: false }} />
        <Stack.Screen name="Chatbot" component={Chatbot} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}