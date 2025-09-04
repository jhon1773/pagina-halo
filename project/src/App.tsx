import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { LandingPage } from './components/Home/LandingPage';
import { RegistrationForm } from './components/Registration/RegistrationForm';
import { AptitudeTest } from './components/Testing/AptitudeTest';
import { AdminPanel } from './components/Admin/AdminPanel';
import { TestResults } from './types';

function App() {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [candidateId, setCandidateId] = useState<string | undefined>(undefined);

  const handleNavigation = (section: string, id?: string) => {
    setCurrentSection(section);
    if (id) {
      setCandidateId(id);
    }
  };

  const handleTestComplete = (results: TestResults) => {
    // Test completed - could redirect to results page or back to home
    console.log('Test completed with results:', results);
    alert(`Test completed! Overall Score: ${results.overallScore}%\n\nCheck the Admin Panel to see your full results.`);
    setCurrentSection('home');
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'register':
        return <RegistrationForm onNavigate={handleNavigation} />;
      case 'test':
        return <AptitudeTest candidateId={candidateId} onComplete={handleTestComplete} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <LandingPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentSection={currentSection} onNavigate={handleNavigation} />
      <main>
        {renderCurrentSection()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">© 2557 United Nations Space Command | All Rights Reserved</p>
            <p className="text-xs">
              "Defending humanity across the galaxy" | Classification: UNSC RECRUITING DIVISION
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;