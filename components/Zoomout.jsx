import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default Zoomout = ({ zoomLevel, jumpOut }) => {
  return zoomLevel > 9 ? (
    <View style={styles.container}>
      <Button
        mode="contained"
        buttonColor="white"
        textColor="#4267b2"
        onPress={jumpOut}
      >
        Zoomout
      </Button>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 130,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 5,
  },
});
