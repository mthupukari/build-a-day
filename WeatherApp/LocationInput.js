import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const LocationInput = ({ onLocationSubmit }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    onLocationSubmit(input);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter Location"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Get Weather" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default LocationInput;
