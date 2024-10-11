import React, { useEffect, useState } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import Nowlocation from "./components/location_button";
import ZoomLevel from "./components/ZoomLevel";
import ZoomOut from "./components/Zoomout";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

const App = () => {
  const [geoJson, setGeoJson] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(null);
  const [pinLocation, setPinLocation] = useState(null);
  const { width, height } = Dimensions.get("screen");
  const ASPECT_RATIO = width / height;
  const [LATITUDE, SetLATITUDE] = useState(15.87);
  const [LONGITUDE, setLONGITUDE] = useState(100.9925);
  // let LATITUDE = 15.87;
  // let LONGITUDE = 100.9925;
  const LATITUDE_DELTA = 0.3;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const mapRef = React.useRef(null);
  const [active_pin, setActive_pin] = useState(false);
  const [useNowLocation, setUseNowLocation] = useState(false);
  const [limit, setLimit] = useState("10000");

  ///////////////////////////// useEffect requestForegroundPermission /////////////////////////////
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation(setMapCenter);
        setUseNowLocation(false);
        return;
      }
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setUseNowLocation(true);
    })();
  }, []);

  ///// useEffect after setLocation and getData show this map //////////////////////////////
  useEffect(() => {
    if (location) {
      const bbox = getBbox(location);
      getData(bbox);
    }
  }, [location]);

  /////////////////////// setCenterMap before /////////////////////////////////////////////////////
  const setMapCenter = {
    latitude: location ? location.latitude : LATITUDE,
    longitude: location ? location.longitude : LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  ///////////////////// ZoomLevel //////////////////////////////////////////////////////////////////
  const onZoom = (region) => {
    const zoom = Math.log2(360 / region.latitudeDelta);
    setZoomLevel(zoom);
  };

  ////////////////////// Bounding box //////////////////////////////////////////////////////////////
  const getBbox = (location) => {
    const buffer = 0.5;
    const xMin = location.longitude - buffer;
    const yMin = location.latitude - buffer;
    const xMax = location.longitude + buffer;
    const yMax = location.latitude + buffer;
    return `${xMin},${yMin},${xMax},${yMax}`;
  };

  /////////////////// get Data from Bounding box //////////////////////////////////////////////////////
  const getData = async (bbox) => {
    try {
      const result = await axios.get(
        `https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?&api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC`,
        {
          params: {
            bbox,
            limit,
          },
        }
      );
      console.log(result.data.features.length);
      setGeoJson(result.data);
    } catch (error) {
      setErrorMsg("Error");
      console.error(error);
    }
  };

  //////////////////////////// Jumpto event //////////////////////////////////////////////////////////

  const jumpToCurrentLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        1000
      );
      setLONGITUDE(location.longitude);
      SetLATITUDE(location.latitude);
      const bbox = getBbox(location);
      getData(bbox);
      setActive_pin(false);
    }
  };

  const jumpToPinLocation = (e) => {
    const newPinLocation = e.nativeEvent.coordinate;
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: newPinLocation.latitude,
          longitude: newPinLocation.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        1000
      );
      setLONGITUDE(newPinLocation.longitude);
      SetLATITUDE(newPinLocation.latitude);
      setPinLocation(newPinLocation);
      const bbox = getBbox(newPinLocation);
      getData(bbox);
    }
  };

  const jumpOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: 9,
          longitudeDelta: LONGITUDE_DELTA,
        },
        1000
      );
    }
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }
  if (!geoJson) {
    return (
      <View style={styles.load}>
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={setMapCenter}
        onRegionChangeComplete={onZoom}
        onPress={active_pin ? jumpToPinLocation : null}
      >
        {geoJson.features.map((feature, index) => {
          const { coordinates } = feature.geometry;
          const { ct_en, ct_tn } = feature.properties;
          const markerCoordinate = {
            latitude: coordinates[1],
            longitude: coordinates[0],
          };
          return zoomLevel > 9 ? (
            <Marker
              key={index}
              coordinate={markerCoordinate}
              title={ct_en}
              description={ct_tn}
            >
              <View style={[styles.customMarker, { backgroundColor: "red" }]} />
            </Marker>
          ) : null;
        })}

        {location && useNowLocation === true && (
          <Marker coordinate={location} title="My Location" pinColor="blue" />
        )}

        {pinLocation && active_pin === true && (
          <Marker coordinate={pinLocation} title="Pinned" pinColor="green" />
        )}
      </MapView>
      <ZoomOut zoomLevel={zoomLevel} jumpOut={jumpOut} />
      <ZoomLevel zoomLevel={zoomLevel} />
      <Nowlocation
        NowLocation={jumpToCurrentLocation}
        PinLocation={() => setActive_pin(!active_pin)}
        active_pin={active_pin}
        useNowLocation={useNowLocation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  customMarker: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  load:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  }
});

export default App;
