import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function NewsScreen() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const query = encodeURIComponent(
    'Premier League OR La Liga OR Bundesliga OR Serie A OR Ligue 1 OR Eredivisie OR Saudi Pro League'
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=50&apiKey=453913374fe3493681955c116a54409d`
        );
        setArticles(response.data.articles || []);
      } catch (err) {
        console.log('❌ Error fetching news:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const openArticle = (url) => {
    navigation.navigate('Article', { url });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openArticle(item.url)} style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.source}>{item.source.name}</Text>
      <Text style={styles.date}>
        {new Date(item.publishedAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading soccer news...</Text>
      </View>
    );
  }

  if (articles.length === 0) {
    return (
      <View style={styles.loader}>
        <Text>No news found right now.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4
  },
  source: {
    fontSize: 12,
    color: '#888'
  },
  date: {
    fontSize: 11,
    color: '#999',
    marginTop: 4
  }
});
