
import { useEffect, useState } from "react";

const SplashScreen = () => {
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  
  useEffect(() => {
    // Stagger animations
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 300);
    
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 800);
    
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
    };
  }, []);
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-forest relative">
      <div className="relative flex flex-col items-center z-10">
        <div 
          className={`transform transition-all duration-1000 ease-out ${
            logoVisible 
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <img 
            src="/lovable-uploads/e2d773ba-0e09-4901-8a3a-68e17dce87ab.png" 
            alt="VentiGrow Logo" 
            className="w-48 h-48 object-contain"
          />
        </div>
        
        <div 
          className={`mt-6 text-center transition-all duration-1000 ease-out ${
            textVisible 
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-3xl font-bold text-white mb-2">VentriGrow</h1>
          <p className="text-lime text-lg">
            Smart Agriculture Ventilation System
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-4 text-white/60 text-sm">
        © 2025 VentriGrow. All rights reserved.
      </div>
    </div>
  );
};

export default SplashScreen;
