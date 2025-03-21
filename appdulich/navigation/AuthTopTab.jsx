import React from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';

import { COLORS } from '../constants/theme';
import Registration from '../screens/authentication/Registration';
import Signin from '../screens/authentication/Signin';

const Tab = createMaterialTopTabNavigator();
const AuthTopTab = () => {
  return (
    
    <View style={{flex: 1, backgroundColor: COLORS.lightWhite}}>
      <ScrollView style={{flex: 1, backgroundColor: COLORS.lightWhite}}>
        
        <Image
        source={{uri: "https://cdnmedia.baotintuc.vn/Upload/XjfgEPYM30O8z6jY3MHxSw/files/2019/10/310/Anh%201_Cau%20Vang%20-%20Sun%20World%20Ba%20Na%20Hills.jpg"}}
        style={{width: '100%', height: 250, resizeMode:'contain', marginTop: -15}} />
        
        <View style={{height: 600}}>
        <Tab.Navigator>
            <Tab.Screen name="Signin" component={Signin}/>
            <Tab.Screen name="Registration" component={Registration}/>
        </Tab.Navigator>
        </View>
      </ScrollView>
    </View>
  )
}

export default AuthTopTab

const styles = StyleSheet.create({})