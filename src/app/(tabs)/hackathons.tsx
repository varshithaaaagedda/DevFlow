import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../../components/Header';
import { HackathonCard } from '../../components/HackathonCard';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/theme';

export default function HackathonsScreen() {
  const { hackathons, isRefreshing, refreshData, toggleHackathonTask } = useApp();

  return (
    <View style={styles.container}>
      <Header title="Hackathon Companion" subtitle="Active Competitions & Submission Deadlines" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={COLORS.primary}
          />
        }
      >
        <Text style={styles.sectionHeader}>Active Hackathons ({hackathons.length})</Text>

        {hackathons.map(hackathon => (
          <HackathonCard
            key={hackathon.id}
            hackathon={hackathon}
            onToggleTask={toggleHackathonTask}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  sectionHeader: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
});
