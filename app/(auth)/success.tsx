import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const usuario = params.usuario as string;

  useEffect(() => {
    // Esperar 2 segundos y luego ir a las tabs
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.successBox}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>
          Has iniciado sesión como {usuario}
        </Text>
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        <Text style={styles.text}>Cargando aplicación...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  successBox: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    minWidth: 300,
  },
  checkmark: {
    fontSize: 80,
    color: '#4CAF50',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  text: {
    fontSize: 14,
    color: '#999',
  },
});