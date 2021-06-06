/*
- This class is active when the user is tracking the location
- When the user clicks and holds anywhere on the map, a window will be shown
    - Two options:
        1. write a note and save observation
        2. cancel
    - When the note is saved ?

*/

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from 'react-native';
import { View, Text } from 'react-native';
import { Polyline, Marker, Callout } from 'react-native-maps';

export default function RegisterSheep(props) {

    const [registeredSheep, setRegisteredSheep] = useState([])

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

    
    
    return (
        registeredSheep.map((position, i) => (
            <View key={i}>
                <Polyline
                coordinates={position.slice(0,2)}
                strokeWidth={6}
                strokeColor={"red"}
                />
                <Marker key={i} coordinate={position[1]}>
                    <Callout>
                        <Text>Latitude: {position[1].latitude}</Text>
                        <Text>Longitude: {position[1].longitude}</Text>
                        <Text>Note: {position[2]}</Text>
                    </Callout>        
                    </Marker>
            </View>
        )
        )
        )
        
}