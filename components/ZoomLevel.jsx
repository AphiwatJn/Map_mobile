import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ZoomLevel({ zoomLevel }) {
  const zoomDisplay = zoomLevel ? zoomLevel.toFixed(2) : '';

  return (
    <View style={styles.zoom}>
      <Text style={styles.zoomText}>{zoomDisplay?zoomDisplay:'16.27'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  zoom: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 50, 
  },
  zoomText: {
    fontWeight: "bold", 
    color: "#4267b2", 
  },
});
