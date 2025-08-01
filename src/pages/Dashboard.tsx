import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import MapComponent from '@/components/MapComponent';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import { UserNav } from '@/components/UserNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Wrench, Clock, User } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  role: 'customer' | 'mechanic';
  first_name?: string;
  last_name?: string;
}

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  address: string;
  created_at: string;
  mechanic_id?: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile();
      getCurrentLocation();
      fetchServiceRequests();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a central location if geolocation fails
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // NYC
        }
      );
    }
  };

  const fetchServiceRequests = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        const { data, error } = await supabase
          .from('service_requests')
          .select('*')
          .eq('customer_id', profileData.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setServiceRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

  const handleRequestSubmit = async (requestData: any) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!profileData) throw new Error('Profile not found');

      const { error } = await supabase
        .from('service_requests')
        .insert({
          customer_id: profileData.id,
          title: requestData.title,
          description: requestData.description,
          address: requestData.address,
          latitude: userLocation?.lat,
          longitude: userLocation?.lng,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Request Submitted',
        description: 'Your service request has been submitted successfully!',
      });

      setShowRequestForm(false);
      fetchServiceRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit service request',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-bold">FixItFast</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={profile?.role === 'mechanic' ? 'default' : 'secondary'}>
              {profile?.role === 'mechanic' ? 'Mechanic' : 'Customer'}
            </Badge>
            <UserNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Nearby Mechanics
                </CardTitle>
                <CardDescription>
                  Find mechanics in your area and track service requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] rounded-lg overflow-hidden">
                  {userLocation && (
                    <MapComponent
                      userLocation={userLocation}
                      showMechanics={profile?.role === 'customer'}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Requests Section */}
          <div className="space-y-4">
            {profile?.role === 'customer' && (
              <Card>
                <CardHeader>
                  <CardTitle>Request Service</CardTitle>
                  <CardDescription>
                    Need roadside assistance? Submit a request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowRequestForm(true)}
                    className="w-full"
                  >
                    Request Help
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {profile?.role === 'customer' ? 'My Requests' : 'Available Jobs'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {serviceRequests.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      {profile?.role === 'customer' 
                        ? 'No service requests yet' 
                        : 'No available jobs'}
                    </p>
                  ) : (
                    serviceRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{request.title}</h4>
                          <Badge 
                            variant={
                              request.status === 'pending' ? 'outline' :
                              request.status === 'accepted' ? 'default' :
                              request.status === 'completed' ? 'secondary' : 'destructive'
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {request.description}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {request.address}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Service Request Form Modal */}
      {showRequestForm && (
        <ServiceRequestForm
          userLocation={userLocation}
          onSubmit={handleRequestSubmit}
          onClose={() => setShowRequestForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;