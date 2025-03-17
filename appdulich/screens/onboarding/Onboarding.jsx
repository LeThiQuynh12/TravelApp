import React from 'react';

import {
  FlatList,
  StyleSheet,
} from 'react-native';

import Slides from './Slides';

const Onboarding = () => {

  const slides = [
    {
        id: 1,
        image: { uri: "https://i.pinimg.com/736x/e8/7d/87/e87d8748b8fdd2615c24b306eeca7e78.jpg" },
        title: "Khám phá kỳ quan Việt Nam dễ dàng"
        
    },
    {
        id: 2,
        image: { uri: "https://i.pinimg.com/474x/06/bb/0e/06bb0e0a9dd8220682edf62a69994612.jpg" },
        title: "Tìm địa điểm hoàn hảo du lịch"
    },
    {
        id: 3,  // id trùng sửa thành 3
        image: { uri: "https://i.pinimg.com/736x/c6/90/01/c690013bb075d9724f3d18ad454b7070.jpg" },
        title: "Trải nghiệm khách sạn tuyệt vời"
    },
];

  return (
    <FlatList
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({item})=><Slides item={item} />}
    />
  )
}

export default Onboarding

const styles = StyleSheet.create({})