import React from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AppBar from '../../components/Reusable/AppBar';
import HeightSpacer from '../../components/Reusable/HeightSpacer';
import {
  COLORS,
  TEXT,
} from '../../constants/theme';

const Contact = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <AppBar
        title="Liên hệ hỗ trợ"
        color={COLORS.white}
        top={50}
        left={10}
        right={10}
        onPress={() => navigation.goBack()}
      />
      <HeightSpacer height={50}/>
      {/* Header */}
      <View style={styles.headerContainer}>
      <View style={{flexDirection: "row", justifyContent:"space-between"}}>
      <Text style={styles.greetingText}>Xin chào</Text>

        <TouchableOpacity>
          <Ionicons name="chatbubble-ellipses-sharp" size={30} color={COLORS.blue}/>
        </TouchableOpacity>
      </View>
        <Text style={styles.subText}>Chúng tôi có thể giúp gì cho bạn?</Text>
      </View>

      {/* Horizontal Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardScroll}
      >
        {/* Card 1: Zalo Support */}
        <View style={styles.card}>
          <Image 
            source={{uri: "https://cdn-icons-png.flaticon.com/128/18595/18595091.png"}} 
            style={styles.imageCard} 
          />
          <Text style={styles.cardTitle}>Hỗ trợ đặt chỗ & vé</Text>
          <Text style={styles.cardText}>Bạn cần hỗ trợ về đặt chỗ ở và đặt vé?</Text>
          <Text style={styles.cardText}>Hãy liên hệ LuxGo chúng tôi!</Text>
          <Text style={styles.cardSubTitle}>Hỗ trợ qua Zalo LuxGo - Kết nối ngay</Text>
          
          <TouchableOpacity style={styles.buttonChat}>
            <View style={styles.buttonContent}>
              <Image 
                source={{uri: "https://cdn-icons-png.flaticon.com/128/3168/3168684.png"}} 
                style={styles.buttonIcon} 
              />
              <Text style={styles.buttonText}>LuxGo đặt phòng khách sạn</Text>

              <Ionicons name="chevron-forward" size={20}/>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonChat}>
            <View style={styles.buttonContent}>
              <Image 
                source={{uri: "https://cdn-icons-png.flaticon.com/128/1358/1358770.png"}} 
                style={styles.buttonIcon} 
              />
              <Text style={styles.buttonText}>LuxGo đặt vé máy bay</Text>
              <Ionicons name="chevron-forward" size={20}/>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonChat}>
            <View style={styles.buttonContent}>
              <Image 
                source={{uri: "https://cdn-icons-png.flaticon.com/128/14703/14703667.png"}} 
                style={styles.buttonIcon} 
              />
              <Text style={styles.buttonText}>LuxGo đặt xe khách</Text>
              <Ionicons name="chevron-forward" size={20}/>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card 2: FAQ Navigation */}
        <TouchableOpacity
          style={[styles.card, styles.cardPartial]}
          onPress={() => navigation.navigate('Chat')}
        >
          {/* To be completed later */}
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <View style={{flexDirection: "row"}}>
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.blue}/>
          <Text style={{color: COLORS.blue, fontWeight: "500"}}> Giờ hoạt động của trung tâm chăm sóc khách hàng</Text> 
        </View>
        <Text> - Tổng đài hoạt động: Thứ Hai - Chủ Nhật (từ 08:00 sáng - 10:00 tối)</Text>
        <Text> - Tin nhắn: Hoạt động: 24/7</Text>
      </View>
    </ScrollView>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginTop: 50,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: TEXT.large+1,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subText: {
    fontSize: 16,
    color: COLORS.grey,
    marginTop: 4,
  },
  cardScroll: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FDF2E9",
    borderRadius: 16,
    height: 450,
    marginRight: 16,
    width: 350,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,

  },
  imageCard: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.blue,
    marginBottom: 8,
  },
  cardSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blue,
    marginBottom: 12,
    marginTop: 8,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 4,
  },
  buttonChat: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 26,
    height: 26,
    marginRight: 12,
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '500',
  },
  cardPartial: {
    width: 350,
    justifyContent: 'space-between',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.white, 
    borderRadius: 20,
    gap: 10,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 5,
  },
});