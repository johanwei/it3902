import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { UrlTile} from 'react-native-maps';
import * as FileSystem from 'expo-file-system';
import DownloadTiles from './components/DownloadTiles';
import TrackLocation from './components/TrackLocation';

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
  const [visisbleSettings, setVisisbleSettings] = useState(false)
  const [mapRegion, setMapRegion] = useState(INITIAL_REGION)
  const [markers, setMarkers] = useState([])
  const [trackLocation, setTrackLocation] = useState(false)
    
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

  function toggeleDownloadSettings() {
    setVisisbleSettings(!visisbleSettings)
  }

  function onDownloadComplete() {
    setIsOffline(true)
    setVisisbleSettings(false)
  }

  function currentLocations(locations){
    locations.forEach(element => {
      console.log("latitude: " + element.latitude);
      console.log("");
    });
  }

  function toggleTrackLocation() {
    setTrackLocation(!trackLocation)
  }
    
  return (
      <View style={styles.container}>
        <MapView 
        style={{ flex: 1}} 
        mapType={'standard'}
        maxZoomLevel={18}
        //showsUserLocation={true}
        onRegionChangeComplete={setMapRegion}
        onLongPress={(e) => setMarkers([...markers, {
          id: markers.length,
          value: e.nativeEvent.coordinate
        }])}
      >
        <UrlTile 
          urlTemplate={urlTemplate}
          shouldReplaceMapContent={true}
        />
        {markers.map((marker) => {
          return (
        <MapView.Marker key={marker.id} coordinate={marker.value}>
          <MapView.Callout>
            <Text>ID: {marker.id}</Text>
            <Text>Latitude: {marker.value.latitude}</Text>
            <Text>Longitude: {marker.value.longitude}</Text>
          </MapView.Callout>        
        </MapView.Marker>)})}

      </MapView>
      <View style={styles.actionContainer}>
        <Button raised title={'Last ned kart'} onPress={toggeleDownloadSettings} />
        <Button raised title={'Slett kart'} onPress={deleteTiles} />
        <Button raised title={isOffline ? 'Bruk online' : 'Bruk offline'} onPress={toggleOffline}/>
      </View>      
      <Button raised title='Track location' onPress={toggleTrackLocation}/>
      {visisbleSettings && (
      <DownloadTiles mapRegion={mapRegion} onFinish={onDownloadComplete} />)}
      {trackLocation && <TrackLocation getLocations={currentLocations} />}
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