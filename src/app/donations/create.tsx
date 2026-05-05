import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { createDonation } from '@/services/donations';
import { useAuth } from '@/hooks/useAuth';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  donor_name: z.string().min(1, 'Name is required'),
  blood_group: z.string().min(1, 'Blood group is required'),
  location: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
});

type FormData = z.infer<typeof schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label} <Text style={styles.required}>*</Text></Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreateDonation() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      donor_name: user?.displayName ?? '',
      blood_group: '',
      location: '',
      city: '',
      state: '',
      country: '',
    },
  });

  const selectedBg = watch('blood_group');

  const onSubmit = async (data: FormData) => {
    if (!user?.uid) {
      Toast.show({ type: 'error', text1: 'Not logged in', text2: 'Please login again.' });
      return;
    }

    const payload = {
      user_id: user.uid,
      blood_group: data.blood_group,
      donor_name: data.donor_name,
      location: data.location,
      city: data.city,
      state: data.state,
      country: data.country,
      donation_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    try {
      await createDonation(payload);
      Toast.show({ type: 'success', text1: 'Registered!', text2: 'You have been added as a donor.' });
      setTimeout(() => router.back(), 1500);
    } catch (err) {
      console.error(err);
      Toast.show({ type: 'error', text1: 'Failed', text2: 'Could not register donation. Try again.' });
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Blood Donation</Text>
          <Text style={styles.subtitle}>All fields are mandatory</Text>
        </View>

        <View style={styles.form}>
          {/* Donor Name */}
          <Field label="Donor Name" error={errors.donor_name?.message}>
            <Controller
              control={control}
              name="donor_name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.donor_name && styles.inputError]}
                  placeholder="Enter your full name"
                  placeholderTextColor="#bbb"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </Field>

          {/* Blood Group */}
          <Field label="Blood Group" error={errors.blood_group?.message}>
            <View style={styles.groupGrid}>
              {BLOOD_GROUPS.map((g) => {
                const active = selectedBg === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[styles.groupBtn, active && styles.groupBtnActive]}
                    onPress={() => setValue('blood_group', g, { shouldValidate: true })}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.groupText, active && styles.groupTextActive]}>{g}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Field>

          {/* Divider */}
          <Text style={styles.sectionHead}>Location Details</Text>

          {/* Address */}
          <Field label="Address" error={errors.location?.message}>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.location && styles.inputError]}
                  placeholder="Street / Area / Landmark"
                  placeholderTextColor="#bbb"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </Field>

          {/* City + State side by side */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Field label="City" error={errors.city?.message}>
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.city && styles.inputError]}
                      placeholder="City"
                      placeholderTextColor="#bbb"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </Field>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Field label="State" error={errors.state?.message}>
                <Controller
                  control={control}
                  name="state"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.state && styles.inputError]}
                      placeholder="State"
                      placeholderTextColor="#bbb"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </Field>
            </View>
          </View>

          {/* Country */}
          <Field label="Country" error={errors.country?.message}>
            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.country && styles.inputError]}
                  placeholder="Country"
                  placeholderTextColor="#bbb"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </Field>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Register as Donor</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Toast must be at root level */}
      <Toast />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },
  content:   { paddingBottom: 48 },

  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  title:    { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  subtitle: { fontSize: 12, color: '#aaa', marginTop: 3 },

  form: { padding: 20 },

  fieldWrap: { marginBottom: 4 },

  label:    { fontSize: 13, fontWeight: '500', color: '#444', marginTop: 16, marginBottom: 7 },
  required: { color: '#E24B4A' },

  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    fontSize: 14,
    color: '#1a1a1a',
  },
  inputError: { borderColor: '#E24B4A' },

  errorText: { fontSize: 11, color: '#E24B4A', marginTop: 4, marginLeft: 2 },

  groupGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  groupBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  groupBtnActive: { backgroundColor: '#E24B4A', borderColor: '#E24B4A' },
  groupText:      { fontSize: 14, fontWeight: '500', color: '#555' },
  groupTextActive:{ color: '#fff' },

  sectionHead: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 0,
  },

  row: { flexDirection: 'row' },

  submitBtn: {
    backgroundColor: '#E24B4A',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
  },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});