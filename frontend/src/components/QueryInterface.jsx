import React, { useState } from 'react';
import axios from 'axios';
import { Search, Bot, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const API_BASE = 'http://localhost:8000';

export default function QueryInterface() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const res = await axios.post(`${API_BASE}/query`, { query, n_results: 3 });
      if (res.data && res.data.results) {
        setResults(res.data.results);
      }
    } catch (err) {
      console.error("Query failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 backdrop-blur-xl bg-black/30 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-saturate-[1.5]">
      <h3 className="text-xl font-medium text-white/90 flex items-center gap-2 mb-6 ml-2">
        <Sparkles className="w-5 h-5 text-purple-400" />
        Ask the Brain
      </h3>
      
      <form onSubmit={handleQuery} className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all shadow-inner"
          placeholder="What do you want to know about your documents?"
        />
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="absolute inset-y-2 right-2 px-6 bg-purple-500/80 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </button>
      </form>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {hasSearched && results.length === 0 && !isSearching && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-6 italic ml-2 text-sm"
            >
              No relevant information found in the brain.
            </motion.p>
          )}

          {results.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-purple-400/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-500/20 rounded-lg shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <p className="text-gray-200 leading-relaxed font-light">{res.text}</p>
                  <p className="text-xs text-purple-400 mt-3 font-medium tracking-wide uppercase opacity-70">
                    Source: {res.id.split('_')[0]} (Chunk {res.id.split('_')[1]})
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
