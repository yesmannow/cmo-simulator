import { NextRequest, NextResponse } from 'next/server';
import { DatabaseSeeder } from '@/lib/database/seedData';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'seed-all':
        await DatabaseSeeder.seedAll();
        return NextResponse.json({ 
          success: true, 
          message: 'Database seeded successfully' 
        });

      case 'seed-achievements':
        await DatabaseSeeder.seedAchievements();
        return NextResponse.json({ 
          success: true, 
          message: 'Achievements seeded successfully' 
        });

      case 'seed-users':
        const userIds = await DatabaseSeeder.seedUsers();
        return NextResponse.json({ 
          success: true, 
          message: 'Users seeded successfully',
          data: { userIds }
        });

      case 'seed-leaderboard':
        await DatabaseSeeder.seedLeaderboard();
        return NextResponse.json({ 
          success: true, 
          message: 'Leaderboard seeded successfully' 
        });

      case 'seed-user-achievements':
        await DatabaseSeeder.seedUserAchievements();
        return NextResponse.json({ 
          success: true, 
          message: 'User achievements seeded successfully' 
        });

      case 'clear-all':
        await DatabaseSeeder.clearAll();
        return NextResponse.json({ 
          success: true, 
          message: 'Database cleared successfully' 
        });

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Database seeding error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database operation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database seeding API',
    actions: [
      'seed-all',
      'seed-achievements', 
      'seed-users',
      'seed-leaderboard',
      'seed-user-achievements',
      'clear-all'
    ]
  });
}
