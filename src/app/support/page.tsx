'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your CatchMyDream AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const userText = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      let aiResponse = "I'm sorry, I couldn't understand that. You can reach out to our team at akashkeluth03@gmail.com for direct help.";
      if (userText.includes('visa')) {
        aiResponse = "For visa assistance, we provide end-to-end support once you have your university offer letter. Our team will guide you through the process.";
      } else if (userText.includes('accommodation') || userText.includes('housing')) {
        aiResponse = "We guarantee accommodation near your chosen university! Check our Accommodation page for listings and distance from campus.";
      } else if (userText.includes('scholarship') || userText.includes('budget')) {
        aiResponse = "You can filter universities by budget on our Search page. Many of our partner universities also offer merit-based scholarships.";
      } else if (userText.includes('apply')) {
        aiResponse = "You can apply directly through our platform once you find a course you like. Create an account to get started!";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Contact Info Side */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-[#212121] mb-4">Support & Help Center</h1>
          <p className="text-zinc-600 mb-8">
            We are here to help you catch your dream. If you have any questions or need assistance, please reach out to us.
          </p>
          <div className="space-y-4 text-left">
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <h3 className="text-xl font-semibold text-[#212121] mb-2">Email Us</h3>
              <p className="text-zinc-600 text-sm">akashkeluth03@gmail.com</p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
              <h3 className="text-xl font-semibold text-[#212121] mb-2">Call Us</h3>
              <p className="text-zinc-600 text-sm">+1 (800) 123-4567</p>
            </div>
          </div>
        </div>

        {/* AI Chatbot Side */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col h-[500px]">
          <h3 className="text-xl font-semibold text-[#212121] mb-4 flex items-center gap-2">
            🤖 AI Assistant
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-zinc-100 text-[#212121] rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full h-12 rounded-full border border-zinc-200 bg-zinc-50 pl-4 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button type="submit" disabled={!input.trim()} className="absolute right-2 top-2 h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50">
              ↑
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
