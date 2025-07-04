// screens/WorkoutScreen.js
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Dimensions } from 'react-native';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

export default function WorkoutScreen({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [workoutName, setWorkoutName] = useState('');

  const addExercise = () => {
    if (newExerciseName.trim().length === 0) return;

    setExercises((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newExerciseName.trim(),
        sets: [{ reps: '', weight: '' }],
      },
    ]);
    setNewExerciseName('');
    setModalVisible(false);
  };

  <TextInput
    style={styles.workoutNameInput}
    placeholder="Enter workout name"
    value={workoutName}
    onChangeText={setWorkoutName}
  />

  const addSet = (exerciseId) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: [...ex.sets, { reps: '', weight: '' }],
          };
        }
        return ex;
      })
    );
  };

  const updateSet = (exerciseId, setIndex, field, value) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedSets = ex.sets.map((set, i) => {
            if (i === setIndex) {
              return { ...set, [field]: value };
            }
            return set;
          });
          return { ...ex, sets: updatedSets };
        }
        return ex;
      })
    );
  };

  const deleteExercise = (id) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const saveWorkout = async () => {
    const today = new Date().toISOString().split('T')[0]; // e.g., "2025-07-01"
    const workoutData = {
      name: workoutName || `Workout on ${today}`,
      id: Date.now().toString(), // unique ID
      date: today,
      exercises,
    };


    try {
      const existing = await AsyncStorage.getItem('workoutHistory');
      const parsed = existing ? JSON.parse(existing) : [];

      const updated = [...parsed, workoutData];
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(updated));

      alert('Workout saved!');
      setExercises([]); // Clear the workout
      setWorkoutName('');
    } catch (err) {
      console.error(err);
      alert('Error saving workout');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.workoutNameInput}
          placeholder="Enter workout name"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
        <Button title="Add Exercise" onPress={() => setModalVisible(true)} />
        <SwipeListView
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item: ex }) => (
            <View style={styles.exerciseContainer}>
              <Text style={styles.exerciseTitle}>{ex.name}</Text>
              {ex.sets.map((set, index) => (
                <View key={index} style={styles.setRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Reps"
                    keyboardType="number-pad"
                    value={set.reps}
                    onChangeText={(text) => updateSet(ex.id, index, 'reps', text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Weight"
                    keyboardType="number-pad"
                    value={set.weight}
                    onChangeText={(text) => updateSet(ex.id, index, 'weight', text)}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => addSet(ex.id)}
              >
                <Text style={styles.addSetButtonText}>+ Add Set</Text>
              </TouchableOpacity>
            </View>
          )}
          renderHiddenItem={({ item }) => (
            <View style={styles.hiddenRow}>
              <TouchableOpacity
                onPress={() => deleteExercise(item.id)}
                style={styles.deleteButton}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-Dimensions.get('window').width}
          disableRightSwipe
          onSwipeValueChange={({ key, value }) => {
            if (Math.abs(value) > Dimensions.get('window').width * 0.9) {
              deleteExercise(key);
            }
          }}
        />
        {exercises.length > 0 && (
          <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
            <Text style={styles.saveButtonText}>Save Workout</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#444c56', marginTop: 15 }]}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.saveButtonText}>View Workout History</Text>
        </TouchableOpacity>

      </View>

      {/* Modal for adding exercise */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Exercise</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter exercise name"
              value={newExerciseName}
              onChangeText={setNewExerciseName}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Add" onPress={addExercise} />
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
    padding: 20,
    backgroundColor: '#0d1117',
  },
  exerciseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#161b22',
    borderRadius: 12,
  },
  exerciseTitle: {
    color: '#58a6ff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    paddingHorizontal: 10,
    height: 40,
  },
  addSetButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#238636',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addSetButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#0969da',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  hiddenRow: {
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  deleteButton: {
    width: 75,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#161b22',
    width: '80%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#58a6ff',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutNameInput: {
    backgroundColor: '#22272e',
    color: '#f0f6fc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#58a6ff',
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 15,
  },
});