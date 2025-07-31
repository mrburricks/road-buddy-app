import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { RoleSelection } from "@/components/RoleSelection";
import { FeatureSection } from "@/components/FeatureSection";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowRoleSelection(true);
  };

  const handleRoleSelect = (role: 'mechanic' | 'customer') => {
    toast({
      title: `Welcome ${role === 'mechanic' ? 'Mechanic' : 'Customer'}!`,
      description: `Your profile is being set up. You can now start using the platform.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
