import React, { useState, useEffect, useRef, useCallback } from 'react';
import { postChat } from '../api';
import { Send, Sparkles, Terminal, X, AlertTriangle, Cpu, Copy, Check } from 'lucide-react';

// Token definitions mapping custom Tailwind utility colors (Extracted to prevent re-creation on render)
const CODE_TOKENS = [
  { regex: /(\/\/.*)/g, class: 'text-neutral-500 italic' }, // Comments
  { regex: /(["'`])(.*?)\1/g, class: 'text-amber-400' }, // Strings
  { regex: /\b(const|let|var|function|return|import|export|from|if|else|for|while|async|await|class|new)\b/g, class: 'text-rose-400 font-bold' }, // Language Keywords
  { regex: /\b(true|false|null|undefined)\b/g, class: 'text-violet-400 font-bold' }, // Core Constants
  { regex: /\b(\d+)\b/g, class: 'text-amber-500' }, // Numerical values
  { regex: /\b(console\.\w+|log|error|warn)\b/g, class: 'text-sky-400' } // Built-in methods / objects
];

// Modern syntax highlighting engine using premium theme color codes
const highlightCodeTokens = (rawCode) => {
  // Escape HTML formatting characters to prevent XSS injection bugs
  let html = rawCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process matches cleanly without overwriting nested elements
  CODE_TOKENS.forEach((token) => {
    html = html.replace(token.regex, (match) => `<span class="${token.class}">${match}</span>`);
  });

  return <code dangerouslySetInnerHTML={{ __html: html }} />;
};

function App({ embedded = false, onClose }) {
  const [messages, setMessages] = useState([
    {
      message: "Hello! I'm QuereeGPT. Drop your breaking logs, compilation stack traces, or architecture doubts here. How can I help you debug today?",
      sentTime: "just now",
      sender: "QuereeGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [chatError, setChatError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const scrollAnchorRef = useRef(null);
  const textInputRef = useRef(null);

  // Auto scroll to latest messages
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle dynamic multi-line textarea resizing
  useEffect(() => {
    const textarea = textInputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  }, [draftMessage]);

  // Core API processing orchestrator
  const processMessageToChatGPT = useCallback(async (chatMessages) => {
    try {
      const last = chatMessages[chatMessages.length - 1];
      const messageText = last?.message || '';
      const { data } = await postChat(null, messageText);

      if (data?.assistant) {
        setMessages((prev) => [
          ...prev,
          {
            message: data.assistant,
            sender: 'ChatGPT',
          },
        ]);
      } else {
        setChatError('Empty parameter return from diagnostic core proxy.');
      }
    } catch (err) {
      console.error('Chat routing runtime exception:', err);
      const message = err?.response?.data?.error || err?.message || 'Interface uplink failure';
      setChatError(message.includes('429') ? 'Rate limit threshold breached. Restabilizing parameters...' : message);
    } finally {
      setIsTyping(false);
    }
  }, []);

  // Structural messaging system dispatch
  const handleSend = useCallback(async (messageText) => {
    const newMessage = {
      message: messageText,
      direction: 'outgoing',
      sender: "user"
    };

    setMessages((prev) => {
      const updated = [...prev, newMessage];
      // Trigger side effect safely after state queuing context closes
      setTimeout(() => processMessageToChatGPT(updated), 0);
      return updated;
    });
    
    setIsTyping(true);
    setChatError('');
  }, [processMessageToChatGPT]);

  // Intercept trigger workflows cleanly
  const submitMessage = useCallback(() => {
    const trimmedMessage = draftMessage.trim();
    if (!trimmedMessage) return;

    setDraftMessage('');
    if (textInputRef.current) textInputRef.current.style.height = 'auto';
    handleSend(trimmedMessage);
  }, [draftMessage, handleSend]);

  // Copy code utility scope handling
  const handleCopyCode = useCallback((codeText, index) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  // Text parser engine tracking markdown backticks
  const renderMessageContent = (text, messageIndex) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }

      let codeContent = match[1];
      const firstLineBreak = codeContent.indexOf('\n');
      let language = 'code';

      if (firstLineBreak !== -1) {
        const potentialLang = codeContent.substring(0, firstLineBreak).trim();
        if (potentialLang.length > 0 && potentialLang.length < 10) {
          language = potentialLang;
          codeContent = codeContent.substring(firstLineBreak + 1);
        }
      }

      parts.push({
        type: 'code',
        language: language,
        content: codeContent.trim()
      });

      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }

    if (parts.length === 0) return <p className="whitespace-pre-wrap">{text}</p>;

    return (
      <div className="space-y-3 w-full">
        {parts.map((part, idx) => {
          if (part.type === 'text') {
            return <p key={idx} className="whitespace-pre-wrap">{part.content}</p>;
          }
          
          const uniqueId = `${messageIndex}-${idx}`;
          const isCopied = copiedIndex === uniqueId;
          
          return (
            <div key={idx} className="w-full rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 overflow-hidden font-mono text-[11px] my-2 shadow-inner">
              
              {/* Terminal Window Header Control Panel */}
              <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] uppercase font-black tracking-wider text-neutral-400 ml-2 font-sans">{part.language} console</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(part.content, uniqueId)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-bold font-sans text-neutral-400 hover:text-neutral-200 cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-700"
                  aria-label={isCopied ? "Code copied" : "Copy code content"}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Snippet Body with Real-time Code Colors Applied */}
              <div className="p-4 overflow-x-auto whitespace-pre scrollbar-thin max-w-full leading-relaxed text-left bg-neutral-950">
                {highlightCodeTokens(part.content)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={embedded ? "h-full w-full bg-transparent" : "flex items-center justify-center min-h-[calc(100vh-4rem)] bg-theme-bg-main p-4 transition-colors duration-200 select-none"}>
      <div className={embedded ? "w-full h-full bg-theme-bg-surface/80 backdrop-blur-xl border border-theme-border/60 rounded-2xl shadow-xl flex flex-col overflow-hidden" : "w-full max-w-2xl h-[680px] bg-theme-bg-surface border border-theme-border rounded-2xl shadow-xl flex flex-col overflow-hidden"}>

        {/* Header Module */}
        <header className="px-5 py-4 border-b border-theme-border/50 bg-gradient-to-r from-theme-accent-primary/[0.03] via-transparent to-transparent flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-theme-accent-primary text-white flex items-center justify-center shadow-md shadow-theme-accent-primary/20 relative group">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-theme-bg-surface" />
            </div>
            <div className="text-left">
              <h2 className="text-xs font-black text-theme-text-main tracking-tight uppercase">QuereeGPT</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-theme-text-dim uppercase tracking-wider">AI Bot</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {embedded && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg border border-theme-border/60 bg-theme-bg-main text-theme-text-dim hover:text-theme-text-main hover:bg-theme-bg-element transition-all cursor-pointer active:scale-90 focus:outline-none"
                aria-label="Terminate session"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </header>

        {/* Message logs view area */}
        <div className="flex-1 min-h-0 flex flex-col bg-gradient-to-b from-transparent to-theme-bg-main/[0.02] relative">
          {chatError && (
            <div className="mx-4 mt-3 p-3 rounded-xl border border-rose-500/10 bg-rose-500/[0.02] flex items-start gap-2.5 text-left animate-fade-in shrink-0 relative z-20">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider">Uplink Interrupt Exception</p>
                <p className="text-xs font-medium text-theme-text-muted">{chatError}</p>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scroll-smooth relative z-10">
            {messages.map((msg, i) => {
              const isBot = msg.sender === "QuereeGPT" || msg.sender === "ChatGPT";
              return (
                <div key={i} className={`flex w-full items-start gap-3 animate-fade-in ${isBot ? 'justify-start' : 'justify-end'}`}>
                  {isBot && (
                    <div className="h-7 w-7 rounded-lg bg-theme-bg-element border border-theme-border/60 text-theme-accent-primary flex items-center justify-center shrink-0 shadow-3xs select-none">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-3xs text-left ${
                    isBot ? 'bg-theme-bg-surface border border-theme-border text-theme-text-muted rounded-tl-none font-sans' : 'bg-theme-accent-primary text-white rounded-tr-none font-semibold'
                  }`}>
                    {isBot ? renderMessageContent(msg.message, i) : <p className="whitespace-pre-wrap break-words">{msg.message}</p>}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex w-full items-start gap-3 justify-start animate-fade-in">
                <div className="h-7 w-7 rounded-lg bg-theme-bg-element border border-theme-border/60 text-theme-accent-primary flex items-center justify-center shrink-0 animate-spin">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div className="bg-theme-bg-surface/50 border border-theme-border/50 text-theme-text-dim rounded-2xl rounded-tl-none px-4 py-2.5 text-xs font-medium tracking-wide flex items-center gap-2">
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 bg-theme-text-dim rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-theme-text-dim rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-theme-text-dim rounded-full animate-bounce" />
                  </span>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Evaluating compiler dependencies...</span>
                </div>
              </div>
            )}
            <div ref={scrollAnchorRef} />
          </div>

          {/* Fixed control console footer dock */}
          <footer className="border-t border-theme-border/40 bg-theme-bg-surface/80 backdrop-blur-md px-4 py-3 shrink-0 relative z-10">
            <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-theme-bg-surface/90 to-transparent pointer-events-none select-none" />
            <div className="w-full max-w-3xl mx-auto flex items-center gap-2.5 rounded-xl border border-theme-border/60 bg-theme-bg-main/50 p-2 shadow-2xs focus-within:ring-2 focus-within:ring-theme-accent-primary/50 focus-within:border-theme-accent-primary focus-within:bg-theme-bg-surface transition-all duration-300">
              <textarea
                ref={textInputRef}
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    submitMessage();
                  }
                }}
                placeholder="Paste diagnostics, breaking error traces, or structural system doubts..."
                rows={1}
                className="h-9 max-h-32 flex-1 resize-none border-0 bg-transparent px-2.5 py-2 text-xs font-semibold text-theme-text-main outline-none focus:outline-none placeholder:text-theme-text-dim/80 leading-normal font-sans scrollbar-none overflow-y-auto"
                aria-label="Diagnostic query input"
              />
              <button
                type="button"
                onClick={submitMessage}
                disabled={!draftMessage.trim() || isTyping}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-theme-accent-primary text-white transition-all duration-200 hover:bg-theme-accent-hover disabled:cursor-not-allowed disabled:opacity-20 shrink-0 cursor-pointer active:scale-95 shadow-xs shadow-theme-accent-primary/15 hover:shadow-md focus:outline-none"
                title="Transmit diagnostic query"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;