import React from 'react';
import { Post } from '../types';
import { Bookmark, Clock, ArrowRight, Terminal } from 'lucide-react';

interface TechFeatureGridProps {
  posts: Post[];
  onReadPost: (post: Post) => void;
  bookmarks: string[];
  onToggleBookmark: (postId: string) => void;
}

export const TechFeatureGrid: React.FC<TechFeatureGridProps> = ({
  posts,
  onReadPost,
  bookmarks,
  onToggleBookmark,
}) => {
  if (posts.length === 0) return null;

  return (
    <section className="py-12 border-b border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Kỹ Thuật Chuyên Sâu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-white mt-1">
            Báo Cáo Nghiên Cứu &amp; Kiến Trúc Hạ Tầng
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((post) => {
          const isSaved = bookmarks.includes(post.id);
          return (
            <article
              key={post.id}
              className="flex flex-col group cursor-pointer p-4 rounded-lg bg-slate-900/40 border border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900/70 transition-all duration-300"
              onClick={() => onReadPost(post)}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-slate-950 border border-slate-800 mb-4">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(post.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-md backdrop-blur-md transition-colors cursor-pointer border ${
                    isSaved
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                      : 'bg-black/60 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={isSaved ? 'Đã lưu trong danh sách' : 'Lưu bài'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Category & Read Time */}
              <div className="flex items-center text-xs font-mono text-slate-400 mb-2">
                <span className="text-cyan-400 font-semibold">{post.category}</span>
                <span className="mx-2 text-slate-600">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTimeMinutes} min</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold font-sans text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2 line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4 flex-1 font-sans">
                {post.excerpt}
              </p>

              {/* Tech Stack Pills */}
              {post.techStack && post.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.techStack.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Author & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-mono">
                <span className="text-slate-300 font-medium truncate max-w-[150px]">
                  {post.author.name}
                </span>
                <span className="inline-flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform font-bold">
                  <span>Chi tiết</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
