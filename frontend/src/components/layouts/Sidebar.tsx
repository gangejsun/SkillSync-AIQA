'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ActivitySquare,
  Brain,
  Briefcase,
  Award,
  FileText,
  User,
  Settings,
  Building2,
  ClipboardList,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    name: '대시보드',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'AI 사용량 추적',
    href: '/ai-usage',
    icon: ActivitySquare,
  },
  {
    name: 'AIQ 성격 분석',
    href: '/aiq-assessment',
    icon: Brain,
  },
  {
    name: '스킬 퀴즈',
    href: '/challenges',
    icon: ClipboardList,
  },
  {
    name: '배지 & 인증서',
    href: '/badges',
    icon: Award,
  },
  {
    name: '잡 매칭',
    href: '/jobs',
    icon: Briefcase,
    badge: '준비중',
    disabled: true,
  },
  {
    name: '팀 리포트',
    href: '/reports',
    icon: FileText,
    badge: '준비중',
    disabled: true,
  },
];

const companyNavItems: NavItem[] = [
  {
    name: '회사 대시보드',
    href: '/company/dashboard',
    icon: Building2,
  },
  {
    name: '맞춤 평가 관리',
    href: '/company/assessments',
    icon: ClipboardList,
  },
  {
    name: '지원자 통계',
    href: '/company/analytics',
    icon: BarChart3,
    badge: '준비중',
    disabled: true,
  },
  {
    name: 'API 사용량',
    href: '/company/billing',
    icon: DollarSign,
    badge: '준비중',
    disabled: true,
  },
];

const bottomNavItems: NavItem[] = [
  {
    name: '프로필',
    href: '/profile',
    icon: User,
  },
  {
    name: '설정',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  // In production, this would come from user state/context
  // For now, check if current path is under /company to show company menu
  const isCompanyMode = pathname.startsWith('/company');

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SkillSync</span>
          </Link>
        </div>

        {/* Role Switcher */}
        <div className="border-b border-gray-200 px-3 py-4">
          <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1">
            <Link
              href="/dashboard"
              className={`flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                !isCompanyMode
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              개인
            </Link>
            <Link
              href="/company/assessments"
              className={`flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors ${
                isCompanyMode
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              기업
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {/* Show company menu if in company mode, otherwise show regular menu */}
          {(isCompanyMode ? companyNavItems : navItems).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={`
                  group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${active
                    ? 'bg-indigo-50 text-indigo-600'
                    : item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${active ? 'text-indigo-600' : ''}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 p-3">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${active
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-indigo-600' : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
