import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Clock, Tag, ChevronRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { cn, formatDateSafe } from '../lib/utils';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  createdAt: any;
  replyCount: number;
}

const CATEGORIES = ['Acne', 'Routine', 'Products', 'Anti-Aging', 'Nutrition', 'General'];

export default function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!user) {
      setPosts([]);
      return;
    }
    const path = 'forum_posts';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, [user]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please login to post');
    if (!newTitle || !newContent) return;

    const path = 'forum_posts';
    try {
      await addDoc(collection(db, path), {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        title: newTitle,
        content: newContent,
        category: newCategory,
        createdAt: serverTimestamp(),
        replyCount: 0
      });
      setIsCreating(false);
      setNewTitle('');
      setNewContent('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 glow-text">Derma <span className="text-brand-purple">Community</span></h1>
          <p className="text-slate-400">Join 10k+ users in the science of skincare.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Start Discussion
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-8 rounded-3xl border-brand-purple/20 mb-8"
              >
                <form onSubmit={handleCreatePost} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setNewCategory(cat)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                            newCategory === cat 
                              ? "bg-brand-purple border-brand-purple text-white" 
                              : "glass hover:border-white/20 text-slate-400"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                    <input 
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g., How to handle hormonal acne?"
                      className="w-full glass p-4 rounded-2xl outline-none focus:border-brand-purple/40 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
                    <textarea 
                      value={newContent}
                      onChange={e => setNewContent(e.target.value)}
                      rows={6}
                      placeholder="Describe your concern or tip..."
                      className="w-full glass p-4 rounded-2xl outline-none focus:border-brand-purple/40 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary px-10">Post Activity</button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-3xl hover:border-white/20 transition-all group cursor-pointer"
              onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-brand-purple" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold">{post.authorName}</h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3" /> 
                      {post.createdAt ? formatDateSafe(post.createdAt) : 'Just now'}
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-bold border border-brand-purple/20 uppercase">
                  {post.category}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 group-hover:text-brand-purple transition-colors">{post.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <MessageCircle className="w-4 h-4" /> {post.replyCount || 0} Replies
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-brand-purple font-bold">
                  Read More <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {selectedPost?.id === post.id && (
                <div className="mt-8 pt-8 border-t border-white/10" onClick={e => e.stopPropagation()}>
                  <Replies postId={post.id} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Trending Topics</h4>
            <div className="space-y-4">
              {CATEGORIES.map(cat => (
                <div key={cat} className="flex justify-between items-center group cursor-pointer">
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium group-hover:text-white transition-colors">
                    <Tag className="w-3 h-3 text-brand-purple" /> {cat}
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">
                    {Math.floor(Math.random() * 50)} posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Replies({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [replies, setReplies] = useState<any[]>([]);
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    if (!user) {
      setReplies([]);
      return;
    }
    const path = `forum_posts/${postId}/replies`;
    const q = query(collection(db, path), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReplies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, [postId, user]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReply) return;

    const path = `forum_posts/${postId}/replies`;
    try {
      await addDoc(collection(db, path), {
        postId,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        content: newReply,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'forum_posts', postId), {
        replyCount: increment(1)
      });
      setNewReply('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  return (
    <div className="space-y-4">
      {replies.map(reply => (
        <div key={reply.id} className="glass bg-white/5 p-4 rounded-2xl border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-brand-purple">{reply.authorName}</span>
            <span className="text-[10px] text-slate-600">{reply.createdAt ? formatDateSafe(reply.createdAt, 'time') : 'Just now'}</span>
          </div>
          <p className="text-sm text-slate-300">{reply.content}</p>
        </div>
      ))}

      {user ? (
        <form onSubmit={handleReply} className="flex gap-2">
          <input 
            value={newReply}
            onChange={e => setNewReply(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 glass p-3 rounded-xl outline-none text-sm"
          />
          <button type="submit" className="p-3 rounded-xl bg-brand-purple text-white hover:scale-105 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <p className="text-center text-xs text-slate-500 py-4">Login to join the conversation.</p>
      )}
    </div>
  );
}
