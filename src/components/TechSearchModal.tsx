import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { Search, X, Clock, ArrowRight, Terminal } from 'lucide-react';

interface TechSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onReadPost: (post: Post) => void;
}

export const TechSearchModal: React.FC<TechSearchModalProps> = ({
  isOpen,
  onClose,
  posts,
  onReadPost,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length === 0
    ? []
    : posts.filter((p) => {
        return (
          p.status === 'published' &&
          (p.title.toLowerCase().includes(trimmed) ||
            p.subtitle.toLowerCase().includes(trimmed) ||
            p.excerpt.toLowerCase().includes(trimmed) ||
            p.author.name.toLowerCase().includes(trimmed) ||
            p.category.toLowerCase().includes(trimmed) ||
            p.tags.some((t) => t.toLowerCase().includes(trimmed)) ||
            (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(trimmed))))
        );
      });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0B0F17] border border-cyan-500/50 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden text-slate-200 font-mono">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEXUS // QUERY CONSOLE</span>
          </div>
          <span className="text-[10px] text-slate-500">ESC để đóng</span>
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-800 bg-slate-950">
          <Search className="w-4 h-4 text-cyan-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm: MoE, Raft, eBPF, Rust, React, CUDA, TSMC..."
            className="w-full py-3.5 text-sm bg-transparent focus:outline-none placeholder:text-slate-500 text-cyan-300 font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-800/80">
          {trimmed.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <p className="text-slate-400">Gợi ý từ khóa công nghệ phổ biến:</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['MoE', 'Raft', 'eBPF', 'Rust', 'Kubernetes', '2nm GAAFET', 'PyTorch', 'vLLM'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 text-xs rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/60 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    #{term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Không tìm thấy bài viết kỹ thuật nào khớp với "{query}".
            </div>
          ) : (
            results.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  onReadPost(post);
                  onClose();
                }}
                className="py-3 px-3 rounded hover:bg-slate-900/60 cursor-pointer transition-colors group"
              >
                <div className="flex items-center text-[11px] text-slate-400 mb-1">
                  <span className="text-cyan-400 font-bold uppercase">{post.category}</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span>{post.author.name}</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span>{post.readTimeMinutes} min</span>
                </div>
                <h4 className="text-sm font-sans font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                  <span>{post.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1 font-sans mt-0.5">
                  {post.excerpt}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
          <span>Tìm kiếm toàn văn trong tiêu đề, nội dung &amp; mã nguồn</span>
          <span>{results.length} kết quả</span>
        </div>
      </div>
    </div>
  );
};
