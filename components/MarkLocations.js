import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { Polyline} from 'react-native-maps';


export default function MarkLocations(props) {
	//console.log("marklocations: " + props.locations.length);

    return (
		<View>
			{/*<Text style={styles.actionContainer}>{props.locations.length}</Text>*/}
			<Polyline
				coordinates={props.locations}
				strokeWidth={6}
			/>
		</View>
    );
}

const styles = StyleSheet.create({
	actionContainer: {
	  padding: 15,
	  paddingTop: 30,
	  zIndex: 999,
	  justifyContent: 'space-around',
	  position: 'absolute',
	  top: 100,
	  left: 0,
	  right: 0,
	  fontSize: 30
	}
  })