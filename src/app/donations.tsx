import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { getDonations } from '@/services/donations';

const BLOOD_COLORS: Record<string, string> = {
  'O+': '#E24B4A', 'O-': '#E24B4A',
  'A+': '#378ADD', 'A-': '#378ADD',
  'B+': '#1D9E75', 'B-': '#1D9E75',
  'AB+': '#EF9F27', 'AB-': '#EF9F27',
};

export default function DonationsScreen() {
  const router = useRouter();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDonations();
      console.log('DONATIONS API ==>', res);
      setDonations(res.response || []);
    } catch (err) {
      console.error('Donation fetch error:', err);
      setError('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe date formatter
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ✅ Smart location formatter
  const formatLocation = (item: any) => {
    const parts = [item.city, item.state, item.country]
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);

    if (parts.length > 0) return parts.join(', ');

    if (item.location) return item.location.split('\n')[0];

    return 'Unknown location';
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E24B4A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Blood Donations' }} />

      <View style={styles.header}>
        <Text style={styles.title}>Blood Donations</Text>
        <Text style={styles.subtitle}>{donations.length} records</Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={donations}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: BLOOD_COLORS[item.blood_group] || '#666' },
                ]}
              >
                <Text style={styles.badgeText}>{item.blood_group}</Text>
              </View>
              <Text style={styles.name}>{item.username || 'Unknown'}</Text>
            </View>

            <Text style={styles.detail}>
              🏥 {item.hospital_name || 'N/A'}
            </Text>

            <Text style={styles.detail}>
              📅 {formatDate(item.donation_date || item.created_at)}
            </Text>

            <Text style={styles.detail}>
              📍 {formatLocation(item)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.empty}>No donations found</Text>
          </View>
        }
      />

      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/donations/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  title: { fontSize: 20, fontWeight: '600', color: '#1a1a1a' },
  subtitle: { fontSize: 12, color: '#888', marginTop: 4 },
  error: { color: '#E24B4A', textAlign: 'center', margin: 16 },
  empty: { color: '#666', fontSize: 16 },
  list: { padding: 16, paddingBottom: 80 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E8E8E8',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  name: { fontSize: 16, fontWeight: '500', color: '#1a1a1a' },

  detail: { fontSize: 13, color: '#666', marginBottom: 4 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E24B4A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 24, fontWeight: '600' },
});