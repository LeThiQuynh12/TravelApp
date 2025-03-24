import React from 'react';

import { Text } from 'react-native';

const ReusableText = ({ text, family, size, color,align, lineHeight }) => {
  return (
    <Text style={{ fontFamily: family, fontSize: size, color: color, textAlign: align, lineHeight: lineHeight }}>
      {text}
    </Text>
  )
}

export default ReusableText
