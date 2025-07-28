import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Shield, Clock, Star, CreditCard, Phone } from "lucide-react";

export const FeatureSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Location-Based Matching",
      description: "Find the nearest available mechanic to your exact location for fastest service",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Verified Mechanics",
      description: "All mechanics are background checked, licensed, and insured for your safety",
      color: "text-accent"
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description: "Track your mechanic's arrival time and location in real-time",
      color: "text-primary"
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Choose mechanics based on customer reviews and ratings",
      color: "text-accent"
    },
    {
      icon: CreditCard,
      title: "Transparent Pricing",
      description: "Know the cost upfront with no hidden fees or surprise charges",
      color: "text-primary"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer support for emergencies anytime",
      color: "text-accent"
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose RoadAide?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the fastest, most reliable roadside assistance service with features 
            designed to get you back on the road quickly and safely.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border hover:shadow-medium transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};