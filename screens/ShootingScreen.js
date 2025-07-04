// screens/ShootingScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TrackShootingScreen({ navigation }) {
  const [makes, setMakes] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [sessionName, setSessionName] = useState('');

  const handleShot = (made) => {
    setAttempts(attempts + 1);
    if (made) setMakes(makes + 1);
  };

  const handleReset = () => {
    setMakes(0);
    setAttempts(0);
  };

  const shootingPercentage = attempts > 0 ? ((makes / attempts) * 100).toFixed(1) : '0.0';

  const handleSaveSession = async () => {
  const today = new Date().toISOString().split('T')[0];

  const sessionData = {
    id: Date.now().toString(),
    name: sessionName || `Shooting Session on ${today}`,
    date: today,
    makes,
    attempts,
    percentage: shootingPercentage,
  };

  try {
    const existing = await AsyncStorage.getItem('shootingHistory');
    const parsed = existing ? JSON.parse(existing) : [];

    const updated = [...parsed, sessionData];
    await AsyncStorage.setItem('shootingHistory', JSON.stringify(updated));

    alert('Session saved!');
    setSaveModalVisible(false);
    setSessionName('');
  } catch (err) {
    console.error(err);
    alert('Error saving session');
  }
};

  return (
    <>
    <View style={styles.container}>
      {/* Title at top */}
      <Text style={styles.header}>🏀 Shooting Tracker</Text>

      {/* Big Record in center */}
      <View style={styles.recordContainer}>
        <Text style={styles.recordText}>{`${makes} / ${attempts}`}</Text>
        <Text style={styles.percentage}>{`${shootingPercentage}%`}</Text>
      </View>

      {/* Made / Missed Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.makeButton} onPress={() => handleShot(true)}>
          <Text style={styles.buttonText}>Made</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.missButton} onPress={() => handleShot(false)}>
          <Text style={styles.buttonText}>Missed</Text>
        </TouchableOpacity>
      </View>

      {/* Reset icon bottom-left */}
      <TouchableOpacity onPress={handleReset} style={styles.resetIcon}>
        <Image
          source={require('../assets/reset.png')}
          style={styles.resetImage}
        />
      </TouchableOpacity>

      {/* Save and View History buttons */}

      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={() => setSaveModalVisible(true)} style={styles.saveButton}>
          <Text style={styles.saveText}>Save Session</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Shooting History')} style={styles.historyButton}>
          <Text style={styles.historyText}>View History</Text>
        </TouchableOpacity>
      </View>
    </View>

    <Modal
      visible={saveModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSaveModalVisible(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Name Your Session</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Session name"
            placeholderTextColor="#888"
            value={sessionName}
            onChangeText={setSessionName}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setSaveModalVisible(false)} />
            <Button title="Save" onPress={handleSaveSession} />
          </View>
        </View>
      </View>
    </Modal>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f97316',
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  recordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  recordText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
  },
  percentage: {
    fontSize: 24,
    color: '#fff',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 200,
  },
  makeButton: {
    backgroundColor: '#15803d',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  missButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  resetIcon: {
    position: 'absolute',
    bottom: 50,
    right: 20,
  },
  resetImage: {
    width: 55,
    height: 55,
    tintColor: '#fff',
  },
  modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButtons: {
  position: 'absolute',
  bottom: 40,
  left: 20,
  width: '40%',
  },
  saveButton: {
    backgroundColor: '#0969da',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  historyButton: {
    backgroundColor: '#444c56',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  historyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});