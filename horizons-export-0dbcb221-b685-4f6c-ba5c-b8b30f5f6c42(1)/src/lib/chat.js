
// Funciones para manejar los chats y mensajes

import { getCurrentUser, updateUserProfile } from './auth';

// Función para crear un nuevo chat
export const createChat = (title = 'Nueva conversación') => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'No hay sesión activa' };
    }
    
    const newChat = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    // Añadir chat a la lista de chats del usuario
    const updatedChats = [...(currentUser.chats || []), newChat];
    
    // Actualizar usuario
    const result = updateUserProfile({ chats: updatedChats });
    
    if (result.success) {
      return { success: true, chat: newChat };
    } else {
      return result;
    }
  } catch (error) {
    console.error('Error al crear chat:', error);
    return { success: false, message: 'Error al crear chat' };
  }
};

// Función para obtener todos los chats del usuario
export const getUserChats = () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'No hay sesión activa' };
    }
    
    return { success: true, chats: currentUser.chats || [] };
  } catch (error) {
    console.error('Error al obtener chats:', error);
    return { success: false, message: 'Error al obtener chats' };
  }
};

// Función para obtener un chat específico
export const getChat = (chatId) => {
  try {
    const { success, chats } = getUserChats();
    
    if (!success) {
      return { success: false, message: 'Error al obtener chats' };
    }
    
    const chat = chats.find(c => c.id === chatId);
    
    if (!chat) {
      return { success: false, message: 'Chat no encontrado' };
    }
    
    return { success: true, chat };
  } catch (error) {
    console.error('Error al obtener chat:', error);
    return { success: false, message: 'Error al obtener chat' };
  }
};

// Función para añadir un mensaje a un chat
export const addMessage = (chatId, message) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'No hay sesión activa' };
    }
    
    // Encontrar el chat y añadir el mensaje
    const updatedChats = (currentUser.chats || []).map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, {
            id: Date.now().toString(),
            ...message,
            timestamp: new Date().toISOString()
          }]
        };
      }
      return chat;
    });
    
    // Actualizar usuario
    const result = updateUserProfile({ chats: updatedChats });
    
    if (result.success) {
      const updatedChat = result.user.chats.find(c => c.id === chatId);
      return { success: true, chat: updatedChat };
    } else {
      return result;
    }
  } catch (error) {
    console.error('Error al añadir mensaje:', error);
    return { success: false, message: 'Error al añadir mensaje' };
  }
};

// Función para eliminar un chat
export const deleteChat = (chatId) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'No hay sesión activa' };
    }
    
    // Filtrar el chat a eliminar
    const updatedChats = (currentUser.chats || []).filter(chat => chat.id !== chatId);
    
    // Actualizar usuario
    const result = updateUserProfile({ chats: updatedChats });
    
    return result;
  } catch (error) {
    console.error('Error al eliminar chat:', error);
    return { success: false, message: 'Error al eliminar chat' };
  }
};

// Función para simular respuesta de IA
export const getAIResponse = async (message) => {
  // Simulamos un pequeño retraso para que parezca que está procesando
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Respuestas predefinidas basadas en palabras clave
  const responses = [
    {
      keywords: ['hola', 'saludos', 'buenos días', 'buenas tardes', 'buenas noches'],
      response: '¡Hola! ¿En qué puedo ayudarte hoy?'
    },
    {
      keywords: ['ayuda', 'ayúdame', 'necesito ayuda'],
      response: 'Estoy aquí para ayudarte. Por favor, dime más sobre lo que necesitas.'
    },
    {
      keywords: ['gracias', 'te agradezco'],
      response: 'No hay de qué. Estoy aquí para asistirte.'
    },
    {
      keywords: ['adiós', 'hasta luego', 'nos vemos'],
      response: '¡Hasta pronto! No dudes en volver si necesitas más ayuda.'
    },
    {
      keywords: ['tiempo', 'clima', 'lluvia', 'temperatura'],
      response: 'Lo siento, no tengo acceso a información en tiempo real sobre el clima.'
    },
    {
      keywords: ['nombre', 'llamas', 'eres'],
      response: 'Soy un asistente virtual diseñado para ayudarte con tus preguntas.'
    }
  ];
  
  // Buscar coincidencias en las palabras clave
  const lowerMessage = message.toLowerCase();
  
  for (const item of responses) {
    if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return item.response;
    }
  }
  
  // Respuesta por defecto si no hay coincidencias
  return 'Entiendo tu mensaje. ¿Puedes proporcionar más detalles para que pueda ayudarte mejor?';
};
