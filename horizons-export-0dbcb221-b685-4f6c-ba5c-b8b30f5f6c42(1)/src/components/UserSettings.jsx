
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { updateUserProfile } from "@/lib/auth";

const UserSettings = ({ user, isOpen, onClose, onUserUpdated }) => {
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const { toast } = useToast();
  
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar datos
    if (!userData.name || !userData.email) {
      toast({
        title: "Error",
        description: "El nombre y el correo electrónico son obligatorios",
        variant: "destructive"
      });
      return;
    }
    
    // Validar contraseña si se está cambiando
    if (userData.newPassword) {
      if (!userData.currentPassword) {
        toast({
          title: "Error",
          description: "Debes ingresar tu contraseña actual",
          variant: "destructive"
        });
        return;
      }
      
      if (userData.currentPassword !== user.password) {
        toast({
          title: "Error",
          description: "La contraseña actual es incorrecta",
          variant: "destructive"
        });
        return;
      }
      
      if (userData.newPassword !== userData.confirmPassword) {
        toast({
          title: "Error",
          description: "Las nuevas contraseñas no coinciden",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Preparar datos para actualizar
    const dataToUpdate = {
      name: userData.name,
      email: userData.email
    };
    
    // Actualizar contraseña si se proporcionó
    if (userData.newPassword) {
      dataToUpdate.password = userData.newPassword;
    }
    
    // Actualizar perfil
    const result = updateUserProfile(dataToUpdate);
    
    if (result.success) {
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente"
      });
      onUserUpdated(result.user);
      onClose();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuración de la cuenta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium mb-2">Cambiar contraseña</h3>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={userData.currentPassword}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={userData.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={userData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;
