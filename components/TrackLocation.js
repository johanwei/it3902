import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

let locationsList = []

export default function trackLocation(props) {
  //const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useMemo(() =>
    console.log("hei"),
    props.getLocations(locationsList),
    [locationsList]
  )

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log("error");
        alert("error")
        return;
      }

      await Location.startLocationUpdatesAsync('firstTask', {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 1,
      })
    })();
  }, []);

  return (
      <Text>Current location</Text>
  )   
}

TaskManager.defineTask('firstTask', ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log("error2");
    alert("error2")
    return;
  }
  if (data) {
    //console.log("success2");
    const { locations } = data;
    locationsList.push({
      "latitude" : locations[0].coords.latitude, 
      "longitude": locations[0].coords.longitude
    });
    alert("latitude: " + locations[0].coords.latitude, 
    "longitude: " + locations[0].coords.longitude);
  }
});

const styles = StyleSheet.create({
})