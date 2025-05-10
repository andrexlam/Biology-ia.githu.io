
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";

const WelcomePage = ({ onStartApp }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
      <ParticlesBackground />
      
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.h1 
            className="text-6xl font-bold text-white mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            Bienvenido a ChatIA
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white/90 max-w-xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Tu asistente de inteligencia artificial personal, listo para ayudarte en cualquier momento.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={onStartApp}
              size="lg"
              className="text-lg px-8 py-6 bg-white text-indigo-600 hover:bg-white/90 transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Aplicación
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <img  alt="AI Assistant" className="w-64 h-64 mx-auto rounded-full shadow-2xl" src="https://images.unsplash.com/photo-1684369176170-463e84248b70" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default WelcomePage;
