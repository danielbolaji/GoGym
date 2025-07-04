// screens/WorkoutHistorycreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function WorkoutHistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem('workoutHistory');
    if (data) setHistory(JSON.parse(data));
  };

  const deleteHistoryItem = async (idToDelete) => {
    const updatedHistory = history.filter((item) => item.id !== idToDelete);
    setHistory(updatedHistory);
    await AsyncStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout History</Text>

      {history.length === 0 ? (
        <Text style={styles.empty}>No saved workouts yet.</Text>
      ) : (
        <SwipeListView
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.workoutTitle}>{item.name}</Text>
              <Text style={styles.date}>{item.date}</Text>
              {item.exercises.map((ex, i) => (
                <View key={i}>
                  <Text style={styles.exercise}>{ex.name}</Text>
                  {ex.sets.map((set, sIdx) => (
                    <Text key={sIdx} style={styles.set}>
                      • {set.reps} reps @ {set.weight} lbs
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
          renderHiddenItem={({ item }) => (
            <View style={styles.hiddenRow}>
              <TouchableOpacity
                onPress={() => deleteHistoryItem(Number(rowMap[itemKey(rowMap)].key))}
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
              deleteHistoryItem(key);
            }
          }}
        />
      )}
    </View>
  );
}

// Helper to get row key safely
const itemKey = (rowMap) => Object.keys(rowMap)[0];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#58a6ff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#161b22',
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
  },
  date: {
    color: '#c9d1d9',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exercise: {
    color: '#58a6ff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  set: {
    color: '#c9d1d9',
    marginLeft: 10,
  },
  empty: {
    color: '#8b949e',
  },
  hiddenRow: {
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  deleteButton: {
    width: 75,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutTitle: {
  color: '#f0f6fc',
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 4,
  },
});
