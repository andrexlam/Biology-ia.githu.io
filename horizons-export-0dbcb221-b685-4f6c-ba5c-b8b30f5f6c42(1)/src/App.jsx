
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { motion, AnimatePresence } from "framer-motion";
import AuthForm from "@/components/AuthForm";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import UserSettings from "@/components/UserSettings";
import ParticlesBackground from "@/components/ParticlesBackground";
import WelcomePage from "@/components/WelcomePage";
import { getCurrentUser } from "@/lib/auth";
import { getUserChats, createChat, deleteChat } from "@/lib/chat";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      // Cargar chats del usuario
      const { success, chats } = getUserChats();
      if (success && chats.length > 0) {
        setChats(chats);
        setActiveChat(chats[0]); // Seleccionar el primer chat por defecto
      } else if (success) {
        // Si no hay chats, crear uno nuevo
        const result = createChat("Nueva conversación");
        if (result.success) {
          setChats([result.chat]);
          setActiveChat(result.chat);
        }
      }
    }
    
    setIsLoading(false);
  }, []);
  
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    
    // Cargar chats del usuario
    const { success, chats } = getUserChats();
    if (success && chats.length > 0) {
      setChats(chats);
      setActiveChat(chats[0]); // Seleccionar el primer chat por defecto
    } else {
      // Si no hay chats, crear uno nuevo
      const result = createChat("Nueva conversación");
      if (result.success) {
        setChats([result.chat]);
        setActiveChat(result.chat);
      }
    }
  };
  
  const handleLogout = () => {
    setUser(null);
    setChats([]);
    setActiveChat(null);
    setShowWelcome(true);
  };
  
  const handleChatSelect = (chat) => {
    setActiveChat(chat);
  };
  
  const handleNewChat = (chat) => {
    setChats([chat, ...chats]);
    setActiveChat(chat);
  };
  
  const handleChatUpdated = (updatedChat) => {
    const updatedChats = chats.map(chat => 
      chat.id === updatedChat.id ? updatedChat : chat
    );
    setChats(updatedChats);
    setActiveChat(updatedChat);
  };
  
  const handleDeleteChat = (chatId) => {
    const result = deleteChat(chatId);
    
    if (result.success) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setChats(remainingChats);
      
      // Si se eliminó el chat activo, seleccionar otro
      if (activeChat && activeChat.id === chatId) {
        if (remainingChats.length > 0) {
          setActiveChat(remainingChats[0]);
        } else {
          // Si no quedan chats, crear uno nuevo
          const newChatResult = createChat("Nueva conversación");
          if (newChatResult.success) {
            setChats([newChatResult.chat]);
            setActiveChat(newChatResult.chat);
          } else {
            setActiveChat(null);
          }
        }
      }
    }
  };
  
  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
  };
  
  // Mostrar pantalla de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="typing-indicator mb-4">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WelcomePage onStartApp={() => setShowWelcome(false)} />
          </motion.div>
        ) : !user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 overflow-hidden"
          >
            <ParticlesBackground />
            <div className="relative z-10">
              <AuthForm onAuthSuccess={handleAuthSuccess} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full"
          >
            <Sidebar
              user={user}
              chats={chats}
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onLogout={handleLogout}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
            
            <div className="flex-1 flex flex-col">
              {activeChat ? (
                <ChatInterface
                  chat={activeChat}
                  onChatUpdated={handleChatUpdated}
                  onDeleteChat={handleDeleteChat}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-center p-4">
                  <div>
                    <img  alt="Empty state illustration" className="w-32 h-32 mx-auto mb-4" src="https://images.unsplash.com/photo-1697564265236-1679374e6e32" />
                    <h3 className="text-xl font-bold mb-2">No hay chat seleccionado</h3>
                    <p className="text-muted-foreground">
                      Selecciona un chat existente o crea uno nuevo para comenzar.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {isSettingsOpen && (
              <UserSettings
                user={user}
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onUserUpdated={handleUserUpdated}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <Toaster />
    </div>
  );
}

export default App;
