import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnrollmentData } from '../EnrollmentForm';

interface StudentInfoStepProps {
  data: EnrollmentData;
  updateData: (data: Partial<EnrollmentData>) => void;
  errors?: Record<string, string>;
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

export const StudentInfoStep: React.FC<StudentInfoStepProps> = ({ data, updateData, errors }) => {
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
          {errors?.studentFirstName && (
            <p className="text-sm text-destructive mt-1">{errors.studentFirstName}</p>
          )}
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
          {errors?.studentLastName && (
            <p className="text-sm text-destructive mt-1">{errors.studentLastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="studentMiddleName" className="text-sm font-medium">
            Middle Name
          </Label>
          <Input
            id="studentMiddleName"
            type="text"
            value={data.studentMiddleName}
            onChange={(e) => updateData({ studentMiddleName: e.target.value })}
            className="transition-smooth focus:shadow-button"
            placeholder="Enter student's middle name (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentPreferredNickname" className="text-sm font-medium">
            Preferred Nickname
          </Label>
          <Input
            id="studentPreferredNickname"
            type="text"
            value={data.studentPreferredNickname}
            onChange={(e) => updateData({ studentPreferredNickname: e.target.value })}
            className="transition-smooth focus:shadow-button"
            placeholder="Enter preferred nickname (optional)"
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
          {errors?.studentDateOfBirth && (
            <p className="text-sm text-destructive mt-1">{errors.studentDateOfBirth}</p>
          )}
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
          {errors?.studentGrade && (
            <p className="text-sm text-destructive mt-1">{errors.studentGrade}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="studentAlternateEmail" className="text-sm font-medium">
          Alternate Email
        </Label>
        <Input
          id="studentAlternateEmail"
          type="email"
          value={data.studentAlternateEmail}
          onChange={(e) => updateData({ studentAlternateEmail: e.target.value })}
          className="transition-smooth focus:shadow-button"
          placeholder="student.alt@example.com"
        />
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