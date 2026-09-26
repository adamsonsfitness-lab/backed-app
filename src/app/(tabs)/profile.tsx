import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button';
import { colors, spacing } from '@/theme';

export default function ProfileScreen() {
  const { session } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{session?.user.email}</Text>

        <View style={styles.footer}>
          <Button title="Sign out" variant="danger" onPress={() => supabase.auth.signOut()} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
