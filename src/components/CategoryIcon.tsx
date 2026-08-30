import React from 'react';
import {
  BookOpen,
  Footprints,
  Droplets,
  Dumbbell,
  Wallet,
  Flame,
  Sparkles,
  Target,
  Music,
  Coffee,
  Heart,
  Layers,
  CheckCircle,
  Clock,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export const ICON_OPTIONS = [
  { name: 'BookOpen', label: 'Books', icon: BookOpen },
  { name: 'Footprints', label: 'Steps / Walk', icon: Footprints },
  { name: 'Droplets', label: 'Hydration', icon: Droplets },
  { name: 'Dumbbell', label: 'Fitness', icon: Dumbbell },
  { name: 'Wallet', label: 'Finance / Savings', icon: Wallet },
  { name: 'Flame', label: 'Habits / Streaks', icon: Flame },
  { name: 'Target', label: 'Goals', icon: Target },
  { name: 'Coffee', label: 'Lifestyle', icon: Coffee },
  { name: 'Heart', label: 'Health', icon: Heart },
  { name: 'Music', label: 'Art & Music', icon: Music },
  { name: 'Clock', label: 'Time Tracking', icon: Clock },
  { name: 'Briefcase', label: 'Work', icon: Briefcase },
  { name: 'GraduationCap', label: 'Study', icon: GraduationCap },
  { name: 'Layers', label: 'General', icon: Layers },
];

export const COLOR_OPTIONS = [
  { name: 'Instagram Pink', value: '#E1306C' },
  { name: 'Sunset Orange', value: '#F56040' },
  { name: 'Golden Yellow', value: '#FCAF45' },
  { name: 'Vibrant Purple', value: '#833AB4' },
  { name: 'Ocean Blue', value: '#3897F0' },
  { name: 'Emerald Green', value: '#10B981' },
  { name: 'Indigo Night', value: '#6366F1' },
  { name: 'Rose Red', value: '#EF4444' },
];

interface CategoryIconProps {
  iconName?: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName = 'Layers', className = 'w-5 h-5' }) => {
  switch (iconName) {
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Footprints':
      return <Footprints className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Dumbbell':
      return <Dumbbell className={className} />;
    case 'Wallet':
      return <Wallet className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'CheckCircle':
      return <CheckCircle className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <Layers className={className} />;
  }
};
