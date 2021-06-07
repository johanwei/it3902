
import React, { useState, useMemo, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
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
          <Dialog.Title>Registrer sau</Dialog.Title>
          <Dialog.Input placeholder="Skriv notat her" 
                        onChangeText={onChangeNote} 
                        numberOfLines={4}
                        multiline
                        />
          <Dialog.Button label="Avbryt" onPress={handleCancel}/>
          <Dialog.Button label="Registrer" onPress={handleRegister} />
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