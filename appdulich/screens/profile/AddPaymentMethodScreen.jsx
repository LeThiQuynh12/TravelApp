import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput, Image } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import AppBar from "../../components/Reusable/AppBar";
import { MaterialIcons } from "@expo/vector-icons";
import ReusableBtn from "../../components/Buttons/ReusableBtn";

const AddPaymentMethodScreen = ({ navigation, route }) => {
    const { methodType } = route.params;
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [errors, setErrors] = useState({});

    const banks = [
        { id: 'mb', name: 'MB Bank', logo: 'https://logo.clearbit.com/mbbank.com.vn' },
        { id: 'vcb', name: 'Vietcombank', logo: 'https://logo.clearbit.com/vietcombank.com.vn' },
        { id: 'tcb', name: 'Techcombank', logo: 'https://logo.clearbit.com/techcombank.com.vn' },
    ];

    const eWallets = [
        { id: 'momo', name: 'MoMo', logo: 'https://logo.clearbit.com/momo.vn' },
        { id: 'zalo', name: 'ZaloPay', logo: 'https://logo.clearbit.com/zalopay.vn' },
        { id: 'vnpay', name: 'VNPay', logo: 'https://logo.clearbit.com/vnpay.vn' },
    ];

    const methods = methodType === 'bank' ? banks : eWallets;
    const title = methodType === 'bank' ? 'Thêm ngân hàng liên kết' : 'Thêm ví điện tử';

    const validateForm = () => {
        const newErrors = {};
        if (!selectedMethod) {
            newErrors.method = "Vui lòng chọn một phương thức thanh toán.";
        }
        if (!accountName.trim()) {
            newErrors.accountName = "Tên chủ tài khoản/ví không được để trống.";
        }
        if (!accountNumber.trim()) {
            newErrors.accountNumber = "Số tài khoản hoặc số ví không được để trống.";
        } else if (!/^\d+$/.test(accountNumber.trim())) {
            newErrors.accountNumber = "Số tài khoản hoặc số ví phải là số.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        navigation.navigate('VerificationScreen', {
            methodType,
            method: selectedMethod,
            accountName,
            accountNumber
        });
    };

    return (
        <View style={styles.container}>
            <AppBar
                title={title}
                color={COLORS.white}
                top={50}
                left={20}
                right={20}
                onPress={() => navigation.goBack()}
            />

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {methodType === 'bank' ? 'Chọn ngân hàng' : 'Chọn ví điện tử'}
                    </Text>
                    <View style={styles.methodsContainer}>
                        {methods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.methodCard,
                                    selectedMethod?.id === method.id && styles.selectedMethodCard
                                ]}
                                onPress={() => setSelectedMethod(method)}
                            >
                                <Image
                                    style={styles.methodLogo}
                                    source={{ uri: method.logo }}
                                />
                                <Text style={styles.methodName}>{method.name}</Text>
                                {selectedMethod?.id === method.id && (
                                    <View style={styles.checkIcon}>
                                        <MaterialIcons name="check-circle" size={24} color={COLORS.primary} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.method && <Text style={styles.errorText}>{errors.method}</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {methodType === 'bank' ? 'Tên chủ tài khoản' : 'Tên chủ ví'}
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.accountName && styles.inputError
                        ]}
                        value={accountName}
                        onChangeText={setAccountName}
                        placeholder={methodType === 'bank' ? "Nhập tên chủ tài khoản" : "Nhập tên chủ ví"}
                    />
                    {errors.accountName && <Text style={styles.errorText}>{errors.accountName}</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {methodType === 'bank' ? 'Số tài khoản' : 'Số điện thoại/Số ví'}
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.accountNumber && styles.inputError
                        ]}
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                        placeholder={methodType === 'bank' ? "Nhập số tài khoản" : "Nhập số điện thoại/số ví"}
                        keyboardType="numeric"
                    />
                    {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}
                </View>

                <View style={styles.noteSection}>
                    <Text style={styles.noteTitle}>Lưu ý:</Text>
                    {methodType === 'bank' ? (
                        <>
                            <Text style={styles.noteText}>- Không để trống các trường thông tin ở trên.</Text>
                            <Text style={styles.noteText}>- Tài khoản ngân hàng phải đang hoạt động.</Text>
                            <Text style={styles.noteText}>- Tên chủ tài khoản phải khớp với thông tin ngân hàng.</Text>
                            <Text style={styles.noteText}>- Xác nhận OTP sẽ được yêu cầu.</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.noteText}>- Không để trống các trường thông tin ở trên.</Text>
                            <Text style={styles.noteText}>- Ví điện tử phải đang hoạt động.</Text>
                            <Text style={styles.noteText}>- Tên chủ ví phải khớp với thông tin đăng ký.</Text>
                            <Text style={styles.noteText}>- Xác nhận OTP sẽ được yêu cầu.</Text>
                        </>
                    )}
                    <Text style={styles.noteText}>- Bảo mật thông tin, không chia sẻ mã OTP.</Text>
                </View>

                <View style={styles.submitButton}>
                    <ReusableBtn
                        btnText={"Xác thực"}
                        width={100}
                        backgroundColor={COLORS.skyBlue}
                        borderColor={COLORS.skyBlue}
                        borderWidth={0}
                        textColor={COLORS.white}
                        style={[
                            (!selectedMethod || !accountName || !accountNumber) && styles.disabledButton
                        ]}
                        onPress={handleSubmit}
                        disabled={!selectedMethod || !accountName || !accountNumber}
                    />
                </View>
            </ScrollView>
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
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 10,
    },
    methodsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    methodCard: {
        width: '48%',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        alignItems: 'center',
        position: 'relative',
    },
    selectedMethodCard: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.lightPrimary,
    },
    methodLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
    },
    methodName: {
        fontSize: SIZES.medium,
        color: COLORS.dark,
        textAlign: 'center',
    },
    checkIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        padding: 12,
        fontSize: SIZES.medium,
        backgroundColor: COLORS.white,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: SIZES.small,
    },
    noteSection: {
        backgroundColor: COLORS.lightGray,
        padding: 15,
        borderRadius: 8,
        marginVertical: 20,
    },
    noteTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.dark,
    },
    noteText: {
        fontSize: SIZES.small,
        color: COLORS.dark,
        marginBottom: 5,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: COLORS.gray,
        opacity: 0.7,
    },
});

export default AddPaymentMethodScreen;
