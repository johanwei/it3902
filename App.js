import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { UrlTile, Polyline } from 'react-native-maps';
import * as FileSystem from 'expo-file-system';
import DownloadTiles from './components/DownloadTiles';
import TrackLocation from './data/TrackLocation';
import MarkLocations from './components/MarkLocations';
import RegisterSheep from './components/RegisterSheep';
import SheepNote from './components/SheepNote';

const MAP_TYPE = Platform.OS == 'android' ? 'none' : 'standard'

export default function App() {
  const MAP_URL =  'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}'
  const TILES_FOLDER = `${FileSystem.documentDirectory}tiles/{z}-{x}-{y}.png`
  const INITIAL_REGION = {
        latitude: 64.1608,
        longitude: 17.7808,
        latitudeDelta: 24.5742,
        longitudeDelta: 28.1047
      }

  const [isOffline, setIsOffline] = useState(false)
  const [visibleSettings, setVisibleSettings] = useState(false)
  const [mapRegion, setMapRegion] = useState(INITIAL_REGION)
  const [trackLocation, setTrackLocation] = useState(false)
  const [currentLocations, setCurrentLocations] = useState([])
  const [currentLocation, setCurrentLocation] = useState()
  const [stopTracking, setStopTracking] = useState(true)
  const [sheepLocation, setSheepLocation] = useState([{latitude: 69, longitude: 16}])
  const [newSheepLocation, setNewSheepLocation] = useState(false)
  const [sheepInformation, setSheepInformation] = useState(false)
    
  const urlTemplate = useMemo(
    () =>
      isOffline
        ? `${TILES_FOLDER}`
        : `${MAP_URL}`,
    [isOffline]
  )

  async function deleteTiles() {
    try {
      await FileSystem.deleteAsync(`${FileSystem.documentDirectory}tiles`)
      alert('Slettet nedlastet kart')
    } catch (error) {
      console.warn(error)
    }
  }

  function toggleOffline() {
    setIsOffline(!isOffline)
  }

  function toggleDownloadSettings() {
    setVisibleSettings(!visibleSettings)
  }

  function onDownloadComplete() {
    setIsOffline(true)
    setVisibleSettings(false)
  }

  function getCurrentLocations(locations){
    setCurrentLocations(locations);
  }

  function getCurrentLocation(loc){
    setCurrentLocation(loc);
  }

  function toggleTrackLocation() {
    setStopTracking(!stopTracking)
    setTrackLocation(!trackLocation);
  }

  function registerNewSheep(info){
    if (info != "cancel"){
      setSheepInformation(info)
    }
    setNewSheepLocation(false)
  }
  
  function registrationFinished(){
    setSheepInformation("")
  }
    
  return (
      <View style={styles.container}>
        <MapView 
        style={{ flex: 1 }} 
        mapType={'standard'}
        maxZoomLevel={18}
        showsUserLocation={true}
        onRegionChangeComplete={setMapRegion}
        onLongPress={(e) => {setSheepLocation([{latitude: e.nativeEvent.coordinate.latitude, 
                                               longitude: e.nativeEvent.coordinate.longitude}])
                                               setNewSheepLocation(true);
                                              }}
        >
        <UrlTile
          urlTemplate={urlTemplate}
          shouldReplaceMapContent={false}
        />
        
        <MarkLocations locations = {currentLocations} />
        
        <RegisterSheep currentLocation = {currentLocation} sheepLocation = {sheepLocation} sheepInformation={sheepInformation} registrationFinished={registrationFinished} />
      </MapView>
      {visibleSettings && (
      <DownloadTiles mapRegion={mapRegion} onFinish={onDownloadComplete} />)}

      <View style={styles.actionContainer}>
        <Button raised title={'Last ned kart'} onPress={toggleDownloadSettings} />
        <Button raised title={'Slett kart'} onPress={deleteTiles} />
        <Button raised title={isOffline ? 'Bruk online' : 'Bruk offline'} onPress={toggleOffline}/>
      </View>      

      <Button raised title={stopTracking ? 'Start ny oppsynstur' : 'Avslutt oppsynstur'} onPress={toggleTrackLocation}/>

      {newSheepLocation && (<SheepNote sheepInformation={registerNewSheep}/>)}

      {<TrackLocation listOfLocations={getCurrentLocations} stopTracking={stopTracking} currentLocation={getCurrentLocation} />}
    </View>
  )   
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    paddingTop: 35,
    zIndex: 999,
    justifyContent: 'space-around',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  }
})