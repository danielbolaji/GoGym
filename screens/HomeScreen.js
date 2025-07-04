import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/gymbackground.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>GoGym</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Workout')}
          >
            <Text style={styles.buttonText}>Start Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Shooting')}
          >
            <Text style={styles.buttonText}>Track Shooting</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Challenge')}
          >
            <Text style={styles.buttonText}>Today’s Challenge</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 17, 23, 0.7)', // Dark overlay with 70% opacity
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#58a6ff',
    marginBottom: 40,
    fontStyle: 'italic',
    transform: [{ skewX: '-15deg' }],
  },
  button: {
    backgroundColor: '#161b22',
    borderColor: '#30363d',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginVertical: 12,
    width: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#82CAFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
