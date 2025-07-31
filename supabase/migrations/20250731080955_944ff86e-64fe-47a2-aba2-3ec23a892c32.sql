-- Create the user_role enum type
CREATE TYPE public.user_role AS ENUM ('customer', 'mechanic');

-- Update the profiles table role column to use the enum type
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::text::user_role;

-- Create service_status enum for service_requests table
CREATE TYPE public.service_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');

-- Update the service_requests table status column to use the enum type
ALTER TABLE public.service_requests 
ALTER COLUMN status TYPE service_status USING status::text::service_status;