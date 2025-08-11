import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnrollmentData } from '../EnrollmentForm';

interface StudentInfoStepProps {
  data: EnrollmentData;
  updateData: (data: Partial<EnrollmentData>) => void;
}

const grades = [
  'Pre-K',
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
];

export const StudentInfoStep: React.FC<StudentInfoStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="studentFirstName" className="text-sm font-medium">
            First Name *
          </Label>
          <Input
            id="studentFirstName"
            type="text"
            value={data.studentFirstName}
            onChange={(e) => updateData({ studentFirstName: e.target.value })}
            className="transition-smooth focus:shadow-button"
            placeholder="Enter student's first name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentLastName" className="text-sm font-medium">
            Last Name *
          </Label>
          <Input
            id="studentLastName"
            type="text"
            value={data.studentLastName}
            onChange={(e) => updateData({ studentLastName: e.target.value })}
            className="transition-smooth focus:shadow-button"
            placeholder="Enter student's last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="studentDateOfBirth" className="text-sm font-medium">
            Date of Birth *
          </Label>
          <Input
            id="studentDateOfBirth"
            type="date"
            value={data.studentDateOfBirth}
            onChange={(e) => updateData({ studentDateOfBirth: e.target.value })}
            className="transition-smooth focus:shadow-button"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentGrade" className="text-sm font-medium">
            Grade Level *
          </Label>
          <Select
            value={data.studentGrade}
            onValueChange={(value) => updateData({ studentGrade: value })}
          >
            <SelectTrigger className="transition-smooth focus:shadow-button">
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.parentalConsentRequired && (
        <div className="mt-6 p-4 bg-education-warning/10 border border-education-warning/20 rounded-lg animate-slide-in">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-education-warning rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Parental Consent Required</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Since the student is under 13 years old, parental consent will be required to complete the enrollment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};