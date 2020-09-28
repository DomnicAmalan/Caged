import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Rating({ rating, color }) {
  const filledStars = Math.floor(rating / 2);
  const maxStars = Array(5 - filledStars).fill('staro');
  const r = [...Array(filledStars).fill('star'), ...maxStars];

  return (
    <View style={styles.rating}>
      <Text style={styles.ratingNumber}>{rating}</Text>
      {r.map((type, index) => {
        return <AntDesign key={index} name={type} size={12} color={color} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  ratingNumber: { marginRight: 4, fontFamily: 'Menlo', fontSize: 14, color: "white" },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4
  },
});