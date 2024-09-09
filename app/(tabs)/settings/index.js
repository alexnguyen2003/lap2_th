import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Pressable,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import InputNumberButton from "./InputNumberButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { evaluate } from "mathjs";

const buttons = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "x"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["sin", "cos", "tan", "="],
  ["rad/deg", "0", ".", "DEL"],
];

export default class App extends Component {
  constructor() {
    super();
    this.initialState = {
      displayValue: "0",
      operator: null,
      firstValue: "",
      secondValue: "",
      nextValue: false,
      history: [],
    };
    this.state = this.initialState;
  }

  toggleTheme = (value) => {
    this.setState({ isDarkTheme: value });
  };

  toggleAngleUnit = () => {
    this.setState({ isRadian: !this.state.isRadian });
  };

  toggleHistory = () => {
    this.setState({ isHistoryVisible: !this.state.isHistoryVisible });
  };

  clearHistory = () => {
    this.setState({ history: [] });
  };

  handleHistorySelect = (item) => {
    console.log("History Item Selected:", item);
    this.setState({
      displayValue: item,
      firstValue: item,
      secondValue: "",
      operator: null,
      nextValue: false,
      isHistoryVisible: false,
    });
  };

  renderButtons() {
    return buttons.map((buttonRows, index) => (
      <View style={styles.inputRow} key={"row-" + index}>
        {buttonRows.map((buttonItems, buttonIndex) => (
          <InputNumberButton
            value={buttonItems}
            handleOnPress={this.handleInput.bind(this, buttonItems)}
            key={"btn-" + buttonIndex}
          />
        ))}
      </View>
    ));
  }

  handleInput = (input) => {
    const {
      displayValue,
      operator,
      firstValue,
      secondValue,
      nextValue,
      isRadian,
    } = this.state;

    switch (input) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.setState({
          displayValue: displayValue === "0" ? input : displayValue + input,
        });
        if (!nextValue) {
          this.setState({
            firstValue: firstValue + input,
          });
        } else {
          this.setState({
            secondValue: secondValue + input,
          });
        }
        break;
      case "+":
      case "-":
      case "x":
      case "÷":
      case "%":
        this.setState({
          nextValue: true,
          operator: input,
          displayValue:
            (operator !== null ? displayValue.slice(0, -1) : displayValue) +
            input,
        });
        break;
      case "sin":
      case "cos":
      case "tan":
        let angle = parseFloat(displayValue);
        if (!isRadian) {
          angle = (angle * Math.PI) / 180;
        }
        let trigResult = Math[input](angle);
        let result = trigResult.toString();
        this.setState({
          displayValue: result,
          firstValue: result,
          secondValue: "",
          operator: null,
          nextValue: false,
          history: [...this.state.history, result],
        });
        break;
      case "rad/deg":
        this.toggleAngleUnit();
        break;
      case "±":
        this.setState({
          displayValue: (-parseFloat(displayValue)).toString(),
        });
        break;
      case ".":
        this.setState({
          displayValue: !displayValue.includes(".")
            ? displayValue + input
            : displayValue,
        });
        if (!nextValue) {
          this.setState({
            firstValue: firstValue + input,
          });
        } else {
          this.setState({
            secondValue: secondValue + input,
          });
        }
        break;
      case "=":
        try {
          if (!operator || !secondValue) {
            this.setState({
              displayValue: firstValue, // Hiển thị giá trị đầu tiên
              secondValue: "",
              operator: null,
              nextValue: false,
            });
          } else {
            let formatOperator =
              operator === "x" ? "*" : operator === "÷" ? "/" : operator;
            let result = evaluate(firstValue + formatOperator + secondValue);
            result = result % 1 === 0 ? result : result.toFixed(2);
            this.setState({
              displayValue: result.toString(),
              firstValue: result.toString(),
              secondValue: "",
              operator: null,
              nextValue: false,
              history: [...this.state.history, result.toString()],
            });
          }
        } catch (error) {
          this.setState({
            displayValue: "Error",
          });
        }
        break;
      case "C":
        this.setState(this.initialState);
        break;
      case "DEL":
        let newString = displayValue.slice(0, -1);
        this.setState({
          displayValue: newString.length === 0 ? "0" : newString,
          firstValue: newString.length === 0 ? "" : newString,
        });
        break;
    }
  };

  renderHistory() {
    console.log("History Data:", this.state.history);
    return (
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>History</Text>
        <FlatList
          data={this.state.history.map((item, index) => ({
            key: index.toString(),
            value: item,
          }))}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyItem}
              onPress={() => this.handleHistorySelect(item.value)}
            >
              <Text style={styles.historyText}>{item.value}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
        <View  style={{
          marginHorizontal: 10,
          flexDirection: "row",
          marginVertical: 10,
          gap: 12,
        }}>
          <Pressable
            style={{
              backgroundColor: "#7CB9E8",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={this.clearHistory}
          >
            <Text>Clear</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: "#7CB9E8",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={this.toggleHistory}
          >
            <Text>Back</Text>
          </Pressable>
          {/* <Button title="Clear History" onPress={this.clearHistory} />
        <Button title="Back to Calculator" onPress={this.toggleHistory} /> */}
        </View>
      </View>
    );
  }

  render() {
    const { isDarkTheme, displayValue, isRadian, isHistoryVisible } =
      this.state;
    const themeStyles = isDarkTheme ? styles.darkTheme : styles.lightTheme;

    return (
      <View style={[styles.container, themeStyles.container]}>
        {isHistoryVisible ? (
          this.renderHistory()
        ) : (
          <>
            <View style={styles.themeToggleContainer}>
              <Switch value={isDarkTheme} onValueChange={this.toggleTheme} />
              <Pressable onPress={this.toggleHistory}>
                <FontAwesome
                  name="history"
                  size={24}
                  color={isDarkTheme ? "white" : "black"}
                />
              </Pressable>
              <Text style={themeStyles.toggleButtonText}>
                {isDarkTheme ? "Dark Mode" : "Light Mode"}
              </Text>
              <Text style={themeStyles.angleUnitText}>
                {isRadian ? "Radians" : "Degrees"}
              </Text>
            </View>
            <View style={styles.resultContainer}>
              <Text style={[styles.resultText, themeStyles.resultText]}>
                {displayValue}
              </Text>
            </View>
            <View style={styles.inputContainer}>{this.renderButtons()}</View>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleContainer: {
    marginTop: 20,
    top: 10,
    left: 10,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
  },
  resultText: {
    fontSize: 80,
    fontWeight: "bold",
    padding: 20,
    textAlign: "right",
  },
  inputRow: {
    flex: 1,
    flexDirection: "row",
  },
  darkTheme: {
    container: {
      backgroundColor: "#000",
    },
    resultText: {
      color: "white",
    },
    toggleButtonText: {
      color: "white",
      marginLeft: 10,
    },
    angleUnitText: {
      color: "white",
      textAlign: "right",
      marginRight: 20,
      fontSize: 18,
    },
  },
  lightTheme: {
    container: {
      backgroundColor: "#fff",
    },
    resultText: {
      color: "#000",
    },
    toggleButtonText: {
      color: "#000",
      marginLeft: 10,
    },
    angleUnitText: {
      color: "#000",
      textAlign: "right",
      marginRight: 20,
      fontSize: 18,
    },
  },
  historyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  historyText: {
    fontSize: 18,
  },
});
