import { StatusBar } from 'expo-status-bar';
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, {MapTypes, UrlTile} from 'react-native-maps';
import * as FileSystem from 'expo-file-system';
import DownloadTiles from './components/DownloadTiles';

const MAP_TYPE = Platform.OS == 'android' ? 'none' : 'standard'

export default function App() {
  const MAP_URL =  'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}'
  const TILES_FOLDER = `${FileSystem.documentDirectory}tiles/{z}/{x}/{y}.png`
  const INITIAL_REGION = {
        latitude: 64.1608,
        longitude: 17.7808,
        latitudeDelta: 24.5742,
        longitudeDelta: 28.1047
      }

  const [isOffline, setIsOffline] = useState(false)
  const [mapRegion, setMapRegion] = useState(INITIAL_REGION)
    
  const urlTemplate = useMemo(
    () =>
      isOffline
        ? `${TILES_FOLDER}`
        : `${MAP_URL}`,
    [isOffline]
  )
    
  return (
      <View style={styles.container}>
        <MapView 
        style={{ flex: 1}} 
        mapType={MAP_TYPE}
        maxZoomLevel={20}
        showsUserLocation={false}
        onRegionChangeComplete={setMapRegion}
      >
        <UrlTile 
          urlTemplate={urlTemplate}
          shouldReplaceMapContent={true}
        />
      </MapView>
      <View style={styles.actionContainer}>
        <Button
          raised
          borderRadius={5}
          title={isOffline ? 'Go online' : 'Go offline'}
          onPress={() => { 
            setIsOffline(!isOffline)
          }}
        />
      </View>      
      
      <DownloadTiles mapRegion={mapRegion}/>
    </View>
  )   
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    padding: 15,
    paddingTop: 30,
    zIndex: 999,
    justifyContent: 'space-around',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  container: {
    flex: 1
  }
})