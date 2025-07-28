import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { RoleSelection } from "@/components/RoleSelection";
import { FeatureSection } from "@/components/FeatureSection";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setShowRoleSelection(true);
  };

  const handleRoleSelect = (role: 'mechanic' | 'customer') => {
    toast({
      title: `Welcome ${role === 'mechanic' ? 'Mechanic' : 'Customer'}!`,
      description: `To complete the ${role} registration, you'll need to connect with Supabase for backend functionality including authentication and profiles.`,
    });
  };

  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onGetStarted={handleGetStarted} />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <RoleSelection onSelectRole={handleRoleSelect} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onGetStarted={handleGetStarted} />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeatureSection />
    </div>
  );
};

export default Index;
