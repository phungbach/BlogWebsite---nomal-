import React from 'react';
import { Post } from '../types';
import { ArrowUpRight, Bookmark, Clock, Eye, Sparkles, Cpu, Layers } from 'lucide-react';

interface TechHeroFeatureProps {
  post: Post;
  onReadPost: (post: Post) => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
}

export const TechHeroFeature: React.FC<TechHeroFeatureProps> = ({
  post,
  onReadPost,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <section className="relative w-full border-b border-slate-800 pb-12 pt-6 lg:pb-16 lg:pt-8">
      {/* High-Tech System Banner */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 mb-6 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-semibold">
            <Cpu className="w-3 h-3" />
            <span>DISPATCH #01</span>
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">BÀI PHÂN TÍCH TIÊU ĐIỂM</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{post.publishedAt}</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-cyan-400 font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>PEER-REVIEWED ARCHITECTURE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Tech Headline, Deck, Stack */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          {/* Category unboxed kicker */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>{post.category}</span>
          </div>

          <h1
            onClick={() => onReadPost(post)}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold font-sans tracking-tight text-white hover:text-cyan-300 transition-colors cursor-pointer leading-[1.2] text-balance"
          >
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tech Stack Chips */}
          {post.techStack && post.techStack.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-slate-500 mr-1">Hạ tầng:</span>
              {post.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-y-2 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80">
            <span className="font-semibold text-slate-200">{post.author.name}</span>
            <span className="mx-2 text-slate-600">·</span>
            <span className="text-slate-400">{post.author.role}</span>
            <span className="mx-2 text-slate-600">·</span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{post.readTimeMinutes} phút đọc</span>
            </span>
            <span className="mx-2 text-slate-600">·</span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span>{post.views} lượt xem</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onReadPost(post)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-md transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer group"
            >
              <span>Đọc Toàn Văn Bài Viết</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(post.id);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-mono font-medium rounded-md border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Đã Lưu' : 'Lưu Bài'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Artwork */}
        <div
          onClick={() => onReadPost(post)}
          className="lg:col-span-5 relative group cursor-pointer overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-2xl"
        >
          <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          {post.coverImageCaption && (
            <div className="p-3 text-[11px] font-mono text-slate-400 bg-slate-950/90 border-t border-slate-800/80">
              {post.coverImageCaption}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
