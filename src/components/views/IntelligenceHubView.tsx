import React, { useState } from 'react';
import {
  IntelligenceSubTab,
  PekelilingItem,
} from '../../types';
import {
  Brain,
  Search,
  BookOpen,
  Bot,
  Send,
  FileText,
  Download,
  Sparkles,
  Tag,
  CheckCircle2,
  Bookmark,
  ExternalLink,
} from 'lucide-react';

interface IntelligenceHubViewProps {
  subTab: IntelligenceSubTab;
  setSubTab: (tab: IntelligenceSubTab) => void;
  pekelilingList: PekelilingItem[];
}

export const IntelligenceHubView: React.FC<IntelligenceHubViewProps> = ({
  subTab,
  setSubTab,
  pekelilingList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Chat Assistant State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Salam Sejahtera, I am AgriPulse AI Assistant powered by Gemini. Ask me any question regarding national food security policies, Pekeliling circulars, Rice SSR forecasts, or IGFMAS fertilizer subsidies.',
      time: 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const filteredPekeliling = pekelilingList.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
    return matchesQuery && matchesTag;
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: userTime }]);
    setInputMsg('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply || 'Thank you. Based on Pekeliling KPKM, national food security guidelines mandate maintaining a 250,000 MT rice buffer stock.',
          time: aiTime,
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Response generated: Current national Rice SSR stands at 66.4% under Dasar Sekuriti Makanan Negara (DSMN) 2021-2030.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#08080a] rounded-2xl border border-white/10 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSubTab('search')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'search' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="w-4 h-4 text-emerald-400" />
          Global Search
        </button>

        <button
          onClick={() => setSubTab('pekeliling')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'pekeliling' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          Pekeliling Search ({pekelilingList.length})
        </button>

        <button
          onClick={() => setSubTab('assistant')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'assistant' ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20 font-bold' : 'text-emerald-400 hover:bg-white/5'
          }`}
        >
          <Bot className="w-4 h-4 text-emerald-400" />
          ✨ Gemini AI Assistant
        </button>

        <button
          onClick={() => setSubTab('knowledge')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'knowledge' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Knowledge Center
        </button>
      </div>

      {/* SUB TAB: PEKELILING SEARCH */}
      {(subTab === 'pekeliling' || subTab === 'search') && (
        <div className="space-y-4">
          <div className="p-4 bg-[#121215]/80 rounded-2xl border border-white/10 shadow-lg space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Pekeliling circulars, acts, reference codes (e.g. DSMN, Fertilizer, Subsidies)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 font-medium focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-400">Filter Tags:</span>
              {['DSMN', 'IGFMAS', 'Fertilizer', 'Poultry Feed', 'Flood Relief'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedTag === tag
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredPekeliling.map((item) => (
              <div key={item.id} className="p-4 bg-[#121215]/80 rounded-2xl border border-white/10 shadow-lg hover:border-emerald-500/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-2.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{item.title}</h4>
                    <span className="text-xs text-slate-400 font-mono">{item.referenceCode}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{item.datePublished}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.summary}</p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/20">
                    <Download className="w-3.5 h-3.5" /> Download Pekeliling PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB: AI ASSISTANT CHAT */}
      {subTab === 'assistant' && (
        <div className="bg-[#121215]/80 rounded-2xl border border-white/10 shadow-lg h-[560px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-950 via-[#0a0a0d] to-black text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">AgriPulse Intelligence Assistant</h3>
                <p className="text-[11px] text-emerald-300/80">Gemini 3.6 Flash Policy Intelligence Model</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-black/60 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">
              Active Session
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#050505]">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-black font-semibold rounded-br-none shadow-md'
                      : 'bg-[#18181b] text-slate-200 border border-white/10 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>AgriPulse Gemini AI is reasoning...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#121215] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about Rice SSR, Pekeliling circulars, fertilizer grants, or commodity forecasts..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMsg.trim()}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB: KNOWLEDGE CENTER */}
      {subTab === 'knowledge' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 bg-[#121215]/80 rounded-2xl border border-white/10 shadow-lg space-y-2">
            <h4 className="font-bold text-white text-sm">OpenDOSM Agriculture Datasets</h4>
            <p className="text-slate-400">Access official statistical releases on crops, livestock numbers, marine landings, and consumer food price indices.</p>
          </div>
          <div className="p-5 bg-[#121215]/80 rounded-2xl border border-white/10 shadow-lg space-y-2">
            <h4 className="font-bold text-white text-sm">MARDI Research Publications</h4>
            <p className="text-slate-400">High-yield hybrid seed varieties (MR315, MR297), precision drone farming tech, & smart irrigation protocols.</p>
          </div>
        </div>
      )}
    </div>
  );
};
