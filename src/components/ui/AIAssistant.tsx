import React, { useState } from 'react';
import {
  SparklesIcon,
  MoreHorizontalIcon,
  StethoscopeIcon,
  PillIcon,
  FileTextIcon,
  SendIcon,
  Plus,
  History,
  Trash2
} from
  'lucide-react';
import ChatIcon from '../../assets/svgs/ChatIcon.svg'
export function AIAssistant() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; text: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setIsTyping(false);
    setIsMenuOpen(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsMenuOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Add user message
      const userMessage = { type: 'user' as const, text: inputValue };
      setMessages([...messages, userMessage]);

      // Simulate bot response
      const botResponse = {
        type: 'bot' as const,
        text: 'Welcome to Health Bot. What can I do for you?'
      };
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
      }, 500);

      setInputValue('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  return (
    <div className="w-full xl:w-[501px] flex-shrink-0 bg-white rounded-[28px] border border-[#FAFAFA] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] p-6 flex flex-col max-h-[603px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <SparklesIcon
            className="w-[22px] h-[22px] text-[#6AA7FF]"
            strokeWidth={2.5} />

          <h2 className="font-satoshi font-medium text-[18px] text-[#080E0D]">
            AI Assistant
          </h2>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 rounded-xl bg-[#F2F2F2] bg-opacity-50 flex items-center justify-center hover:bg-opacity-100 transition-colors relative">
          <MoreHorizontalIcon
            className="w-5 h-5 text-[#353535]"
            strokeWidth={2.5} />

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-[#EDEDED] overflow-hidden z-50">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4F5F6] transition-colors text-left">
                <Plus className="w-4 h-4 text-[#418BF5]" strokeWidth={2.5} />
                <span className="font-mulish text-[14px] text-[#080E0D]">New Chat</span>
              </button>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4F5F6] transition-colors text-left">
                <History className="w-4 h-4 text-[#14B8A6]" strokeWidth={2.5} />
                <span className="font-mulish text-[14px] text-[#080E0D]">History</span>
              </button>

              <button
                onClick={handleClearChat}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4F5F6] transition-colors text-left">
                <Trash2 className="w-4 h-4 text-[#E30303]" strokeWidth={2.5} />
                <span className="font-mulish text-[14px] text-[#080E0D]">Clear Chat</span>
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-3 min-h-0">
        {messages.length === 0 && !isTyping ? (
          <>
            {/* Chat Icon */}
            <div className="relative mb-4">
              <img src={ChatIcon} alt="Chat Icon" className="w-[180px] h-[180px]" />
            </div>

            <div className="text-center space-y-1 mb-4">
              <p className="font-satoshi text-[14px] text-[#353535]">Hi Joanne,</p>
              <h3 className="font-satoshi font-medium text-[16px] text-[#080E0D]">
                How can i help you today?
              </h3>
            </div>
          </>
        ) : (
          <>
            {/* Typing Circle */}
            {isTyping && messages.length === 0 && (
              <div className="relative mb-4 flex flex-col gap-[20px]">
                <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-br from-[#a8d4ff] to-[#418BF5] shadow-[0_20px_40px_-10px_rgba(65,139,245,0.4)]"></div>

                <div className="text-center space-y-1 mb-4">
                  <p className="font-satoshi text-[14px] text-[#353535]">Hi Joanne,</p>
                  <h3 className="font-satoshi font-medium text-[16px] text-[#080E0D]">
                    How can i help you today?
                  </h3>
                </div>
              </div>
            )}

            {/* Messages Display */}
            {messages.length > 0 && (
              <div className="w-full flex-1 overflow-y-auto mb-2 space-y-3 min-h-0">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.type === 'user'
                        ? 'bg-[#418BF5] text-white'
                        : 'bg-[#F2F2F2] text-[#080E0D]'
                        }`}
                    >
                      <p className="font-mulish text-[12px]">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col gap-3 w-full">
          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="flex flex-row gap-2">
              <button className="flex-1 bg-[#FAFAFA] border border-[#F4F5F6] rounded-xl p-2 flex flex-col gap-2 hover:shadow-md transition-all group text-left">
                <div className="w-7 h-7 rounded-lg bg-[#E8F0FA] border border-[#E1EDFF] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <StethoscopeIcon
                    className="w-3 h-3 text-[#418BF5]"
                    strokeWidth={2.5} />

                </div>
                <span className="font-mulish font-medium text-[10px] text-[#080E0D]">
                  Symptom Checker
                </span>
              </button>

              <button className="flex-1 bg-[#FAFAFA] border border-[#F4F5F6] rounded-xl p-2 flex flex-col gap-2 hover:shadow-md transition-all group text-left">
                <div className="w-7 h-7 rounded-lg bg-[#EBFFFD] border border-[#D9FFFB] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PillIcon className="w-3 h-3 text-[#14B8A6]" strokeWidth={2.5} />
                </div>
                <span className="font-mulish font-medium text-[10px] text-[#080E0D]">
                  Medication Care
                </span>
              </button>

              <button className="flex-1 bg-[#FAFAFA] border border-[#F4F5F6] rounded-xl p-2 flex flex-col gap-2 hover:shadow-md transition-all group text-left">
                <div className="w-7 h-7 rounded-lg bg-[#FFF7EA] border border-[#FFF1DA] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileTextIcon
                    className="w-3 h-3 text-[#F59E0B]"
                    strokeWidth={2.5} />

                </div>
                <span className="font-mulish font-medium text-[10px] text-[#080E0D]">
                  Medical Records
                </span>
              </button>
            </div>
          )}

          {/* Chat Input */}
          <div className="flex flex-row gap-3">
            <div className={`flex-1 bg-[#F4F5F6] border rounded-xl px-4 py-3 flex items-center transition-all ${isInputFocused ? 'border-[#418BF5] bg-white shadow-md' : 'border-[#F2F2F2]'
              }`}>
              <input
                type="text"
                placeholder="Ask Something..."
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyPress={handleKeyPress}
                className="w-full bg-transparent font-mulish text-[14px] text-[#080E0D] placeholder-[#BCBCBC] focus:outline-none" />

            </div>
            <button
              onClick={handleSendMessage}
              className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors shadow-sm ${inputValue.length > 0 ? 'bg-[#418BF5] hover:bg-[#2563EB]' : 'bg-[#A9CCFF] hover:bg-[#A9CCFF]'}`}>
              <SendIcon className="w-5 h-5 text-white ml-1" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}