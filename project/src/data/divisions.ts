import { DivisionRequirements } from '../types';

export const divisionRequirements: DivisionRequirements[] = [
  {
    division: 'marine',
    name: 'UNSC Marine Corps',
    description: 'The backbone of the UNSC military. Marines are the first line of defense against the Covenant threat.',
    minAge: 18,
    maxAge: 35,
    minPhysicalCondition: 'good',
    minEducation: 'high-school',
    militaryExperienceRequired: false,
    specialRequirements: [
      'Basic combat training readiness',
      'Teamwork and unit cohesion',
      'Adaptability under pressure'
    ]
  },
  {
    division: 'odst',
    name: 'Orbital Drop Shock Troopers',
    description: 'Elite shock troops who drop from orbit into hostile territory. "Feet First Into Hell"',
    minAge: 21,
    maxAge: 32,
    minPhysicalCondition: 'excellent',
    minEducation: 'bachelor',
    militaryExperienceRequired: true,
    specialRequirements: [
      'Advanced combat experience',
      'Psychological stability under extreme stress',
      'Exceptional physical conditioning',
      'Paratrooper qualification'
    ]
  },
  {
    division: 'spartan',
    name: 'Spartan Program',
    description: 'The ultimate super-soldiers. Enhanced humans capable of extraordinary feats in battle.',
    minAge: 18,
    maxAge: 25,
    minPhysicalCondition: 'excellent',
    minEducation: 'bachelor',
    militaryExperienceRequired: false,
    specialRequirements: [
      'Exceptional genetic markers',
      'Superior mental acuity',
      'Peak physical condition',
      'Psychological evaluation clearance',
      'Willing to undergo augmentation procedures'
    ]
  }
];