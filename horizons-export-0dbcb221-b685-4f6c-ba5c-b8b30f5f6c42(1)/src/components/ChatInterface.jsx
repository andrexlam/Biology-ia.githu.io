
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2 } from "lucide-react";
import { addMessage, getAIResponse } from "@/lib/chat";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ChatInterface = ({ chat, onChatUpdated, onDeleteChat }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();
  
  // Scroll al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Añadir mensaje del usuario
    const userMessageData = {
      content: message,
      sender: "user"
    };
    
    const result = addMessage(chat.id, userMessageData);
    
    if (result.success) {
      onChatUpdated(result.chat);
      setMessage("");
      
      // Simular respuesta de la IA
      setIsTyping(true);
      try {
        const aiResponse = await getAIResponse(message);
        
        // Añadir respuesta de la IA
        const aiMessageData = {
          content: aiResponse,
          sender: "ai"
        };
        
        const aiResult = addMessage(chat.id, aiMessageData);
        
        if (aiResult.success) {
          onChatUpdated(aiResult.chat);
        } else {
          toast({
            title: "Error",
            description: aiResult.message,
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo obtener respuesta de la IA",
          variant: "destructive"
        });
      } finally {
        setIsTyping(false);
      }
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteChat = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteChat = () => {
    onDeleteChat(chat.id);
    setIsDeleteDialogOpen(false);
  };
  
  // Renderizar indicador de escritura
  const renderTypingIndicator = () => {
    return (
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
        </Avatar>
        <div className="message-ai p-3 rounded-lg max-w-[80%]">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">{chat.title}</h2>
        <Button variant="ghost" size="icon" onClick={handleDeleteChat}>
          <Trash2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 chat-container">
        <AnimatePresence>
          {chat.messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center p-4"
            >
              <div className="mb-4">
                <img  alt="Robot assistant" className="w-24 h-24 mx-auto" src="https://images.unsplash.com/photo-1613750651512-d65ce96dff55" />
              </div>
              <h3 className="text-xl font-bold mb-2">¡Comienza una nueva conversación!</h3>
              <p className="text-muted-foreground">
                Escribe un mensaje para iniciar una conversación con la IA.
              </p>
            </motion.div>
          ) : (
            chat.messages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 mb-4 ${
                  msg.sender === "user" ? "justify-end" : ""
                }`}
              >
                {msg.sender === "ai" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender === "user" ? "message-user" : "message-ai"
                  }`}
                >
                  {msg.content}
                </div>
                
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary">TÚ</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))
          )}
          
          {isTyping && renderTypingIndicator()}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
      
      {/* Diálogo de confirmación para eliminar chat */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas eliminar esta conversación?</p>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteChat}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;
