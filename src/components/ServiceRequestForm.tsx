import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ServiceRequestFormProps {
  userLocation: { lat: number; lng: number } | null;
  onSubmit: (data: { title: string; description: string; address: string }) => void;
  onClose: () => void;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  userLocation,
  onSubmit,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    
    // If no address provided, try to get it from coordinates
    let finalAddress = address;
    if (!finalAddress && userLocation) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLocation.lng},${userLocation.lat}.json?access_token=YOUR_MAPBOX_TOKEN`
        );
        const data = await response.json();
        if (data.features?.[0]?.place_name) {
          finalAddress = data.features[0].place_name;
        }
      } catch (error) {
        console.error('Error getting address:', error);
        finalAddress = `${userLocation.lat}, ${userLocation.lng}`;
      }
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      address: finalAddress || 'Location not specified',
    });

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Request Service</CardTitle>
              <CardDescription>
                Describe what kind of help you need
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Service Type</Label>
              <Input
                id="title"
                placeholder="e.g., Flat tire, Dead battery, Engine trouble"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe your situation in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                placeholder="Your current location will be used if not specified"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceRequestForm;