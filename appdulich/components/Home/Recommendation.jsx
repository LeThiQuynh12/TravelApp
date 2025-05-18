import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import {
  COLORS,
  SIZES,
  TEXT,
} from '../../constants/theme';
import { fetchSuggestions } from '../../services/api';
import { rowWithSpace } from '../Reusable/reusable.style';
import ReusableText from '../Reusable/ReusableText';
import ReusableTile from '../Reusable/ReusableTile';

const Recommendations = () => {
  const navigation = useNavigation();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const suggestionList = await fetchSuggestions();
        setRecommendations(suggestionList);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi lấy danh sách recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

if (loading) {
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={COLORS.red} style={{ marginBottom: 10 }} />
      <ReusableText

        family={'medium'}
        size={TEXT.medium}
        color={COLORS.black}
      />
    </View>
  );
}

  if (error) {
    return (
      <View style={styles.container}>
        <ReusableText
          text={error}
          family={'medium'}
          size={TEXT.medium}
          color={COLORS.red}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[rowWithSpace('space-between'), { paddingBottom: 10 }]}>
        <ReusableText
          text={'Gợi ý'}
          family={'medium'}
          size={TEXT.large}
          color={COLORS.black}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Recommended')}>
          <Feather name="list" size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recommendations}
        horizontal
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ columnGap: SIZES.medium }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ReusableTile
            item={item}
            onPress={() => navigation.navigate('PlaceDetails', { item })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
});

export default Recommendations;