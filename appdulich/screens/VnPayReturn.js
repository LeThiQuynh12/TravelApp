import { useRoute } from '@react-navigation/native';
import { View, Text } from 'react-native';

export default function VnPayReturn() {
  const route = useRoute();
  const { status } = route.params || {};

  return (
    <View>
      <Text>Thanh toán: {status === 'success' ? 'Thành công' : 'Thất bại'}</Text>
    </View>
  );
}
