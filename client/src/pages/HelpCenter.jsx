import React, { useContext, useState, useEffect, useRef } from 'react'
import { AppContext } from '../context/AppContext';
import { FaHandsHelping } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';

const HelpCenter = () => {
  const { userData, backendUrl } = useContext(AppContext);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  const chatRef = useRef(null);

  // Scroll to bottom when new messages added
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const userMessage = { type: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    
    // Cache check
    if (localStorage.getItem(question.trim())) {
      setQuestion('');
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: localStorage.getItem(question.trim()) }]);  
      }, 1000);
      return;
    }

    setQuestion('');
    setQuestionLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/chat/chatbot`, { question });
      if (data.success) {
        setMessages(prev => [...prev, { type: 'bot', content: data.data }]);
        localStorage.setItem(question.trim(), data.data);
      } else {
        toast.error(data.message || "Bot failed to respond");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to contact chatbot");
    } finally {
      setQuestionLoading(false);
    }
  };

  return (
    <main className='p-4 min-h-screen bg-gray-50 flex flex-col'>
      {/* Page header */}
      <h1 className='font-semibold text-xl flex items-center gap-2 mb-4'>
        <FaHandsHelping className='text-[var(--primary-color)]' />
        How can I help you, <span className='font-bold'>{userData?.name || "Guest"}</span>
      </h1>

      {/* Chatbot aside panel */}
      <aside className="fixed right-0 top-0 w-full max-w-md h-[100vh] bg-white shadow-lg flex flex-col overflow-hidden border">
        
        {/* Header */}
        <div className="flex items-center justify-center gap-3 p-4 border-b bg-gradient-to-r from-[var(--primary-color)] to-teal-400 text-white">
          <img loading="lazy" width="40" height="40" src="/fav_logo.webp" alt="Logo" className="rounded-full" />
          <h3 className="font-semibold text-lg text-center">Alfa Career Assistant</h3>
        </div>

        {/* Chat messages */}
        <div ref={chatRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
          {messages.length > 0 ? messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] break-words p-3 rounded-2xl text-sm ${msg.type === 'user'
                ? 'self-end bg-[var(--primary-color)]/20 border border-[var(--primary-color)] rounded-br-none'
                : 'self-start bg-gray-100 rounded-bl-none shadow-sm'
                }`}
            >
              {msg.content}
            </div>
          )) : (
            <div className='text-center text-gray-500 mt-10'>
              Hello! 👋 How can I assist you today?
            </div>
          )}
          {questionLoading && (
            <div className="self-start w-4 h-4 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t bg-white sticky bottom-0">
          <img loading='lazy' src="/favicon.ico" alt="favicon" className='w-6 h-6' />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            autoComplete="off"
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:border-[var(--primary-color)] focus:outline-none text-sm"
          />
          <button type="submit" className='bg-[var(--primary-color)] text-white px-4 py-2 rounded-full text-sm font-medium hover:brightness-110 transition'>
            Send
          </button>
        </form>
      </aside>
    </main>
  );
};

export default HelpCenter;
