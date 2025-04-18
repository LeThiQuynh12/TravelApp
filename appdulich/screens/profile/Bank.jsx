import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image,Platform } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import AppBar from "../../components/Reusable/AppBar";
import { MaterialIcons } from "@expo/vector-icons";

const Bank = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <AppBar
                title="Liên kết thanh toán"
                color={COLORS.white}
                top={50}
                left={20}
                right={20}
                onPress={() => navigation.goBack()}
            />
           
            
            <ScrollView style={styles.content}>
            <Image style={styles.img} source={{uri:"https://i.pinimg.com/736x/d6/0a/7c/d60a7cada509e2027b6721eeca130ad8.jpg"}}/>
                {/* Phần ngân hàng liên kết */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ngân hàng liên kết</Text>
                    
                    <TouchableOpacity style={styles.bankCard}
                     onPress={() => navigation.navigate('AccountDetail', { 
                        account: {
                            type: 'bank',
                            name: 'MB Bank',
                            logo: 'https://logo.clearbit.com/mbbank.com.vn',
                            number: '*2271',
                            holderName: 'Nguyễn Văn A',
                            linkedDate: '15/10/2023'
                        }
                    })}
                    >
                        <View style={styles.bankInfo}>
                            <Image 
                                style={styles.bankLogo} 
                                source={{uri: "https://logo.clearbit.com/mbbank.com.vn"}} 
                            />
                            <Text style={styles.bankName}>MB Bank</Text>
                        </View>
                        <Text style={styles.cardNumber}>*2271</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddPaymentMethodScreen', { methodType: 'bank' })}
                        >
                        <MaterialIcons name="add" size={24} color={COLORS.primary} />
                        <Text style={styles.addButtonText}>Thêm ngân hàng liên kết</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Phần ví điện tử */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ví điện tử</Text>
                    
                    <TouchableOpacity style={styles.bankCard}
                    onPress={() => navigation.navigate('AccountDetail', { 
                        account: {
                            type: 'ewallet',
                            name: 'MoMo',
                            logo: 'https://logo.clearbit.com/momo.vn',
                            number: '*8781',
                            holderName: 'Nguyễn Văn A',
                            linkedDate: '20/10/2023'
                        }
                    })}>
                        <View style={styles.bankInfo}>
                            <Image 
                                style={styles.bankLogo} 
                                source={{uri: "https://logo.clearbit.com/momo.vn"}} 
                            />
                            <Text style={styles.bankName}>MoMo</Text>
                        </View>
                        <Text style={styles.cardNumber}>*8781</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddPaymentMethodScreen', { methodType: 'ewallet' })}
                        >
                        <MaterialIcons name="add" size={24} color={COLORS.primary} />
                        <Text style={styles.addButtonText}>Thêm ví điện tử</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },
    content: {
        paddingTop: 100,
        paddingHorizontal: 20,
    },
    img:{
        width:"100%",
        height:200,
    },
    section: {
        marginBottom: 30,
       marginTop:20 
    },
    sectionTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 15,
    },
    bankCard: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.gray,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    bankInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bankLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    bankName: {
        fontSize: SIZES.medium,
        color: COLORS.dark,
    },
    cardNumber: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    addButtonText: {
        fontSize: SIZES.medium,
        color: COLORS.primary,
        marginLeft: 10,
    },
});

export default Bank;