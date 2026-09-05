import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, AlertCircle, Loader, Compass, FileSearch } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { LoadingState, SkeletonHero, SkeletonCard, SkeletonList } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';

export default function UIStatesShowcaseScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'404' | 'error' | 'loading' | 'empty'>('404');

  return (
    <>
      <Stack.Screen options={{ title: 'UI States Showcase', headerShown: false }} />
      <SafeAreaView style={styles.container}>
        {/* Navigation Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace('/(tabs)' as any)}
          >
            <ArrowLeft size={20} color={Colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.topTitle}>UI States & Handlers</Text>
            <Text style={styles.topSubtitle}>Interactive preview of application states</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === '404' && styles.activeTabItem]}
            onPress={() => setActiveTab('404')}
          >
            <Compass size={16} color={activeTab === '404' ? Colors.white : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === '404' && styles.activeTabText]}>
              404 Page
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'error' && styles.activeTabItem]}
            onPress={() => setActiveTab('error')}
          >
            <AlertCircle size={16} color={activeTab === 'error' ? Colors.white : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'error' && styles.activeTabText]}>
              Error Page
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'loading' && styles.activeTabItem]}
            onPress={() => setActiveTab('loading')}
          >
            <Loader size={16} color={activeTab === 'loading' ? Colors.white : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'loading' && styles.activeTabText]}>
              Loading
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'empty' && styles.activeTabItem]}
            onPress={() => setActiveTab('empty')}
          >
            <FileSearch size={16} color={activeTab === 'empty' ? Colors.white : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'empty' && styles.activeTabText]}>
              Empty
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Display */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === '404' && (
            <View style={styles.previewContainer}>
              <Text style={styles.sectionHeader}>404 Not Found Screen Preview</Text>
              <TouchableOpacity
                style={styles.launchFullBtn}
                onPress={() => router.push('/not-found' as any)}
              >
                <Text style={styles.launchFullBtnText}>Open Dedicated 404 Route →</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'error' && (
            <View style={styles.previewContainer}>
              <Text style={styles.sectionHeader}>Error State Component Preview</Text>
              <ErrorState
                title="Failed to Load Legal Database"
                message="We were unable to establish a secure connection to the Supabase legal server."
                errorDetails="FetchError: Network connection timeout after 5000ms at Supabase.query()"
                onRetry={() => alert('Retrying connection...')}
              />
            </View>
          )}

          {activeTab === 'loading' && (
            <View style={styles.previewContainer}>
              <Text style={styles.sectionHeader}>Skeleton Hero Loader</Text>
              <SkeletonHero />

              <Text style={styles.sectionHeader}>Skeleton Card Loader</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                <SkeletonCard />
                <SkeletonCard />
              </ScrollView>

              <Text style={styles.sectionHeader}>Skeleton List Loader</Text>
              <SkeletonList count={3} />

              <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Full-Screen Spinner</Text>
              <LoadingState message="Fetching updated Nigerian tenancy statutes..." />
            </View>
          )}

          {activeTab === 'empty' && (
            <View style={styles.previewContainer}>
              <Text style={styles.sectionHeader}>Search Empty State</Text>
              <EmptyState
                icon="search"
                title="No Legal Guides Found"
                description="We couldn't find any documents matching your search filter. Try using broader keywords like 'police' or 'landlord'."
                actionLabel="Reset Search"
                onAction={() => alert('Search reset')}
              />

              <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Bookmarks Empty State</Text>
              <EmptyState
                icon="compass"
                title="Your Library is Empty"
                description="Save key legal rights guides to read offline anytime."
                actionLabel="Explore Rights Library"
                onAction={() => router.push('/(tabs)/library' as any)}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  topSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  tabBar: {
    flexDirection: 'row',
    padding: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardWhite,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeTabItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.white,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  previewContainer: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  launchFullBtn: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  launchFullBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
