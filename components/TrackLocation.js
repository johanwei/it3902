import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

//const LOCATION_UPDATES_TASK = 'location-updates';

let locationsList = [];
let locationsString = "";

export default function trackLocation(props) {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log("error");
        alert("error")
        return;
      }
      
      await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
      }, (loc) => {
                  locationsString += `${loc.coords.latitude},${loc.coords.longitude} `
                  locationsList = locationsString.trim().split(" ").map(a => a.split(",")).map(a => ({latitude: parseFloat(a[0]), longitude: parseFloat(a[1])}));
                  props.listOfLocations(locationsList);
                    })
    })();
  }, []);

  return (
      <Text>Current location {locationsList.length}</Text>
  )   
}

const styles = StyleSheet.create({
})