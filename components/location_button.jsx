import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const Nowlocation = ({
  NowLocation,
  PinLocation,
  active_pin,
  useNowLocation,
}) => {
  console.log(useNowLocation);
  
  return (
    <View style={styles.container}>
      {useNowLocation === true ? (
        <Button
          icon="map-marker"
          mode="contained"
          onPress={NowLocation}
          buttonColor="white"
          textColor="#4267b2"
        >
          Now Location
        </Button>
      ) : null}
      {active_pin ? (
        <Button
          icon="map-marker-radius"
          mode="contained"
          onPress={PinLocation}
          buttonColor="red"
        >
          unPin Location
        </Button>
      ) : (
        <Button
          icon="map-marker-radius"
          mode="contained"
          onPress={PinLocation}
          buttonColor="#4267b2"
        >
          PinLocation
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 70,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 5,
  },
});

export default Nowlocation;
