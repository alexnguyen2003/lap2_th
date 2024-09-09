import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default class InputNumberButton extends Component {
  render() {
    const { value, handleOnPress } = this.props;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => handleOnPress(value)}
      >
        <Text style={styles.text}>{value}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius:30,
    flex: 1,
    margin: 1,
    backgroundColor: "#d98f42",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "#000",
    fontSize: 26
  }
});
