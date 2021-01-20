import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, {LocalTile, UrlTile} from 'react-native-maps';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const urlTemplate =  'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}'
  const offlineUrlTemplate = '${FileSystem.documentDirectory}tiles/{z}/{x}/{y}.png'
  const [isOffline, setIsOffline] = useState(false)
  const [mapRegion, setMapRegion] = useState(undefined)

  const [region, setRegion] = useState({
                              latitude: 64.1608,
                              longitude: 17.7808,
                              latitudeDelta: 24.5742,
                              longitudeDelta: 28.1047,
  })

  return (
    <View>
      <View>
        <Button
          //raised
          borderRadius={5}
          title={isOffline ? 'Go online' : 'Go offline'}
          onPress={() => {
            isOffline
              ? setIsOffline(false)
              : setIsOffline(true)
          }}
        />
      </View>
      <MapView 
        style={{ flex: 1}} 
        maxZoomLevel={20}
        showsUserLocation={false}
        onRegionChangeComplete={region => {
          setRegion(region);
      }}
      //{...console.log(region)}
      >
        <UrlTile 
          urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}"
          //urlTemplate={FileSystem.documentDirectory + '{z}-{x}-{y}.png'}
          shouldReplaceMapContent={true}
        />
      </MapView>
  );
  </View>
  )   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
