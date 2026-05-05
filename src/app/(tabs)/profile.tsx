import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserById } from '@/services/users';


export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    fetchUser(user.uid);
  }, [user?.uid]);

const fetchUser = async (uid: string) => {
  try {
    setLoading(true);
    setError(null);

    const res = await getUserById(uid);
    console.log('USER API ==>', res);

    if (res?.response) {
      setProfile(res.response);
      return;
    }

    // Handle backend error codes
    if (res?.status === 404) {
      throw new Error('No profile found for this user.');
    }

    if (res?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    if (res?.detail) {
      throw new Error(res.detail);
    }

    throw new Error('Unexpected response from server');
  } catch (err: any) {
    console.log('PROFILE ERROR:', err);
    setError(err?.message || 'Failed to load profile');
  } finally {
    setLoading(false);
  }
};

if (error) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>⚠️ Error</Text>
      <Text style={styles.errorText}>
        {error.includes('No profile') 
          ? 'We couldn’t find your profile details. Try updating your info or contact support.'
          : error.includes('Server')
          ? 'Our servers are having trouble. Please try again later.'
          : error}
      </Text>
    </View>
  );
}

  // 🔄 Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E24B4A" />
      </View>
    );
  }

  // ❌ Error UI
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>⚠️ Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              user?.photoURL ||
              'https://via.placeholder.com/100',
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>
          {user?.displayName || profile?.name || 'Unknown User'}
        </Text>

        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* INFO CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>📧 Email</Text>
        <Text style={styles.value}>
          {profile?.email || user?.email || 'N/A'}
        </Text>

        <Text style={styles.label}>📱 Phone</Text>
        <Text style={styles.value}>
          {profile?.phone || 'Not added'}
        </Text>

        <Text style={styles.label}>🏠 Address</Text>
        <Text style={styles.value}>
          {profile?.address || 'Not added'}
        </Text>

        <Text style={styles.label}>🆔 UID</Text>
        <Text style={styles.valueSmall}>{user?.uid}</Text>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    backgroundColor: '#E24B4A',
    padding: 30,
    alignItems: 'center',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },

  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },

  email: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },

  value: {
    fontSize: 15,
    color: '#222',
    marginTop: 2,
  },

  valueSmall: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E24B4A',
    marginBottom: 6,
  },

  errorText: {
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});