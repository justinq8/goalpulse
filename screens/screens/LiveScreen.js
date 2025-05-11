// screens/LiveScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_KEY = '89f55a19ec6c05eb2b82b7541c1cb5ab';

export default function LiveScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchLiveMatches = async () => {
    try {
      const response = await axios.get(
        'https://v3.football.api-sports.io/fixtures?live=all',
        {
          headers: { 'x-apisports-key': API_KEY },
        }
      );
      setMatches(response.data.response || []);
    } catch (error) {
      console.error('Error fetching live matches:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 30000); // auto-update every 30s
    return () => clearInterval(interval);
  }, []);

  const renderMatch = ({ item }) => {
    const { teams, goals, league, fixture } = item;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('MatchDetails', { match: item })}
      >
        <View style={styles.leagueRow}>
          <Image source={{ uri: league.logo }} style={styles.leagueLogo} />
          <Text style={styles.leagueName}>{league.name}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.teamContainer}>
            <Image source={{ uri: teams.home.logo }} style={styles.logo} />
            <Text style={styles.team}>{teams.home.name}</Text>
          </View>

          <View style={styles.scoreBox}>
            <Text style={styles.score}>
              {goals.home} - {goals.away}
            </Text>
            <Text style={styles.liveTag}>{fixture.status.short}</Text>
          </View>

          <View style={styles.teamContainer}>
            <Text style={styles.team}>{teams.away.name}</Text>
            <Image source={{ uri: teams.away.logo }} style={styles.logo} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : matches.length === 0 ? (
        <Text style={styles.noMatches}>No live matches right now.</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.fixture.id.toString()}
          renderItem={renderMatch}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12 },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 14,
    color: '#222',
  },
  noMatches: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  leagueLogo: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 6,
  },
  leagueName: {
    fontSize: 13,
    color: '#444',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '40%',
  },
  logo: {
    width: 26,
    height: 26,
    marginHorizontal: 6,
    resizeMode: 'contain',
  },
  team: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  scoreBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  liveTag: {
    fontSize: 12,
    fontWeight: '500',
    color: '#d00',
    marginTop: 2,
  },
});
