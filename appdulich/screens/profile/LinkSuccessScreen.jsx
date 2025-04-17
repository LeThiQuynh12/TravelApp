import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { COLORS,SIZES } from "../../constants/theme";
import AppBar from "../../components/Reusable/AppBar";

const LinkSuccessScreen = ({ navigation, route }) => {
    const { methodType, method, accountName, accountNumber } = route.params;
    const maskedNumber = accountNumber.slice(-4).padStart(accountNumber.length, '*');

    return (
        <View style={styles.container}>
            <AppBar
                title="Liên kết thành công"
                color={COLORS.white}
                top={50}
                left={20}
                right={20}
                onPress={() => navigation.goBack()}
            />
            
            <View style={styles.content}>
              
                
                <Text style={styles.successTitle}>
                    {methodType === 'bank' 
                        ? 'Liên kết ngân hàng thành công!' 
                        : 'Liên kết ví điện tử thành công!'}
                </Text>
                
                <View style={styles.methodInfo}>
                    <Image 
                        style={styles.methodLogo} 
                        source={{ uri: method.logo }} 
                    />
                    <View style={styles.methodDetails}>
                        <Text style={styles.methodName}>{method.name}</Text>
                        <Text style={styles.accountNumber}>{maskedNumber}</Text>
                        <Text style={styles.accountName}>{accountName}</Text>
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={styles.doneButton}
                    onPress={() => navigation.navigate('Bottom')}
                >
                    <Text style={styles.doneButtonText}>Hoàn thành</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightWhite,
    },
    content: {
        paddingTop: 100,
        paddingHorizontal: 20,
        alignItems: 'center',
        flex: 1,
    },
    successImage: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    successTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 30,
        textAlign: 'center',
    },
    methodInfo: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 15,
        width: '100%',
        marginBottom: 30,
        alignItems: 'center',
    },
    methodLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    methodDetails: {
        flex: 1,
    },
    methodName: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 5,
    },
    accountNumber: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        marginBottom: 5,
    },
    accountName: {
        fontSize: SIZES.small,
        color: COLORS.gray,
    },
    doneButton: {
        backgroundColor: COLORS.red,
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        
    },
    doneButtonText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        fontWeight: 'bold',
    },
});

export default LinkSuccessScreen;