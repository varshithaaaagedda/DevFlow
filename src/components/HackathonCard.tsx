import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { Hackathon } from '../types';
import { hackathonService } from '../services/HackathonService';
import { COLORS, RADIUS } from '../constants/theme';

interface HackathonCardProps {
  hackathon: Hackathon;
  onToggleTask: (hackathonId: string, taskId: string) => void;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon, onToggleTask }) => {
  const [timeLeft, setTimeLeft] = useState(
    hackathonService.getRemainingTime(hackathon.submissionDeadline)
  );
  const [showTasks, setShowTasks] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(hackathonService.getRemainingTime(hackathon.submissionDeadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [hackathon.submissionDeadline]);

  return (
    <GlassCard highlightBorder>
      <View style={styles.topRow}>
        <View style={styles.titleInfo}>
          <Text style={styles.nameText}>{hackathon.name}</Text>
          <Text style={styles.organizerText}>by {hackathon.organizer} • {hackathon.prizePool}</Text>
        </View>
        <Badge
          label={hackathon.submissionStatus.replace(/_/g, ' ').toUpperCase()}
          variant={hackathon.submissionStatus === 'submitted' ? 'success' : 'important'}
          size="sm"
        />
      </View>

      <View style={styles.countdownContainer}>
        <View style={styles.timerRow}>
          <Ionicons name="time" size={16} color={COLORS.hackathonGold} />
          <Text style={styles.countdownLabel}>Submission Deadline:</Text>
        </View>
        <View style={styles.timerDisplay}>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{timeLeft.days}</Text>
            <Text style={styles.timeSub}>DAYS</Text>
          </View>
          <Text style={styles.colon}>:</Text>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{String(timeLeft.hours).padStart(2, '0')}</Text>
            <Text style={styles.timeSub}>HOURS</Text>
          </View>
          <Text style={styles.colon}>:</Text>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
            <Text style={styles.timeSub}>MINS</Text>
          </View>
          <Text style={styles.colon}>:</Text>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
            <Text style={styles.timeSub}>SECS</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Project Progress</Text>
          <Text style={styles.progressValue}>{hackathon.progressPercentage}%</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${hackathon.progressPercentage}%` }]} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.tasksToggleHeader}
        onPress={() => setShowTasks(!showTasks)}
        activeOpacity={0.7}
      >
        <Text style={styles.tasksTitle}>
          Milestones ({hackathon.tasks.filter(t => t.completed).length}/{hackathon.tasks.length})
        </Text>
        <Ionicons
          name={showTasks ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {showTasks && (
        <View style={styles.taskList}>
          {hackathon.tasks.map(task => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => onToggleTask(hackathon.id, task.id)}
            >
              <Ionicons
                name={task.completed ? 'checkbox' : 'square-outline'}
                size={20}
                color={task.completed ? COLORS.success : COLORS.textMuted}
              />
              <Text style={[styles.taskTitleText, task.completed && styles.taskCompleted]}>
                {task.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
  },
  organizerText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  countdownContainer: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    marginBottom: 16,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  countdownLabel: {
    color: COLORS.hackathonGold,
    fontSize: 12,
    fontWeight: '700',
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timeUnit: {
    alignItems: 'center',
    backgroundColor: 'rgba(10, 14, 26, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    minWidth: 48,
  },
  timeValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  timeSub: {
    color: COLORS.textMuted,
    fontSize: 8,
    fontWeight: '800',
  },
  colon: {
    color: COLORS.hackathonGold,
    fontSize: 16,
    fontWeight: '800',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  progressValue: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  tasksToggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tasksTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  taskList: {
    gap: 8,
    marginTop: 6,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  taskTitleText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  taskCompleted: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
});
