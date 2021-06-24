/*
- This class is active when the user is tracking the location
- When the user clicks and holds anywhere on the map, a window will be shown
    - Two options:
        1. write a note and save observation
        2. cancel
*/

import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Button, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import { Polyline, Marker, Callout } from 'react-native-maps';

export default function RegisterSheep(props) {

    const [registeredSheep, setRegisteredSheep] = useState([])
    const [forceUpdate, setForceUpdate] = useState(false)

    useEffect(() => {
        if(props.currentLocation && props.sheepInformation){
            setRegisteredSheep([...registeredSheep, 
                [{latitude: props.currentLocation.coords.latitude, 
                  longitude: props.currentLocation.coords.longitude},
                 {latitude: props.sheepLocation[0].latitude,
                  longitude: props.sheepLocation[0].longitude},
                props.sheepInformation]
            ])
        }
        props.registrationFinished()
    }, [props.sheepInformation])

    /*
    registeredSheep:
        [
            [{latitude: startlat, longitude: startlon}, 
            {latitude: endlat, longitude: endlon}],
            
            [{latitude: startlat, longitude: startlon}, 
            {latitude: endlat, longitude: endlon}]]
    */

    function deleteRegistration(observationInfo){
        let index = registeredSheep.indexOf(observationInfo)
        registeredSheep.splice(index, 1)
        setForceUpdate(!forceUpdate)
    }
    
    return (
        registeredSheep.map((observationInfo, i) => (
            <View key={i} style={styles.container}>
                <Polyline
                coordinates={observationInfo.slice(0,2)}
                strokeWidth={6}
                strokeColor={"red"}
                />
                <Marker key={i} coordinate={observationInfo[1]}>
                    <Callout>
                        <Text style={styles.container}>Latitude: {observationInfo[1].latitude}</Text>
                        <Text style={styles.container}>Longitude: {observationInfo[1].longitude}</Text>
                        <Text style={styles.container}>Notat: {observationInfo[2]}</Text>
                        <TouchableOpacity onPress={() => deleteRegistration(observationInfo)} style={styles.appButtonContainer}>
                            <Text style={styles.appButtonText}>Delete note</Text>
                        </TouchableOpacity>
                    </Callout>        
                    </Marker>
            </View>
        ))
    )
}

const styles = StyleSheet.create({
    container: {
        fontSize: 14,
        margin:5,
        maxWidth: 380
    },
    appButtonContainer: {
        fontSize: 14,
        elevation: 8,
        backgroundColor: "red",
        borderRadius: 10,
        margin:12
      },
      appButtonText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase",
        padding: 5,
      }
  });