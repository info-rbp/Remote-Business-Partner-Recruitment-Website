
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { BlogPost } from '../types';
import { Plus, Search, Calendar, User, Tag, Edit, Trash2, X, Sparkles, Loader2, Save, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const BlogManagement: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAppStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    category: 'Technology',
    author: 'Admin',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
    excerpt: '',
    content: ''
  });

  const categories = ['Technology', 'Management', 'Culture', 'Recruitment', 'Career Advice'];

  const filteredPosts = blogPosts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      category: 'Technology',
      author: 'Admin',
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
      excerpt: '',
      content: ''
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlogPost(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    if (editingPost) {
      updateBlogPost(formData as BlogPost);
    } else {
      const newPost: BlogPost = {
        ...formData as BlogPost,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      addBlogPost(newPost);
    }
    setShowModal(false);
  };

  const handleGenerateContent = async () => {
    if (!formData.title) {
      alert("Please enter a title first so the AI knows what to write about.");
      return;
    }

    setLoadingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Write a professional recruitment blog post for "Remote Business Partner".
        Title: "${formData.title}"
        Category: "${formData.category}"
        
        The post should be engaging, provide value to either candidates or hiring managers, and be formatted in HTML (using <p>, <h3>, and <ul> tags).
        
        Return a JSON object with two fields:
        1. "excerpt": A 2-sentence summary of the post.
        2. "content": The full HTML content of the post.
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          excerpt: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["excerpt", "content"]
      };

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const data = JSON.parse(result.text || '{}');
      setFormData(prev => ({
        ...prev,
        excerpt: data.excerpt,
        content: data.content
      }));
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("AI was unable to generate content. Please try again or check your API key.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Blog Admin</h1>
          <p className="text-slate-500">Create and manage content for your public recruitment blog.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-bold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center">
        <Search className="w-5 h-5 text-slate-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search articles..." 
          className="flex-1 outline-none text-slate-700 placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group flex flex-col">
            <div className="h-40 relative overflow-hidden">
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-800 border border-slate-200">
                {post.category}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-tight">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {post.date}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3"/> {post.author}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{post.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <a 
                  href={`#/blog/${post.id}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  title="View Live"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleEdit(post)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{editingPost ? 'Edit Blog Post' : 'New Blog Post'}</h2>
                <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Article Editor</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Article Title *</label>
                    <input 
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 font-medium text-lg"
                      placeholder="e.g. How to Build a High-Performance Remote Engineering Team"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Excerpt (Summary)</label>
                      <button 
                        type="button"
                        onClick={handleGenerateContent}
                        disabled={loadingAI || !formData.title}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                      >
                        {loadingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Generate with Gemini
                      </button>
                    </div>
                    <textarea 
                      rows={3}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-600 resize-none"
                      placeholder="A short summary that appears on the card..."
                      value={formData.excerpt}
                      onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Article Body (HTML Supported) *</label>
                    <textarea 
                      required
                      rows={12}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-mono"
                      placeholder="<p>Write your article here...</p>"
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Post Metadata</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                        <select 
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Author Name</label>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                          <input 
                            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.author}
                            onChange={e => setFormData({...formData, author: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
                        <div className="relative">
                          <ImageIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                          <input 
                            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://images.unsplash.com/..."
                            value={formData.imageUrl}
                            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-400 p-4">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-[10px] uppercase font-bold tracking-widest">Image Preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 font-bold uppercase tracking-wider text-xs"
                >
                  <Save className="w-4 h-4" />
                  {editingPost ? 'Update Post' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
