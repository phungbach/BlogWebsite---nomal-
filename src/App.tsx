/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Post, Comment, ThemeMode, PostStatus, AdminSession } from './types';
import { INITIAL_TECH_POSTS, INITIAL_TECH_COMMENTS } from './data/techPosts';
import { TechTopBar } from './components/TechTopBar';
import { TechHeroFeature } from './components/TechHeroFeature';
import { TechFeatureGrid } from './components/TechFeatureGrid';
import { TechArticleList } from './components/TechArticleList';
import { TechArticleView } from './components/TechArticleView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginGate } from './components/AdminLoginGate';
import { TechSearchModal } from './components/TechSearchModal';
import { TechBookmarksDrawer } from './components/TechBookmarksDrawer';
import { TechFooter } from './components/TechFooter';

export default function App() {
  // Posts state initialized with INITIAL_TECH_POSTS + any persisted user posts
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_tech_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_TECH_POSTS;
  });

  // Comments state
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_tech_comments');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_TECH_COMMENTS;
  });

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_tech_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return ['tech-post-1'];
  });

  // Admin session authentication
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const saved = localStorage.getItem('nexus_admin_session') || sessionStorage.getItem('nexus_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isAuthenticated) return parsed;
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // Theme mode (dark mode default for high-tech aesthetic)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('nexus_tech_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Fallback
    }
    return 'dark';
  });

  // Navigation states
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Persist posts
  useEffect(() => {
    try {
      localStorage.setItem('nexus_tech_posts', JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  // Persist comments
  useEffect(() => {
    try {
      localStorage.setItem('nexus_tech_comments', JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments]);

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('nexus_tech_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Sync theme
  useEffect(() => {
    if (themeMode === 'light') {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-cyan-500/20 selection:text-cyan-900';
    } else {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#080B10] text-[#E2E8F0] antialiased selection:bg-cyan-500/25 selection:text-cyan-200';
    }
    try {
      localStorage.setItem('nexus_tech_theme', themeMode);
    } catch {
      // ignore
    }
  }, [themeMode]);

  // Handle URL hash for direct deep links (#admin or #slug)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setIsAdminView(true);
        setSelectedPost(null);
      } else if (hash) {
        const found = posts.find((p) => p.slug === hash || p.id === hash);
        if (found) {
          setSelectedPost(found);
          setIsAdminView(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        setSelectedPost(null);
        setIsAdminView(false);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [posts]);

  // Global Ctrl+K / Cmd+K search listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleBookmark = (postId: string) => {
    setBookmarks((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleClearBookmarks = () => {
    setBookmarks([]);
  };

  const handleReadPost = (post: Post) => {
    setSelectedPost(post);
    setIsAdminView(false);
    window.location.hash = post.slug;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p))
    );
  };

  const handleBackToHome = () => {
    setSelectedPost(null);
    setIsAdminView(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ADMIN OPERATIONS
  const handleLoginSuccess = (session: AdminSession) => {
    setAdminSession(session);
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_admin_session');
    sessionStorage.removeItem('nexus_admin_session');
    setAdminSession(null);
    setIsAdminView(false);
    window.location.hash = '';
  };

  const handleCancelAdmin = () => {
    setIsAdminView(false);
    window.location.hash = '';
  };

  const handleSavePost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleUpdatePost = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedPost && selectedPost.id === updated.id) {
      setSelectedPost(updated);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleBulkDeletePosts = (postIds: string[]) => {
    const idSet = new Set(postIds);
    setPosts((prev) => prev.filter((p) => !idSet.has(p.id)));
  };

  const handleBulkUpdateStatus = (postIds: string[], status: PostStatus) => {
    const idSet = new Set(postIds);
    setPosts((prev) =>
      prev.map((p) => (idSet.has(p.id) ? { ...p, status } : p))
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleUpdateCommentStatus = (commentId: string, status: 'approved' | 'pending' | 'spam') => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, status } : c))
    );
  };

  const handleResetDefaultData = () => {
    setPosts(INITIAL_TECH_POSTS);
    setComments(INITIAL_TECH_COMMENTS);
    setBookmarks(['tech-post-1']);
    try {
      localStorage.setItem('nexus_tech_posts', JSON.stringify(INITIAL_TECH_POSTS));
      localStorage.setItem('nexus_tech_comments', JSON.stringify(INITIAL_TECH_COMMENTS));
      localStorage.setItem('nexus_tech_bookmarks', JSON.stringify(['tech-post-1']));
    } catch {
      // ignore
    }
  };

  // Reader interactions
  const handleClapPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, claps: p.claps + 1 } : p))
    );
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, claps: prev.claps + 1 } : null));
    }
  };

  const handleAddComment = (
    postId: string,
    authorName: string,
    authorRole: string,
    content: string
  ) => {
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      postId,
      authorName,
      authorRole,
      content,
      createdAt: 'Vừa xong',
      claps: 0,
      status: 'approved',
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleClapComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, claps: c.claps + 1 } : c))
    );
  };

  // Lead and featured posts
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const leadPost = publishedPosts.find((p) => p.featured || p.isPinned) || publishedPosts[0];
  const featurePosts = publishedPosts.filter((p) => p.id !== leadPost?.id).slice(0, 3);

  // ADMIN ROUTING: If Admin is requested, enforce authentication gate!
  if (isAdminView) {
    if (!adminSession?.isAuthenticated) {
      return (
        <AdminLoginGate
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleCancelAdmin}
        />
      );
    }

    return (
      <AdminDashboard
        posts={posts}
        comments={comments}
        adminSession={adminSession}
        onLogout={handleLogout}
        onSavePost={handleSavePost}
        onUpdatePost={handleUpdatePost}
        onDeletePost={handleDeletePost}
        onBulkDeletePosts={handleBulkDeletePosts}
        onBulkUpdateStatus={handleBulkUpdateStatus}
        onDeleteComment={handleDeleteComment}
        onUpdateCommentStatus={handleUpdateCommentStatus}
        onResetDefaultData={handleResetDefaultData}
        onExitAdmin={() => {
          setIsAdminView(false);
          window.location.hash = '';
        }}
        onViewPostInBlog={(post) => {
          handleReadPost(post);
        }}
      />
    );
  }

  // Blog Reader View
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200 bg-tech-grid">
      {/* Strict Top Bar */}
      <TechTopBar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (selectedPost) setSelectedPost(null);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        bookmarksCount={bookmarks.length}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onGoHome={handleBackToHome}
        onOpenAdmin={() => {
          setIsAdminView(true);
          window.location.hash = 'admin';
        }}
        isAdminView={isAdminView}
      />

      {/* Main View Router */}
      {selectedPost ? (
        <TechArticleView
          post={selectedPost}
          allPosts={posts}
          onBack={handleBackToHome}
          onSelectPost={handleReadPost}
          isBookmarked={bookmarks.includes(selectedPost.id)}
          onToggleBookmark={handleToggleBookmark}
          comments={comments}
          onAddComment={handleAddComment}
          onClapPost={handleClapPost}
          onClapComment={handleClapComment}
        />
      ) : (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Hero Feature Lead Story */}
          {leadPost && (
            <TechHeroFeature
              post={leadPost}
              onReadPost={handleReadPost}
              isBookmarked={bookmarks.includes(leadPost.id)}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {/* Curated Tech Feature Grid */}
          {featurePosts.length > 0 && (
            <TechFeatureGrid
              posts={featurePosts}
              onReadPost={handleReadPost}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {/* All Articles List & Archive */}
          <TechArticleList
            posts={posts}
            onReadPost={handleReadPost}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </main>
      )}

      {/* Tech Footer */}
      <TechFooter
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (selectedPost) setSelectedPost(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setIsAdminView(true);
          window.location.hash = 'admin';
        }}
        onGoHome={handleBackToHome}
      />

      {/* Drawers & Modals */}
      <TechSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
        onReadPost={handleReadPost}
      />

      <TechBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        allPosts={posts}
        onReadPost={handleReadPost}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={handleClearBookmarks}
      />
    </div>
  );
}
