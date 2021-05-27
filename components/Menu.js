import React, { useState, useMemo } from 'react';
import { View } from 'react-native';

export default function Menu(props) {

    return (
    <View>
        <View style={styles.actionContainer}>
            <Button raised title={'Last ned kart'} onPress={props.toggleDownloadSettings()} />
            <Button raised title={'Slett kart'} onPress={props.deleteTiles()} />
            <Button raised title={isOffline ? 'Bruk online' : 'Bruk offline'} onPress={props.toggleOffline()}/>
        </View>      
        
    </View>
    )

}