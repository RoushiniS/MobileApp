import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUsers } from '@/services/users';
import { getDonations } from '@/services/donations';
import { getDeliveries } from '@/services/deliveries';

interface Stats {
  users: number;
  donors: number;
  deliveries: number;
  pending: number;
}

interface StatCardProps {
  label: string;
  value: number;
  accentColor: string;
}

interface MenuItemProps {
  title: string;
  desc: string;
  emoji: string;
  iconBg: string;
  route: string;
}

const STAT_CARDS: Omit<StatCardProps, 'value'>[] = [
  { label: 'Registered users', accentColor: '#378ADD' },
  { label: 'Blood donors',     accentColor: '#E24B4A' },
  { label: 'Deliveries',       accentColor: '#1D9E75' },
];

const MENU_ITEMS: MenuItemProps[] = [
  { title: 'Blood donations', desc: 'Find donors · Request blood · Add donation', emoji: '🩸', iconBg: '#FCEBEB', route: '/(tabs)/donationOptions' },
  { title: 'Deliveries',      desc: 'Normal · C-section · Patient records',       emoji: '📋', iconBg: '#E1F5EE', route: '/(tabs)/deliveries' },
  { title: 'Users',           desc: 'View · Search · Manage members',             emoji: '👥', iconBg: '#E6F1FB', route: '/(tabs)/users' },
];

function StatCard({ label, value, accentColor }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderTopColor: accentColor, borderTopWidth: 3 }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statNum}>{value === 0 ? '—' : value}</Text>
    </View>
  );
}

function MenuItem({ title, desc, emoji, iconBg, route }: MenuItemProps) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.menuItem} onPress={() => router.push(route as any)} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDesc}>{desc}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ users: 0, donors: 0, deliveries: 0, pending: 0 });
  const [error, setError] = useState<string | null>(null);

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? 'U');

  useEffect(() => {
    async function loadStats() {
      try {
        const [users, donations, deliveries] = await Promise.all([
          getUsers(),
          getDonations(),
          getDeliveries(),
        ]);

        console.log('USERS ==>', JSON.stringify(users));
        console.log('DONATIONS ==>', JSON.stringify(donations));
        console.log('DELIVERIES ==>', JSON.stringify(deliveries));

        const usersArr = Array.isArray(users?.response) ? users.response : [];
        const donationsArr = Array.isArray(donations?.response) ? donations.response : [];
        const deliveriesArr = Array.isArray(deliveries?.response) ? deliveries.response : [];

        setStats({
          users: usersArr.length,
          donors: donationsArr.length,
          deliveries: deliveriesArr.length,
          pending: 0,
        });
      } catch (err) {
        console.error('API ERROR ==>', err);
        setError('Failed to load data');
      }
    }
    loadStats();
  }, []);

  const statValues = [stats.users, stats.donors, stats.deliveries, stats.pending];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.appTitle}>HELP EACH OTHER</Text>
          <Text style={styles.appSub}>Community health network</Text>
        </View>
        {/* <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View> */}
      </View>profil

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.sectionLabel}>OVERVIEW</Text>
      <View style={styles.statGrid}>
        {STAT_CARDS.map((card, i) => (
          <StatCard key={card.label} {...card} value={statValues[i]} />
        ))}
      </View>

      <Text style={styles.sectionLabel}>ACTIONS</Text>
      {MENU_ITEMS.map((item) => (
        <MenuItem key={item.title} {...item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F5F5F0' },
  content:      { paddingBottom: 32 },
  topbar:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0' },
  appTitle:     { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  appSub:       { fontSize: 12, color: '#888', marginTop: 2 },
  avatar:       { width: 36, height: 36, borderRadius: 18, backgroundColor: '#B5D4F4', alignItems: 'center', justifyContent: 'center' },
  avatarText:   { fontSize: 13, fontWeight: '600', color: '#0C447C' },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: '#999', letterSpacing: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 10 },
  statGrid:     { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  statCard:     { width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: '#E8E8E8' },
  statLabel:    { fontSize: 11, color: '#888' },
  statNum:      { fontSize: 24, fontWeight: '500', color: '#1a1a1a', marginTop: 4 },
  menuItem:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 14, padding: 16, borderWidth: 0.5, borderColor: '#E8E8E8' },
  menuIcon:     { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuText:     { flex: 1 },
  menuTitle:    { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  menuDesc:     { fontSize: 12, color: '#888', marginTop: 3 },
  arrow:        { fontSize: 20, color: '#ccc', marginLeft: 8 },
  errorText:    { color: '#E24B4A', fontSize: 13, textAlign: 'center', marginTop: 12 },
});
