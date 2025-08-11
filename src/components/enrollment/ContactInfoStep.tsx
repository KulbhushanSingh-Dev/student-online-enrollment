import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnrollmentData } from '../EnrollmentForm';
import { MapPin, Phone } from 'lucide-react';

interface ContactInfoStepProps {
  data: EnrollmentData;
  updateData: (data: Partial<EnrollmentData>) => void;
}

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const emergencyRelationships = [
  'Mother',
  'Father',
  'Stepmother',
  'Stepfather',
  'Grandmother',
  'Grandfather',
  'Aunt',
  'Uncle',
  'Family Friend',
  'Neighbor',
  'Other'
];

export const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Address Information */}
      <Card className="border border-primary/20 bg-gradient-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Home Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="streetAddress" className="text-sm font-medium">
              Street Address *
            </Label>
            <Input
              id="streetAddress"
              type="text"
              value={data.streetAddress}
              onChange={(e) => updateData({ streetAddress: e.target.value })}
              className="transition-smooth focus:shadow-button"
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City *
              </Label>
              <Input
                id="city"
                type="text"
                value={data.city}
                onChange={(e) => updateData({ city: e.target.value })}
                className="transition-smooth focus:shadow-button"
                placeholder="City name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">
                State *
              </Label>
              <Select
                value={data.state}
                onValueChange={(value) => updateData({ state: value })}
              >
                <SelectTrigger className="transition-smooth focus:shadow-button">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm font-medium">
                ZIP Code *
              </Label>
              <Input
                id="postalCode"
                type="text"
                value={data.postalCode}
                onChange={(e) => updateData({ postalCode: e.target.value })}
                className="transition-smooth focus:shadow-button"
                placeholder="12345"
                maxLength={10}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border border-accent/20 bg-gradient-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="w-5 h-5 text-accent" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="emergencyContactName"
              type="text"
              value={data.emergencyContactName}
              onChange={(e) => updateData({ emergencyContactName: e.target.value })}
              className="transition-smooth focus:shadow-button"
              placeholder="Emergency contact full name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                value={data.emergencyContactPhone}
                onChange={(e) => updateData({ emergencyContactPhone: e.target.value })}
                className="transition-smooth focus:shadow-button"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship" className="text-sm font-medium">
                Relationship *
              </Label>
              <Select
                value={data.emergencyContactRelationship}
                onValueChange={(value) => updateData({ emergencyContactRelationship: value })}
              >
                <SelectTrigger className="transition-smooth focus:shadow-button">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {emergencyRelationships.map((relationship) => (
                    <SelectItem key={relationship} value={relationship}>
                      {relationship}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <strong>Note:</strong> This person will be contacted in case of emergencies when primary guardians are not available.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};