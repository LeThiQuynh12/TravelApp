import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import AppBar from "../../components/Reusable/AppBar";
import { MaterialIcons } from "@expo/vector-icons";

const AccountDetail = ({ navigation, route }) => {
    // Nhận dữ liệu từ navigation params
    const { account } = route.params || {};
    
    // Fallback nếu không có dữ liệu
    if (!account) {
        return (
            <View style={styles.container}>
                <AppBar
                    title="Chi tiết tài khoản"
                    color={COLORS.white}
                    top={50}
                    left={20}
                    right={20}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.content}>
                    <Text style={styles.errorText}>Không có thông tin tài khoản</Text>
                </View>
            </View>
        );
    }

    // Hàm xử lý hủy liên kết
    const handleUnlink = () => {
        // Xử lý logic hủy liên kết ở đây
        alert(`Xác nhận hủy liên kết với ${account.name}`);
        // navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <AppBar
                title="Chi tiết tài khoản"
                color={COLORS.white}
                top={50}
                left={20}
                right={20}
                onPress={() => navigation.goBack()}
            />
            
            <ScrollView style={styles.content}>
                <View style={styles.accountCard}>
                    <View style={styles.accountHeader}>
                        <Image 
                            style={styles.accountLogo} 
                            source={{ uri: account.logo }} 
                        />
                        <Text style={styles.accountName}>{account.name}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Số tài khoản:</Text>
                        <Text style={styles.infoValue}>{account.number}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Tên chủ tài khoản:</Text>
                        <Text style={styles.infoValue}>{account.holderName}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Trạng thái:</Text>
                        <Text style={[styles.infoValue, styles.activeStatus]}>Đang hoạt động</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày liên kết:</Text>
                        <Text style={styles.infoValue}>{account.linkedDate || "15/10/2023"}</Text>
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={styles.unlinkButton}
                    onPress={handleUnlink}
                >
                    <MaterialIcons name="link-off" size={24} color={COLORS.red} />
                    <Text style={styles.unlinkButtonText}>Hủy liên kết</Text>
                </TouchableOpacity>
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
    errorText: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
        textAlign: 'center',
        marginTop: 50,
    },
    accountCard: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
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
    accountHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGrey,
        paddingBottom: 15,
    },
    accountLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    accountName: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: SIZES.medium,
        color: COLORS.gray,
    },
    infoValue: {
        fontSize: SIZES.medium,
        color: COLORS.dark,
        fontWeight: '500',
    },
    activeStatus: {
        color: COLORS.green,
    },
    unlinkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.red,
        borderRadius: 10,
        marginBottom: 30,
    },
    unlinkButtonText: {
        fontSize: SIZES.medium,
        color: COLORS.red,
        marginLeft: 10,
        fontWeight: '500',
    },
});

export default AccountDetail;