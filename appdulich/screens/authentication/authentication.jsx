import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Signin from "./Signin";
import Registration from "./Registration";

const Authentication = () => {
  const [selectedTab, setSelectedTab] = useState("signin");

  return (
    <View style={styles.container}>
      {/* Hình ảnh */}
      <Image
        source={{
          uri: "https://www.vietnambooking.com/wp-content/uploads/2023/03/dich-vu-du-lich-1.jpg",
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
            Đăng nhập
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "registration" && styles.activeTab]}
          onPress={() => setSelectedTab("registration")}
        >
          <Text style={[styles.tabText, selectedTab === "registration" && styles.activeText]}>
            Đăng ký
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị form tương ứng */}
      {selectedTab === "registration" ? <Registration /> : <Signin />}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        paddingTop: 60,
        flexDirection:'column',
      },
      image: {
        width:400,
        height: 200,
        resizeMode: "contain",
        resizeMode: "contain",
      },
  tabWrapper: {
    flexDirection: "row",
    padding:30
  },
  tab: {
    flex: 1,
    padding:10,
    alignItems: "center",
    justifyContent: "center", 
  },
  activeTab: {
   
    borderBottomWidth:3,
    borderBottomColor:'#3CA684'
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#777",
    
  },
  activeText: {
    color: "#3CA684",
  },
});

export default Authentication;
