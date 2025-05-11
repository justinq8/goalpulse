// MatchDetailsScreen.js (Tabbed Version)
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, FlatList
} from 'react-native';
import axios from 'axios';

const API_KEY = '89f55a19ec6c05eb2b82b7541c1cb5ab';

export default function MatchDetailsScreen({ route }) {
  const { match } = route.params;
  const fixtureId = match.fixture.id;
  const homeId = match.teams.home.id;
  const awayId = match.teams.away.id;

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [injuries, setInjuries] = useState([]);
  const [h2h, setH2H] = useState([]);
  const [lineups, setLineups] = useState([]);
  const [activeTab, setActiveTab] = useState('Info');

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const [ev, st, injH, injA, h2hData, lineupData] = await Promise.all([
          axios.get(`https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`, {
            headers: { 'x-apisports-key': API_KEY }
          }),
          axios.get(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`, {
            headers: { 'x-apisports-key': API_KEY }
          }),
          axios.get(`https://v3.football.api-sports.io/injuries?team=${homeId}&season=2024`, {
            headers: { 'x-apisports-key': API_KEY }
          }),
          axios.get(`https://v3.football.api-sports.io/injuries?team=${awayId}&season=2024`, {
            headers: { 'x-apisports-key': API_KEY }
          }),
          axios.get(`https://v3.football.api-sports.io/fixtures/headtohead?h2h=${homeId}-${awayId}`, {
            headers: { 'x-apisports-key': API_KEY }
          }),
          axios.get(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${fixtureId}`, {
            headers: { 'x-apisports-key': API_KEY }
          })
        ]);

        setEvents(ev.data.response);
        setStats(st.data.response);
        setInjuries([...injH.data.response, ...injA.data.response]);
        setH2H(h2hData.data.response.slice(0, 5));
        setLineups(lineupData.data.response);
      } catch (err) {
        console.error('❌ Match details error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'Info':
        return (
          <View>
            <Text style={styles.sectionTitle}>Kickoff</Text>
            <Text style={styles.sectionText}>{new Date(match.fixture.date).toLocaleString()}</Text>
            {match.fixture.venue?.name && (
              <Text style={styles.sectionText}>
                📍 {match.fixture.venue.name}, {match.fixture.venue.city}
              </Text>
            )}
            {match.fixture.referee && (
              <Text style={styles.sectionText}>Referee: {match.fixture.referee}</Text>
            )}
          </View>
        );

      case 'Summary':
        const goals = events.filter(e => e.type === 'Goal');
        return goals.length === 0
          ? <Text style={styles.noData}>No goals yet</Text>
          : goals.map((e, i) => (
            <Text key={i} style={styles.sectionText}>
              {e.time.elapsed}' - {e.player.name} ({e.team.name})
            </Text>
          ));

      case 'Stats':
        return stats.length === 2 ? stats[0].statistics.map((item, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statValue}>{stats[0].statistics[index]?.value ?? '-'}</Text>
            <Text style={styles.statLabel}>{item.type}</Text>
            <Text style={styles.statValue}>{stats[1].statistics[index]?.value ?? '-'}</Text>
          </View>
        )) : <Text style={styles.noData}>Stats not available</Text>;

      case 'Line-ups':
        if (lineups.length === 0) return <Text style={styles.noData}>Lineups not available</Text>;
        const home = lineups.find(l => l.team.id === homeId);
        const away = lineups.find(l => l.team.id === awayId);

        const renderPlayers = (team, type) => (
          <View style={{ flex: 1 }}>
            {team[type]?.map(player => (
              <Text key={player.player.id} style={styles.lineupText}>{player.player.name}</Text>
            ))}
          </View>
        );

        return (
          <View>
            <Text style={styles.sectionTitle}>Starting XI</Text>
            <View style={styles.lineupRow}>
              {renderPlayers(home, 'startXI')}
              <Text style={styles.lineupCenter}>vs</Text>
              {renderPlayers(away, 'startXI')}
            </View>
            <Text style={styles.sectionTitle}>Substitutes</Text>
            <View style={styles.lineupRow}>
              {renderPlayers(home, 'substitutes')}
              <Text style={styles.lineupCenter}>vs</Text>
              {renderPlayers(away, 'substitutes')}
            </View>
          </View>
        );

      case 'H2H':
        return h2h.map((item, i) => (
          <View key={i} style={styles.h2hRow}>
            <Image source={{ uri: item.teams.home.logo }} style={styles.h2hLogo} />
            <View style={styles.h2hInfo}>
              <Text>{item.teams.home.name} {item.goals.home} - {item.goals.away} {item.teams.away.name}</Text>
              <Text style={styles.h2hDate}>{new Date(item.fixture.date).toLocaleDateString()}</Text>
            </View>
            <Image source={{ uri: item.teams.away.logo }} style={styles.h2hLogo} />
          </View>
        ));

      case 'Injuries':
        return injuries.length === 0
          ? <Text style={styles.noData}>No injuries reported</Text>
          : injuries.map((inj, i) => (
            <View key={i} style={styles.injuryCard}>
              <Text style={styles.injuryName}>{inj.player.name} ({inj.team.name})</Text>
              <Text style={styles.injuryInfo}>{inj.injury}</Text>
            </View>
          ));

      default:
        return null;
    }
  };

  if (loading) {
    return <View style={styles.loader}><ActivityIndicator size="large" /><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.teamColumn}>
          <Image source={{ uri: match.teams.home.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.teams.home.name}</Text>
        </View>
        <Text style={styles.score}>{match.goals.home} : {match.goals.away}</Text>
        <View style={styles.teamColumn}>
          <Image source={{ uri: match.teams.away.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.teams.away.name}</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {['Info', 'Summary', 'Stats', 'Line-ups', 'H2H', 'Injuries'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.tabContent}>
        {renderTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  teamColumn: { alignItems: 'center', flex: 1 },
  teamLogo: { width: 50, height: 50, resizeMode: 'contain' },
  teamName: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  score: { fontSize: 22, fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f8f8f8' },
  tab: { padding: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#007bff' },
  tabText: { fontSize: 13, color: '#666' },
  activeTabText: { color: '#007bff', fontWeight: 'bold' },
  tabContent: { padding: 16 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 4, fontSize: 15 },
  sectionText: { marginBottom: 8 },
  noData: { fontStyle: 'italic', color: '#666', marginVertical: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  statValue: { width: 50, textAlign: 'center' },
  statLabel: { flex: 1, textAlign: 'center' },
  lineupRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  lineupCenter: { alignSelf: 'center', paddingHorizontal: 8, fontWeight: 'bold' },
  lineupText: { fontSize: 12, marginBottom: 3 },
  injuryCard: { backgroundColor: '#ffe6e6', padding: 10, marginBottom: 10, borderRadius: 6 },
  injuryName: { fontWeight: 'bold' },
  injuryInfo: { fontSize: 12 },
  h2hRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  h2hLogo: { width: 30, height: 30, resizeMode: 'contain' },
  h2hInfo: { flex: 1, alignItems: 'center' },
  h2hDate: { fontSize: 12, color: '#666' },
});
