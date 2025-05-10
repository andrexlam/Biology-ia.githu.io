
// Funciones de autenticación utilizando localStorage

export const registerUser = (userData) => {
  try {
    // Verificar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(user => user.email === userData.email);
    
    if (existingUser) {
      return { success: false, message: 'El correo electrónico ya está registrado' };
    }
    
    // Crear nuevo usuario con ID único
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      chats: []
    };
    
    // Guardar en localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Guardar sesión actual
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { success: false, message: 'Error al registrar usuario' };
  }
};

export const loginUser = (email, password) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Credenciales incorrectas' };
    }
    
    // Guardar sesión actual
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, message: 'Error al iniciar sesión' };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  return { success: true };
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};

export const updateUserProfile = (userData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'No hay sesión activa' };
    }
    
    // Actualizar datos del usuario
    const updatedUser = { ...currentUser, ...userData };
    
    // Actualizar en localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Actualizar en la lista de usuarios
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return { success: false, message: 'Error al actualizar perfil' };
  }
};
