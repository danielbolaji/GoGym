import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import challenges from '../assets/challenges';

const windowWidth = Dimensions.get('window').width;

export default function ChallengeScreen({ navigation }) {
  const [today, setToday] = useState('');
  const [todayChallenge, setTodayChallenge] = useState('');
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [isTodayCompleted, setIsTodayCompleted] = useState(false);
  const [fireEmojis, setFireEmojis] = useState([]);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setToday(todayStr);

    const index = getChallengeIndex(todayStr);
    setTodayChallenge(challenges[index]);

    loadHistory();
  }, []);

  const getChallengeIndex = (dateStr) => {
    const start = new Date(new Date().getFullYear(), 0, 1);
    const todayDate = new Date(dateStr);
    const diffDays = Math.floor((todayDate - start) / (1000 * 60 * 60 * 24));
    return diffDays % challenges.length;
  };

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('challengeHistory');
      const parsed = stored ? JSON.parse(stored) : [];

      setHistory(parsed);
      setIsTodayCompleted(parsed.some((item) => item.date === today));

      const sorted = [...parsed].sort((a, b) => new Date(b.date) - new Date(a.date));
      let currentStreak = 0;
      let yesterday = new Date();

      for (const item of sorted) {
        const itemDate = new Date(item.date);
        const diff = Math.floor((yesterday - itemDate) / (1000 * 60 * 60 * 24));
        if (diff === 1 || diff === 0) {
          currentStreak++;
          yesterday = itemDate;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    } catch (e) {
      console.error('Failed to load challenge history:', e);
    }
  };

  const toggleComplete = async () => {
    const stored = await AsyncStorage.getItem('challengeHistory');
    const parsed = stored ? JSON.parse(stored) : [];

    const isAlreadyCompleted = parsed.some((item) => item.date === today);

    let updated;
    if (isAlreadyCompleted) {
      updated = parsed.filter((item) => item.date !== today);
    } else {
      const newEntry = { date: today, challenge: todayChallenge };
      updated = [...parsed, newEntry];
    }

    await AsyncStorage.setItem('challengeHistory', JSON.stringify(updated));
    setHistory(updated);
    loadHistory();
  };

  // Handle tap to create a new animated fire emoji
  const handleTap = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    const id = Date.now().toString();

    const animatedValue = new Animated.Value(0);

    setFireEmojis((prev) => [...prev, { id, animatedValue, x: locationX, y: locationY }]);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => {
      setFireEmojis((prev) => prev.filter((emoji) => emoji.id !== id));
    });
  };

  return (
    <ImageBackground
      source={require('../assets/yel.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay for opacity */}
      <View style={styles.overlay} />

      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.container}>
          <Text style={styles.title}>🏋️ Daily Challenge</Text>

          <View style={styles.middleSection}>
            <Text style={styles.challengeText}>{todayChallenge}</Text>

            <TouchableOpacity
              style={[styles.completeButton, isTodayCompleted && styles.disabledButton]}
              onPress={toggleComplete}
            >
              <Text style={styles.completeText}>
                {isTodayCompleted ? 'Completed ✓ (Undo)' : 'Mark as Complete'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.streakText}>🔥 {streak} day{streak === 1 ? '' : 's'}</Text>
          </View>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('ChallengeHistory')}
          >
            <Text style={styles.historyText}>View Past Completions</Text>
          </TouchableOpacity>

          {/* Animated fire emojis */}
          {fireEmojis.map(({ id, animatedValue, x, y }) => {
            const translateY = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -150],
            });
            const opacity = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            });
            const scale = animatedValue.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 1.5, 1],
            });

            return (
              <Animated.Text
                key={id}
                style={[
                  styles.fireEmoji,
                  {
                    left: x - 15,
                    top: y - 30,
                    transform: [{ translateY }, { scale }],
                    opacity,
                    position: 'absolute',
                  },
                ]}
              >
                🔥
              </Animated.Text>
            );
          })}
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 35,
    fontWeight: '700',
    color: '#58a6ff',
    textAlign: 'center',
    marginTop: 40,
  },
  middleSection: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  challengeText: {
    fontSize: 40,
    color: '#c9d1d9',
    textAlign: 'center',
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: '#238636',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#444c56',
  },
  completeText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
  },
  streakText: {
    color: '#f0f6fc',
    fontSize: 30,
    textAlign: 'center',
  },
  historyButton: {
    backgroundColor: '#444c56',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  historyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fireEmoji: {
    fontSize: 40,
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});
