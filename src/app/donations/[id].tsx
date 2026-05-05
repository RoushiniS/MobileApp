import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getDonationById } from '@/services/donations';

export default function DonationDetails() {
  const { id } = useLocalSearchParams();
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadDonation();
  }, [id]);

  const loadDonation = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getDonationById(id as string);

      // ✅ handle both success + error response
      if (res?.response) {
        setDonation(res.response);
      } else if (res?.detail) {
        setError(res.detail);
      } else {
        setError('Something went wrong');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load donation');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toDateString();
  };

  const formatLocation = (item: any) => {
    const parts = [item?.city, item?.state, item?.country]
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);

    if (parts.length > 0) return parts.join(', ');
    if (item?.location) return item.location.split('\n')[0];

    return 'Unknown location';
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E24B4A" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>⚠️ Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!donation) {
    return (
      <View style={styles.centered}>
        <Text>No data found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Donation Details' }} />

      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.name}>{donation.username}</Text>
        <Text style={styles.blood}>{donation.blood_group}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.item}>🩸 Blood Group: {donation.blood_group}</Text>

        <Text style={styles.item}>
          📅 Date: {formatDate(donation.donation_date || donation.created_at)}
        </Text>

        <Text style={styles.item}>
          📍 Location: {formatLocation(donation)}
        </Text>

        <Text style={styles.item}>🆔 ID: {donation._id}</Text>
      </View>

      {/* Proof Image */}
      {/* {donation.proof_url && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Proof</Text>
          <Image
            source={{ uri: donation.proof_url }}
            style={styles.image}
          />
        </View>
      )} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  headerCard: {
    backgroundColor: '#E24B4A',
    padding: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },

  blood: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  item: {
    fontSize: 15,
    marginBottom: 10,
    color: '#444',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E24B4A',
    marginBottom: 8,
  },

  errorText: {
    color: '#666',
    textAlign: 'center',
  },
});