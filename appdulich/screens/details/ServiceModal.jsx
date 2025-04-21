import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Linking ,
  Image
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS,SIZES } from '../../constants/theme';

const ServicelModal = ({ 
  visible, 
  onClose, 
  service,
  onBookPress 
}) => {
  if (!service) return null;

  const handleCall = () => {
    if (service.contact) {
      Linking.openURL(`tel:${service.contact}`);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{service.name}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            
            </View>
            <Image 
                style={styles.image}
                source={{ uri:service.image }}
                resizeMode="cover"
                height={100}
                width={"100%"}
                />
            {/* Thông tin cơ bản */}
           
            <Text style={styles.serviceDescription}>{service.description}</Text>

            {/* Giá và đánh giá */}
            <View style={styles.detailRow}>
              <MaterialIcons name="attach-money" size={20} color={COLORS.primary} />
              <Text style={styles.detailText}>{service.price}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.detailText}>
                {service.rating} ({service.reviews || 0} đánh giá)
              </Text>
            </View>

            {/* Hướng dẫn sử dụng */}
            {service.guide && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hướng dẫn sử dụng dịch vụ </Text>
                {service.guide.map((step, index) => (
                  <Text key={index} style={styles.sectionText}>• {step}</Text>
                ))}
              </View>
            )}

            {/* Chính sách */}
            {service.policies && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Điều khoản</Text>
                {service.policies.map((policy, index) => (
                  <Text key={index} style={styles.sectionText}>• {policy}</Text>
                ))}
              </View>
            )}

            {/* Nút hành động */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.callButton]}
                onPress={handleCall}
              >
                <Ionicons name="call" size={20} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Gọi đặt lịch</Text>
              </TouchableOpacity>

            
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    color: COLORS.black,
  },
  closeButton: {
    padding: 5,
    marginLeft: 10,
  },
  serviceType: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 5,
  },
  image:{
    borderRadius:15
  },
  serviceDescription: {
    marginTop:10,
    fontSize: 15,
    color: COLORS.darkGray,
    lineHeight: 22,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.black,
  },
  section: {
    marginVertical: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
  },
  sectionText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 5,
    marginLeft: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  callButton: {
    backgroundColor: COLORS.green,
    marginRight: 10,
  },
  bookButton: {
    backgroundColor: COLORS.green,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ServicelModal;