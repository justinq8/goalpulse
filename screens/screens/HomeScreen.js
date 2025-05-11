import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [dates, setDates] = useState([]);
  const navigation = useNavigation();

  const leagueIds = [
    39, 140, 135, 78, 61, 88, 94, 307, 40, 253, 128, 71, 235, 262, 144, 203, 179,
    207, 197, 111, 113, 123, 106, 118, 219, 218, 215, 216, 217, 220, 136, 141,
    79, 41, 42, 62, 198, 236, 2, 3, 4, 45, 48, 143, 46, 67, 137
  ];

  useEffect(() => {
    const today = new Date();
    const next7Days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      next7Days.push(d);
    }

    setDates(next7Days);
  }, []);

  useEffect(() => {
    if (dates.length > 0) {
      fetchMatches(dates[selectedDateIndex]);
    }
  }, [dates, selectedDateIndex]);

  const fetchMatches = async (date) => {
    setLoading(true);
    const dateString = date.toISOString().split('T')[0];

    try {
      const response = await axios.get(
        `https://v3.football.api-sports.io/fixtures?date=${dateString}`,
        {
          headers: {
            'x-apisports-key': '89f55a19ec6c05eb2b82b7541c1cb5ab'
          }
        }
      );

      const filtered = response.data.response.filter(match =>
        leagueIds.includes(match.league.id)
      );

      setMatches(filtered);
    } catch (error) {
      console.error(`❌ Error fetching matches for ${dateString}:`, error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDateTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateTabs}>
      {dates.map((date, index) => {
        const label = date.toDateString().slice(0, 10);
        return (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDateIndex(index)}
            style={[
              styles.dateTab,
              selectedDateIndex === index && styles.activeDateTab,
            ]}
          >
            <Text style={[
              styles.dateTabText,
              selectedDateIndex === index && styles.activeDateTabText
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderItem = ({ item }) => {
    const { teams, fixture, league, goals } = item;
    const matchDate = new Date(fixture.date).toLocaleString();
    const status = fixture.status.short;

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => navigation.navigate('MatchDetails', { match: item })}
      >
        <View style={styles.leagueRow}>
          {league.logo && (
            <Image source={{ uri: league.logo }} style={styles.leagueLogo} />
          )}
          <Text style={styles.leagueText}>{league.name}</Text>
          {league.flag && (
            <Image source={{ uri: league.flag }} style={styles.flag} />
          )}
        </View>

        <View style={styles.row}>
          {teams.home.logo && (
            <Image source={{ uri: teams.home.logo }} style={styles.logo} />
          )}
          <Text style={styles.scoreText}>
            {goals.home !== null && goals.away !== null
              ? `${goals.home} : ${goals.away}`
              : 'vs'}
          </Text>
          {teams.away.logo && (
            <Image source={{ uri: teams.away.logo }} style={styles.logo} />
          )}
        </View>

        <Text style={styles.teams}>
          {teams.home.name} vs {teams.away.name}
        </Text>
        <Text style={styles.time}>{matchDate}</Text>
        {fixture.venue?.name && (
          <Text style={styles.venue}>
            📍 {fixture.venue.name}, {fixture.venue.city}
          </Text>
        )}
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>{status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.dateTabWrapper}>{renderDateTabs()}</View>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
          <Text>Loading matches for selected date...</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.fixture.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  dateTabWrapper: {
    marginBottom: 14,
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  dateTabs: {
    flexGrow: 0,
  },
  dateTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderRadius: 16,
  },
  activeDateTab: {
    backgroundColor: '#007bff',
  },
  dateTabText: {
    fontSize: 13,
    color: '#333',
  },
  activeDateTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: { paddingHorizontal: 16 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  leagueLogo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 6
  },
  leagueText: {
    fontWeight: '600',
    marginRight: 6,
    fontSize: 14
  },
  flag: {
    width: 18,
    height: 12,
    resizeMode: 'contain'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    resizeMode: 'contain'
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  teams: {
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600'
  },
  time: {
    textAlign: 'center',
    color: '#555',
    marginTop: 4
  },
  venue: {
    textAlign: 'center',
    fontSize: 12,
    color: '#777',
    marginTop: 2
  },
  statusContainer: {
    marginTop: 6,
    alignSelf: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10
  },
  statusLabel: {
    fontWeight: 'bold',
    color: '#444'
  }
});
