-- Create enrollment applications table
CREATE TABLE public.enrollment_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Student Information
  student_first_name TEXT NOT NULL,
  student_last_name TEXT NOT NULL,
  student_date_of_birth DATE NOT NULL,
  student_grade TEXT NOT NULL,
  
  -- Guardian Information
  primary_guardian_first_name TEXT NOT NULL,
  primary_guardian_last_name TEXT NOT NULL,
  primary_guardian_relationship TEXT NOT NULL,
  primary_guardian_email TEXT NOT NULL,
  primary_guardian_phone TEXT NOT NULL,
  
  -- Secondary Guardian (optional)
  secondary_guardian_first_name TEXT,
  secondary_guardian_last_name TEXT,
  secondary_guardian_relationship TEXT,
  secondary_guardian_email TEXT,
  secondary_guardian_phone TEXT,
  
  -- Contact Information
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  emergency_contact_relationship TEXT NOT NULL,
  
  -- Consent and Status
  parental_consent_required BOOLEAN NOT NULL DEFAULT false,
  parental_consent_given BOOLEAN DEFAULT false,
  application_status TEXT NOT NULL DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.enrollment_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own applications" 
ON public.enrollment_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" 
ON public.enrollment_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.enrollment_applications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_enrollment_applications_updated_at
BEFORE UPDATE ON public.enrollment_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();