import React, { useState, useMemo } from 'react'
import { StyleSheet, Text, ActivityIndicator } from 'react-native'
import { Card } from 'react-native-elements'
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system'
import { tileGridForRegion } from './TileGrid'

export default function downloadTiles(props) {
  const [maxZoom, setMaxZoom] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const currentZoom = useMemo(() => {
    const zoom = calcZoom(props.mapRegion.longitudeDelta)
    return zoom
  }, [props.mapRegion])


  async function fetchTiles() {
    const tiles = tileGridForRegion(props.mapRegion, currentZoom, maxZoom)

      /*
       * For Expo to be able to download the tiles,
       * the directories have to be created first.
       */
      for (const tile of tiles) {
        const folder = `${FileSystem.documentDirectory}tiles/${tile.z}/${tile.x}`
        await FileSystem.makeDirectoryAsync(folder, { intermediates: true })
      }

      const BATCH_SIZE = 100

      let batch = []
  
      for (const tile of tiles){
        const fetchUrl = `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom=${tile.z}&x=${tile.x}&y=${tile.y}`
        const localLocation = `${FileSystem.documentDirectory}tiles/${tile.z}/${tile.x}/${tile.y}.png`
        const tilePromise = FileSystem.downloadAsync(fetchUrl, localLocation)

        batch.push(tilePromise)

        if (batch.length >= BATCH_SIZE) {
          await Promise.all(batch)
          batch = []
        }
      }
    
      await Promise.all(batch)

      alert('Finished downloading tiles, you are now viewing the offline map.')
    }

    return (
      <Text style={styles.warningMessage}>
        Warning! Selecting a high detail level will take up more space.
      </Text>
      /*<Card
      title={'Select number of zoom levels to download'}
      containerStyle={styles.container}>
      <Text style={styles.warningMessage}>
        Warning! Selecting a high detail level will take up more space.
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
      {...console.log(currentZoom)}
      {...console.log(maxZoom)}
      />

      <Button raised title="Last ned kart" onPress={fetchTiles} />
      </Card>*/
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
  estimate: {
    marginVertical: 15,
    textAlign: 'center',
  },
})