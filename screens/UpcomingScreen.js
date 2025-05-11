import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { fetchMatchesByDate } from '../services/api';

export default function UpcomingScreen() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split('T')[0];
    fetchMatchesByDate(date).then(setMatches);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tomorrow's Matches</Text>
      {matches.length === 0 ? (
        <Text style={styles.noMatches}>No matches scheduled for tomorrow.</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.fixture.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.teamContainer}>
                  <Image source={{ uri: item.teams.home.logo }} style={styles.logo} />
                  <Text style={styles.team}>{item.teams.home.name}</Text>
                </View>
                <Text style={styles.score}>vs</Text>
                <View style={styles.teamContainer}>
                  <Text style={styles.team}>{item.teams.away.name}</Text>
                  <Image source={{ uri: item.teams.away.logo }} style={styles.logo} />
                </View>
              </View>
              <Text style={styles.time}>
                Kickoff: {new Date(item.fixture.date).toLocaleTimeString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  noMatches: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
  card: { padding: 15, marginBottom: 12, backgroundColor: '#f4f4f4', borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamContainer: { flexDirection: 'row', alignItems: 'center', maxWidth: '40%' },
  logo: { width: 24, height: 24, marginRight: 6, resizeMode: 'contain' },
  team: { fontSize: 16 },
  score: { fontSize: 18, fontWeight: '600' },
  time: { fontSize: 14, color: '#333', marginTop: 6 }
});
