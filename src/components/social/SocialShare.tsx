'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Linkedin, Facebook, Copy, Download, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/lib/database/types';

interface SocialShareProps {
  entry: LeaderboardEntry;
  rank?: number;
  onClose?: () => void;
}

export function SocialShare({ entry, rank, onClose }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const shareText = `🎯 Just achieved a ${entry.grade} grade in CMO Simulator!\n\n📊 Final Score: ${entry.final_score.toLocaleString()}\n💰 Revenue: $${entry.revenue?.toLocaleString() || 'N/A'}\n📈 Market Share: ${entry.market_share}%\n🏢 Company: ${entry.company_name}\n🎯 Strategy: ${entry.strategy_type}\n\n${rank ? `🏆 Ranked #${rank} on the leaderboard!` : '🚀 Ready to take on the competition!'}\n\n#CMOSimulator #MarketingStrategy #BusinessSimulation`;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/leaderboard' : '';

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const handleDownloadImage = async () => {
    setIsGeneratingImage(true);
    try {
      // Generate a shareable image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 600;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CMO Simulator Achievement', canvas.width / 2, 80);

      // Company and Grade
      ctx.font = 'bold 36px Arial';
      ctx.fillText(`${entry.company_name} - Grade ${entry.grade}`, canvas.width / 2, 140);

      // Stats
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      const stats = [
        `Final Score: ${entry.final_score.toLocaleString()}`,
        `ROI: ${entry.roi}%`,
        `Market Share: ${entry.market_share}%`,
        `Customer Satisfaction: ${entry.customer_satisfaction}%`,
        `Brand Awareness: ${entry.brand_awareness}%`,
        `Strategy: ${entry.strategy_type}`,
        `Industry: ${entry.industry}`
      ];

      let yPos = 220;
      stats.forEach(stat => {
        ctx.fillText(stat, 50, yPos);
        yPos += 40;
      });

      // Rank if available
      if (rank) {
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`🏆 Leaderboard Rank: #${rank}`, canvas.width / 2, 520);
      }

      // Website
      ctx.font = '20px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Play at: CMO-Simulator.com', canvas.width / 2, 560);

      // Download
      const link = document.createElement('a');
      link.download = `cmo-simulator-${entry.company_name}-${entry.grade}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-lg bg-card/95 backdrop-blur-sm border-2"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Share2 className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Share Your Achievement</h2>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>

          {/* Achievement Preview */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge className={`${getGradeColor(entry.grade)} text-white`}>
                  Grade {entry.grade}
                </Badge>
                {rank && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Rank #{rank}
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-primary">
                {entry.final_score.toLocaleString()}
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{entry.company_name}</h3>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ROI: {entry.roi}%
              </div>
              <div>Market Share: {entry.market_share}%</div>
              <div>Strategy: {entry.strategy_type}</div>
              <div>Industry: {entry.industry}</div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-[#1DA1F2]"
                onClick={() => handleSocialShare('twitter')}
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#0077B5]/90 text-white border-[#0077B5]"
                onClick={() => handleSocialShare('linkedin')}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-[#1877F2]"
                onClick={() => handleSocialShare('facebook')}
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleCopyToClipboard}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDownloadImage}
                disabled={isGeneratingImage}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isGeneratingImage ? 'Generating...' : 'Download Image'}
              </Button>
            </div>
          </div>

          {/* Preview Text */}
          <div className="mt-4 p-3 bg-muted/30 rounded text-sm text-muted-foreground border">
            <div className="font-medium mb-1">Preview:</div>
            <div className="whitespace-pre-line text-xs">
              {shareText.substring(0, 200)}...
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Hook for easy social sharing integration
export function useSocialShare() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareEntry, setShareEntry] = useState<LeaderboardEntry | null>(null);
  const [shareRank, setShareRank] = useState<number | undefined>();

  const openShare = (entry: LeaderboardEntry, rank?: number) => {
    setShareEntry(entry);
    setShareRank(rank);
    setIsSharing(true);
  };

  const closeShare = () => {
    setIsSharing(false);
    setShareEntry(null);
    setShareRank(undefined);
  };

  return {
    isSharing,
    shareEntry,
    shareRank,
    openShare,
    closeShare
  };
}
