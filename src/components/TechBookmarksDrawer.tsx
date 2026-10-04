import React from 'react';
import { Post } from '../types';
import { X, Trash2, ArrowRight, Bookmark, Terminal } from 'lucide-react';

interface TechBookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: string[];
  allPosts: Post[];
  onReadPost: (post: Post) => void;
  onRemoveBookmark: (postId: string) => void;
  onClearAll: () => void;
}

export const TechBookmarksDrawer: React.FC<TechBookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  allPosts,
  onReadPost,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const bookmarkedPosts = allPosts.filter((p) => bookmarks.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-md h-full bg-[#0B0F17] border-l border-slate-800 shadow-2xl flex flex-col text-slate-200 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Danh Sách Đã Lưu
            </h3>
            <span className="text-xs text-cyan-400">({bookmarkedPosts.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 divide-y divide-slate-800/80">
          {bookmarkedPosts.length === 0 ? (
            <div className="py-20 text-center text-slate-500 space-y-2 text-xs">
              <Terminal className="w-8 h-8 mx-auto text-slate-700" />
              <p className="text-sm font-sans text-slate-300">Chưa có bài viết nào được lưu.</p>
              <p>Nhấp vào biểu tượng bookmark ở bất kỳ bài viết nào để lưu đọc lại.</p>
            </div>
          ) : (
            bookmarkedPosts.map((post) => (
              <div key={post.id} className="py-4 flex items-start justify-between gap-3 group">
                <div
                  className="flex-1 cursor-pointer space-y-1"
                  onClick={() => {
                    onReadPost(post);
                    onClose();
                  }}
                >
                  <span className="text-[10px] uppercase font-bold text-cyan-400">
                    {post.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-sans font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{post.author.name}</span>
                    <span>·</span>
                    <span>{post.readTimeMinutes} min</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    onClick={() => {
                      onReadPost(post);
                      onClose();
                    }}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 cursor-pointer"
                    title="Đọc ngay"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(post.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 cursor-pointer"
                    title="Xóa khỏi danh sách"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookmarkedPosts.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <button
              onClick={onClearAll}
              className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              Xóa toàn bộ
            </button>
            <span className="text-slate-600 text-[11px]">NEXUS Memory Cache</span>
          </div>
        )}

      </div>
    </div>
  );
};
