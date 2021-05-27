/*
- This class is active when the user is tracking the location
- When the user clicks and holds anywhere on the map, a window will be shown
    - Two options:
        1. write a note and save observation
        2. cancel
    - When the note is saved ?

*/

import React, { useState, useMemo, useEffect } from 'react';
import { Polyline } from 'react-native-maps';

export default function RegisterSheep(props) {

    const [registeredSheep, setRegisteredSheep] = useState([])

    useEffect(() => {
        if(props.currentLocation){
            console.log(props.currentLocation);
        setRegisteredSheep([...registeredSheep, [{latitude: props.currentLocation.coords.latitude, 
                                                  longitude: props.currentLocation.coords.longitude},
                                                {latitude: props.sheepLocation[0].latitude,
                                                 longitude: props.sheepLocation[0].longitude}]
                                            ])}
    }, props.sheepLocation)
    

    //[[{latitude: startlat, longitude: startlon}, {latitude: endlat, longitude: endlon}],
     //[{latitude: startlat, longitude: startlon}, {latitude: endlat, longitude: endlon}]]

    return (
        registeredSheep.map((position, i) => (
            <Polyline key={i}
            coordinates={position}
            strokeWidth={6}
            strokeColor={"red"}
        />
        ))
    )
}