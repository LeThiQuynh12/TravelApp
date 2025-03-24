import React, { useState } from 'react';

import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

import { FontAwesome5 } from '@expo/vector-icons';

import ReusableBtn from '../../components/Buttons/ReusableBtn';
import {
  COLORS,
  SIZES,
} from '../../constants/theme';

const cities =["Hà Nội", "Đà Nẵng"];
const today = new Date().toISOString().split("T")[0];

const BusTicket = () => {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [departure, setDeparture] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingDeparture, setSelectingDeparture] = useState(true);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleDayPress = (day) => {
    if (selectingDeparture) {
      setDepartureDate(day.dateString);
      setReturnDate(null);
    } else {
      if (departureDate && day.dateString >= departureDate) {
        setReturnDate(day.dateString);
      }
    }
  };
    const [showDepartureModal, setShowDepartureModal] = useState(false);
    const [showDestinationModal, setShowDestinationModal] = useState(false);

  return (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
    <View style={styles.container} >
      <Text style={styles.title}>Đặt vé xe khách giá rẻ</Text>
     {/* Chọn nơi khởi hành */}
     <TouchableOpacity
        style={styles.inputGroup}
        onPress={() => setShowDepartureModal(true)}
      >
        <FontAwesome5 name="plane-departure" size={16} color={COLORS.gray} />
        <Text style={styles.input}>{departure || "Chọn nơi khởi hành"}</Text>
      </TouchableOpacity>

        {/* Chọn nơi đến */}
        <TouchableOpacity
        style={styles.inputGroup}
        onPress={() => setShowDestinationModal(true)}
      >
        <FontAwesome5 name="plane-arrival" size={16} color={COLORS.gray} />
        <Text style={styles.input}>{destination || "Chọn nơi đến"}</Text>
      </TouchableOpacity>

        {/* Chọn ngày đi */}
        <TouchableOpacity
        style={styles.inputGroup}
        onPress={() => {
          setSelectingDeparture(true);
          setShowCalendar(true);
        }}
      >
        <FontAwesome5 name="calendar-alt" size={16} color={COLORS.gray} />
        <Text style={styles.input}>
          {departureDate || "Chọn ngày đi"}
        </Text>
        <Text style={styles.roundTripText}>Khứ hồi</Text>
        <Switch value={isRoundTrip} onValueChange={setIsRoundTrip} />
      </TouchableOpacity>

       {/* Chọn ngày về (chỉ hiện nếu bật khứ hồi) */}
       {isRoundTrip && (
        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => {
            setSelectingDeparture(false);
            setShowCalendar(true);
          }}
        >
          <FontAwesome5 name="calendar-alt" size={16} color={COLORS.gray} />
          <Text style={styles.input}>
            {returnDate || "Chọn ngày về"}
          </Text>
        </TouchableOpacity>
      )}


  {/* Số lượng khách */}
       {/* Số lượng khách */}
       <TouchableOpacity
        style={styles.inputGroup}
        onPress={() => setShowGuestModal(true)}
      >
        <FontAwesome5 name="user-friends" size={16} color={COLORS.gray} />
        <Text style={styles.input}>{`${adults} Người lớn, ${children} Trẻ em, ${infants} Em bé`}</Text>
      </TouchableOpacity>


      {/* Modal chọn số lượng khách */}
      <Modal visible={showGuestModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {[{ label: "Người lớn", count: adults, setCount: setAdults },
              { label: "Trẻ em", count: children, setCount: setChildren },
              { label: "Em bé", count: infants, setCount: setInfants }].map((item, index) => (
                <View key={index} style={styles.guestRow}>
                  <Text style={styles.listText}>{item.label}</Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity
                      style={styles.counterButton}
                      onPress={() => item.setCount(Math.max(0, item.count - 1))}
                    >
                      <Text style={styles.counterText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{item.count}</Text>
                    <TouchableOpacity
                      style={styles.counterButton}
                      onPress={() => item.setCount(item.count + 1)}
                    >
                      <Text style={styles.counterText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowGuestModal(false)}
            >
              <Text style={styles.closeText}>Xong</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
   {/* Nút tìm kiếm */}
              
   <ReusableBtn
              onPress={()=>{}}
              btnText={"Tìm kiếm"}
              textColor={COLORS.white}
            //   width={SIZES.xLarge}
               width={(SIZES.width - 30)}
              backgroundColor={COLORS.green}
              borderWidth={0}
              borderColor={COLORS.green}
              />

      {/* Modal chọn nơi khởi hành */}
      <Modal visible={showDepartureModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={cities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    setDeparture(item);
                    setShowDepartureModal(false);
                  }}
                >
                  <Text style={styles.listText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDepartureModal(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


 {/* Modal chọn nơi đến */}
      <Modal visible={showDestinationModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={cities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    setDestination(item);
                    setShowDestinationModal(false);
                  }}
                >
                  <Text style={styles.listText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDestinationModal(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

       {/* Modal chọn ngày */}
       <Modal visible={showCalendar} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
              minDate={today}
              onDayPress={handleDayPress}
              markedDates={{
                [departureDate]: {
                  selected: true,
                  selectedColor: "blue",
                },
                [returnDate]: {
                  selected: true,
                  selectedColor: "green",
                },
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


    </View>
    </ScrollView>
  )

}

export default BusTicket

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: COLORS.lightWhite,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  searchButton: {
    backgroundColor: COLORS.green,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  searchText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%", // Tăng lên từ 80% để rộng hơn
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20, // Tăng padding cho thoáng
    maxHeight: "70%", // Giới hạn chiều cao tránh tràn màn hình
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  listText: {
    fontSize: SIZES.medium, // Tăng font chữ
    color: COLORS.black,
  },
  guestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    backgroundColor: COLORS.lightGrey,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  counterText: {
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  counterValue: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  closeButton: {
    backgroundColor: COLORS.green,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: "bold",
  },
  listText: {
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  

})