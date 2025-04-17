import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { COLORS,SIZES } from "../constants/theme";
import AppBar from "./Reusable/AppBar";

const VerificationScreen = ({ navigation, route }) => {
    const { methodType, method, accountName, accountNumber } = route.params;
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [countdown, setCountdown] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const otpInputs = useRef([]);

    useEffect(() => {
        const timer = countdown > 0 && setInterval(() => {
            setCountdown(countdown - 1);
            if (countdown - 1 === 0) {
                setIsResendDisabled(false);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1].focus();
        }

        // Submit if all fields are filled
        if (newOtp.every(val => val !== "") && index === 5) {
            handleSubmit();
        }
    };

    const handleResendOtp = () => {
        setCountdown(30);
        setIsResendDisabled(true);
        // Gửi lại OTP logic ở đây
        
    };

    const handleSubmit = () => {
        const otpCode = otp.join("");
        // Xử lý xác thực OTP
        navigation.navigate('LinkSuccessScreen', { 
            methodType,
            method,
            accountName,
            accountNumber 
        });
    };

    return (
        <View style={styles.container}>
            <AppBar
                title="Xác thực OTP"
                color={COLORS.white}
                top={50}
                left={20}
                right={20}
                onPress={() => navigation.goBack()}
            />
            
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nhập mã OTP</Text>
                    <Text style={styles.subTitle}>
                        Mã OTP đã được gửi đến số điện thoại đăng ký với {method.name}
                    </Text>
                    
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => otpInputs.current[index] = ref}
                                style={styles.otpInput}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(index, value)}
                                keyboardType="numeric"
                                maxLength={1}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                                        otpInputs.current[index - 1].focus();
                                    }
                                }}
                            />
                        ))}
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.resendButton}
                        onPress={handleResendOtp}
                        disabled={isResendDisabled}
                    >
                        <Text style={[
                            styles.resendText,
                            isResendDisabled && styles.disabledResendText
                        ]}>
                            {isResendDisabled ? `Gửi lại mã OTP (${countdown}s)` : 'Gửi lại mã OTP'}
                        </Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={!otp.every(val => val !== "")}
                >
                    <Text style={styles.submitButtonText}>Xác nhận</Text>
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
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 10,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        textAlign: 'center',
        marginBottom: 30,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: SIZES.large,
        backgroundColor: COLORS.white,
    },
    resendButton: {
        alignSelf: 'center',
    },
    resendText: {
        fontSize: SIZES.medium,
        color: COLORS.primary,
    },
    disabledResendText: {
        color: COLORS.gray,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        opacity: 1,
    },
    disabledSubmitButton: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: COLORS.green,
        fontSize: SIZES.medium,
        fontWeight: 'bold',
    },
});

export default VerificationScreen;