// Authentication.jsx
import React, { useState } from 'react';

import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { TEXT } from '../../constants/theme';
import Registration from './Registration';
import Signin from './Signin';

const Authentication = ({ navigation, route }) => {
  const [selectedTab, setSelectedTab] = useState("signin");
  const { setIsLoggedIn } = route.params || {}; // Nhận setIsLoggedIn từ route

  return (
    <SafeAreaView style={styles.container}>
      {/* Hình ảnh */}
      <Image
        source={{
          uri: "https://i.pinimg.com/474x/57/81/ee/5781ee3858125aaa7494c2bff48b9d19.jpg",
        }}
        style={styles.image}
      />

      {/* Tabs Đăng nhập / Đăng ký */}
      <View style={styles.tabWrapper}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "signin" && styles.activeTab]}
          onPress={() => setSelectedTab("signin")}
        >
          <Text style={[styles.tabText, selectedTab === "signin" && styles.activeText]}>
            ĐĂNG NHẬP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "registration" && styles.activeTab]}
          onPress={() => setSelectedTab("registration")}
        >
          <Text style={[styles.tabText, selectedTab === "registration" && styles.activeText]}>
            ĐĂNG KÝ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị form tương ứng */}
      {selectedTab === "registration" ? (
        <Registration navigation={navigation} route={route} />
      ) : (
        <Signin navigation={navigation} route={route} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: 240,
    marginTop: -45,
  },
  tabWrapper: {
    flexDirection: "row",
    paddingTop: 20,
    width: '100%',
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3CA684',
  },
  tabText: {
    fontSize: TEXT.medium - 1,
    fontWeight: "bold",
    color: "#777",
  },
  activeText: {
    color: "#3CA684",
  },
});

export default Authentication;