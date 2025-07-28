-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('customer', 'mechanic');

-- Create enum for service request status
CREATE TYPE public.service_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');

-- Create profiles table with proper primary key
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create mechanic_profiles table with additional mechanic-specific info
CREATE TABLE public.mechanic_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  license_number TEXT,
  specialties TEXT[],
  hourly_rate DECIMAL(10,2),
  years_experience INTEGER,
  is_available BOOLEAN DEFAULT TRUE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  service_radius_km INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- Create service_requests table
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mechanic_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  status service_status DEFAULT 'pending',
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  completed_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mechanic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for mechanic_profiles
CREATE POLICY "Anyone can view mechanic profiles" 
ON public.mechanic_profiles FOR SELECT 
USING (true);

CREATE POLICY "Mechanics can update their own profile" 
ON public.mechanic_profiles FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = mechanic_profiles.profile_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Mechanics can insert their own profile" 
ON public.mechanic_profiles FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = profile_id 
  AND profiles.user_id = auth.uid()
));

-- Create RLS policies for service_requests
CREATE POLICY "Users can view their own service requests" 
ON public.service_requests FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id IN (service_requests.customer_id, service_requests.mechanic_id)
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Customers can create service requests" 
ON public.service_requests FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = customer_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Customers and assigned mechanics can update service requests" 
ON public.service_requests FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id IN (service_requests.customer_id, service_requests.mechanic_id)
  AND profiles.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mechanic_profiles_updated_at
  BEFORE UPDATE ON public.mechanic_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'customer')::user_role,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();