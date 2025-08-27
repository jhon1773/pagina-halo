import React from 'react';
import { ArrowRight, Shield, Users, Target, Award } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (section: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23FFD700%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 bg-opacity-20 rounded-full mb-4">
              <Shield className="h-12 w-12 text-yellow-500" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-yellow-500 mb-4 tracking-wider">
              ANSWER
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6 tracking-wider">
              THE CALL
            </h2>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Humanity needs heroes. The UNSC is calling for brave souls to defend our species against the greatest threat we've ever faced.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('register')}
              className="group bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-none font-bold text-lg tracking-wider transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              ENLIST NOW
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => onNavigate('test')}
              className="bg-transparent border-2 border-gray-400 hover:border-yellow-500 text-gray-300 hover:text-yellow-500 px-8 py-4 rounded-none font-bold text-lg tracking-wider transition-all duration-300"
            >
              APTITUDE TEST
            </button>
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-yellow-500 mb-4 tracking-wider">CHOOSE YOUR PATH</h3>
            <p className="text-gray-300 text-lg">Three divisions. One mission. Infinite honor.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Marines */}
            <div className="group bg-gray-900 border border-gray-700 hover:border-green-500 p-8 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-green-500 mr-3" />
                <h4 className="text-2xl font-bold text-green-500 tracking-wider">MARINES</h4>
              </div>
              <p className="text-gray-300 mb-6">
                The backbone of the UNSC. First to fight, last to fall. Marines hold the line when everything goes to hell.
              </p>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Infantry Combat</li>
                <li>• Vehicle Operations</li>
                <li>• Planetary Defense</li>
                <li>• Frontline Operations</li>
              </ul>
            </div>

            {/* ODST */}
            <div className="group bg-gray-900 border border-gray-700 hover:border-orange-500 p-8 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-orange-500 mr-3" />
                <h4 className="text-2xl font-bold text-orange-500 tracking-wider">ODST</h4>
              </div>
              <p className="text-gray-300 mb-6">
                Orbital Drop Shock Troopers. "Feet First Into Hell." Elite soldiers who drop from orbit into hostile territory.
              </p>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Orbital Insertion</li>
                <li>• Special Operations</li>
                <li>• Behind Enemy Lines</li>
                <li>• Urban Warfare</li>
              </ul>
            </div>

            {/* Spartan */}
            <div className="group bg-gray-900 border border-gray-700 hover:border-blue-500 p-8 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 text-blue-500 mr-3" />
                <h4 className="text-2xl font-bold text-blue-500 tracking-wider">SPARTAN</h4>
              </div>
              <p className="text-gray-300 mb-6">
                Humanity's greatest weapons. Augmented super-soldiers capable of turning the tide of any battle.
              </p>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Genetic Augmentation</li>
                <li>• Advanced Combat</li>
                <li>• Strategic Operations</li>
                <li>• Covenant Elimination</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-black mb-6 tracking-wider">THE COVENANT WON'T WAIT</h3>
          <p className="text-black text-xl mb-8 max-w-2xl mx-auto">
            Every moment of hesitation gives the enemy another chance to destroy what we hold dear. Your planet, your family, your species - they all depend on heroes like you.
          </p>
          <button 
            onClick={() => onNavigate('register')}
            className="bg-black hover:bg-gray-900 text-yellow-500 px-12 py-4 rounded-none font-bold text-xl tracking-wider transition-all duration-300 transform hover:scale-105"
          >
            JOIN THE FIGHT
          </button>
        </div>
      </section>
    </div>
  )
};