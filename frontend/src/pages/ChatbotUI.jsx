/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const ChatbotUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = { role: 'user', content: inputMessage };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages.map(msg => ({ 
            user: msg.role === 'user' ? msg.content : '',
            assistant: msg.role === 'assistant' ? msg.content : ''
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Best Practices Foundation Chatbot</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div 
          ref={chatContainerRef} 
          className="h-[28rem] overflow-y-auto mb-6 p-4 border rounded-lg bg-green-50 shadow-inner"
        >
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span 
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-gray-800 border border-green-200'
                } shadow-md`}
              >
                {message.content}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="text-center">
              <span className="inline-block p-3 rounded-lg bg-green-200 text-green-600 animate-pulse">
                Thinking...
              </span>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow text-lg py-2 px-4 rounded-full focus:ring-2 focus:ring-green-500"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="rounded-full bg-green-500 hover:bg-green-600 transition-colors"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatbotUI;