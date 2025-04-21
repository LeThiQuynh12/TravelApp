import React, {
  useEffect,
  useState,
} from 'react';

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
  TEXT,
} from '../../constants/theme';
import { fetchBusCities } from '../../services/api';

const today = new Date().toISOString().split('T')[0];

const BusTicket = ({ navigation }) => {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [departure, setDeparture] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingDeparture, setSelectingDeparture] = useState(true);
  const [showSeatsModal, setShowSeatsModal] = useState(false);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [showDepartureModal, setShowDepartureModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cityList = await fetchBusCities();
        setCities(cityList);
      } catch (err) {
        setError('Không thể tải danh sách thành phố. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCities();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    if (selectingDeparture) {
      setDepartureDate(selectedDate);
      if (returnDate && selectedDate > returnDate) {
        setReturnDate(null);
      }
    } else {
      if (departureDate && selectedDate >= departureDate) {
        setReturnDate(selectedDate);
      } else {
        alert('Ngày về phải sau ngày đi');
        return;
      }
    }
    setShowCalendar(false);
  };

  const handleSearch = () => {
    if (!departure || !destination || !departureDate) {
      alert('Vui lòng chọn nơi khởi hành, nơi đến và ngày đi');
      return;
    }
    if (isRoundTrip && !returnDate) {
      alert('Vui lòng chọn ngày về cho chuyến khứ hồi');
      return;
    }
    if (numberOfSeats < 1) {
      alert('Số ghế phải lớn hơn 0');
      return;
    }
    navigation.navigate('BusList', {
      searchParams: {
        departureCity: departure?.departureCity || departure,
        arrivalCity: destination?.departureCity || destination,
        outboundDate: formatDate(departureDate),
        isRoundTrip,
        returnDate: isRoundTrip ? formatDate(returnDate) : null,
        numberOfSeats,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Đặt vé xe khách giá rẻ</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => setShowDepartureModal(true)}
        >
          <FontAwesome5 name="bus" size={16} color={COLORS.gray} />
          <Text style={styles.input}>
            {departure?.departureName || departure || 'Chọn nơi khởi hành'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => setShowDestinationModal(true)}
        >
          <FontAwesome5 name="bus" size={16} color={COLORS.gray} />
          <Text style={styles.input}>
            {destination?.departureName || destination || 'Chọn nơi đến'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => {
            setSelectingDeparture(true);
            setShowCalendar(true);
          }}
        >
          <FontAwesome5 name="calendar-alt" size={16} color={COLORS.gray} />
          <Text style={styles.input}>
            {departureDate ? formatDate(departureDate) : 'Chọn ngày đi'}
          </Text>
          <Text style={styles.roundTripText}>Khứ hồi</Text>
          <Switch value={isRoundTrip} onValueChange={setIsRoundTrip} />
        </TouchableOpacity>

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
              {returnDate ? formatDate(returnDate) : 'Chọn ngày về'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => setShowSeatsModal(true)}
        >
          <FontAwesome5 name="chair" size={16} color={COLORS.gray} />
          <Text style={styles.input}>{`${numberOfSeats} Ghế ngồi`}</Text>
        </TouchableOpacity>

        <Modal visible={showSeatsModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.guestRow}>
                <Text style={styles.listText}>Số ghế ngồi</Text>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setNumberOfSeats(Math.max(1, numberOfSeats - 1))}
                  >
                    <Text style={styles.counterText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{numberOfSeats}</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setNumberOfSeats(Math.min(10, numberOfSeats + 1))}
                  >
                    <Text style={styles.counterText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSeatsModal(false)}
              >
                <Text style={styles.closeText}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ReusableBtn
          onPress={handleSearch}
          btnText={'Tìm kiếm'}
          textColor={COLORS.white}
          width={SIZES.width - 30}
          backgroundColor={COLORS.green}
          borderWidth={0}
          borderColor={COLORS.green}
        />

        <Modal visible={showDepartureModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {isLoading ? (
                <Text style={styles.loadingText}>Đang tải thành phố...</Text>
              ) : (
                <FlatList
                  data={cities}
                  keyExtractor={(item) => item.departureCity}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => {
                        setDeparture(item);
                        setShowDepartureModal(false);
                      }}
                    >
                      <Text style={styles.listText}>{item.departureName}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDepartureModal(false)}
              >
                <Text style={styles.closeText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showDestinationModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {isLoading ? (
                <Text style={styles.loadingText}>Đang tải thành phố...</Text>
              ) : (
                <FlatList
                  data={cities}
                  keyExtractor={(item) => item.departureCity}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => {
                        setDestination(item);
                        setShowDestinationModal(false);
                      }}
                    >
                      <Text style={styles.listText}>{item.departureName}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDestinationModal(false)}
              >
                <Text style={styles.closeText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showCalendar} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Calendar
                minDate={today}
                onDayPress={handleDayPress}
                markedDates={{
                  [departureDate]: { selected: true, selectedColor: COLORS.blue },
                  [returnDate]: { selected: true, selectedColor: COLORS.green },
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: COLORS.lightWhite,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: TEXT.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
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
  roundTripText: {
    marginRight: 10,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  listText: {
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  closeButton: {
    backgroundColor: COLORS.green,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.red,
    fontSize: SIZES.medium,
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default BusTicket;