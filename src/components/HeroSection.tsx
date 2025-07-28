import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock } from "lucide-react";
import heroImage from "@/assets/hero-mechanic.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-automotive-dark/90 via-automotive-dark/70 to-automotive-dark/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Roadside Help
              <span className="block bg-gradient-to-r from-automotive-orange to-accent bg-clip-text text-transparent">
                When You Need It
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 leading-relaxed">
              Connect with verified mechanics in your area for emergency roadside assistance. 
              Fast, reliable, and professional help is just a tap away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto"
                onClick={onGetStarted}
              >
                Get Help Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto border-white text-white hover:bg-white hover:text-automotive-dark"
              >
                Learn More
              </Button>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-automotive-orange" />
                </div>
                <div>
                  <h3 className="font-semibold">Location Based</h3>
                  <p className="text-sm text-gray-300">Find help nearby</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-automotive-orange" />
                </div>
                <div>
                  <h3 className="font-semibold">24/7 Available</h3>
                  <p className="text-sm text-gray-300">Round the clock</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-automotive-orange" />
                </div>
                <div>
                  <h3 className="font-semibold">Instant Connect</h3>
                  <p className="text-sm text-gray-300">Quick response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};