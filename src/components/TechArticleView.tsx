import React, { useState, useEffect } from 'react';
import { Post, Comment } from '../types';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Heart,
  MessageSquare,
  Clock,
  Check,
  Send,
  Copy,
  Terminal,
  Cpu,
  Github,
  CheckCircle,
} from 'lucide-react';

interface TechArticleViewProps {
  post: Post;
  allPosts: Post[];
  onBack: () => void;
  onSelectPost: (post: Post) => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  comments: Comment[];
  onAddComment: (postId: string, authorName: string, authorRole: string, content: string) => void;
  onClapPost: (postId: string) => void;
  onClapComment: (commentId: string) => void;
}

export const TechArticleView: React.FC<TechArticleViewProps> = ({
  post,
  allPosts,
  onBack,
  onSelectPost,
  isBookmarked,
  onToggleBookmark,
  comments,
  onAddComment,
  onClapPost,
  onClapComment,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [commentName, setCommentName] = useState('');
  const [commentRole, setCommentRole] = useState('');
  const [commentText, setCommentText] = useState('');
  const [hasClapped, setHasClapped] = useState(false);

  // Filter approved comments for this post
  const postComments = comments.filter(
    (c) => c.postId === post.id && c.status !== 'spam'
  );

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.status === 'published')
    .slice(0, 2);

  // Reading scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const p = (window.scrollY / total) * 100;
        setScrollProgress(Math.min(100, Math.max(0, p)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(
      post.id,
      commentName.trim() || 'Kỹ sư ẩn danh',
      commentRole.trim() || 'Tech Reader',
      commentText.trim()
    );
    setCommentText('');
  };

  // Parse blocks
  const contentBlocks = post.content.split('\n\n').filter(Boolean);

  return (
    <article className="min-h-screen bg-[#080B10] text-slate-200 pb-24 font-sans">
      
      {/* Laser Cyan Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-cyan-400 z-50 shadow-[0_0_10px_rgba(6,182,212,0.9)] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Reading Utility Bar */}
      <div className="sticky top-16 z-30 w-full border-b border-slate-800 bg-[#0B0F17]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between text-xs font-mono">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh mục</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Claps */}
            <button
              onClick={() => {
                onClapPost(post.id);
                setHasClapped(true);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                hasClapped
                  ? 'border-cyan-500 bg-cyan-950/80 text-cyan-300'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
              }`}
              title="Đồng ý &amp; Ủng hộ bài viết"
            >
              <Heart className={`w-3.5 h-3.5 ${hasClapped ? 'fill-current text-cyan-400' : ''}`} />
              <span className="tabular-nums">{post.claps}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(post.id)}
              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'border-cyan-500 bg-cyan-950/80 text-cyan-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title={isBookmarked ? 'Bỏ lưu' : 'Lưu bài'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share Link */}
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-md border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer relative"
              title="Sao chép liên kết"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                  Đã copy URL!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4" />
            <span>{post.category}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-500">{post.slug}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-sans tracking-tight text-white leading-[1.2] mb-4 text-balance">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed mb-6">
            {post.subtitle}
          </p>

          {/* Tech Stack Pills */}
          {post.techStack && post.techStack.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-mono text-slate-500">Cấu trúc công nghệ:</span>
              {post.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-cyan-950/40 border border-cyan-800/80 text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Author Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-slate-200 text-sm font-sans flex items-center gap-2">
                  <span>{post.author.name}</span>
                  {post.author.github && (
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Github className="w-3 h-3" />
                      <span>@{post.author.github}</span>
                    </span>
                  )}
                </div>
                <div className="text-slate-400 text-[11px]">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span>Ngày đăng: {post.publishedAt}</span>
              <span className="text-slate-600">·</span>
              <span className="inline-flex items-center gap-1 text-cyan-400">
                <Clock className="w-3 h-3" />
                <span>{post.readTimeMinutes} phút đọc</span>
              </span>
            </div>
          </div>
        </header>

        {/* Hero Plate */}
        <div className="max-w-4xl mx-auto mb-12 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <div className="aspect-[16/9] w-full">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
          {post.coverImageCaption && (
            <div className="p-3 text-xs font-mono text-slate-400 bg-slate-950/90 border-t border-slate-800/80">
              {post.coverImageCaption}
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6 leading-relaxed font-sans text-slate-300 text-base">
            {contentBlocks.map((block, idx) => {
              // Subheading
              if (block.startsWith('### ')) {
                return (
                  <h3
                    key={idx}
                    className="text-xl sm:text-2xl font-bold font-sans text-white pt-6 pb-2 border-b border-slate-800 flex items-center gap-2 text-cyan-400"
                  >
                    <span>{block.replace('### ', '')}</span>
                  </h3>
                );
              }

              // Code block
              if (block.startsWith('```')) {
                const lines = block.split('\n');
                const lang = lines[0].replace('```', '') || 'code';
                const codeContent = lines.slice(1, -1).join('\n');
                const isCopied = copiedCodeIdx === idx;

                return (
                  <div key={idx} className="my-6 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="uppercase font-semibold text-slate-300">{lang}</span>
                      </div>

                      <button
                        onClick={() => handleCopyCode(codeContent, idx)}
                        className="inline-flex items-center gap-1 text-[11px] hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {isCopied ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Đã copy' : 'Sao chép mã'}</span>
                      </button>
                    </div>

                    <pre className="p-4 overflow-x-auto text-xs font-mono text-cyan-200 leading-relaxed">
                      <code>{codeContent}</code>
                    </pre>
                  </div>
                );
              }

              // Blockquote
              if (block.startsWith('> ')) {
                return (
                  <blockquote
                    key={idx}
                    className="my-6 p-4 rounded-r-lg border-l-2 border-cyan-400 bg-cyan-950/20 text-slate-200 italic font-sans text-base"
                  >
                    {block.replace('> ', '')}
                  </blockquote>
                );
              }

              return <p key={idx}>{block}</p>;
            })}

            {/* Tags Strip */}
            <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-slate-500 uppercase">Tags:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="text-cyan-400">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Reader Reflections & Comments */}
            <section className="mt-16 pt-8 border-t border-slate-800" id="comments">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 font-mono">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white uppercase">
                    Thảo Luận Kỹ Thuật ({postComments.length})
                  </h3>
                </div>
              </div>

              {/* Comment submission form */}
              <form onSubmit={handleCommentSubmit} className="mb-10 p-5 rounded-lg border border-slate-800 bg-slate-900/40 space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Họ tên kỹ sư / Độc giả *"
                    className="px-3.5 py-2 rounded-md bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    value={commentRole}
                    onChange={(e) => setCommentRole(e.target.value)}
                    placeholder="Chức danh / Tổ chức (tùy chọn)"
                    className="px-3.5 py-2 rounded-md bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <textarea
                  rows={3}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Gửi phản biện kỹ thuật, thắc mắc triển khai hoặc đóng góp ý kiến..."
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans text-sm"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-md transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Thảo Luận</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              {postComments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-xs bg-slate-900/20 rounded-lg border border-slate-800">
                  Chưa có bình luận nào cho bài viết này. Hãy là người đầu tiên mở đầu thảo luận!
                </div>
              ) : (
                <div className="space-y-4">
                  {postComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 space-y-2 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-sans text-sm">
                            {comment.authorName}
                          </span>
                          {comment.authorRole && (
                            <span className="text-slate-400 text-[11px]">({comment.authorRole})</span>
                          )}
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-500 text-[11px]">{comment.createdAt}</span>
                        </div>

                        <button
                          onClick={() => onClapComment(comment.id)}
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-400 cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>{comment.claps}</span>
                        </button>
                      </div>

                      <p className="text-slate-300 font-sans leading-relaxed text-sm">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Author Card & Related Dispatches (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Author Card */}
            <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/50 space-y-3 font-mono text-xs">
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold">
                Tác Giả &amp; Nghiên Cứu
              </div>
              <h4 className="text-base font-bold font-sans text-white">{post.author.name}</h4>
              <div className="text-slate-400">{post.author.role}</div>
              <p className="text-slate-300 font-sans leading-relaxed pt-1 text-xs">
                {post.author.bio}
              </p>
              {post.author.github && (
                <div className="pt-2 border-t border-slate-800">
                  <a
                    href={`https://github.com/${post.author.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>github.com/{post.author.github}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="p-5 rounded-lg border border-slate-800 bg-slate-900/40 space-y-3 font-mono text-xs">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold">
                  Tài Liệu Cùng Chủ Đề
                </div>
                <div className="space-y-3">
                  {relatedPosts.map((related) => (
                    <div
                      key={related.id}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        onSelectPost(related);
                      }}
                      className="group cursor-pointer p-2 rounded hover:bg-slate-800/60 transition-colors space-y-1"
                    >
                      <div className="text-[10px] text-cyan-400 uppercase">{related.category}</div>
                      <h5 className="font-sans font-bold text-white group-hover:text-cyan-300 leading-snug line-clamp-2">
                        {related.title}
                      </h5>
                      <div className="text-[11px] text-slate-500">
                        {related.readTimeMinutes} min · {related.author.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </article>
  );
};
