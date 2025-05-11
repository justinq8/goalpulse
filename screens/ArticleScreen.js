import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ArticleScreen({ route }) {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator style={styles.loader} size="large" color="#000" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
