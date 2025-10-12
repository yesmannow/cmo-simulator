import { supabase } from '@/lib/supabase/client';
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/achievements/achievements';
import { generateMockLeaderboardEntries } from '@/lib/testing/mockData';
import type { UserAchievement } from './types';

type UserAchievementInsert = Pick<
  UserAchievement,
  'user_id' | 'achievement_id' | 'leaderboard_entry_id' | 'earned_at'
>;

export class DatabaseSeeder {
  // Seed achievements table
  static async seedAchievements(): Promise<void> {
    try {
      console.log('Seeding achievements...');
      
      const { error } = await supabase
        .from('achievements')
        .upsert(ACHIEVEMENT_DEFINITIONS, { 
          onConflict: 'name',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      
      console.log(`✅ Seeded ${ACHIEVEMENT_DEFINITIONS.length} achievements`);
    } catch (error) {
      console.error('❌ Error seeding achievements:', error);
      throw error;
    }
  }

  // Seed sample users
  static async seedUsers(): Promise<string[]> {
    try {
      console.log('Seeding sample users...');
      
      const sampleUsers = [
        {
          username: 'MarketingMaven',
          email: 'maven@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maven'
        },
        {
          username: 'StrategyKing',
          email: 'king@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=king'
        },
        {
          username: 'CMOExpert',
          email: 'expert@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert'
        },
        {
          username: 'GrowthHacker',
          email: 'growth@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=growth'
        },
        {
          username: 'BrandBuilder',
          email: 'brand@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=brand'
        },
        {
          username: 'DataDriven',
          email: 'data@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=data'
        },
        {
          username: 'CreativeGenius',
          email: 'creative@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creative'
        },
        {
          username: 'ROIMaster',
          email: 'roi@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=roi'
        },
        {
          username: 'InnovationLead',
          email: 'innovation@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=innovation'
        },
        {
          username: 'MarketLeader',
          email: 'leader@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leader'
        }
      ];

      const { data, error } = await supabase
        .from('users')
        .upsert(sampleUsers, { 
          onConflict: 'username',
          ignoreDuplicates: false 
        })
        .select('id');

      if (error) throw error;
      
      const userIds = data?.map(user => user.id) || [];
      console.log(`✅ Seeded ${userIds.length} sample users`);
      
      return userIds;
    } catch (error) {
      console.error('❌ Error seeding users:', error);
      throw error;
    }
  }

  // Seed leaderboard entries
  static async seedLeaderboard(userIds?: string[]): Promise<void> {
    try {
      console.log('Seeding leaderboard entries...');
      
      // If no userIds provided, get existing users
      if (!userIds || userIds.length === 0) {
        const { data: users, error } = await supabase
          .from('users')
          .select('id, username')
          .limit(10);
        
        if (error) throw error;
        userIds = users?.map(u => u.id) || [];
      }

      if (userIds.length === 0) {
        throw new Error('No users found. Please seed users first.');
      }

      const mockEntries = generateMockLeaderboardEntries(userIds.length);
      
      // Assign user IDs to mock entries
      const leaderboardEntries = mockEntries.map((entry, index) => ({
        ...entry,
        user_id: userIds[index % userIds.length],
      }));

      const { error } = await supabase
        .from('leaderboard_entries')
        .upsert(leaderboardEntries, { 
          onConflict: 'user_id,season',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      
      console.log(`✅ Seeded ${leaderboardEntries.length} leaderboard entries`);
    } catch (error) {
      console.error('❌ Error seeding leaderboard:', error);
      throw error;
    }
  }

  // Seed user achievements
  static async seedUserAchievements(): Promise<void> {
    try {
      console.log('Seeding user achievements...');
      
      // Get users and achievements
      const [usersResult, achievementsResult, leaderboardResult] = await Promise.all([
        supabase.from('users').select('id').limit(10),
        supabase.from('achievements').select('id, rarity'),
        supabase.from('leaderboard_entries').select('id, user_id')
      ]);

      if (usersResult.error) throw usersResult.error;
      if (achievementsResult.error) throw achievementsResult.error;
      if (leaderboardResult.error) throw leaderboardResult.error;

      const users = usersResult.data || [];
      const achievements = achievementsResult.data || [];
      const leaderboardEntries = leaderboardResult.data || [];

      const userAchievements: UserAchievementInsert[] = [];

      // Randomly assign achievements to users
      users.forEach(user => {
        const userLeaderboardEntry = leaderboardEntries.find(entry => entry.user_id === user.id);
        if (!userLeaderboardEntry) return;

        // Each user gets 2-8 random achievements
        const numAchievements = Math.floor(Math.random() * 7) + 2;
        const shuffledAchievements = [...achievements].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < Math.min(numAchievements, achievements.length); i++) {
          const achievement = shuffledAchievements[i];
          
          // Higher chance for common achievements, lower for legendary
          const rarityChance = {
            common: 0.8,
            rare: 0.5,
            epic: 0.3,
            legendary: 0.1
          };
          
          if (Math.random() < rarityChance[achievement.rarity as keyof typeof rarityChance]) {
            userAchievements.push({
              user_id: user.id,
              achievement_id: achievement.id,
              leaderboard_entry_id: userLeaderboardEntry.id,
              earned_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
            });
          }
        }
      });

      if (userAchievements.length > 0) {
        const { error } = await supabase
          .from('user_achievements')
          .upsert(userAchievements, { 
            onConflict: 'user_id,achievement_id,leaderboard_entry_id',
            ignoreDuplicates: true 
          });

        if (error) throw error;
      }
      
      console.log(`✅ Seeded ${userAchievements.length} user achievements`);
    } catch (error) {
      console.error('❌ Error seeding user achievements:', error);
      throw error;
    }
  }

  // Seed all data
  static async seedAll(): Promise<void> {
    try {
      console.log('🌱 Starting database seeding...');
      
      // Seed in order due to dependencies
      await this.seedAchievements();
      const userIds = await this.seedUsers();
      await this.seedLeaderboard(userIds);
      await this.seedUserAchievements();
      
      console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
      console.error('💥 Database seeding failed:', error);
      throw error;
    }
  }

  // Clear all seeded data (for testing)
  static async clearAll(): Promise<void> {
    try {
      console.log('🧹 Clearing seeded data...');
      
      await Promise.all([
        supabase.from('user_achievements').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('leaderboard_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('achievements').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      ]);
      
      console.log('✅ Cleared all seeded data');
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      throw error;
    }
  }
}

// CLI-style seeding script
export async function runSeeder() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  try {
    switch (command) {
      case 'achievements':
        await DatabaseSeeder.seedAchievements();
        break;
      case 'users':
        await DatabaseSeeder.seedUsers();
        break;
      case 'leaderboard':
        await DatabaseSeeder.seedLeaderboard();
        break;
      case 'user-achievements':
        await DatabaseSeeder.seedUserAchievements();
        break;
      case 'clear':
        await DatabaseSeeder.clearAll();
        break;
      case 'all':
      default:
        await DatabaseSeeder.seedAll();
        break;
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Export for use in development
if (typeof window === 'undefined' && require.main === module) {
  runSeeder();
}
