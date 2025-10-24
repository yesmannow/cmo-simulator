'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { Channel } from '@/types/engine';

export default function EngineDemoPage() {
  const [spend, setSpend] = useState(50000);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const simulationState = useGameStore(state => state.simulationState);
  const channelBudgets = useGameStore(state => state.channelBudgets);
  const setBudget = useGameStore(state => state.setBudget);
  const advanceTick = useGameStore(state => state.advanceTick);
  const reset = useGameStore(state => state.reset);

  // Achievement system
  const [achievements, setAchievements] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const handleAdvanceTick = () => {
    // Convert channelBudgets to PlayerInput format
    const playerInputs = {
      channelBudgets: channelBudgets as Record<Channel, number>,
      promotions: []
    };

    const marketConditions = {
      seasonalityIndex: 1.0 + Math.sin(Date.now() * 0.001) * 0.3, // Dynamic seasonality
      competitorSpend: {
        tv: 50000, radio: 30000, print: 20000, digital: 80000, social: 40000, seo: 20000, events: 10000, pr: 15000
      } as Record<Channel, number>,
      economicIndex: 0.9 + Math.random() * 0.2 // Random economic conditions
    };

    advanceTick(playerInputs, marketConditions);
    setAnimationTrigger(prev => prev + 1);

    // Check for achievements
    const newAchievements = [];
    if (simulationState.results.totalSales > 500000) {
      newAchievements.push('Revenue Champion! 🎉');
      setScore(prev => prev + 100);
    }
    if (Object.values(channelBudgets).some(b => b > 100000)) {
      newAchievements.push('Big Spender! 💰');
      setScore(prev => prev + 50);
    }
    if (simulationState.results.incrementalSales > simulationState.results.baseSales) {
      newAchievements.push('Marketing Master! 📈');
      setScore(prev => prev + 75);
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  // Real-time calculation preview
  const [previewRevenue, setPreviewRevenue] = useState(0);

  useEffect(() => {
    // Simple preview calculation
    const totalSpend = Object.values(channelBudgets).reduce((sum, budget) => sum + budget, 0);
    const estimatedRevenue = totalSpend * 0.1 * (0.8 + Math.random() * 0.4); // Rough estimate
    setPreviewRevenue(estimatedRevenue);
  }, [channelBudgets]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header with Score */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="text-4xl">🎮</div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interactive Marketing Engine
            </h1>
            <p className="text-gray-600">Watch your decisions come to life in real-time!</p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 mb-6">
          <div className="bg-white px-4 py-2 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600">${simulationState.results.totalSales.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-purple-600">{simulationState.tick}</div>
            <div className="text-xs text-gray-500">Simulation Day</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="text-yellow-400 text-xl">🏆</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Achievements Unlocked!</h3>
              <div className="mt-1 text-sm text-yellow-700">
                {achievements.map((achievement, index) => (
                  <div key={index} className="animate-bounce">{achievement}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Budget Controls */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🎛️</span>
            Channel Budget Controls
          </h2>

          {/* Revenue Preview */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700 mb-1">Revenue Preview</div>
              <div className="text-3xl font-bold text-green-600 animate-pulse">
                ${previewRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">Estimated from current budget allocation</div>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(channelBudgets).map(([channel, budget]) => (
              <div key={channel} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {channel === 'tv' ? '📺' :
                       channel === 'digital' ? '💻' :
                       channel === 'social' ? '📱' :
                       channel === 'seo' ? '🔍' :
                       channel === 'radio' ? '📻' :
                       channel === 'print' ? '📰' :
                       channel === 'events' ? '🎪' : '📢'}
                    </span>
                    <span className="font-medium capitalize">{channel.replace('-', ' ')}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">${budget.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {simulationState.results.channelRoi[channel as Channel]?.toFixed(1)}% ROI
                    </div>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={budget}
                  onChange={(e) => setBudget(channel, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />

                {/* Visual feedback */}
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span>
                  <span className="font-medium">${(budget/1000).toFixed(0)}K</span>
                  <span>$200K</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAdvanceTick}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Advance Day
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Live Results Dashboard */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Live Results Dashboard
          </h2>

          {/* Animated Revenue Chart */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Revenue Breakdown</span>
              <span className="text-sm text-gray-500">Animated updates</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Base Sales</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 bg-blue-200 rounded transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min((simulationState.results.baseSales / simulationState.results.totalSales) * 100, 100)}%`,
                      minWidth: '20px'
                    }}
                  ></div>
                  <span className="font-bold text-blue-600 min-w-[80px] text-right">
                    ${simulationState.results.baseSales.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Incremental Sales</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 bg-green-400 rounded transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min((simulationState.results.incrementalSales / simulationState.results.totalSales) * 100, 100)}%`,
                      minWidth: '20px'
                    }}
                  ></div>
                  <span className="font-bold text-green-600 min-w-[80px] text-right">
                    ${simulationState.results.incrementalSales.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Channel Performance */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Channel Performance</h3>
            <div className="space-y-2">
              {Object.entries(simulationState.results.channelContributions)
                .filter(([_, contribution]) => contribution > 0)
                .sort(([,a], [,b]) => b - a)
                .map(([channel, contribution]) => (
                  <div key={channel} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="capitalize text-sm">{channel.replace('-', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min((contribution / simulationState.results.incrementalSales) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                      <span className="font-bold text-sm min-w-[60px] text-right">
                        ${contribution.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs font-medium text-gray-600">Efficiency</div>
              <div className="text-lg font-bold text-orange-600">
                {((simulationState.results.incrementalSales / Object.values(channelBudgets).reduce((sum, b) => sum + b, 1)) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs font-medium text-gray-600">Best Channel</div>
              <div className="text-sm font-bold text-purple-600 capitalize">
                {Object.entries(simulationState.results.channelContributions)
                  .reduce((best, [channel, contrib]) =>
                    contrib > (simulationState.results.channelContributions[best] || 0) ? channel : best,
                    Object.keys(simulationState.results.channelContributions)[0]
                  )?.replace('-', ' ') || 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adstock Visualization */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          Adstock Memory Effect
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(simulationState.adstock).map(([channel, level]) => (
            <div key={channel} className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-lg font-medium capitalize mb-1">{channel.replace('-', ' ')}</div>
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                ${level.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Advertising Memory</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-indigo-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((level / 200000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          💡 Adstock shows how advertising effects persist over time, creating cumulative impact!
        </p>
      </div>

      {/* Tips and Learning */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span>💡</span>
          Marketing Insights
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Adstock Effect:</strong> Marketing spend creates lasting awareness that compounds over time.
          </div>
          <div>
            <strong>Channel Synergy:</strong> Different channels work better together than alone.
          </div>
          <div>
            <strong>Saturation:</strong> Each channel has limits - too much spend yields diminishing returns.
          </div>
          <div>
            <strong>Seasonality:</strong> Market conditions change over time, affecting performance.
          </div>
        </div>
      </div>
    </div>
  );
}
