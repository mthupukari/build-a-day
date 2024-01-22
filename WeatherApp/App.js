import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import LocationInput from "./LocationInput";
import WeatherDisplay from "./WeatherDisplay";
require("dotenv").config();

const App = () => {
  const [weatherData, setWeatherData] = useState(null);

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const fetchWeather = async (loc) => {
    const geo_api = process.env.GEOCODE_KEY;
    const owm_api = process.env.OPENWEATHERAPP_KEY;

    const url = `https://geocode.maps.co/search?q=${loc}&api_key=${geo_api}`;

    try {
      const res = await fetch(url);
      let location, temp, condition;
      if (!res.ok) {
        setWeatherData({ location: "Weather data not found" });
      }
      const data = await res.json();
      location = data[0].display_name;
      lon = data[0].lon;
      lat = data[0].lat;

      try {
        url2 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${owm_api}`;

        const res2 = await fetch(url2);
        if (!res2.ok) {
          setWeatherData({ location: "Weather data not found" });
        }

        const data2 = await res2.json();
        temp = data2.current.temp;
        condition = toTitleCase(data2.current.weather[0].description);

        setWeatherData({
          location: location,
          temp: temp,
          condition: condition,
        });
      } catch (error) {
        setWeatherData({ location: "Weather data not found" });
      }
    } catch (error) {
      setWeatherData({ location: "Weather data not found" });
    }

    setWeatherData({ location: location, temp: temp, condition: condition });
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
