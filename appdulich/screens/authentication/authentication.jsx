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

const Authentication = () => {
  const [selectedTab, setSelectedTab] = useState("signin");

  return (
    <SafeAreaView style={styles.container}>
      {/* Hình ảnh */}
      <Image
        source={{
          // uri: "https://i.pinimg.com/474x/ba/94/26/ba9426e86e1e4b9675f1c83c84970a03.jpg",
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
      {selectedTab === "registration" ? <Registration /> : <Signin />}
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
    width: '100%', // Giảm chiều rộng để ảnh không chiếm toàn màn hình
    height: 240, // Giảm chiều cao để cân đối
    // resizeMode: "contain", // Đảm bảo ảnh hiển thị đầy đủ, không bị cắt
    marginTop: -45, // Thêm khoảng cách phía trên để bố cục đẹp hơn
  },
  tabWrapper: {
    flexDirection: "row",
    paddingTop: 20,
    width: '100%', // Đảm bảo tab chiếm toàn chiều rộng
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
    fontSize: TEXT.medium-1,
    fontWeight: "bold",
    color: "#777",
  },
  activeText: {
    color: "#3CA684",
  },
});

export default Authentication;