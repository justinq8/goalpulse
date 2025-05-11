import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const STANDING_LEAGUES = [
  { id: 39, name: 'Premier League' },
  { id: 140, name: 'La Liga' },
  { id: 135, name: 'Serie A' },
  { id: 78, name: 'Bundesliga' },
  { id: 61, name: 'Ligue 1' },
  { id: 88, name: 'Eredivisie' },
  { id: 94, name: 'Portuguese Primeira Liga' },
  { id: 307, name: 'Saudi Pro League' },
  { id: 40, name: 'English Championship' },
  { id: 253, name: 'MLS' },
  { id: 128, name: 'Argentine Primera' },
  { id: 71, name: 'Brasileiro Série A' },
  { id: 235, name: 'Russian Premier League' },
  { id: 262, name: 'Ukrainian Premier League' },
  { id: 144, name: 'Belgian Pro League' },
  { id: 203, name: 'Turkish Super Lig' },
  { id: 179, name: 'Scottish Premiership' },
  { id: 194, name: 'Swiss Super League' },
  { id: 197, name: 'Greek Super League' },
  { id: 214, name: 'Norwegian Eliteserien' },
  { id: 2031, name: 'Swedish Allsvenskan' },
  { id: 208, name: 'Danish Superliga' },
  { id: 209, name: 'Finnish Veikkausliiga' },
  { id: 106, name: 'Polish Ekstraklasa' },
  { id: 119, name: 'Romanian Liga I' },
  { id: 1411, name: 'Hungarian NB I' },
  { id: 169, name: 'Bulgarian First League' },
  { id: 213, name: 'Slovak Super Liga' },
  { id: 216, name: 'Slovenian PrvaLiga' },
  { id: 98, name: 'Czech Fortuna Liga' },
  { id: 238, name: 'Serbian SuperLiga' },
  { id: 218, name: 'Croatian HNL' },
  { id: 195, name: 'Austrian Bundesliga' },
  { id: 146, name: 'Belgian Challenger Pro League' },
  { id: 136, name: 'Serie B' },
  { id: 141, name: 'Spanish Segunda' },
  { id: 81, name: '2. Bundesliga' },
  { id: 42, name: 'League One' },
  { id: 43, name: 'League Two' },
  { id: 62, name: 'Ligue 2' },
  { id: 201, name: 'Greek Super League 2' },
  { id: 236, name: 'Russian First League' },
];

const getCurrentSeason = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  return month >= 7 ? year : year - 1;
};

export default function StatsScreen() {
  const [selectedLeague, setSelectedLeague] = useState(STANDING_LEAGUES[0].id);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentSeason = getCurrentSeason();

  useEffect(() => {
    fetchStandings(selectedLeague);
  }, [selectedLeague]);

  const fetchStandings = async (leagueId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://v3.football.api-sports.io/standings?season=${currentSeason}&league=${leagueId}`,
        {
          headers: {
            'x-apisports-key': '89f55a19ec6c05eb2b82b7541c1cb5ab',
          },
        }
      );
      const table = res.data.response[0]?.league?.standings[0] || [];
      setStandings(table);
    } catch (err) {
      console.error('Error fetching standings:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabBar}
      contentContainerStyle={styles.tabContainer}
    >
      {STANDING_LEAGUES.map((league) => (
        <TouchableOpacity
          key={league.id}
          onPress={() => setSelectedLeague(league.id)}
          style={[
            styles.tabItem,
            selectedLeague === league.id && styles.tabItemActive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              selectedLeague === league.id && styles.tabTextActive,
            ]}
          >
            {league.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTableHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={styles.rank}>#</Text>
      <Text style={[styles.name, { flex: 2 }]}>Team</Text>
      <Text style={styles.stat}>GP</Text>
      <Text style={styles.stat}>W</Text>
      <Text style={styles.stat}>D</Text>
      <Text style={styles.stat}>L</Text>
      <Text style={styles.stat}>GF</Text>
      <Text style={styles.stat}>GA</Text>
      <Text style={styles.stat}>GD</Text>
      <Text style={styles.stat}>Pts</Text>
    </View>
  );

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>{item.rank}</Text>
      <View style={[styles.name, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
        <Image source={{ uri: item.team.logo }} style={styles.logo} />
        <Text numberOfLines={1} style={{ marginLeft: 6, fontSize: 13 }}>{item.team.name}</Text>
      </View>
      <Text style={styles.stat}>{item.all.played}</Text>
      <Text style={styles.stat}>{item.all.win}</Text>
      <Text style={styles.stat}>{item.all.draw}</Text>
      <Text style={styles.stat}>{item.all.lose}</Text>
      <Text style={styles.stat}>{item.all.goals.for}</Text>
      <Text style={styles.stat}>{item.all.goals.against}</Text>
      <Text style={styles.stat}>{item.goalsDiff}</Text>
      <Text style={styles.stat}>{item.points}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
      <Text style={styles.header}>League Standings</Text>
      {renderTabs()}
      <Text style={styles.leagueTitle}>
        {STANDING_LEAGUES.find((l) => l.id === selectedLeague)?.name}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={standings}
          keyExtractor={(item) => `${item.team.id}-${selectedLeague}`}
          renderItem={renderRow}
          ListHeaderComponent={renderTableHeader}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tabBar: {
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  tabContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  tabItemActive: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 13,
    color: '#333',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  leagueTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    color: '#444',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.4,
    borderColor: '#ccc',
  },
  headerRow: {
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },
  rank: {
    width: 24,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  name: {
    flex: 1,
    fontSize: 13,
  },
  stat: {
    width: 30,
    textAlign: 'center',
    fontSize: 12,
    color: '#000',
  },
});
