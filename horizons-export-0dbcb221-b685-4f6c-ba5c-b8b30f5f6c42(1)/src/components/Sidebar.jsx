
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Plus, MessageSquare, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { createChat } from "@/lib/chat";
import { logoutUser } from "@/lib/auth";

const Sidebar = ({ user, chats, onChatSelect, onNewChat, onLogout, onOpenSettings, activeChat }) => {
  const [newChatTitle, setNewChatTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleCreateChat = (e) => {
    e.preventDefault();
    
    const title = newChatTitle.trim() || "Nueva conversación";
    const result = createChat(title);
    
    if (result.success) {
      toast({
        title: "Chat creado",
        description: `Se ha creado "${title}" correctamente`
      });
      onNewChat(result.chat);
      setNewChatTitle("");
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = () => {
    const result = logoutUser();
    if (result.success) {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente"
      });
      onLogout();
    }
  };
  
  return (
    <div className="w-64 h-full flex flex-col bg-card border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            ChatIA
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpenSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" /> Nuevo chat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo chat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateChat} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del chat</Label>
                <Input
                  id="title"
                  placeholder="Nueva conversación"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Crear</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {chats.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              <p>No hay conversaciones</p>
              <p className="text-sm">Crea un nuevo chat para comenzar</p>
            </div>
          ) : (
            chats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={activeChat?.id === chat.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left mb-1"
                  onClick={() => onChatSelect(chat)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="truncate">{chat.title}</span>
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
