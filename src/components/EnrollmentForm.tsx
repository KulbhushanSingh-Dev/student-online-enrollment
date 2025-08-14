import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StudentInfoStep } from './enrollment/StudentInfoStep';
import { GuardianInfoStep } from './enrollment/GuardianInfoStep';
import { ContactInfoStep } from './enrollment/ContactInfoStep';
import { ConfirmationStep } from './enrollment/ConfirmationStep';
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface EnrollmentData {
  // Student Information
  studentFirstName: string;
  studentMiddleName: string;
  studentLastName: string;
  studentPreferredNickname: string;
  studentDateOfBirth: string;
  studentGrade: string;
  studentAlternateEmail: string;
  
  // Guardian Information
  primaryGuardianFirstName: string;
  primaryGuardianMiddleName: string;
  primaryGuardianLastName: string;
  primaryGuardianRelationship: string;
  primaryGuardianEmail: string;
  primaryGuardianAlternateEmail: string;
  primaryGuardianPhone: string;
  
  // Secondary Guardian (optional)
  hasSecondaryGuardian: boolean;
  secondaryGuardianFirstName: string;
  secondaryGuardianLastName: string;
  secondaryGuardianRelationship: string;
  secondaryGuardianEmail: string;
  secondaryGuardianPhone: string;
  
  // Contact Information
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  secondaryPhoneNumber: string;
  linkedInProfile: string;
  contactAlternateEmail: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  
  // Consent
  parentalConsentRequired: boolean;
  parentalConsentGiven: boolean;
}

const initialData: EnrollmentData = {
  studentFirstName: '',
  studentMiddleName: '',
  studentLastName: '',
  studentPreferredNickname: '',
  studentDateOfBirth: '',
  studentGrade: '',
  studentAlternateEmail: '',
  primaryGuardianFirstName: '',
  primaryGuardianMiddleName: '',
  primaryGuardianLastName: '',
  primaryGuardianRelationship: '',
  primaryGuardianEmail: '',
  primaryGuardianAlternateEmail: '',
  primaryGuardianPhone: '',
  hasSecondaryGuardian: false,
  secondaryGuardianFirstName: '',
  secondaryGuardianLastName: '',
  secondaryGuardianRelationship: '',
  secondaryGuardianEmail: '',
  secondaryGuardianPhone: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  secondaryPhoneNumber: '',
  linkedInProfile: '',
  contactAlternateEmail: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  parentalConsentRequired: false,
  parentalConsentGiven: false,
};

const steps = [
  { title: 'Student Information', description: 'Basic student details' },
  { title: 'Guardian Information', description: 'Parent/guardian details' },
  { title: 'Contact Information', description: 'Address and emergency contact' },
  { title: 'Confirmation', description: 'Review and submit' },
];

export const EnrollmentForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<EnrollmentData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Calculate student age and determine if parental consent is required
  useEffect(() => {
    if (data.studentDateOfBirth) {
      const birthDate = new Date(data.studentDateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        const actualAge = age - 1;
        setData(prev => ({ 
          ...prev, 
          parentalConsentRequired: actualAge < 13,
          parentalConsentGiven: actualAge >= 13 ? true : prev.parentalConsentGiven
        }));
      } else {
        setData(prev => ({ 
          ...prev, 
          parentalConsentRequired: age < 13,
          parentalConsentGiven: age >= 13 ? true : prev.parentalConsentGiven
        }));
      }
    }
  }, [data.studentDateOfBirth]);

  const updateData = (stepData: Partial<EnrollmentData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => phone.replace(/\D/g, '').length >= 7;

  const validateCurrentStep = () => {
    const stepErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: {
        if (!data.studentFirstName.trim()) stepErrors.studentFirstName = 'First name is required';
        if (!data.studentLastName.trim()) stepErrors.studentLastName = 'Last name is required';
        if (!data.studentDateOfBirth) stepErrors.studentDateOfBirth = 'Date of birth is required';
        else {
          const d = new Date(data.studentDateOfBirth);
          if (isNaN(d.getTime())) stepErrors.studentDateOfBirth = 'Enter a valid date';
        }
        if (!data.studentGrade) stepErrors.studentGrade = 'Grade level is required';
        break;
      }
      case 1: {
        if (!data.primaryGuardianFirstName.trim()) stepErrors.primaryGuardianFirstName = 'First name is required';
        if (!data.primaryGuardianLastName.trim()) stepErrors.primaryGuardianLastName = 'Last name is required';
        if (!data.primaryGuardianRelationship) stepErrors.primaryGuardianRelationship = 'Relationship is required';
        if (!data.primaryGuardianEmail.trim()) stepErrors.primaryGuardianEmail = 'Email is required';
        else if (!isEmailValid(data.primaryGuardianEmail)) stepErrors.primaryGuardianEmail = 'Enter a valid email address';
        if (!data.primaryGuardianPhone.trim()) stepErrors.primaryGuardianPhone = 'Phone number is required';
        else if (!isPhoneValid(data.primaryGuardianPhone)) stepErrors.primaryGuardianPhone = 'Enter a valid phone number';

        if (data.parentalConsentRequired && !data.parentalConsentGiven) {
          stepErrors.parentalConsentGiven = 'Parental consent is required';
        }
        break;
      }
      case 2: {
        if (!data.streetAddress.trim()) stepErrors.streetAddress = 'Street address is required';
        if (!data.city.trim()) stepErrors.city = 'City is required';
        if (!data.state) stepErrors.state = 'State is required';
        if (!data.postalCode.trim()) stepErrors.postalCode = 'ZIP code is required';
        if (!data.emergencyContactName.trim()) stepErrors.emergencyContactName = 'Emergency contact name is required';
        if (!data.emergencyContactPhone.trim()) stepErrors.emergencyContactPhone = 'Emergency contact phone is required';
        else if (!isPhoneValid(data.emergencyContactPhone)) stepErrors.emergencyContactPhone = 'Enter a valid phone number';
        if (!data.emergencyContactRelationship) stepErrors.emergencyContactRelationship = 'Relationship is required';
        break;
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      if (!validateCurrentStep()) return;
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your enrollment application.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('enrollment_applications')
        .insert({
          user_id: user.id,
          student_first_name: data.studentFirstName,
          student_last_name: data.studentLastName,
          student_date_of_birth: data.studentDateOfBirth,
          student_grade: data.studentGrade,
          primary_guardian_first_name: data.primaryGuardianFirstName,
          primary_guardian_last_name: data.primaryGuardianLastName,
          primary_guardian_relationship: data.primaryGuardianRelationship,
          primary_guardian_email: data.primaryGuardianEmail,
          primary_guardian_phone: data.primaryGuardianPhone,
          secondary_guardian_first_name: data.hasSecondaryGuardian ? data.secondaryGuardianFirstName : null,
          secondary_guardian_last_name: data.hasSecondaryGuardian ? data.secondaryGuardianLastName : null,
          secondary_guardian_relationship: data.hasSecondaryGuardian ? data.secondaryGuardianRelationship : null,
          secondary_guardian_email: data.hasSecondaryGuardian ? data.secondaryGuardianEmail : null,
          secondary_guardian_phone: data.hasSecondaryGuardian ? data.secondaryGuardianPhone : null,
          street_address: data.streetAddress,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
          emergency_contact_name: data.emergencyContactName,
          emergency_contact_phone: data.emergencyContactPhone,
          emergency_contact_relationship: data.emergencyContactRelationship,
          parental_consent_required: data.parentalConsentRequired,
          parental_consent_given: data.parentalConsentGiven,
          application_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully",
        description: "Your enrollment application has been submitted and is under review.",
      });

      // Reset form and redirect to dashboard
      setData(initialData);
      setCurrentStep(0);
      navigate('/');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StudentInfoStep data={data} updateData={updateData} errors={errors} />;
      case 1:
        return <GuardianInfoStep data={data} updateData={updateData} errors={errors} />;
      case 2:
        return <ContactInfoStep data={data} updateData={updateData} errors={errors} />;
      case 3:
        return <ConfirmationStep data={data} onSubmit={submitApplication} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-button">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Online Enrollment
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Complete your student enrollment application
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-slide-in">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-gradient-primary text-white shadow-button'
                      : 'bg-muted'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="text-xs font-medium">{step.title}</div>
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="shadow-form bg-gradient-card border-0 animate-scale-in">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-center">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="transition-smooth"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-button transition-smooth"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};