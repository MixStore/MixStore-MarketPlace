import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { COLORS } from '../util/COLORS';
import "../../global.css"


// import { useState, useEffect  } from 'react';
// import { app } from '../../firebaseConfig';
// import { Formik } from 'formik';
// import { getFirestore } from "firebase/firestore"
// import { collection, getDocs} from "firebase/firestore";
// import {Picker} from '@react-native-picker/picker';
// import * as ImagePicker from 'expo-image-picker';
// import { useUser } from '@clerk/clerk-expo';
// import { Platform } from 'react-native';
// import * as FileSystem from 'expo-file-system';
// import { addDoc } from 'firebase/firestore';


export default function ExploreScreen () {
    return (
      <View style={styles.container}>
        <Text> ExploreScreen </Text>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
});

