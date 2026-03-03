import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, Bookmark, Search, 
  TrendingUp, Users, X, Image as ImageIcon, Send, ScanLine
} from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/stores/appStore';
import type { Post } from '@/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export function Social() {
  const { posts, likePost, addPost } = useAppStore();
  const [activeTab, setActiveTab] = useState<'recommend' | 'following'>('recommend');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // 发帖表单状态
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // 扫描状态
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanStep, setScanStep] = useState<'scan' | 'binding' | 'success'>('scan');
  
  // 处理扫码绑定
  const handleScan = () => {
    setScanStep('binding');
    setTimeout(() => {
      setScanStep('success');
      setTimeout(() => {
        setShowScanModal(false);
        setScanStep('scan');
      }, 1500);
    }, 2000);
  };
  
  const availableTags = ['茶宠养成', '养护心得', '定制分享', '斗茶竞技'];
  
  // 格式化时间
  const formatTime = (date: Date | string) => {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diff = now.getTime() - targetDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };
  
  // 处理标签点击，添加到搜索框
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };
  
  // 发布帖子
  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    addPost({
      id: Date.now().toString(),
      content: newPostContent,
      tags: selectedTags,
      images: []
    });
    
    setNewPostContent('');
    setSelectedTags([]);
    setShowPostForm(false);
  };
  
  // 切换标签选择
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <MobileLayout
      navBarProps={{ 
        title: '茶友广场', 
        showBack: true,
        showScan: true,
        onScan: () => setShowScanModal(true)
      }}
      className="bg-[#F5F0E6]"
    >
      {/* 搜索栏 */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8B7A]" />
          <input 
            type="text"
            placeholder="搜索话题、用户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm border border-[#E8E2D5] focus:outline-none focus:border-[#8FBC6B]"
          />
        </div>
      </div>
      
      {/* 热门标签 */}
      <div className="px-4 pt-3">
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-[#5C4A3A] border border-[#E8E2D5]"
              whileTap={{ scale: 0.95 }}
            >
              #{tag}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* 标签切换 */}
      <div className="px-4 pt-3">
        <div className="flex gap-2">
          <motion.button
            onClick={() => setActiveTab('recommend')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === 'recommend'
                ? 'bg-[#8FBC6B] text-white'
                : 'bg-white text-[#9A8B7A] border border-[#E8E2D5]'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp size={14} />
            热门推荐
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === 'following'
                ? 'bg-[#8FBC6B] text-white'
                : 'bg-white text-[#9A8B7A] border border-[#E8E2D5]'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={14} />
            关注动态
          </motion.button>
        </div>
      </div>
      
      {/* 发帖区域 - 页面内表单 */}
      <div className="px-4 pt-3">
        {!showPostForm ? (
          <motion.button
            onClick={() => setShowPostForm(true)}
            className="w-full cozy-card p-3 flex items-center gap-3 text-left"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-[#8FBC6B] rounded-xl flex items-center justify-center">
              <Send size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#5C4A3A] text-sm">分享你的茶宠故事</p>
              <p className="text-[10px] text-[#9A8B7A]">点击发布动态，与茶友交流</p>
            </div>
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="cozy-card p-4"
          >
            {/* 发帖头部 */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#5C4A3A] text-sm">发布动态</h3>
              <button 
                onClick={() => setShowPostForm(false)}
                className="w-7 h-7 bg-[#F5F0E6] rounded-full flex items-center justify-center"
              >
                <X size={16} className="text-[#9A8B7A]" />
              </button>
            </div>
            
            {/* 内容输入 */}
            <textarea
              placeholder="分享你的茶宠故事..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full h-24 px-3 py-2 bg-[#F5F0E6] rounded-xl text-sm border border-[#E8E2D5] focus:outline-none focus:border-[#8FBC6B] resize-none mb-3"
            />
            
            {/* 话题选择 */}
            <div className="mb-3">
              <p className="text-xs text-[#9A8B7A] mb-2">添加话题</p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <motion.button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[#8FBC6B] text-white'
                        : 'bg-[#F5F0E6] text-[#9A8B7A]'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    #{tag}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* 图片上传 */}
            <div className="flex gap-2 mb-3">
              <motion.button
                className="w-14 h-14 bg-[#F5F0E6] rounded-xl flex flex-col items-center justify-center border border-dashed border-[#E8E2D5]"
                whileTap={{ scale: 0.95 }}
              >
                <ImageIcon size={18} className="text-[#9A8B7A] mb-0.5" />
                <span className="text-[9px] text-[#9A8B7A]">图片</span>
              </motion.button>
            </div>
            
            {/* 发布按钮 */}
            <motion.button
              onClick={handlePost}
              disabled={!newPostContent.trim()}
              className="w-full leaf-btn text-white py-2.5 rounded-xl font-medium text-sm disabled:opacity-50"
              whileTap={{ scale: 0.98 }}
            >
              发布动态
            </motion.button>
          </motion.div>
        )}
      </div>
      
      {/* 话题标签 */}
      <div className="px-4 pt-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['茶宠养成', '养护心得', '定制分享', '斗茶竞技', '新品推荐', '茶道文化'].map((tag) => (
            <span 
              key={tag}
              className="px-2.5 py-1 bg-white rounded-full text-[10px] text-[#9A8B7A] whitespace-nowrap border border-[#E8E2D5]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* 帖子列表 */}
      <div className="px-4 py-3 space-y-3 pb-20">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="cozy-card p-3 cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            {/* 用户信息 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8FBC6B] to-[#7A9E6E] flex items-center justify-center text-white text-sm font-bold">
                  {post.author.nickname.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-[#5C4A3A] text-xs">{post.author.nickname}</p>
                  <p className="text-[10px] text-[#9A8B7A]">
                    Lv.{post.author.level} · {formatTime(post.createdAt)}
                  </p>
                </div>
              </div>
              <motion.button
                className="px-2 py-1 bg-[#8FBC6B]/10 text-[#8FBC6B] text-[10px] rounded-full font-medium"
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                关注
              </motion.button>
            </div>
            
            {/* 内容 */}
            <p className="mt-2 text-xs text-[#5C4A3A] leading-relaxed line-clamp-2">{post.content}</p>
            
            {/* 标签 */}
            <div className="flex gap-1 mt-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] text-[#8FBC6B]">#{tag}</span>
              ))}
            </div>
            
            {/* 图片 */}
            {post.images.length > 0 && (
              <div className={`mt-2 grid gap-1.5 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.images.slice(0, 4).map((image, imgIndex) => (
                  <div 
                    key={imgIndex}
                    className={`rounded-lg overflow-hidden bg-[#F5F0E6] ${post.images.length === 1 ? 'aspect-video' : 'aspect-square'}`}
                  >
                    <img 
                      src={image} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* 互动按钮 */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5F0E6]">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  likePost(post.id);
                }}
                className={`flex items-center gap-1 text-xs ${
                  post.isLiked ? 'text-[#E8A87C]' : 'text-[#9A8B7A]'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={14} fill={post.isLiked ? 'currentColor' : 'none'} />
                <span>{post.likes}</span>
              </motion.button>
              
              <div className="flex items-center gap-1 text-xs text-[#9A8B7A]">
                <MessageCircle size={14} />
                <span>{post.comments}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-[#9A8B7A]">
                <Share2 size={14} />
              </div>
              
              <div className="flex items-center gap-1 text-xs text-[#9A8B7A]">
                <Bookmark size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* 帖子详情弹窗 */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-[360px] bg-[#FFFEF8] rounded-3xl p-0 border-2 border-[#E8E2D5] max-h-[85vh] overflow-hidden">
          {selectedPost && (
            <>
              {/* 头部 */}
              <div className="p-4 border-b border-[#E8E2D5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8FBC6B] to-[#7A9E6E] flex items-center justify-center text-white font-bold">
                    {selectedPost.author.nickname.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-[#5C4A3A] text-sm">{selectedPost.author.nickname}</p>
                    <p className="text-[10px] text-[#9A8B7A]">
                      Lv.{selectedPost.author.level} · {formatTime(selectedPost.createdAt)}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedPost(null)}>
                  <X size={20} className="text-[#9A8B7A]" />
                </button>
              </div>
              
              {/* 内容 */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <p className="text-sm text-[#5C4A3A] leading-relaxed mb-3">{selectedPost.content}</p>
                
                {/* 标签 */}
                <div className="flex gap-2 mb-3">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="text-xs text-[#8FBC6B]">#{tag}</span>
                  ))}
                </div>
                
                {/* 图片 */}
                {selectedPost.images.length > 0 && (
                  <div className="grid gap-2">
                    {selectedPost.images.map((image, imgIndex) => (
                      <div 
                        key={imgIndex}
                        className="rounded-xl overflow-hidden bg-[#F5F0E6]"
                      >
                        <img 
                          src={image} 
                          alt=""
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 底部互动 */}
              <div className="p-4 border-t border-[#E8E2D5] bg-[#F5F0E6]">
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={() => likePost(selectedPost.id)}
                    className={`flex items-center gap-1.5 text-sm ${
                      selectedPost.isLiked ? 'text-[#E8A87C]' : 'text-[#9A8B7A]'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart size={18} fill={selectedPost.isLiked ? 'currentColor' : 'none'} />
                    <span>{selectedPost.likes}</span>
                  </motion.button>
                  
                  <div className="flex items-center gap-1.5 text-sm text-[#9A8B7A]">
                    <MessageCircle size={18} />
                    <span>{selectedPost.comments}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm text-[#9A8B7A]">
                    <Share2 size={18} />
                    <span>分享</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm text-[#9A8B7A]">
                    <Bookmark size={18} />
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 扫码绑定弹窗 */}
      <Dialog open={showScanModal} onOpenChange={setShowScanModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-6 border-2 border-[#E8E2D5]">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowScanModal(false)}>
              <X size={20} className="text-[#9A8B7A]" />
            </button>
          </div>
          <div className="text-center">
            <div className="w-48 h-48 mx-auto bg-[#F5F0E6] rounded-2xl flex items-center justify-center mb-4">
              <ScanLine size={64} className="text-[#9A8B7A]" />
            </div>
            <p className="text-[#5C4A3A] font-medium mb-4">扫描茶宠二维码</p>
            <motion.button
              onClick={handleScan}
              className="leaf-btn text-white py-3 px-8 rounded-xl font-medium"
              whileTap={{ scale: 0.95 }}
            >
              开始扫描
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
