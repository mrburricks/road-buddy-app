import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, User, MapPin, Clock } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: 'mechanic' | 'customer') => void;
}

export const RoleSelection = ({ onSelectRole }: RoleSelectionProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Role</h2>
        <p className="text-muted-foreground text-lg">
          Get started by selecting how you'd like to use RoadAide
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Card */}
        <Card className="border-2 hover:border-primary transition-all duration-200 hover:shadow-medium cursor-pointer group">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">I Need Help</CardTitle>
            <CardDescription className="text-base">
              Get roadside assistance from verified mechanics near you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Find mechanics nearby</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">24/7 emergency service</span>
              </div>
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Professional assistance</span>
              </div>
            </div>
            <Button 
              className="w-full mt-6" 
              variant="default"
              size="lg"
              onClick={() => onSelectRole('customer')}
            >
              Continue as Customer
            </Button>
          </CardContent>
        </Card>

        {/* Mechanic Card */}
        <Card className="border-2 hover:border-accent transition-all duration-200 hover:shadow-medium cursor-pointer group">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent to-accent-hover rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Wrench className="w-8 h-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">I'm a Mechanic</CardTitle>
            <CardDescription className="text-base">
              Join our network and help customers while earning money
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Work in your area</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Flexible schedule</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Build your clientele</span>
              </div>
            </div>
            <Button 
              className="w-full mt-6" 
              variant="accent"
              size="lg"
              onClick={() => onSelectRole('mechanic')}
            >
              Join as Mechanic
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};