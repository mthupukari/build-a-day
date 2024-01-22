import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import LocationInput from "./LocationInput";
import WeatherDisplay from "./WeatherDisplay";

const App = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = async (loc) => {
    // Fetch weather data from an API
    // For now, it's just a placeholder
    
    setWeatherData({ temp: "20°C", condition: "Sunny" });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.weatherContainer}>
        {weatherData && <WeatherDisplay data={weatherData} />}
      </View>
      <View style={styles.inputContainer}>
        <LocationInput onLocationSubmit={fetchWeather} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
  },
  weatherContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
});

export default App;
