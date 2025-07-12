import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();
  
  const [privacyModeEnabled, setPrivacyModeEnabled] = useState(false);
  const styles = createStyles(colors);

  const SettingItem: React.FC<SettingItemProps> = ({ 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    showChevron = true 
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemContent}>
        <View style={styles.settingItemText}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingItemSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.settingItemRight}>
          {rightElement}
          {showChevron && onPress && (
            <Text style={styles.chevron}>›</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };



  const handleDataExport = () => {
    Alert.alert('Export Data', 'Data export feature coming soon!');
  };

  const handleHelpSupport = () => {
    Alert.alert('Help & Support', 'Help and support feature coming soon!');
  };

  const handleAbout = () => {
    Alert.alert('About MindMirror', 'MindMirror v1.0.0\n\nA mindful journaling app for mental wellness.');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>
                {user?.displayName || 'User'}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || 'No email'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsCard}>
          <SettingItem
            title="Privacy Mode"
            subtitle="Hide sensitive content and data"
            rightElement={
              <Switch
                value={privacyModeEnabled}
                onValueChange={setPrivacyModeEnabled}
                trackColor={{ false: '#767577', true: colors.tint }}
                thumbColor={privacyModeEnabled ? '#fff' : '#f4f3f4'}
              />
            }
            showChevron={false}
          />
          <View style={styles.divider} />
          <SettingItem
            title="Dark Mode"
            subtitle="Use dark theme"
            rightElement={
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: colors.tint }}
                thumbColor={theme === 'dark' ? '#fff' : '#f4f3f4'}
              />
            }
            showChevron={false}
          />

        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsCard}>
          <SettingItem
            title="Export Data"
            subtitle="Download your journal entries"
            onPress={handleDataExport}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.settingsCard}>
          <SettingItem
            title="Help & Support"
            subtitle="Get help and contact us"
            onPress={handleHelpSupport}
          />
          <View style={styles.divider} />
          <SettingItem
            title="About"
            subtitle="App version and information"
            onPress={handleAbout}
          />
        </View>
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background === '#fff' ? '#f8f9fa' : '#1a1a1a',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  profileCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.icon,
  },
  editButton: {
    backgroundColor: colors.tint,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  settingsCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingItemText: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: 14,
    color: colors.icon,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 18,
    color: colors.icon,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background === '#fff' ? '#f0f0f0' : '#333',
    marginHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 32,
  },
}); 