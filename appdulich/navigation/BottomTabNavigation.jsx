import React, { useEffect } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { COLORS } from '../constants/theme';
import Authentication from '../screens/authentication/authentication';
import Contact from '../screens/chat/Contact';
import Explore from '../screens/explore/Explore';
import Home from '../screens/home/Home';
import Location from '../screens/location/Location';
import Profile from '../screens/profile/Profile';
import Vehicle from '../screens/vehicle/Vehicle';

const Tab = createBottomTabNavigator();
//ios
const tabBarStyle = {
    padding: 20,
    borderRadius:20,
    height: 82,
    position: "absolute",
    // bottom: 20,
    left: 20,
    right: 20,
}
// android
// const tabBarStyle = {
//     padding: 20,
//     height: 60,
//     position: "absolute",
//     left: 20,
//     right: 20,
// }
const BottomTabNavigation = ({isLoggedIn, setIsLoggedIn, navigation}) => {

    // Lắng nghe thay đổi của isLoggedIn và điêuf hướng

    useEffect(()=>{
        if(isLoggedIn){
            navigation.navigate("Profile") // Điều hướng đến Profile khi đăng nhập thành công
        }
    },[isLoggedIn, navigation])

    
  return (

      <Tab.Navigator
      initialRouteName="Home"
      activeColor='#EB6A58'
      tabBarHideKeyBoard={true}
      headerShown={false}
      inactiveColor='#3e2465'
      barStyle={{paddingBottom:48}}
      >
        <Tab.Screen name="Home" component={Home} 
        options={{
            tabBarStyle: tabBarStyle,
            tabBarShowLabel: false,
            headerShown: false,
           
            tabBarIcon: ({ focused }) => (
                <Ionicons 
                    name={focused ? "grid" : "grid-outline"} 
                    color={focused ? COLORS.red : COLORS.gray} 
                    size={26} 
                />
            )
            
        }} 
        />


        <Tab.Screen name="Vehicle" component={Vehicle} 
                options={{
                    tabBarStyle: tabBarStyle,
                    tabBarShowLabel: false,headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons 
                            name={focused ? "car" : "car-outline"} 
                            color={focused ? COLORS.red : COLORS.gray} 
                            size={30} 
                        />
                    )
                }} 
                />


            <Tab.Screen name="Location" component={Location} 
                options={{
                    tabBarStyle: tabBarStyle,
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons 
                            name={focused ? "location" : "location-outline"} 
                            color={focused ? COLORS.red : COLORS.gray} 
                            size={26} 
                        />
                    )
                }} 
                />

            <Tab.Screen name="Contact" component={Contact} 
                    options={{
                        tabBarStyle: tabBarStyle,
                        tabBarShowLabel: false,headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <Ionicons 
                                name={focused ? "chatbubble" : "chatbubble-outline"} 
                                color={focused ? COLORS.red : COLORS.gray} 
                                size={26} 
                            />
                        )
                    }} 
                    />

        
            <Tab.Screen name="Explore" component={Explore} 
                    options={{
                        tabBarStyle: tabBarStyle,
                        tabBarShowLabel: false,headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <Ionicons 
                                name={focused ? "compass" : "compass-outline"} 
                                color={focused ? COLORS.red : COLORS.gray} 
                                size={26} 
                            />
                        )
                    }} 
                    />

        <Tab.Screen
            name={isLoggedIn ? "Profile" : "authentication"}
            component={isLoggedIn ? Profile : Authentication}
            options={{
            headerShown: false,
            tabBarStyle: tabBarStyle,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
                <Ionicons
                name={focused ? "person" : "person-outline"}
                color={focused ? COLORS.red : COLORS.gray}
                size={26}
                />
            ),
            }}
            initialParams={{ setIsLoggedIn }} // Truyền setIsLoggedIn vào params
            listeners={({ navigation }) => ({
            tabPress: (e) => {
                if (!isLoggedIn) {
                e.preventDefault();
                navigation.navigate('authentication', { setIsLoggedIn });
                }
            },
            })}
        />




      </Tab.Navigator>
    
  )
}

export default BottomTabNavigation