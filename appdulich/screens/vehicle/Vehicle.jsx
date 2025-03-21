import React, { useState } from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';

import AppBar from '../../components/Reusable/AppBar';
import {
  COLORS,
  SHADOWS,
  SIZES,
  TEXT,
} from '../../constants/theme';
import AirlineTicket from './AirlineTicket';
import BusTicket from './BusTicket';

const Vehicle = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("airplane");
  const images = {
    bus: "https://i.pinimg.com/736x/b8/96/2d/b8962d6460555231b8838ee62eb665bc.jpg",
    airplane: "https://i.pinimg.com/736x/e4/13/6c/e4136c6857a9914b81a7298a766e9844.jpg"
  }
  return (
    <View style={styles.container}>
      <AppBar
        title="Di chuyển"
        color={COLORS.white}
        // icon="search1"
        top={50}
        left={10}
        right={10}
        onPress={() => navigation.goBack()}
        // onPress1={() => navigation.navigate("HotelSearch")}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hình ảnh */}
        <Image 
          source={{uri: images[selectedTab]}}
          style={styles.image}
        />

        {/* Tabs Container */}
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "airplane" && styles.activeTab]}
            onPress={() => setSelectedTab("airplane")}
          >
            <FontAwesome5 name="plane" size={20} color={selectedTab === "airplane" ? COLORS.white : COLORS.red} />
            <Text style={[styles.tabText, selectedTab === "airplane" && styles.activeText]}>Vé máy bay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === "bus" && styles.activeTab]}
            onPress={() => setSelectedTab("bus")}
          >
            <FontAwesome5 name="bus" size={20} color={selectedTab === "bus" ? COLORS.white : COLORS.red} />
            <Text style={[styles.tabText, selectedTab === "bus" && styles.activeText]}>Vé xe khách</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị nội dung tương ứng */}
        {selectedTab === "bus" ? <BusTicket /> : <AirlineTicket />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    // backgroundColor: COLORS.white
  },
  scrollContainer: {
    paddingBottom: 20, 
  },
  image: { 
    width: "100%", 
    height: 240, 
    resizeMode: "cover", 
    borderRadius: 30,
    alignSelf: "center",
    marginBottom: -50,
    marginTop: 90,
    paddingHorizontal: 5,
   
  },
  tabWrapper: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 10,
    marginHorizontal: SIZES.large,
    ...SHADOWS.medium,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 5,
    
  },
  activeTab: { 
    backgroundColor: COLORS.green 
  },
  tabText: { 
    fontSize: TEXT.medium, 
    color: COLORS.red, 
    marginTop: 5,
    fontWeight: "bold",
  },
  activeText: { 
    color: COLORS.white, 
    fontWeight: "bold" 
  },
});

export default Vehicle;
