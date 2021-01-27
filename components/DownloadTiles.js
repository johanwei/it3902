import React, { useState, useMemo } from 'react'
import { View, Button, StyleSheet, Text, ActivityIndicator } from 'react-native'
import Slider from '@react-native-community/slider';
import * as Progress from 'react-native-progress';
import * as FileSystem from 'expo-file-system'
import { tileGridForRegion } from './TileGrid'

export default function downloadTiles(props) {
  const [maxZoom, setMaxZoom] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [ totalTiles, setTotalTiles ] = useState(0) 
  const [ tilesDownloaded, setTilesDownloaded ] = useState(0) 

  const currentZoom = useMemo(() => {
    const zoom = calcZoom(props.mapRegion.longitudeDelta)
    return zoom 
  }, [props.mapRegion])

  async function fetchTiles() {
    setIsLoading(true)

    const tiles = tileGridForRegion(props.mapRegion, currentZoom, maxZoom)
 
    setTotalTiles(tiles.length)
    /*
       * For Expo to be able to download the tiles,
       * the directories have to be created first.
       */
      /*for (const tile of tiles) {
        const folder = `${FileSystem.documentDirectory}tiles/${tile.z}/${tile.x}`
        await FileSystem.makeDirectoryAsync(folder, { intermediates: true })
      }*/
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}tiles`, { intermediates: true })

      const BATCH_SIZE = 10

      let batch = []
      let tilesCounter = 0
  
      for (const tile of tiles){
        const fetchUrl = `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom=${tile.z}&x=${tile.x}&y=${tile.y}`
        const localLocation = `${FileSystem.documentDirectory}tiles/${tile.z}-${tile.x}-${tile.y}.png`
        const tilePromise = FileSystem.downloadAsync(fetchUrl, localLocation)
        batch.push(tilePromise)
        
        if (batch.length >= BATCH_SIZE) {
          tilesCounter += (await Promise.all(batch)).length
          setTilesDownloaded(tilesCounter)
          batch = []
        }
      }
      
      tilesCounter += (await Promise.all(batch)).length
      setTilesDownloaded(tilesCounter)

      alert('Kartet er lastet ned. Du kan nå vise det i offline-modus.')
      setIsLoading(false)
      props.onFinish()
    }

    return (
      <View
      containerStyle={styles.container}>
      <Text style={styles.title}>
      Velg hvilket detaljnivå av kartet du vil laste ned   
      </Text>
      <Text style={styles.warningMessage}>
        Advarsel! Høyere detaljnivå vil ta mer tid og plass å laste ned.
      </Text>

      <Slider
        style={{
          marginBottom: 30,
          marginTop: 30,
        }}
        step={1}
        minimumValue={currentZoom}
        maximumValue={18}
        onValueChange={setMaxZoom}
      />
      {isLoading && <Progress.Bar style={styles.bar} progress={tilesDownloaded/totalTiles} width={350} />}
      {!isLoading && <Button raised title="Last ned kart" onPress={fetchTiles} />}
      </View>
    )
}

function calcZoom(longitudeDelta) {
  return Math.round(Math.log(360 / longitudeDelta) / Math.LN2)
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  warningMessage: {
    marginVertical: 10,
    color: '#bbb',
    fontStyle: 'italic',
    fontSize: 10,
    textAlign: 'center',
  },
  title: {
    marginVertical: 10,
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  bar: {
    bottom: 25,
    left: 10,
  },
  estimate: {
    marginVertical: 15,
    textAlign: 'center',
  },
})