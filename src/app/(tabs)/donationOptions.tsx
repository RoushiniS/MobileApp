import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function DonationsScreen() {
    const router = useRouter()
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blood Donations</Text>
      </View>

      <View style={styles.list}>

        <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => {router.push('/donations/create')}}>
          <View style={[styles.icon, { backgroundColor: '#FCEBEB' }]}>
            <Text style={{ fontSize: 18 }}>🩸</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>Add Blood Donation</Text>
            <Text style={styles.desc}>Register yourself as a donor</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => {router.push('/donations')}}>
          <View style={[styles.icon, { backgroundColor: '#E6F1FB' }]}>
            <Text style={{ fontSize: 18 }}>👥</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>View Donors</Text>
            <Text style={styles.desc}>Browse blood donors near you</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },
  header:    { backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },

  list:  { marginTop: 24, paddingHorizontal: 16, gap: 10 },
  item:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 0.5, borderColor: '#E8E8E8' },
  icon:  { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  text:  { flex: 1 },
  title: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  desc:  { fontSize: 12, color: '#888', marginTop: 3 },
  arrow: { fontSize: 20, color: '#ccc', marginLeft: 8 },
});