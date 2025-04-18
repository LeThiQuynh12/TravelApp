import React, {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppBar from '../../components/Reusable/AppBar';
import ReusableTile from '../../components/Reusable/ReusableTile';
import { COLORS } from '../../constants/theme';
import { fetchSuggestions } from '../../services/api';

const Recommended = ({ navigation }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const suggestionList = await fetchSuggestions();
        setSuggestions(suggestionList);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi lấy danh sách suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.statusText}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.statusText, { color: COLORS.red }]}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 50 }}>
        <AppBar
          title={'Danh sách điểm đến'}
          color={COLORS.white}
          color1={COLORS.white}
          icon="search1"
          top={0}
          left={0}
          right={0}
          onPress={() => navigation.goBack()}
          onPress1={() => navigation.navigate('Search')}
        />
      </View>

      <View style={{ paddingTop: 10 }}>
        <FlatList
          data={suggestions}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <ReusableTile
                item={item}
                onPress={() => navigation.navigate('PlaceDetails', { item })}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Recommended;