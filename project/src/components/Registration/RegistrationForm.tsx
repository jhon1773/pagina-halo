import React, { useState } from 'react';
import { User, Mail, Calendar, Globe, GraduationCap, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { PersonalInfo, Division, PhysicalCondition, EducationLevel } from '../../types';
import { divisionRequirements } from '../../data/divisions';
import { candidateService } from '../../services/candidateService';

interface RegistrationFormProps {
  onNavigate: (section: string, candidateId?: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [selectedDivision, setSelectedDivision] = useState<Division>('marine');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    age: 18,
    nationality: '',
    physicalCondition: 'good',
    education: 'high-school',
    militaryExperience: false
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentDivision = divisionRequirements.find(d => d.division === selectedDivision)!;

  const validateEligibility = (): string[] => {
    const errors: string[] = [];
    
    if (personalInfo.age < currentDivision.minAge || personalInfo.age > currentDivision.maxAge) {
      errors.push(`Age must be between ${currentDivision.minAge} and ${currentDivision.maxAge} for ${currentDivision.name}`);
    }
    
    const physicalLevels = { poor: 1, fair: 2, good: 3, excellent: 4 };
    const requiredPhysical = physicalLevels[currentDivision.minPhysicalCondition];
    const candidatePhysical = physicalLevels[personalInfo.physicalCondition];
    
    if (candidatePhysical < requiredPhysical) {
      errors.push(`Physical condition must be at least ${currentDivision.minPhysicalCondition} for ${currentDivision.name}`);
    }
    
    const educationLevels = { 'high-school': 1, bachelor: 2, master: 3, doctorate: 4 };
    const requiredEducation = educationLevels[currentDivision.minEducation];
    const candidateEducation = educationLevels[personalInfo.education];
    
    if (candidateEducation < requiredEducation) {
      errors.push(`Education level must be at least ${currentDivision.minEducation} for ${currentDivision.name}`);
    }
    
    if (currentDivision.militaryExperienceRequired && !personalInfo.militaryExperience) {
      errors.push(`Military experience is required for ${currentDivision.name}`);
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const candidateId = candidateService.registerCandidate({
        personalInfo,
        division: selectedDivision,
        status: 'pending',
        testResults: {
          reactionTime: 0,
          accuracy: 0,
          strategicThinking: 0,
          overallScore: 0,
          completedTests: []
        }
      });
      
      setIsSubmitting(false);
      onNavigate('test', candidateId);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Registration failed:', error);
    }
  };

  const renderDivisionSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4 tracking-wider">SELECT YOUR DIVISION</h2>
        <p className="text-gray-400">Choose the division that matches your skills and ambition.</p>
      </div>
      
      <div className="grid gap-6">
        {divisionRequirements.map((division) => (
          <div
            key={division.division}
            onClick={() => setSelectedDivision(division.division)}
            className={`p-6 border-2 cursor-pointer transition-all duration-300 ${
              selectedDivision === division.division
                ? 'border-yellow-500 bg-yellow-500 bg-opacity-10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-yellow-500 tracking-wider">{division.name.toUpperCase()}</h3>
              {selectedDivision === division.division && (
                <CheckCircle className="h-6 w-6 text-yellow-500" />
              )}
            </div>
            <p className="text-gray-300 mb-4">{division.description}</p>
            <div className="text-sm text-gray-400">
              <p>Age: {division.minAge}-{division.maxAge} | Education: {division.minEducation}+</p>
              <p>Physical: {division.minPhysicalCondition}+ | Military Experience: {division.militaryExperienceRequired ? 'Required' : 'Not Required'}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={() => setStep(2)}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 font-bold tracking-wider transition-all duration-300"
      >
        CONTINUE TO PERSONAL INFO
      </button>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4 tracking-wider">PERSONAL INFORMATION</h2>
        <p className="text-gray-400">Provide accurate information for security clearance verification.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            <User className="inline h-4 w-4 mr-2" />
            First Name
          </label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            <User className="inline h-4 w-4 mr-2" />
            Last Name
          </label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            <Mail className="inline h-4 w-4 mr-2" />
            Email Address
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            <Calendar className="inline h-4 w-4 mr-2" />
            Age
          </label>
          <input
            type="number"
            value={personalInfo.age}
            onChange={(e) => setPersonalInfo({...personalInfo, age: parseInt(e.target.value)})}
            min="16" max="50"
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            <Globe className="inline h-4 w-4 mr-2" />
            Nationality
          </label>
          <input
            type="text"
            value={personalInfo.nationality}
            onChange={(e) => setPersonalInfo({...personalInfo, nationality: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            <GraduationCap className="inline h-4 w-4 mr-2" />
            Education Level
          </label>
          <select
            value={personalInfo.education}
            onChange={(e) => setPersonalInfo({...personalInfo, education: e.target.value as EducationLevel})}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
          >
            <option value="high-school">High School</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="doctorate">Doctorate</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            <Activity className="inline h-4 w-4 mr-2" />
            Physical Condition
          </label>
          <select
            value={personalInfo.physicalCondition}
            onChange={(e) => setPersonalInfo({...personalInfo, physicalCondition: e.target.value as PhysicalCondition})}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
          >
            <option value="poor">Poor</option>
            <option value="fair">Fair</option>
            <option value="good">Good</option>
            <option value="excellent">Excellent</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={personalInfo.militaryExperience}
              onChange={(e) => setPersonalInfo({...personalInfo, militaryExperience: e.target.checked})}
              className="form-checkbox h-5 w-5 text-yellow-500"
            />
            <span className="text-gray-300">I have military experience</span>
          </label>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 px-6 font-bold tracking-wider transition-all duration-300"
        >
          BACK
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-3 px-6 font-bold tracking-wider transition-all duration-300"
        >
          REVIEW APPLICATION
        </button>
      </div>
    </div>
  );

  const renderReview = () => {
    const errors = validateEligibility();
    const isEligible = errors.length === 0;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-yellow-500 mb-4 tracking-wider">REVIEW & SUBMIT</h2>
          <p className="text-gray-400">Verify your information before final submission.</p>
        </div>

        {/* Eligibility Status */}
        <div className={`p-6 border-2 ${isEligible ? 'border-green-500 bg-green-500 bg-opacity-10' : 'border-red-500 bg-red-500 bg-opacity-10'}`}>
          <div className="flex items-center mb-4">
            {isEligible ? (
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            )}
            <h3 className="text-xl font-bold text-gray-100">
              {isEligible ? 'ELIGIBLE FOR SERVICE' : 'ELIGIBILITY ISSUES DETECTED'}
            </h3>
          </div>
          
          {!isEligible && (
            <ul className="text-red-400 space-y-2">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Application Summary */}
        <div className="bg-gray-800 p-6">
          <h3 className="text-xl font-bold text-yellow-500 mb-4">APPLICATION SUMMARY</h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div><strong>Division:</strong> {currentDivision.name}</div>
            <div><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</div>
            <div><strong>Age:</strong> {personalInfo.age}</div>
            <div><strong>Education:</strong> {personalInfo.education}</div>
            <div><strong>Physical Condition:</strong> {personalInfo.physicalCondition}</div>
            <div><strong>Military Experience:</strong> {personalInfo.militaryExperience ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setStep(2)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 px-6 font-bold tracking-wider transition-all duration-300"
          >
            BACK
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isEligible || isSubmitting}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400 text-black py-3 px-6 font-bold tracking-wider transition-all duration-300"
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gray-800 border border-gray-700 p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Step {step} of 3</span>
              <span className="text-sm text-gray-400">{Math.round((step / 3) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 h-2">
              <div
                className="bg-yellow-500 h-2 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {step === 1 && renderDivisionSelection()}
          {step === 2 && renderPersonalInfo()}
          {step === 3 && renderReview()}
        </div>
      </div>
    </div>
  );
};