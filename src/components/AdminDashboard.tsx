import React, { useState } from 'react';
import { Post, Comment, PostCategory, PostStatus, AdminTab } from '../types';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MessageSquare,
  Database,
  ArrowLeft,
  Search,
  Eye,
  Trash2,
  Edit3,
  Pin,
  CheckCircle,
  Clock,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Code2,
  SlidersHorizontal,
  LogOut,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { AdminSession } from '../types';

interface AdminDashboardProps {
  posts: Post[];
  comments: Comment[];
  onSavePost: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onBulkDeletePosts: (postIds: string[]) => void;
  onBulkUpdateStatus: (postIds: string[], status: PostStatus) => void;
  onDeleteComment: (commentId: string) => void;
  onUpdateCommentStatus: (commentId: string, status: 'approved' | 'pending' | 'spam') => void;
  onResetDefaultData: () => void;
  onExitAdmin: () => void;
  onViewPostInBlog: (post: Post) => void;
  adminSession?: AdminSession | null;
  onLogout: () => void;
}

const PRESET_COVERS = [
  {
    name: 'Neural AI Processor (Siêu vi xử lý)',
    url: '/src/assets/images/tech_neural_network_core_1791093394796.jpg',
  },
  {
    name: 'Cloud Datacenter Server Rack (Máy chủ đám mây)',
    url: '/src/assets/images/tech_cloud_cluster_server_1791093416133.jpg',
  },
  {
    name: 'Cybersecurity Data Shield (Mạng an ninh số)',
    url: '/src/assets/images/tech_cyber_security_shield_1791093432890.jpg',
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  posts,
  comments,
  onSavePost,
  onUpdatePost,
  onDeletePost,
  onBulkDeletePosts,
  onBulkUpdateStatus,
  onDeleteComment,
  onUpdateCommentStatus,
  onResetDefaultData,
  onExitAdmin,
  onViewPostInBlog,
  adminSession,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('posts');

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // Posts table state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Editor form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState<PostCategory>('AI & Machine Learning');
  const [formAuthorName, setFormAuthorName] = useState('Admin Kỹ Thuật');
  const [formAuthorRole, setFormAuthorRole] = useState('Staff Engineer @ NEXUS TECH');
  const [formAuthorBio, setFormAuthorBio] = useState('Nghiên cứu các xu hướng công nghệ lõi và tối ưu hóa hạ tầng.');
  const [formAuthorGithub, setFormAuthorGithub] = useState('nexus-dev');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCoverImage, setFormCoverImage] = useState(PRESET_COVERS[0].url);
  const [formStatus, setFormStatus] = useState<PostStatus>('published');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formTags, setFormTags] = useState('AI, System, Cloud');
  const [formTechStack, setFormTechStack] = useState('PyTorch, CUDA, Docker');
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  // Password change handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    const savedPass = localStorage.getItem('nexus_admin_password') || 'admin123';
    if (currentPass !== savedPass) {
      setPassError('Mật khẩu hiện tại không chính xác!');
      return;
    }
    if (!newPass || newPass.length < 6) {
      setPassError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    localStorage.setItem('nexus_admin_password', newPass);
    setPassSuccess('Đã cập nhật mật khẩu quản trị viên thành công!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    notify('Đã cập nhật mật khẩu quản trị viên mới!');
  };

  // Switch to edit post mode
  const handleStartEdit = (post: Post) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSubtitle(post.subtitle);
    setFormSlug(post.slug);
    setFormCategory(post.category);
    setFormAuthorName(post.author.name);
    setFormAuthorRole(post.author.role);
    setFormAuthorBio(post.author.bio);
    setFormAuthorGithub(post.author.github || '');
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormCoverImage(post.coverImage);
    setFormStatus(post.status);
    setFormIsPinned(!!post.isPinned);
    setFormFeatured(!!post.featured);
    setFormTags(post.tags.join(', '));
    setFormTechStack(post.techStack ? post.techStack.join(', ') : '');
    setActiveTab('create');
  };

  // Reset form for brand new post
  const handleStartNewPost = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormSlug('');
    setFormCategory('AI & Machine Learning');
    setFormAuthorName('Admin Kỹ Thuật');
    setFormAuthorRole('Staff Engineer @ NEXUS TECH');
    setFormAuthorBio('Nghiên cứu các xu hướng công nghệ lõi và tối ưu hóa hạ tầng.');
    setFormAuthorGithub('nexus-dev');
    setFormExcerpt('');
    setFormContent(
      '### Giới thiệu vấn đề\n\nNêu bối cảnh kỹ thuật và bài toán cần giải quyết...\n\n```python\n# Mã nguồn ví dụ\ndef optimize_pipeline(data):\n    return [item.process() for item in data]\n```\n\n### Kiến trúc giải pháp\n\nChi tiết giải thuật và phân tích hiệu năng.'
    );
    setFormCoverImage(PRESET_COVERS[0].url);
    setFormStatus('published');
    setFormIsPinned(false);
    setFormFeatured(false);
    setFormTags('Tech, Architecture, Software');
    setFormTechStack('Go, Kubernetes, Redis');
    setActiveTab('create');
  };

  // Submit form (Create or Update)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      notify('Vui lòng điền đầy đủ tiêu đề và nội dung bài viết!');
      return;
    }

    const wordCount = formContent.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const cleanSlug = formSlug.trim()
      ? formSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : formTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const tagsArray = formTags.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
    const techStackArray = formTechStack.split(',').map((t) => t.trim()).filter((t) => t.length > 0);

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    if (editingPost) {
      // Update existing
      const updated: Post = {
        ...editingPost,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || formExcerpt.trim(),
        slug: cleanSlug,
        category: formCategory,
        excerpt: formExcerpt.trim() || formContent.trim().slice(0, 160) + '...',
        content: formContent.trim(),
        coverImage: formCoverImage,
        author: {
          name: formAuthorName.trim(),
          role: formAuthorRole.trim(),
          bio: formAuthorBio.trim(),
          github: formAuthorGithub.trim() || undefined,
        },
        updatedAt: dateFormatted,
        readTimeMinutes,
        status: formStatus,
        isPinned: formIsPinned,
        featured: formFeatured,
        tags: tagsArray,
        techStack: techStackArray,
      };
      onUpdatePost(updated);
      notify(`Đã cập nhật thành công bài viết: "${updated.title}"`);
    } else {
      // Create new
      const created: Post = {
        id: `tech-post-${Date.now()}`,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || formExcerpt.trim(),
        slug: cleanSlug || `post-${Date.now()}`,
        category: formCategory,
        excerpt: formExcerpt.trim() || formContent.trim().slice(0, 160) + '...',
        content: formContent.trim(),
        coverImage: formCoverImage,
        coverImageCaption: 'Hình ảnh minh họa hệ thống kỹ thuật',
        author: {
          name: formAuthorName.trim(),
          role: formAuthorRole.trim(),
          bio: formAuthorBio.trim(),
          github: formAuthorGithub.trim() || undefined,
        },
        publishedAt: dateFormatted,
        updatedAt: dateFormatted,
        readTimeMinutes,
        claps: 0,
        views: 1,
        status: formStatus,
        isPinned: formIsPinned,
        featured: formFeatured,
        tags: tagsArray,
        techStack: techStackArray,
      };
      onSavePost(created);
      notify(`Đã đăng xuất bản bài viết mới: "${created.title}"`);
    }

    setActiveTab('posts');
    setEditingPost(null);
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Bulk selections
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPostIds(filteredPosts.map((p) => p.id));
    } else {
      setSelectedPostIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Metrics
  const totalViews = posts.reduce((acc, p) => acc + p.views, 0);
  const totalClaps = posts.reduce((acc, p) => acc + p.claps, 0);
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-200 flex flex-col font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 w-full h-14 bg-[#0B0F17]/95 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Blog Độc Giả</span>
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-200 uppercase">
              NEXUS CORE // ADMIN CONSOLE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showNotification && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs rounded-md font-mono animate-fade-in">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showNotification}</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-500">Admin:</span>
            <span className="text-cyan-400 font-bold">{adminSession?.username || 'admin'}</span>
          </div>

          <button
            onClick={handleStartNewPost}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-semibold rounded-md transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Viết Bài Mới</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi phiên Quản Trị?')) {
                onLogout();
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs font-mono rounded-md transition-colors cursor-pointer"
            title="Đăng xuất quản trị viên"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Đăng Xuất</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout: Sidebar + Canvas */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 bg-[#0B0F17] border-b md:border-b-0 md:border-r border-slate-800 p-3 flex md:flex-col gap-1 shrink-0 overflow-x-auto">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
            Hệ Thống Quản Trị
          </div>

          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-mono transition-colors cursor-pointer text-left ${
              activeTab === 'posts'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quản Lý Bài Viết</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
              {posts.length}
            </span>
          </button>

          <button
            onClick={handleStartNewPost}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-mono transition-colors cursor-pointer text-left ${
              activeTab === 'create'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingPost ? 'Chỉnh Sửa Bài Viết' : 'Đăng Bài Mới'}</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-mono transition-colors cursor-pointer text-left ${
              activeTab === 'overview'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Chỉ Số Tổng Quan</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-mono transition-colors cursor-pointer text-left ${
              activeTab === 'comments'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Bình Luận Độc Giả</span>
            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
              {comments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-mono transition-colors cursor-pointer text-left ${
              activeTab === 'settings'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Sao Lưu Dữ Liệu</span>
          </button>

          <div className="hidden md:block mt-auto p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 font-mono space-y-1">
            <div className="text-slate-300 font-semibold">Trạng Thái Kho Dữ Liệu</div>
            <div>Bộ nhớ: Trình duyệt LocalStorage</div>
            <div className="text-emerald-400">Đồng bộ tự động: BẬT</div>
          </div>
        </aside>

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
          
          {/* TAB 1: ALL POSTS MANAGEMENT TABLE */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <span>Kiểm Soát Danh Sách Bài Viết ({filteredPosts.length})</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Quản lý toàn bộ bài viết đã đăng, chỉnh sửa nội dung, ghim bài nổi bật và xóa bài cũ.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedPostIds.length > 0 && (
                    <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-md border border-slate-700 text-xs font-mono">
                      <span className="text-cyan-400 px-2">Đã chọn: {selectedPostIds.length}</span>
                      <button
                        onClick={() => {
                          onBulkUpdateStatus(selectedPostIds, 'published');
                          setSelectedPostIds([]);
                          notify(`Đã xuất bản ${selectedPostIds.length} bài viết`);
                        }}
                        className="px-2 py-1 bg-emerald-950 text-emerald-300 rounded hover:bg-emerald-900 cursor-pointer"
                      >
                        Xuất bản
                      </button>
                      <button
                        onClick={() => {
                          onBulkUpdateStatus(selectedPostIds, 'draft');
                          setSelectedPostIds([]);
                          notify(`Đã chuyển ${selectedPostIds.length} bài về bản nháp`);
                        }}
                        className="px-2 py-1 bg-amber-950 text-amber-300 rounded hover:bg-amber-900 cursor-pointer"
                      >
                        Ẩn/Nháp
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn xóa ${selectedPostIds.length} bài viết đã chọn?`)) {
                            onBulkDeletePosts(selectedPostIds);
                            setSelectedPostIds([]);
                            notify(`Đã xóa thành công các bài viết đã chọn`);
                          }
                        }}
                        className="px-2 py-1 bg-red-950 text-red-300 rounded hover:bg-red-900 cursor-pointer"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-[#0B0F17] rounded-lg border border-slate-800 text-xs font-mono">
                {/* Search */}
                <div className="sm:col-span-6 relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tiêu đề, tác giả, thẻ công nghệ..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Category filter */}
                <div className="sm:col-span-3">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">Mọi Chuyên Mục</option>
                    <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                    <option value="Distributed Systems">Hệ thống Phân tán</option>
                    <option value="DevSecOps & Cloud">DevSecOps &amp; Cloud</option>
                    <option value="Software Architecture">Kỹ thuật Phần mềm</option>
                    <option value="Semiconductors & Hardware">Bán dẫn &amp; Phần cứng</option>
                  </select>
                </div>

                {/* Status filter */}
                <div className="sm:col-span-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="published">Đã xuất bản (Live)</option>
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="archived">Đã lưu trữ (Archived)</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-[#0B0F17] rounded-lg border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredPosts.length > 0 &&
                              selectedPostIds.length === filteredPosts.length
                            }
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                          />
                        </th>
                        <th className="p-3">Bài Viết &amp; Chuyên Mục</th>
                        <th className="p-3">Tác Giả</th>
                        <th className="p-3 text-center">Trạng Thái</th>
                        <th className="p-3 text-center">Lượt Xem / Thích</th>
                        <th className="p-3">Ngày Cập Nhật</th>
                        <th className="p-3 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredPosts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 font-mono">
                            Không tìm thấy bài viết nào phù hợp với điều kiện lọc.
                          </td>
                        </tr>
                      ) : (
                        filteredPosts.map((post) => {
                          const isSelected = selectedPostIds.includes(post.id);
                          return (
                            <tr
                              key={post.id}
                              className={`hover:bg-slate-800/40 transition-colors ${
                                isSelected ? 'bg-cyan-950/20' : ''
                              }`}
                            >
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectOne(post.id)}
                                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                                />
                              </td>

                              <td className="p-3 max-w-sm">
                                <div className="flex items-center gap-2">
                                  {post.isPinned && (
                                    <span className="p-1 bg-amber-950/80 text-amber-400 rounded text-[10px]" title="Bài viết được ghim">
                                      <Pin className="w-3 h-3" />
                                    </span>
                                  )}
                                  <span
                                    onClick={() => handleStartEdit(post)}
                                    className="font-medium text-slate-100 hover:text-cyan-400 cursor-pointer line-clamp-1 text-sm font-sans"
                                  >
                                    {post.title}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span className="text-cyan-400">{post.category}</span>
                                  <span>·</span>
                                  <span>{post.readTimeMinutes} min read</span>
                                  <span>·</span>
                                  <span className="text-slate-500">/{post.slug}</span>
                                </div>
                              </td>

                              <td className="p-3 text-slate-300">
                                <div className="font-sans font-medium">{post.author.name}</div>
                                <div className="text-[10px] text-slate-500">{post.author.role}</div>
                              </td>

                              <td className="p-3 text-center">
                                <button
                                  onClick={() => {
                                    const nextStatus = post.status === 'published' ? 'draft' : 'published';
                                    onUpdatePost({ ...post, status: nextStatus });
                                    notify(`Đã đổi trạng thái "${post.title}" sang: ${nextStatus}`);
                                  }}
                                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                                    post.status === 'published'
                                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                      : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                                  }`}
                                  title="Nhấn để đổi nhanh trạng thái"
                                >
                                  {post.status === 'published' ? '● Xuất bản' : '○ Bản nháp'}
                                </button>
                              </td>

                              <td className="p-3 text-center font-mono tabular-nums text-slate-300">
                                <div>{post.views} xem</div>
                                <div className="text-[10px] text-slate-500">{post.claps} thích</div>
                              </td>

                              <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                                {post.updatedAt || post.publishedAt}
                              </td>

                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* View in Blog */}
                                  <button
                                    onClick={() => onViewPostInBlog(post)}
                                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    title="Xem trước bài viết trên Blog"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Pin toggle */}
                                  <button
                                    onClick={() => {
                                      const updated = { ...post, isPinned: !post.isPinned };
                                      onUpdatePost(updated);
                                      notify(`Đã ${updated.isPinned ? 'ghim' : 'bỏ ghim'} bài viết`);
                                    }}
                                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                                      post.isPinned
                                        ? 'text-amber-400 bg-amber-950/40'
                                        : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                                    }`}
                                    title={post.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu trang'}
                                  >
                                    <Pin className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Edit */}
                                  <button
                                    onClick={() => handleStartEdit(post)}
                                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    title="Chỉnh sửa nội dung"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    onClick={() => {
                                      if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${post.title}"? Thao tác này không thể hoàn tác.`)) {
                                        onDeletePost(post.id);
                                        notify(`Đã xóa bài viết "${post.title}"`);
                                      }
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                    title="Xóa bài viết"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE & EDIT POST STUDIO */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-cyan-400" />
                    <span>{editingPost ? `Sửa Bài Viết: ${editingPost.title}` : 'Đăng Bài Viết Kỹ Thuật Mới'}</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Soạn thảo bài viết công nghệ với trình thông dịch Markdown, khối mã nguồn (Code blocks) và gắn thẻ hệ thống.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-md border border-slate-800 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setEditorMode('write')}
                      className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                        editorMode === 'write' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Soạn Thảo (Editor)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                        editorMode === 'preview' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Xem Trước (Preview)
                    </button>
                  </div>
                </div>
              </div>

              {editorMode === 'write' ? (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">
                        Tiêu đề bài viết *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => {
                          setFormTitle(e.target.value);
                          if (!editingPost) {
                            setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                          }
                        }}
                        placeholder="Ví dụ: Tối ưu hóa Inference LLM với vLLM & CUDA Kernel"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-cyan-500 text-sm font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">
                        Chuyên mục kỹ thuật *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as PostCategory)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-cyan-500 text-xs font-mono"
                      >
                        <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                        <option value="Distributed Systems">Hệ thống Phân tán</option>
                        <option value="DevSecOps & Cloud">DevSecOps &amp; Cloud</option>
                        <option value="Software Architecture">Kỹ thuật Phần mềm</option>
                        <option value="Semiconductors & Hardware">Bán dẫn &amp; Phần cứng</option>
                      </select>
                    </div>
                  </div>

                  {/* Subtitle / Deck */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase text-slate-400">
                      Phụ đề / Thông điệp kỹ thuật cốt lõi
                    </label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="Tóm tắt ngắn gọn các kỹ thuật cốt lõi giải quyết bài toán..."
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-cyan-500 text-xs font-sans"
                    />
                  </div>

                  {/* Author, Status, Pins */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
                    <div>
                      <label className="block uppercase text-slate-400 mb-1">Tác giả</label>
                      <input
                        type="text"
                        value={formAuthorName}
                        onChange={(e) => setFormAuthorName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-slate-400 mb-1">Vai trò kỹ thuật</label>
                      <input
                        type="text"
                        value={formAuthorRole}
                        onChange={(e) => setFormAuthorRole(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-slate-400 mb-1">Trạng thái xuất bản</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as PostStatus)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
                      >
                        <option value="published">Xuất bản ngay</option>
                        <option value="draft">Lưu bản nháp</option>
                        <option value="archived">Lưu trữ</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsPinned}
                          onChange={(e) => setFormIsPinned(e.target.checked)}
                          className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                        />
                        <span className="text-slate-300">Ghim đầu trang</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formFeatured}
                          onChange={(e) => setFormFeatured(e.target.checked)}
                          className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                        />
                        <span className="text-slate-300">Bài nổi bật</span>
                      </label>
                    </div>
                  </div>

                  {/* Cover Image Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase text-slate-400">
                      Ảnh bìa công nghệ (Cover Artwork)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PRESET_COVERS.map((cov) => (
                        <div
                          key={cov.url}
                          onClick={() => setFormCoverImage(cov.url)}
                          className={`relative aspect-[16/9] rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
                            formCoverImage === cov.url
                              ? 'border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                              : 'border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={cov.url} alt={cov.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/80 px-2 py-1 text-[10px] font-mono text-slate-300 truncate">
                            {cov.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stacks & Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-mono uppercase text-slate-400">
                        Tech Stack (Công nghệ sử dụng, cách nhau bởi dấu phẩy)
                      </label>
                      <input
                        type="text"
                        value={formTechStack}
                        onChange={(e) => setFormTechStack(e.target.value)}
                        placeholder="Ví dụ: PyTorch, CUDA, Triton, vLLM"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono uppercase text-slate-400">
                        Tags / Từ khóa tìm kiếm
                      </label>
                      <input
                        type="text"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="Ví dụ: AI, LLM, Performance, Systems"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Markdown Content Editor */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Nội dung bài viết (Markdown &amp; Code Blocks)</span>
                      </div>

                      {/* Quick Markdown Inserts */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setFormContent((prev) => prev + '\n\n### Tiêu Đề Mục Mới\n')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer text-[11px]"
                        >
                          + Heading
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormContent((prev) => prev + '\n\n```python\n# Mã nguồn ví dụ\ndef run():\n    pass\n```\n')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded cursor-pointer text-[11px]"
                        >
                          + Python Code
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormContent((prev) => prev + '\n\n```rust\n// Code Rust\nfn main() {\n    println!("Hello!");\n}\n```\n')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded cursor-pointer text-[11px]"
                        >
                          + Rust Code
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormContent((prev) => prev + '\n\n> Trích dẫn kỹ thuật quan trọng ở đây.\n')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer text-[11px]"
                        >
                          + Quote
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={14}
                      required
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder="Viết nội dung bài viết kỹ thuật bằng Markdown..."
                      className="w-full p-4 bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs leading-relaxed"
                    />

                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>Định dạng hỗ trợ: Markdown, LaTeX ($...$), Code Blocks (\`\`\`lang ... \`\`\`)</span>
                      <span>
                        {formContent.trim().split(/\s+/).filter(Boolean).length} từ · ước tính ~{Math.max(1, Math.ceil(formContent.trim().split(/\s+/).filter(Boolean).length / 200))} phút đọc
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('posts');
                        setEditingPost(null);
                      }}
                      className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                    >
                      Hủy bỏ
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold rounded-md transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{editingPost ? 'Lưu Cập Nhật Bài Viết' : 'Xuất Bản Bài Viết Ngay'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* LIVE PREVIEW */
                <div className="p-6 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                      {formCategory}
                    </span>
                    <h2 className="text-2xl font-bold font-sans text-white mt-1">
                      {formTitle || 'Tiêu đề bài viết chưa nhập'}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                      {formSubtitle || 'Chưa có phụ đề tóm tắt.'}
                    </p>
                    <div className="text-xs font-mono text-slate-500 mt-3 flex items-center gap-3">
                      <span>Tác giả: {formAuthorName}</span>
                      <span>·</span>
                      <span>Trạng thái: {formStatus}</span>
                    </div>
                  </div>

                  <div className="aspect-[16/9] max-w-2xl rounded-lg overflow-hidden border border-slate-800">
                    <img src={formCoverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="font-sans text-slate-300 space-y-4 leading-relaxed text-sm">
                    {formContent ? (
                      formContent.split('\n\n').map((block, idx) => {
                        if (block.startsWith('### ')) {
                          return (
                            <h3 key={idx} className="text-lg font-bold text-white font-mono pt-4 pb-1 border-b border-slate-800 text-cyan-400">
                              {block.replace('### ', '')}
                            </h3>
                          );
                        }
                        if (block.startsWith('```')) {
                          return (
                            <pre key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-md font-mono text-xs text-cyan-300 overflow-x-auto">
                              {block.replace(/```[a-z]*/g, '').trim()}
                            </pre>
                          );
                        }
                        if (block.startsWith('> ')) {
                          return (
                            <blockquote key={idx} className="p-3 border-l-2 border-cyan-400 bg-cyan-950/20 text-slate-300 italic text-sm">
                              {block.replace('> ', '')}
                            </blockquote>
                          );
                        }
                        return <p key={idx}>{block}</p>;
                      })
                    ) : (
                      <p className="text-slate-500 italic">Chưa có nội dung để xem trước...</p>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: OVERVIEW & SYSTEM METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                  <span>Tổng Quan Chỉ Số Hệ Thống</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Đo lường lưu lượng độc giả kỹ thuật, mức độ tương tác và trạng thái xuất bản bài viết.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Tổng Bài Viết</span>
                  <div className="text-2xl font-bold font-mono text-white">{posts.length}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {publishedCount} đã phát hành · {draftCount} nháp
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Tổng Lượt Đọc</span>
                  <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                    {totalViews.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Lượt xem trang thực tế</div>
                </div>

                <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Lượt Thích / Ủng Hộ</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                    {totalClaps.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Tương tác từ kỹ sư &amp; độc giả</div>
                </div>

                <div className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Bình Luận Kỹ Thuật</span>
                  <div className="text-2xl font-bold font-mono text-purple-400 tabular-nums">
                    {comments.length}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Đóng góp thảo luận</div>
                </div>
              </div>

              {/* Top Performing Articles */}
              <div className="p-5 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-4">
                <h3 className="text-sm font-mono font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Bài Viết Được Quan Tâm Nhất</span>
                </h3>

                <div className="divide-y divide-slate-800/80">
                  {[...posts]
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 4)
                    .map((post, idx) => (
                      <div key={post.id} className="py-3 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 w-4">#{idx + 1}</span>
                          <div>
                            <div className="font-sans font-medium text-slate-200 hover:text-cyan-400 cursor-pointer" onClick={() => handleStartEdit(post)}>
                              {post.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {post.category} · Tác giả: {post.author.name}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div className="text-cyan-400 tabular-nums">{post.views} lượt xem</div>
                          <button
                            onClick={() => handleStartEdit(post)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] cursor-pointer"
                          >
                            Sửa
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMMENTS MODERATION */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <span>Kiểm Soát Bình Luận Độc Giả ({comments.length})</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Kiểm duyệt phản hồi, ngăn chặn spam và duyệt các thảo luận kỹ thuật từ cộng đồng.
                </p>
              </div>

              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs bg-[#0B0F17] rounded-lg border border-slate-800">
                    Chưa có bình luận nào trên hệ thống.
                  </div>
                ) : (
                  comments.map((comment) => {
                    const post = posts.find((p) => p.id === comment.postId);
                    return (
                      <div
                        key={comment.id}
                        className="p-4 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-2 text-xs font-mono"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-sans text-sm">
                              {comment.authorName}
                            </span>
                            {comment.authorRole && (
                              <span className="text-[11px] text-slate-400">({comment.authorRole})</span>
                            )}
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-500 text-[11px]">{comment.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                              comment.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400'
                                : comment.status === 'spam'
                                ? 'bg-red-950 text-red-400'
                                : 'bg-amber-950 text-amber-400'
                            }`}>
                              {comment.status}
                            </span>

                            <button
                              onClick={() => {
                                const next = comment.status === 'approved' ? 'spam' : 'approved';
                                onUpdateCommentStatus(comment.id, next);
                                notify(`Đã chuyển trạng thái bình luận sang: ${next}`);
                              }}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] cursor-pointer"
                            >
                              {comment.status === 'approved' ? 'Chặn spam' : 'Duyệt'}
                            </button>

                            <button
                              onClick={() => {
                                onDeleteComment(comment.id);
                                notify('Đã xóa bình luận');
                              }}
                              className="p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                              title="Xóa bình luận"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {post && (
                          <div className="text-[11px] text-cyan-400 font-sans">
                            Bài viết: <span className="hover:underline cursor-pointer" onClick={() => onViewPostInBlog(post)}>{post.title}</span>
                          </div>
                        )}

                        <p className="text-slate-300 font-sans leading-relaxed text-sm bg-slate-900/60 p-3 rounded border border-slate-800/80">
                          {comment.content}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & DATA SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <span>Sao Lưu &amp; Khôi Phục Dữ Liệu</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Xuất dữ liệu toàn bộ blog sang file JSON hoặc khôi phục dữ liệu mẫu chuẩn ban đầu.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Backup */}
                <div className="p-5 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Download className="w-4 h-4" />
                    <span>Xuất Bản Sao Lưu (Export JSON)</span>
                  </div>
                  <p className="text-slate-400 font-sans">
                    Tải về toàn bộ bài viết, cấu hình tác giả, ảnh bìa và bình luận dưới dạng file JSON độc lập để lưu trữ an toàn.
                  </p>
                  <button
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ posts, comments }, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `nexus_blog_backup_${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      notify('Đã tải xuống file sao lưu JSON thành công!');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải File Sao Lưu (.JSON)</span>
                  </button>
                </div>

                {/* Reset to Factory Default */}
                <div className="p-5 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <RefreshCw className="w-4 h-4" />
                    <span>Khôi Phục Dữ Liệu Mẫu Chuẩn</span>
                  </div>
                  <p className="text-slate-400 font-sans">
                    Nạp lại 5 bài viết công nghệ mẫu chuẩn về AI, Rust Raft, eBPF K8s, React 19 và Bán dẫn 2nm.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn nạp lại danh sách bài viết mẫu ban đầu?')) {
                        onResetDefaultData();
                        notify('Đã khôi phục dữ liệu mẫu ban đầu thành công!');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Nạp Lại Bài Mẫu Chuẩn</span>
                  </button>
                </div>
              </div>

              {/* Admin Security & Password Change */}
              <div className="p-5 rounded-lg bg-[#0B0F17] border border-slate-800 space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Key className="w-4 h-4" />
                    <span>Bảo Mật Tài Khoản &amp; Đổi Mật Khẩu Quản Trị</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Phiên Đăng Nhập Được Bảo Vệ</span>
                  </div>
                </div>

                {passError && (
                  <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded text-xs">
                    {passError}
                  </div>
                )}

                {passSuccess && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{passSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1">
                      Mật khẩu hiện tại *
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="Mật khẩu cũ"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1">
                      Mật khẩu mới (tối thiểu 6 ký tự) *
                    </label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Mật khẩu mới"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1">
                      Xác nhận mật khẩu mới *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded cursor-pointer transition-colors shadow-sm"
                    >
                      Cập Nhật Mật Khẩu Quản Trị
                    </button>
                  </div>
                </form>

                {/* Session Details */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400">
                  <div>Tài khoản: <span className="text-white font-bold">{adminSession?.username || 'admin'}</span></div>
                  <div>Thời gian đăng nhập: <span className="text-slate-300">{adminSession?.loginAt || 'Hôm nay'}</span></div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Đăng xuất khỏi phiên quản trị này?')) {
                          onLogout();
                        }
                      }}
                      className="text-red-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Đăng xuất phiên làm việc</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
