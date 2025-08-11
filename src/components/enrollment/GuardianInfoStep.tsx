import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnrollmentData } from '../EnrollmentForm';
import { Users, User } from 'lucide-react';

interface GuardianInfoStepProps {
  data: EnrollmentData;
  updateData: (data: Partial<EnrollmentData>) => void;
}

const relationships = [
  'Mother',
  'Father',
  'Stepmother',
  'Stepfather',
  'Grandmother',
  'Grandfather',
  'Aunt',
  'Uncle',
  'Legal Guardian',
  'Other'
];

export const GuardianInfoStep: React.FC<GuardianInfoStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Primary Guardian */}
      <Card className="border border-primary/20 bg-gradient-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            Primary Guardian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryGuardianFirstName" className="text-sm font-medium">
                First Name *
              </Label>
              <Input
                id="primaryGuardianFirstName"
                type="text"
                value={data.primaryGuardianFirstName}
                onChange={(e) => updateData({ primaryGuardianFirstName: e.target.value })}
                className="transition-smooth focus:shadow-button"
                placeholder="Guardian's first name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryGuardianLastName" className="text-sm font-medium">
                Last Name *
              </Label>
              <Input
                id="primaryGuardianLastName"
                type="text"
                value={data.primaryGuardianLastName}
                onChange={(e) => updateData({ primaryGuardianLastName: e.target.value })}
                className="transition-smooth focus:shadow-button"
                placeholder="Guardian's last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryGuardianRelationship" className="text-sm font-medium">
              Relationship to Student *
            </Label>
            <Select
              value={data.primaryGuardianRelationship}
              onValueChange={(value) => updateData({ primaryGuardianRelationship: value })}
            >
              <SelectTrigger className="transition-smooth focus:shadow-button">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationships.map((relationship) => (
                  <SelectItem key={relationship} value={relationship}>
                    {relationship}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryGuardianEmail" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="primaryGuardianEmail"
                type="email"
                value={data.primaryGuardianEmail}
                onChange={(e) => updateData({ primaryGuardianEmail: e.target.value })}
                className="transition-smooth focus:shadow-button"
                placeholder="guardian@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryGuardianPhone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                id="primaryGuardianPhone"
                type="tel"
                value={data.primaryGuardianPhone}
                onChange={(e) => updateData({ primaryGuardianPhone: e.target.value })}
                className="transition-smooth focus:shadow-button"
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Guardian Option */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="hasSecondaryGuardian"
            checked={data.hasSecondaryGuardian}
            onCheckedChange={(checked) => updateData({ hasSecondaryGuardian: checked as boolean })}
          />
          <Label htmlFor="hasSecondaryGuardian" className="text-sm font-medium cursor-pointer">
            Add Secondary Guardian Information
          </Label>
        </div>

        {data.hasSecondaryGuardian && (
          <Card className="border border-accent/20 bg-gradient-card animate-slide-in">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-accent" />
                Secondary Guardian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryGuardianFirstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="secondaryGuardianFirstName"
                    type="text"
                    value={data.secondaryGuardianFirstName}
                    onChange={(e) => updateData({ secondaryGuardianFirstName: e.target.value })}
                    className="transition-smooth focus:shadow-button"
                    placeholder="Guardian's first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryGuardianLastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="secondaryGuardianLastName"
                    type="text"
                    value={data.secondaryGuardianLastName}
                    onChange={(e) => updateData({ secondaryGuardianLastName: e.target.value })}
                    className="transition-smooth focus:shadow-button"
                    placeholder="Guardian's last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryGuardianRelationship" className="text-sm font-medium">
                  Relationship to Student
                </Label>
                <Select
                  value={data.secondaryGuardianRelationship}
                  onValueChange={(value) => updateData({ secondaryGuardianRelationship: value })}
                >
                  <SelectTrigger className="transition-smooth focus:shadow-button">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map((relationship) => (
                      <SelectItem key={relationship} value={relationship}>
                        {relationship}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryGuardianEmail" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="secondaryGuardianEmail"
                    type="email"
                    value={data.secondaryGuardianEmail}
                    onChange={(e) => updateData({ secondaryGuardianEmail: e.target.value })}
                    className="transition-smooth focus:shadow-button"
                    placeholder="guardian@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryGuardianPhone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="secondaryGuardianPhone"
                    type="tel"
                    value={data.secondaryGuardianPhone}
                    onChange={(e) => updateData({ secondaryGuardianPhone: e.target.value })}
                    className="transition-smooth focus:shadow-button"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Parental Consent */}
      {data.parentalConsentRequired && (
        <Card className="border border-education-warning/20 bg-education-warning/5 animate-slide-in">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="parentalConsentGiven"
                checked={data.parentalConsentGiven}
                onCheckedChange={(checked) => updateData({ parentalConsentGiven: checked as boolean })}
              />
              <Label htmlFor="parentalConsentGiven" className="text-sm cursor-pointer">
                I give consent for my child to enroll in this educational institution and understand the terms and conditions.
              </Label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};