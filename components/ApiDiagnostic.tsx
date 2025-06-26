// components/ApiDiagnostic.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useScan } from '@/contexts/scanContext';

const ApiDiagnostic: React.FC = () => {
  const { testApiConnection, apiStatus } = useScan();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<{
    success: boolean;
    error?: string;
    details?: any;
    timestamp?: number;
  } | null>(null);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      const result = await testApiConnection();
      setLastTestResult({
        ...result,
        timestamp: Date.now()
      });
      
      if (result.success) {
        Alert.alert(
          'Connexion réussie ✅',
          'L\'API OpenRouter est accessible et fonctionne correctement.'
        );
      } else {
        Alert.alert(
          'Connexion échouée ❌',
          `Erreur: ${result.error}\n\nDétails: ${JSON.stringify(result.details, null, 2)}`
        );
      }
    } catch (error) {
      Alert.alert('Erreur', `Test de connexion échoué: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'connected': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'connected': return 'Connecté ✅';
      case 'error': return 'Erreur ❌';
      default: return 'Inconnu ⚠️';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnostic API OpenRouter</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Statut actuel:</Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.testButton, isTestingConnection && styles.testButtonDisabled]}
        onPress={handleTestConnection}
        disabled={isTestingConnection}
      >
        <Text style={styles.testButtonText}>
          {isTestingConnection ? 'Test en cours...' : 'Tester la connexion'}
        </Text>
      </TouchableOpacity>

      {lastTestResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Dernier test:</Text>
          <Text style={styles.resultTimestamp}>
            {new Date(lastTestResult.timestamp!).toLocaleString()}
          </Text>
          
          <View style={styles.resultStatus}>
            <Text style={[
              styles.resultStatusText,
              { color: lastTestResult.success ? '#4CAF50' : '#F44336' }
            ]}>
              {lastTestResult.success ? 'Succès' : 'Échec'}
            </Text>
          </View>

          {lastTestResult.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Erreur:</Text>
              <Text style={styles.errorText}>{lastTestResult.error}</Text>
            </View>
          )}

          {lastTestResult.details && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Détails:</Text>
              <Text style={styles.detailsText}>
                {JSON.stringify(lastTestResult.details, null, 2)}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>Solutions possibles:</Text>
        <Text style={styles.helpText}>
          • Vérifiez votre clé API OpenRouter{'\n'}
          • Confirmez vos crédits API{'\n'}
          • Testez votre connexion internet{'\n'}
          • Redémarrez l'application{'\n'}
          • Consultez les logs pour plus de détails
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  resultStatus: {
    marginBottom: 10,
  },
  resultStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: 10,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    fontStyle: 'italic',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
  },
  helpContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 5,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  helpText: {
    fontSize: 12,
    color: '#1976d2',
    lineHeight: 18,
  },
});

export default ApiDiagnostic;