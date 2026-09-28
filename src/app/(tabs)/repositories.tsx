import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { RepoCard } from '../../components/RepoCard';
import { PRCard } from '../../components/PRCard';
import { AIExplainModal } from '../../components/AIExplainModal';
import { useApp } from '../../context/AppContext';
import { COLORS, RADIUS } from '../../constants/theme';
import { PullRequest, Repository } from '../../types';

export default function RepositoriesScreen() {
  const { repositories, pullRequests, subscription, isRefreshing, refreshData, explainPRWithAI } = useApp();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'repos' | 'prs'>('repos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const isPro = subscription?.isPro ?? false;
  // Free users are capped at 1 repo
  const visibleRepos = isPro ? repositories : repositories.slice(0, 1);

  const filteredRepos = visibleRepos.filter(
    r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPRs = pullRequests.filter(
    p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAIExplain = async (pr: PullRequest) => {
    setSelectedPR(pr);
    setIsExplaining(true);
    const text = await explainPRWithAI(pr);
    setExplanation(text);
    setIsExplaining(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Repositories & PRs" subtitle="GitHub Monitored Projects" />

      <View style={styles.topControls}>
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="Search repositories, PRs, languages..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'repos' && styles.activeTabButton]}
            onPress={() => setActiveTab('repos')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'repos' && styles.activeTabText]}>
              Repositories ({visibleRepos.length}{!isPro ? '/1 Free' : ''})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'prs' && styles.activeTabButton]}
            onPress={() => setActiveTab('prs')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'prs' && styles.activeTabText]}>
              Pull Requests ({pullRequests.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
        {!isPro && activeTab === 'repos' && repositories.length > 1 && (
          <TouchableOpacity
            style={styles.proLimitBanner}
            onPress={() => router.push('/subscription')}
            activeOpacity={0.8}
          >
            <View style={styles.proLimitHeader}>
              <Ionicons name="lock-closed" size={16} color={COLORS.hackathonGold} />
              <Text style={styles.proLimitTitle}>Free Plan Repo Limit (1 Monitored Repo)</Text>
            </View>
            <Text style={styles.proLimitSub}>
              Upgrade to DevFlow Pro to monitor all {repositories.length} repositories with automated AI summaries.
            </Text>
          </TouchableOpacity>
        )}

        {activeTab === 'repos' ? (
          filteredRepos.length > 0 ? (
            filteredRepos.map(repo => <RepoCard key={repo.id} repo={repo} />)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="git-branch" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Repositories Found</Text>
              <Text style={styles.emptySub}>Try adjusting your search query</Text>
            </View>
          )
        ) : filteredPRs.length > 0 ? (
          filteredPRs.map(pr => <PRCard key={pr.id} pr={pr} onAIExplain={handleAIExplain} />)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="git-pull-request" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Pull Requests Found</Text>
            <Text style={styles.emptySub}>No open pull requests matching your search</Text>
          </View>
        )}
      </ScrollView>

      {/* AI Explain Modal */}
      <AIExplainModal
        visible={!!selectedPR}
        pr={selectedPR}
        explanationText={explanation}
        isLoading={isExplaining}
        onClose={() => {
          setSelectedPR(null);
          setExplanation(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topControls: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.md,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  activeTabButton: {
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  tabButtonText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  proLimitBanner: {
    backgroundColor: '#1E1B4B',
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    marginBottom: 12,
  },
  proLimitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  proLimitTitle: {
    color: COLORS.hackathonGold,
    fontSize: 13,
    fontWeight: '800',
  },
  proLimitSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
