"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Copy, Trash2, Edit2, X, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
}

export default function Home() {
  const [snippets, setSnippets] = useState<Snippet[]>([
    {
      id: "1",
      title: "useState Hook",
      code: "const [count, setCount] = useState(0)",
      language: "javascript",
      tags: ["react", "hooks"],
    },
    {
      id: "2",
      title: "Supabase Query",
      code: "const { data } = await supabase.from('posts').select('*')",
      language: "javascript",
      tags: ["supabase", "database"],
    },
  ]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newSnippet, setNewSnippet] = useState({ title: "", code: "", language: "javascript", tags: "" });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredSnippets = snippets.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const addSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) return;
    const snippet: Snippet = {
      id: Date.now().toString(),
      title: newSnippet.title,
      code: newSnippet.code,
      language: newSnippet.language,
      tags: newSnippet.tags.split(",").map(t => t.trim()),
    };
    setSnippets([snippet, ...snippets]);
    setShowModal(false);
    setNewSnippet({ title: "", code: "", language: "javascript", tags: "" });
  };

  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  const copyToClipboard = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-pink-600/20 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Code Snippet Manager
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Store, search, and share your code snippets
          </p>
        </motion.div>

        {/* Search and Add Bar */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or tag..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2 hover:scale-105"
          >
            <Plus size={18} />
            New Snippet
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-4 mb-6 text-sm text-gray-400">
          <span>📦 {snippets.length} snippets</span>
          <span>🏷️ {new Set(snippets.flatMap(s => s.tags)).size} tags</span>
          <span>💻 {new Set(snippets.map(s => s.language)).size} languages</span>
        </div>

        {/* Snippets Grid */}
        {filteredSnippets.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
            <p className="text-gray-400 text-lg">No snippets found</p>
            <p className="text-gray-500 text-sm mt-2">Try a different search or create a new snippet</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              + Create one
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredSnippets.map((snippet, index) => (
                <motion.div
                  key={snippet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white">{snippet.title}</h3>
                    <div className="flex gap-2">
                      <button className="p-1 hover:text-purple-400 transition">
                        <Edit2 size={16} />
                      </button>
                      {deleteConfirm === snippet.id ? (
                        <div className="flex gap-1 bg-red-500/20 rounded-lg p-1">
                          <button onClick={() => deleteSnippet(snippet.id)} className="px-2 py-0.5 text-xs text-red-400 hover:bg-red-500/20 rounded">✓</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 text-xs text-gray-400 hover:bg-gray-700 rounded">✗</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(snippet.id)} className="p-1 hover:text-red-400 transition">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <SyntaxHighlighter
                    language={snippet.language}
                    style={vscDarkPlus}
                    className="rounded-xl text-sm mb-3"
                    showLineNumbers
                  >
                    {snippet.code}
                  </SyntaxHighlighter>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                      {snippet.language}
                    </span>
                    {snippet.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(snippet.code, snippet.id)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition"
                  >
                    {copiedId === snippet.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copiedId === snippet.id ? "Copied!" : "Copy code"}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Snippet Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 max-w-lg w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add New Snippet</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-800 rounded">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newSnippet.title}
                onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                placeholder="Code"
                value={newSnippet.code}
                onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Language (javascript, python, typescript, etc.)"
                value={newSnippet.language}
                onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Tags (comma separated: react, hooks, state)"
                value={newSnippet.tags}
                onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={addSnippet}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Save Snippet
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}