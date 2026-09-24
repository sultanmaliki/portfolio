"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ type: "cmd" | "out"; text: React.ReactNode }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "~" || e.key === "`") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: "cmd" as const, text: cmd }];

    let output: React.ReactNode = "";

    switch (trimmed) {
      case "help":
        output = "Available commands: help, querycraft, github, linkedin, resume, contact, anime, linux, clear, curiosity, nature";
        break;
      case "anime":
        output = (
          <div className="flex flex-col gap-1">
            <span>One Piece</span>
            <span>Vinland Saga</span>
            <span>Naruto</span>
            <span>Code Geass</span>
          </div>
        );
        break;
      case "linux":
        output = (
          <div className="flex flex-col gap-1">
            <span className="text-[#F5F5F5]/60">Current Daily Driver</span>
            <span className="group relative w-fit cursor-help">
              Ubuntu
              <span className="absolute left-full ml-4 top-0 bg-red-500/20 text-red-300 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                Heart says Arch.
              </span>
            </span>
            <span className="text-[#F5F5F5]/60 mt-2">Preferred</span>
            <span>Arch Linux</span>
          </div>
        );
        break;
      case "curiosity":
        output = (
          <div className="italic">
            {"\"I don't build because I have to. I build because I wonder what happens if I do.\""}
          </div>
        );
        break;
      case "nature":
        output = (
          <div className="italic">
            {"\"If software disappeared tomorrow... I'd probably be growing tomatoes somewhere.\""}
          </div>
        );
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "querycraft":
        window.open("https://github.com/sultanmaliki/QueryCraft-AI", "_blank", "noopener,noreferrer");
        output = "Opening QueryCraft repository...";
        break;
      case "github":
        window.open("https://github.com/sultanmaliki", "_blank", "noopener,noreferrer");
        output = "Opening GitHub profile...";
        break;
      case "linkedin":
        window.open("https://www.linkedin.com/in/syedmohammedsultan", "_blank", "noopener,noreferrer");
        output = "Opening LinkedIn profile...";
        break;
      case "resume":
        window.open("/resume.pdf", "_blank", "noopener,noreferrer");
        output = "Opening resume...";
        break;
      case "contact":
        window.location.href = "mailto:ssultanmaliki47@gmail.com";
        output = "Opening mail client...";
        break;
      case "":
        break;
      default:
        output = `Command not found: ${trimmed}. Type 'help' for available commands.`;
    }

    if (trimmed !== "") {
      newHistory.push({ type: "out", text: output });
    }
    setHistory(newHistory);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="Interactive terminal"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl h-[60vh] bg-[#121212]/90 border border-white/10 rounded-xl shadow-2xl flex flex-col font-mono text-sm overflow-hidden backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 justify-between bg-white/5">
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Close terminal"
                  className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500"
                  onClick={() => setIsOpen(false)}
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-white/40 text-xs">sultan@portfolio:~</div>
              <div className="w-12" />
            </div>

            {/* Content */}
            <div ref={containerRef} role="log" aria-live="polite" className="flex-1 p-4 overflow-y-auto" onClick={() => inputRef.current?.focus()}>
              <div className="mb-4 text-[#6EA8FF]">
                Welcome to Sultan&apos;s Interactive Terminal v1.0.0
                <br />
                Type &apos;help&apos; to see available commands.
              </div>

              {history.map((h, i) => (
                <div key={i} className="mb-2">
                  {h.type === "cmd" ? (
                    <div className="flex gap-2 text-white/70">
                      <span className="text-green-400">➜</span>
                      <span className="text-blue-400">~</span>
                      <span>{h.text}</span>
                    </div>
                  ) : (
                    <div className="text-white/90 pl-6">{h.text}</div>
                  )}
                </div>
              ))}

              <div className="flex gap-2 items-center text-white mt-2">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                <input
                  ref={inputRef}
                  type="text"
                  aria-label="Terminal command"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommand(input);
                  }}
                  className="flex-1 bg-transparent outline-none border-none text-white caret-[#6EA8FF]"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
