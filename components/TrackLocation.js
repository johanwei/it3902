import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_UPDATES_TASK = 'location-updates';

let locationsList = [];
let locationsListLength = 0;
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

      await Location.startLocationUpdatesAsync(LOCATION_UPDATES_TASK, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 1,
      })
    })();
  }, []);

  setInterval(() => {
    if (locationsList.length > locationsListLength)
    {
      props.listOfLocations(locationsList);
      locationsListLength = locationsList.length;
    }
  }, 10000)

  return (
      <Text>Current location {locationsList.length}</Text>
  )   
}

TaskManager.defineTask(LOCATION_UPDATES_TASK, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log("error2");
    alert("error2")
    return;
  }
  if (data) {
    const { locations } = data;

    locationsString += `${locations[0].coords.latitude},${locations[0].coords.longitude} `

    locationsList = locationsString.trim().split(" ").map(a => a.split(",")).map(a => ({latitude: parseFloat(a[0]), longitude: parseFloat(a[1])}));

    console.log("taskmanager: " + locationsList.length);
  }
});

const styles = StyleSheet.create({
})