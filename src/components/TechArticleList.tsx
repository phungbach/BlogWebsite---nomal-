import React, { useState } from 'react';
import { Post } from '../types';
import { Bookmark, Clock, ArrowUpRight, Flame, Calendar, SlidersHorizontal, Terminal } from 'lucide-react';

interface TechArticleListProps {
  posts: Post[];
  onReadPost: (post: Post) => void;
  bookmarks: string[];
  onToggleBookmark: (postId: string) => void;
  activeCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

export const TechArticleList: React.FC<TechArticleListProps> = ({
  posts,
  onReadPost,
  bookmarks,
  onToggleBookmark,
  activeCategory,
  onSelectCategory,
}) => {
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'length'>('latest');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = [
    'Tất cả chuyên mục',
    'AI & Machine Learning',
    'Distributed Systems',
    'DevSecOps & Cloud',
    'Software Architecture',
    'Semiconductors & Hardware',
  ];

  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (post.status !== 'published') return false;
    if (activeCategory && post.category !== activeCategory) return false;
    if (selectedTag && !post.tags.includes(selectedTag)) return false;
    return true;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'popular') return b.views - a.views;
    if (sortBy === 'length') return b.readTimeMinutes - a.readTimeMinutes;
    return 0;
  });

  return (
    <section className="py-12 border-b border-slate-800">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Kho Dữ Liệu Kỹ Thuật</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-white mt-1">
            Danh Mục Tài Liệu Kỹ Thuật
          </h2>
        </div>

        {/* Sorting Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          <button
            onClick={() => setSortBy('latest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              sortBy === 'latest'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mới nhất</span>
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              sortBy === 'popular'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Xem nhiều</span>
          </button>
          <button
            onClick={() => setSortBy('length')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              sortBy === 'length'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Đọc sâu</span>
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 text-xs font-mono no-scrollbar">
        {categories.map((cat) => {
          const isAll = cat === 'Tất cả chuyên mục';
          const isSelected = isAll ? activeCategory === null : activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(isAll ? null : cat);
                setSelectedTag(null);
              }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Tag Refinement */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono text-slate-400">
          <span className="text-slate-500 uppercase text-[11px]">Từ khóa:</span>
          {allTags.map((tag) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isTagActive ? null : tag)}
                className={`transition-colors cursor-pointer ${
                  isTagActive
                    ? 'text-cyan-400 underline font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-slate-500 hover:text-slate-300 ml-2"
            >
              (Bỏ lọc)
            </button>
          )}
        </div>
      )}

      {/* Rows */}
      {sortedPosts.length === 0 ? (
        <div className="py-16 text-center text-slate-500 font-mono text-sm bg-slate-900/30 rounded-lg border border-slate-800">
          Không tìm thấy bài viết nào theo bộ lọc này.
        </div>
      ) : (
        <div className="divide-y divide-slate-800/80">
          {sortedPosts.map((post) => {
            const isSaved = bookmarks.includes(post.id);
            return (
              <article
                key={post.id}
                onClick={() => onReadPost(post)}
                className="py-6 group flex flex-col md:flex-row md:items-baseline justify-between gap-4 cursor-pointer hover:bg-slate-900/40 px-3 -mx-3 rounded-lg transition-colors"
              >
                {/* Left: Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center text-xs font-mono text-slate-400">
                    <span className="text-cyan-400 font-semibold">{post.category}</span>
                    <span className="mx-2 text-slate-600">·</span>
                    <span>{post.publishedAt}</span>
                    <span className="mx-2 text-slate-600">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{post.readTimeMinutes} min</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-sans text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed font-sans">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-slate-500">
                    <span className="text-slate-300">{post.author.name}</span>
                    <span>·</span>
                    {post.techStack && post.techStack.map((tech) => (
                      <span key={tech} className="text-slate-400">
                        [{tech}]
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(post.id);
                    }}
                    className={`p-2 rounded-md transition-colors cursor-pointer border ${
                      isSaved
                        ? 'border-cyan-500 bg-cyan-950/80 text-cyan-300'
                        : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                    title={isSaved ? 'Đã lưu' : 'Lưu bài'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Xem bài</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
