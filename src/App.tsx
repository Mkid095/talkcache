import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, Users, Hash, Send, User, LogIn, Plus } from 'lucide-react';

// Define message types
interface ChatMessage {
  id: string;
  room: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isPrivate: boolean;
  recipientId?: string;
}

interface ConnectedUser {
  id: string;
  name: string;
}

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ConnectedUser[]>([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [rooms, setRooms] = useState<string[]>(['general']);
  const [newRoomName, setNewRoomName] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [privateRecipient, setPrivateRecipient] = useState<ConnectedUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('users_list', (usersList: ConnectedUser[]) => {
      setUsers(usersList);
    });

    newSocket.on('message_history', (history: ChatMessage[]) => {
      setMessages(history);
      
      // Extract unique rooms from history
      const uniqueRooms = new Set(['general']);
      history.forEach(msg => {
        if (!msg.isPrivate && msg.room) {
          uniqueRooms.add(msg.room);
        }
      });
      setRooms(Array.from(uniqueRooms));
    });

    newSocket.on('receive_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentRoom, privateRecipient]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && socket) {
      socket.emit('join', username);
      socket.emit('join_room', 'general');
      setIsJoined(true);
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && !rooms.includes(newRoomName.trim())) {
      const room = newRoomName.trim();
      setRooms(prev => [...prev, room]);
      handleJoinRoom(room);
      setNewRoomName('');
    }
  };

  const handleJoinRoom = (room: string) => {
    if (socket) {
      setCurrentRoom(room);
      setPrivateRecipient(null);
      socket.emit('join_room', room);
    }
  };

  const handleStartPrivateChat = (user: ConnectedUser) => {
    setPrivateRecipient(user);
    setCurrentRoom('private');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket) return;

    if (privateRecipient) {
      socket.emit('send_private_message', {
        recipientId: privateRecipient.id,
        text: messageInput
      });
    } else {
      socket.emit('send_message', {
        room: currentRoom,
        text: messageInput
      });
    }
    
    setMessageInput('');
  };

  // Filter messages based on current view (room or private chat)
  const filteredMessages = messages.filter(msg => {
    if (privateRecipient) {
      // Show private messages between current user and recipient
      return msg.isPrivate && (
        (msg.senderId === socket?.id && msg.recipientId === privateRecipient.id) ||
        (msg.senderId === privateRecipient.id && msg.recipientId === socket?.id)
      );
    } else {
      // Show public messages for the current room
      return !msg.isPrivate && msg.room === currentRoom;
    }
  });

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-blue/10 p-3 rounded-full">
              <MessageCircle className="w-8 h-8 text-brand-blue" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome to Talk Cache</h1>
          <p className="text-center text-slate-500 mb-8">Enter a username to join the conversation</p>
          
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                placeholder="e.g. Alex"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-[40vh] md:h-screen">
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <div className="bg-brand-blue/10 p-2 rounded-lg">
            <MessageCircle className="w-6 h-6 text-brand-blue" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Talk Cache</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              {username}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Rooms Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-3 h-3" /> Rooms
              </h3>
            </div>
            <ul className="space-y-1">
              {rooms.map(room => (
                <li key={room}>
                  <button
                    onClick={() => handleJoinRoom(room)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      currentRoom === room && !privateRecipient
                        ? 'bg-brand-blue/10 text-brand-blue font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Hash className="w-4 h-4 opacity-50" />
                    {room}
                  </button>
                </li>
              ))}
            </ul>
            
            <form onSubmit={handleCreateRoom} className="mt-2 flex gap-2">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="New room..."
                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
              />
              <button
                type="submit"
                disabled={!newRoomName.trim()}
                className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Users Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
              <Users className="w-3 h-3" /> Online Users ({users.length})
            </h3>
            <ul className="space-y-1">
              {users.map(user => (
                <li key={user.id}>
                  <button
                    onClick={() => user.id !== socket?.id && handleStartPrivateChat(user)}
                    disabled={user.id === socket?.id}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      privateRecipient?.id === user.id
                        ? 'bg-brand-blue/10 text-brand-blue font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    } ${user.id === socket?.id ? 'opacity-50 cursor-default' : ''}`}
                  >
                    <div className="relative">
                      <User className="w-4 h-4 opacity-50" />
                      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-brand-green border border-white"></span>
                    </div>
                    {user.name} {user.id === socket?.id && '(You)'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[60vh] md:h-screen bg-white">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-200 flex items-center px-6 bg-white shrink-0">
          <div className="flex items-center gap-2">
            {privateRecipient ? (
              <>
                <User className="w-5 h-5 text-slate-400" />
                <h2 className="font-semibold text-slate-800">{privateRecipient.name}</h2>
                <span className="text-xs bg-brand-yellow/30 text-brand-blue px-2 py-0.5 rounded-full font-medium">Private</span>
              </>
            ) : (
              <>
                <Hash className="w-5 h-5 text-slate-400" />
                <h2 className="font-semibold text-slate-800">{currentRoom}</h2>
              </>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No messages yet. Start the conversation!
            </div>
          ) : (
            filteredMessages.map((msg, idx) => {
              const isMe = msg.senderId === socket?.id;
              const showName = idx === 0 || filteredMessages[idx - 1].senderId !== msg.senderId;
              
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {showName && !isMe && (
                    <span className="text-xs font-medium text-slate-500 mb-1 ml-1">{msg.senderName}</span>
                  )}
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isMe 
                      ? 'bg-brand-blue text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 mx-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={privateRecipient ? `Message ${privateRecipient.name}...` : `Message #${currentRoom}...`}
              className="flex-1 px-4 py-2.5 bg-slate-100 border-transparent focus:bg-white border focus:border-brand-blue rounded-xl outline-none transition-all text-sm"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
