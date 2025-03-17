import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { COLORS } from '../constants/theme';
import Chat from '../screens/chat/Chat';
import Home from '../screens/home/Home';
import Location from '../screens/location/Location';
import Profile from '../screens/profile/Profile';
import Vehicle from '../screens/vehicle/Vehicle';

const Tab = createBottomTabNavigator();
//ios
const tabBarStyle = {
    padding: 20,
    borderRadius:20,
    height: 80,
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
const BottomTabNavigation = () => {
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

        <Tab.Screen name="Chat" component={Chat} 
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
                <Tab.Screen name="Profile" component={Profile} 
                options={{
                    tabBarStyle: tabBarStyle,
                    tabBarShowLabel: false,headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons 
                            name={focused ? "person" : "person-outline"} 
                            color={focused ? COLORS.red : COLORS.gray} 
                            size={26} 
                        />
                    )
                }} 
                />
      </Tab.Navigator>
    
  )
}

export default BottomTabNavigation