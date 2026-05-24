import React from 'react';
import * as Lucide from 'lucide-react';

export type IconName =
  | 'plus'
  | 'trash'
  | 'edit'
  | 'save'
  | 'star'
  | 'search'
  | 'calendar'
  | 'clock'
  | 'sparkles'
  | 'sliders'
  | 'check'
  | 'check-circle'
  | 'circle'
  | 'settings'
  | 'sun'
  | 'moon'
  | 'list'
  | 'coffee'
  | 'home'
  | 'briefcase'
  | 'user';

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  variant?: 'outline' | 'solid';
  size?: number | string;
  className?: string;
}

const iconMap: Record<IconName, React.ComponentType<any>> = {
  plus: Lucide.Plus,
  trash: Lucide.Trash2,
  edit: Lucide.Edit2,
  save: Lucide.Save,
  star: Lucide.Star,
  search: Lucide.Search,
  calendar: Lucide.Calendar,
  clock: Lucide.Clock,
  sparkles: Lucide.Sparkles,
  sliders: Lucide.Sliders,
  check: Lucide.Check,
  'check-circle': Lucide.CheckCircle2,
  circle: Lucide.Circle,
  settings: Lucide.Settings,
  sun: Lucide.Sun,
  moon: Lucide.Moon,
  list: Lucide.ListTodo,
  coffee: Lucide.Coffee,
  home: Lucide.Home,
  briefcase: Lucide.Briefcase,
  user: Lucide.User,
};

export const Icon: React.FC<IconProps> = ({
  name,
  variant = 'outline',
  size = 18,
  className = '',
  ...props
}) => {
  const LucideIcon = iconMap[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" does not exist in our map.`);
    return null;
  }

  const isSolid = variant === 'solid';

  const canFill = ['star', 'check-circle', 'circle', 'calendar', 'clock', 'settings', 'sun', 'moon', 'coffee', 'home', 'briefcase', 'user'].includes(name);

  const fillValue = isSolid && canFill ? 'currentColor' : 'none';
  const strokeWidthValue = isSolid ? 2.5 : 2; // bolder outline for solid icons or default 2

  return (
    <LucideIcon
      size={size}
      className={className}
      fill={fillValue}
      strokeWidth={strokeWidthValue}
      {...props}
    />
  );
};
