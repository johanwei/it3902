
import React, { useState, useMemo, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { Polyline, Marker, Callout } from 'react-native-maps';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Dialog from "react-native-dialog";


export default function SheepNote(props) {

    const [modalVisible, setModalVisible] = useState(true)
    const [note, onChangeNote] = useState()

    const handleCancel = () => {
      props.sheepInformation("cancel")
      setModalVisible(!modalVisible)
    };
  
    const handleRegister = () => {
      setModalVisible(!modalVisible)
      props.sheepInformation(note)
    };

    return (
      <View>
        <Dialog.Container visible={modalVisible}>
          <Dialog.Title>Register sheep</Dialog.Title>
          <Dialog.Description>
            Enter text and press "Register" to register sheep observation
          </Dialog.Description>
          <Dialog.Input placeholder="Enter note here" 
                        onChangeText={onChangeNote} 
                        numberOfLines={4}
                        multiline
                        />
          <Dialog.Button label="Cancel" onPress={handleCancel}/>
          <Dialog.Button label="Register" onPress={handleRegister} />
        </Dialog.Container>
     </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });