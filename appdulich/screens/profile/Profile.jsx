import React from 'react';
import AppBar from '../../components/Reusable/AppBar';
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome6";
import Icons from "react-native-vector-icons/Feather";
import { COLORS,  SHADOWS,  SIZES,  TEXT,} from '../../constants/theme';

const Profile = ({navigation}) => {
  return (
       <View style={styles.container}>
          <AppBar
            title="Tài khoản"
            color={COLORS.white}
            // icon="search1"

            top={50}
            left={10}
            right={10}
            onPress={() => navigation.goBack()}
        />
         
         <View style={styles.header}>
           <Image source={{ uri: "https://i.pravatar.cc/100" }} style={styles.avatar} />
           <View style={styles.userInfo}>
             <Text style={styles.userName}>LÊ THỊ QUỲNH</Text>
             <TouchableOpacity style={styles.editImage}>
               <Icon name="user-pen" size={20} />
               <Text style={styles.editText}> Sửa ảnh</Text>
             </TouchableOpacity>
           </View>
         </View>
        <View style={styles.listItem}>
          <View style={styles.item}> 
            <Image style={styles.imageItem} source={{uri: "https://images.icon-icons.com/1760/PNG/512/4105938-account-card-id-identification-identity-card-profile-user-profile_113929.png"}} />
            <Text style={styles.itemText}> Thông tin cá nhân </Text>
            <Icon name='angle-right' style={styles.iconItem} size={20} />
            
          </View>
          <View style={styles.under}></View>
          <View style={styles.item}> 
            <Icons name='phone-call' style={styles.imageItem} size={30}/>
            <Text style={styles.itemText}> Số điện thoại  </Text>
            <Icon name='angle-right' style={styles.iconItem} size={20} />
          </View>
          <View style={styles.under}></View>
          <View style={styles.item}> 
          <Icons name='mail' style={styles.imageItem} size={35}/>
            <Text style={styles.itemText}> Email </Text>
            <Icon name='angle-right' style={styles.iconItem} size={20} />
          </View>
          <View style={styles.under}> </View>
          <View style={styles.item}> 
            <Icon name='user-lock' style={styles.imageItem} size={30} />
            <Text style={styles.itemText}> Đổi mật khẩu  </Text>
            <Icon name='angle-right' style={styles.iconItem} size={20} />
          </View>
          <View style={styles.under}></View>
          <View style={styles.item}> 
            <Image style={styles.imageItem} source={{uri: "https://images.icon-icons.com/1947/PNG/512/4635002-bank_122546.png"}} />
            <Text style={styles.itemText}> Liênn kết ngân hàng  </Text>
            <Icon name='angle-right' style={styles.iconItem} size={20} />
          </View>

        </View>
        </View>
     );
   };
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: "F5F5F5",
       padding:15
     },
     header: {
       flexDirection: "row",
       alignItems: "center",
       marginTop:80,
       paddingLeft:20,
       height:100,
       borderRadius:20,
       backgroundColor: "#E0F2F1",
     },
     avatar: {
       width: 60,
       height: 60,
       borderRadius: 30,
     },
     editImage:{
      flexDirection:'row',
      paddingTop:8
     },
     userInfo: {
       marginLeft: 15,
     },
     userName: {
       fontSize: 16,
       fontWeight: "bold",
       color: "#D32F2F",
     },
     listItem:{
      flexDirection:'column',
      padding:10,
      backgroundColor:'white',
      marginTop:20,
      borderRadius:20,

     },
     item:{
      flexDirection:'row',
      padding:10,
      height:65,
      marginBottom:1,
      
     },
     imageItem:{
      height:30,
      width:40,
      alignSelf:'center'
     },
     itemText:{
      fontSize:20,
      fontWeight:'bold',
      alignSelf:'center',
      paddingLeft:10,
      justifyContent:'space-between',
      flex:1
     },
     iconItem:{
      alignSelf:'center'
     },
     under:{
      height:1,
      width:"90%",
      backgroundColor:"#eee",
      marginVertical:5,
      alignSelf:'center'
     },
     editText: {
       color: "#007AFF",
       marginTop: 5,
       fontSize:15,
       paddingLeft:5
     },
   });


export default Profile