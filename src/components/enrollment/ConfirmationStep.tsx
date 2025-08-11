import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EnrollmentData } from '../EnrollmentForm';
import { CheckCircle, User, Users, MapPin, Phone, FileText } from 'lucide-react';

interface ConfirmationStepProps {
  data: EnrollmentData;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ data, onSubmit, isSubmitting }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-button animate-scale-in">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Review Your Application</h3>
        <p className="text-muted-foreground">
          Please review all information before submitting your enrollment application.
        </p>
      </div>

      {/* Student Information */}
      <Card className="border border-primary/20 bg-gradient-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Name:</span>
              <p className="font-medium">{data.studentFirstName} {data.studentLastName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Date of Birth:</span>
              <p className="font-medium">{formatDate(data.studentDateOfBirth)}</p>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Grade Level:</span>
            <p className="font-medium">{data.studentGrade}</p>
          </div>
          {data.parentalConsentRequired && (
            <div className="mt-4 p-3 bg-education-success/10 border border-education-success/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-education-success" />
                <span className="text-sm font-medium">
                  {data.parentalConsentGiven ? 'Parental consent provided' : 'Parental consent required'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guardian Information */}
      <Card className="border border-primary/20 bg-gradient-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-primary" />
            Guardian Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-3">Primary Guardian</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Name:</span>
                <p className="font-medium">{data.primaryGuardianFirstName} {data.primaryGuardianLastName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Relationship:</span>
                <p className="font-medium">{data.primaryGuardianRelationship}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Email:</span>
                <p className="font-medium">{data.primaryGuardianEmail}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                <p className="font-medium">{data.primaryGuardianPhone}</p>
              </div>
            </div>
          </div>

          {data.hasSecondaryGuardian && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Secondary Guardian</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Name:</span>
                    <p className="font-medium">{data.secondaryGuardianFirstName} {data.secondaryGuardianLastName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Relationship:</span>
                    <p className="font-medium">{data.secondaryGuardianRelationship}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                    <p className="font-medium">{data.secondaryGuardianEmail}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                    <p className="font-medium">{data.secondaryGuardianPhone}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border border-primary/20 bg-gradient-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-3">Home Address</h4>
            <p className="font-medium">
              {data.streetAddress}<br />
              {data.city}, {data.state} {data.postalCode}
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Name:</span>
                <p className="font-medium">{data.emergencyContactName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                <p className="font-medium">{data.emergencyContactPhone}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Relationship:</span>
                <p className="font-medium">{data.emergencyContactRelationship}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center pt-6">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || (data.parentalConsentRequired && !data.parentalConsentGiven)}
          className="w-full md:w-auto px-8 py-3 bg-gradient-primary hover:bg-gradient-primary/90 shadow-button transition-smooth text-lg font-semibold"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Submitting Application...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Submit Enrollment Application
            </>
          )}
        </Button>

        {data.parentalConsentRequired && !data.parentalConsentGiven && (
          <p className="text-sm text-destructive mt-2">
            Parental consent is required to submit the application.
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
          By submitting this application, you confirm that all information provided is accurate and complete. 
          You will receive a confirmation email once your application has been submitted.
        </p>
      </div>
    </div>
  );
};