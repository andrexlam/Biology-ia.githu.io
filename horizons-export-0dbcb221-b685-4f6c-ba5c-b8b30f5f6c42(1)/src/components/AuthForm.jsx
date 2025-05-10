
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { registerUser, loginUser } from "@/lib/auth";

const AuthForm = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }
    
    const result = loginUser(loginData.email, loginData.password);
    
    if (result.success) {
      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión como ${result.user.name}`
      });
      onAuthSuccess(result.user);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };
  
  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return;
    }
    
    // Registrar usuario
    const result = registerUser({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password
    });
    
    if (result.success) {
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente"
      });
      onAuthSuccess(result.user);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="w-full shadow-lg border-0 glass-effect">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            ChatIA
          </CardTitle>
          <CardDescription>
            Tu asistente de inteligencia artificial personal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="tu@ejemplo.com" 
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Iniciar Sesión
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Tu nombre" 
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo Electrónico</Label>
                    <Input 
                      id="register-email" 
                      name="email" 
                      type="email" 
                      placeholder="tu@ejemplo.com" 
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input 
                      id="register-password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <Input 
                      id="confirm-password" 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Crear Cuenta
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {activeTab === "login" 
              ? "¿No tienes una cuenta? " 
              : "¿Ya tienes una cuenta? "}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
            >
              {activeTab === "login" ? "Regístrate" : "Inicia sesión"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
