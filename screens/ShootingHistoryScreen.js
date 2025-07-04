// screens/ShootingHistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableOpacity, Dimensions } from 'react-native';

export default function ShootingHistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const saved = await AsyncStorage.getItem('shootingHistory');
      setHistory(saved ? JSON.parse(saved) : []);
    };

    const unsubscribe = loadHistory();
    return () => unsubscribe;
  }, []);
  
  const deleteSession = async (idToDelete) => {
    const updatedHistory = history.filter((item) => item.id !== idToDelete);
    setHistory(updatedHistory);
    await AsyncStorage.setItem('shootingHistory', JSON.stringify(updatedHistory));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shooting History</Text>
      <SwipeListView
        data={[...history].reverse()} // To keep latest on top
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={styles.sessionCard}>
            <Text style={styles.sessionName}>{item.name}</Text>
            <Text style={styles.sessionDetail}>{item.date}</Text>
            <Text style={styles.sessionDetail}>
                {item.makes} / {item.attempts} shots ({item.percentage}%)
            </Text>
            </View>
        )}
        renderHiddenItem={({ item }) => (
            <View style={styles.hiddenRow}>
            <TouchableOpacity
                onPress={() => deleteSession(item.id)}
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
            deleteSession(key);
            }
        }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#58a6ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  sessionCard: {
    backgroundColor: '#161b22',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sessionName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f0f6fc',
  },
  sessionDetail: {
    fontSize: 16,
    color: '#c9d1d9',
    marginTop: 4,
  },
  hiddenRow: {
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  deleteButton: {
    width: 75,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
