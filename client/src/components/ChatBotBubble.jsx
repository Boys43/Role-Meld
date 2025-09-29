import axios from 'axios';
import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

import ReactMarkdown from 'react-markdown';


const ChatBotBubble = () => {
  const { backendUrl } = useContext(AppContext)
  const [showChat, setShowChat] = useState(false);
  const [question, setQuestion] = useState('');

  const [messages, setMessages] = useState([]);

  const [questionLoading, setQuestionLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: question }]);

    if (localStorage.getItem(question)) {
      return setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: localStorage.getItem(question) }]);
      }, 1000);
    }
    setQuestionLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/chat/chatbot`, { question });
      if (data.success) {
        setMessages(prev => [...prev, { type: 'bot', content: data.data }]);
      } else {
        toast.error(data.message || "Bot failed to respond");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to contact chatbot");
    } finally {
      setQuestion('');
      setQuestionLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowChat(!showChat)}
        className="w-15 h-15 cursor-pointer group border border-[var(--primary-color)] fixed bottom-5 right-5 p-3 bg-white rounded-full"
      >
        <img loading='lazy' src="/fav_logo.webp" className="w-full pointer-events-none h-full" alt="" />
      </div>
      <div
        className={`w-80 fixed bottom-15 right-15 z-50 -h-100 rounded-2xl rounded-br-none border border-[var(--primary-color)] bg-white shadow-xl transform transition-all overflow-y-auto duration-300 origin-bottom-right ${showChat ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
      >
        <div id='chatbox' className='flex-1 p-2 pb-14 w-full flex flex-col justify-end gap-2 text-xs overflow-y-auto'>
          {messages.length > 0 ? messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-2xl py-1 px-3 ${msg.type === 'user' ? 'self-end bg-[var(--primary-color)]/10 border border-[var(--primary-color)] rounded-br-none' : 'self-start bg-[var(--primary-color)]/10 rounded-bl-none'
                }`}
            >
              {msg.content}
            </div>
          )) : <div className='text-center h-full flex items-center font-medium text-[var(--primary-color)]'>
            <h3>
              Hello, How can I Assist you?
            </h3>
          </div>}
          {questionLoading &&
            <div
              className="w-4 h-4 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"
            />
          }
        </div>
        <div className='fixed flex items-center gap-4 bottom-0 w-full border-t border-[var(--primary-color)] rounded-bl-2xl'>
          <img loading='lazy' src="/favicon.ico" className='absolute left-2' alt="favicon" />
          <form onSubmit={handleSubmit} className='w-full'>
            <input autoComplete='off' value={question} onChange={(e) => setQuestion(e.target.value)} type="text" className='pl-12 text-[var(--primary-color)] py-2 rounded-bl-2xl border-3 transition-all border-transparent focus:border-[var(--primary-color)] focus:outline-0 w-full text-sm' id='question' name='question' placeholder='Ask me anything' />
          </form>
        </div>
      </div>
    </>
  )
}

export default ChatBotBubble
