import React from 'react';
import { Search, Bookmark, Moon, Sun, Terminal, ShieldAlert } from 'lucide-react';
import { ThemeMode } from '../types';

interface TechTopBarProps {
  onSelectCategory: (category: string | null) => void;
  activeCategory: string | null;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onGoHome: () => void;
  onOpenAdmin: () => void;
  isAdminView: boolean;
}

export const TechTopBar: React.FC<TechTopBarProps> = ({
  onSelectCategory,
  activeCategory,
  onOpenSearch,
  onOpenBookmarks,
  bookmarksCount,
  themeMode,
  onToggleTheme,
  onGoHome,
  onOpenAdmin,
  isAdminView,
}) => {
  const categories = [
    { label: 'Tất cả bài viết', value: null },
    { label: 'AI & Machine Learning', value: 'AI & Machine Learning' },
    { label: 'Hệ thống Phân tán', value: 'Distributed Systems' },
    { label: 'Cloud & DevSecOps', value: 'DevSecOps & Cloud' },
    { label: 'Kỹ thuật Phần mềm', value: 'Software Architecture' },
    { label: 'Bán dẫn & Hardware', value: 'Semiconductors & Hardware' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 bg-[#0B0F17]/90 border-slate-800 dark:bg-[#0B0F17]/90 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors cursor-pointer text-left font-mono"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
            <span>NEXUS // TECH</span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-medium">
          {categories.map((item) => {
            const isActive = activeCategory === item.value;
            return (
              <button
                key={item.label}
                onClick={() => onSelectCategory(item.value)}
                className={`transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-md transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            aria-label="Tìm kiếm bài viết"
            title="Tìm kiếm (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="p-2 relative text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-md transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            aria-label="Bài viết đã lưu"
            title="Bài viết đã lưu"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarksCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.9)]" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-md transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            aria-label="Đổi giao diện"
            title={themeMode === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin Console Switcher */}
          <button
            onClick={onOpenAdmin}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium rounded-md transition-all cursor-pointer whitespace-nowrap border ${
              isAdminView
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-cyan-500/60 hover:text-cyan-300'
            }`}
            title="Trang quản trị bài viết"
          >
            {isAdminView ? <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> : <Terminal className="w-3.5 h-3.5" />}
            <span>{isAdminView ? 'Bảng Quản Trị' : 'Quản Trị Web'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
