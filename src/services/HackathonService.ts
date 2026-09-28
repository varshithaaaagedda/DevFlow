import { Hackathon } from '../types';
import { MOCK_HACKATHONS } from '../constants/mockData';

export interface IHackathonService {
  getHackathons(): Promise<Hackathon[]>;
  getHackathonById(id: string): Promise<Hackathon | null>;
  toggleTask(hackathonId: string, taskId: string): Promise<Hackathon>;
  getRemainingTime(deadlineIso: string): { days: number; hours: number; minutes: number; seconds: number; formatted: string };
}

export class HackathonService implements IHackathonService {
  private static instance: HackathonService;
  private hackathons: Hackathon[] = [...MOCK_HACKATHONS];

  public static getInstance(): HackathonService {
    if (!HackathonService.instance) {
      HackathonService.instance = new HackathonService();
    }
    return HackathonService.instance;
  }

  async getHackathons(): Promise<Hackathon[]> {
    await new Promise(res => setTimeout(res, 200));
    return [...this.hackathons];
  }

  async getHackathonById(id: string): Promise<Hackathon | null> {
    const hack = this.hackathons.find(h => h.id === id);
    return hack || null;
  }

  async toggleTask(hackathonId: string, taskId: string): Promise<Hackathon> {
    this.hackathons = this.hackathons.map(h => {
      if (h.id !== hackathonId) return h;
      
      const updatedTasks = h.tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const totalCount = updatedTasks.length;
      const newProgress = Math.round((completedCount / totalCount) * 100);

      return {
        ...h,
        tasks: updatedTasks,
        progressPercentage: newProgress,
      };
    });

    const updated = this.hackathons.find(h => h.id === hackathonId);
    return updated!;
  }

  getRemainingTime(deadlineIso: string) {
    const totalMs = new Date(deadlineIso).getTime() - Date.now();
    if (totalMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, formatted: 'Deadline Passed' };
    }

    const seconds = Math.floor((totalMs / 1000) % 60);
    const minutes = Math.floor((totalMs / 1000 / 60) % 60);
    const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

    return {
      days,
      hours,
      minutes,
      seconds,
      formatted: `${days}d ${hours}h ${minutes}m remaining`,
    };
  }
}

export const hackathonService = HackathonService.getInstance();
