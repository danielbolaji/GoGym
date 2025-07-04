// screens/ChallengeHistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function ChallengeHistoryScreen() {
  const [completedChallenges, setCompletedChallenges] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const stored = await AsyncStorage.getItem('challengeHistory');
      setCompletedChallenges(stored ? JSON.parse(stored) : []);
    };

    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Challenges</Text>
      <SwipeListView
        data={[...completedChallenges].reverse()}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.challenge}>{item.challenge}</Text>
          </View>
        )}
        // Remove renderHiddenItem and rightOpenValue to disable swipe delete
        disableRightSwipe
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
  card: {
    backgroundColor: '#161b22',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f0f6fc',
    marginBottom: 6,
  },
  challenge: {
    fontSize: 16,
    color: '#c9d1d9',
  },
});
