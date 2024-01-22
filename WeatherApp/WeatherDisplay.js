import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WeatherDisplay = ({ data }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.tempText}>Temperature: {data.temp}</Text>
      <Text style={styles.conditionText}>Condition: {data.condition}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  tempText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  conditionText: {
    fontSize: 18,
  },
});

export default WeatherDisplay;
