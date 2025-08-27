import React, { useState, useEffect } from 'react';
import { Timer, Target, Zap, Brain, CheckCircle } from 'lucide-react';
import { candidateService } from '../../services/candidateService';
import { TestResults } from '../../types';

interface AptitudeTestProps {
  candidateId?: string;
  onComplete: (results: TestResults) => void;
}

export const AptitudeTest: React.FC<AptitudeTestProps> = ({ candidateId, onComplete }) => {
  const [currentTest, setCurrentTest] = useState<'reaction' | 'accuracy' | 'strategy' | 'completed'>('reaction');
  const [testResults, setTestResults] = useState<TestResults>({
    reactionTime: 0,
    accuracy: 0,
    strategicThinking: 0,
    overallScore: 0,
    completedTests: []
  });

  // Reaction Time Test
  const [reactionPhase, setReactionPhase] = useState<'waiting' | 'ready' | 'active' | 'completed'>('waiting');
  const [reactionStartTime, setReactionStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Accuracy Test
  const [targets, setTargets] = useState<Array<{id: number, x: number, y: number, hit: boolean}>>([]);
  const [accuracyScore, setAccuracyScore] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);

  // Strategy Test
  const [strategyQuestion, setStrategyQuestion] = useState(0);
  const [strategyAnswers, setStrategyAnswers] = useState<number[]>([]);

  const strategyQuestions = [
    {
      question: "You're leading a squad through hostile territory. Covenant forces are detected 200m ahead. Your best approach is:",
      options: [
        "Direct frontal assault to overwhelm the enemy",
        "Flank from the left while providing covering fire",
        "Call in orbital bombardment and retreat",
        "Send scouts ahead to gather intelligence first"
      ],
      correct: 3
    },
    {
      question: "Your squad is pinned down by plasma fire. You notice a fuel rod cannon position that needs to be neutralized. Your priority is:",
      options: [
        "Charge the position with full squad",
        "Use grenades to suppress and advance",
        "Request backup from command",
        "Coordinate with nearby units for a combined assault"
      ],
      correct: 3
    },
    {
      question: "During a search and destroy mission, you encounter civilians in the combat zone. Your immediate action is:",
      options: [
        "Continue mission as planned",
        "Evacuate civilians immediately",
        "Secure the area and assess threat level",
        "Radio for civilian extraction support"
      ],
      correct: 2
    }
  ];

  useEffect(() => {
    if (currentTest === 'completed') {
      const overall = Math.round((testResults.reactionTime + testResults.accuracy + testResults.strategicThinking) / 3);
      const finalResults = { ...testResults, overallScore: overall };
      
      if (candidateId) {
        candidateService.updateTestResults(candidateId, finalResults);
      }
      
      onComplete(finalResults);
    }
  }, [currentTest, testResults, candidateId, onComplete]);

  const startReactionTest = () => {
    setReactionPhase('ready');
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    setTimeout(() => {
      setReactionPhase('active');
      setReactionStartTime(Date.now());
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionPhase === 'active') {
      const reactionTime = Date.now() - reactionStartTime;
      const newTimes = [...reactionTimes, reactionTime];
      setReactionTimes(newTimes);
      
      if (newTimes.length < 5) {
        setReactionPhase('waiting');
        setTimeout(() => startReactionTest(), 1500);
      } else {
        const avgTime = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
        const score = Math.max(0, 100 - (avgTime - 200) / 5); // Score based on reaction time
        setTestResults(prev => ({ 
          ...prev, 
          reactionTime: Math.round(Math.max(0, Math.min(100, score))),
          completedTests: [...prev.completedTests, 'reaction']
        }));
        setReactionPhase('completed');
      }
    }
  };

  const generateTargets = () => {
    const newTargets = [];
    for (let i = 0; i < 15; i++) {
      newTargets.push({
        id: i,
        x: Math.random() * 80 + 10, // 10-90% of container width
        y: Math.random() * 80 + 10, // 10-90% of container height
        hit: false
      });
    }
    setTargets(newTargets);
    setTotalTargets(15);
    
    // Auto-complete after 30 seconds
    setTimeout(() => {
      if (currentTest === 'accuracy') {
        completeAccuracyTest();
      }
    }, 30000);
  };

  const hitTarget = (targetId: number) => {
    setTargets(prev => prev.map(t => 
      t.id === targetId ? { ...t, hit: true } : t
    ));
    setAccuracyScore(prev => prev + 1);
  };

  const completeAccuracyTest = () => {
    const score = Math.round((accuracyScore / totalTargets) * 100);
    setTestResults(prev => ({ 
      ...prev, 
      accuracy: score,
      completedTests: [...prev.completedTests, 'accuracy']
    }));
    setCurrentTest('strategy');
  };

  const answerStrategy = (answerIndex: number) => {
    const newAnswers = [...strategyAnswers, answerIndex];
    setStrategyAnswers(newAnswers);
    
    if (strategyQuestion < strategyQuestions.length - 1) {
      setStrategyQuestion(prev => prev + 1);
    } else {
      // Calculate strategy score
      let correct = 0;
      newAnswers.forEach((answer, index) => {
        if (answer === strategyQuestions[index].correct) {
          correct++;
        }
      });
      const score = Math.round((correct / strategyQuestions.length) * 100);
      setTestResults(prev => ({ 
        ...prev, 
        strategicThinking: score,
        completedTests: [...prev.completedTests, 'strategy']
      }));
      setCurrentTest('completed');
    }
  };

  const renderReactionTest = () => (
    <div className="text-center space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-yellow-500 mb-4">REACTION TIME TEST</h3>
        <p className="text-gray-400 mb-6">Click as soon as the target appears. Complete 5 rounds.</p>
      </div>

      <div className="mb-4">
        <p className="text-gray-300">Round: {reactionTimes.length + 1}/5</p>
      </div>

      <div className="relative w-full h-96 bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
        {reactionPhase === 'waiting' && (
          <div className="text-center">
            <Timer className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Get ready...</p>
            <button 
              onClick={startReactionTest}
              className="mt-4 bg-yellow-500 text-black px-6 py-2 font-bold"
            >
              START
            </button>
          </div>
        )}
        
        {reactionPhase === 'ready' && (
          <div className="text-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-4"></div>
            <p className="text-red-400">Wait for green...</p>
          </div>
        )}
        
        {reactionPhase === 'active' && (
          <div 
            onClick={handleReactionClick}
            className="w-24 h-24 bg-green-500 rounded-full cursor-pointer animate-pulse"
          ></div>
        )}
      </div>

      {reactionTimes.length > 0 && (
        <div className="text-sm text-gray-400">
          Last reaction time: {reactionTimes[reactionTimes.length - 1]}ms
        </div>
      )}

      {reactionPhase === 'completed' && (
        <button 
          onClick={() => setCurrentTest('accuracy')}
          className="bg-yellow-500 text-black px-8 py-3 font-bold"
        >
          NEXT TEST: ACCURACY
        </button>
      )}
    </div>
  );

  const renderAccuracyTest = () => (
    <div className="text-center space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-yellow-500 mb-4">TARGET ACCURACY TEST</h3>
        <p className="text-gray-400 mb-6">Hit as many targets as possible. You have 30 seconds.</p>
      </div>

      <div className="flex justify-between text-gray-300 mb-4">
        <span>Targets Hit: {accuracyScore}/{totalTargets}</span>
        <span>Accuracy: {Math.round((accuracyScore / Math.max(1, totalTargets)) * 100)}%</span>
      </div>

      <div className="relative w-full h-96 bg-gray-800 border-2 border-gray-600">
        {targets.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <button 
              onClick={generateTargets}
              className="bg-yellow-500 text-black px-8 py-3 font-bold"
            >
              BEGIN ACCURACY TEST
            </button>
          </div>
        ) : (
          targets.map(target => (
            <div
              key={target.id}
              onClick={() => !target.hit && hitTarget(target.id)}
              className={`absolute w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${
                target.hit 
                  ? 'bg-green-500 transform scale-0' 
                  : 'bg-red-500 hover:bg-red-400 animate-pulse'
              }`}
              style={{ 
                left: `${target.x}%`, 
                top: `${target.y}%`,
                transform: target.hit ? 'scale(0)' : 'scale(1)'
              }}
            >
              <Target className="h-full w-full text-white p-1" />
            </div>
          ))
        )}
      </div>

      {accuracyScore === totalTargets && (
        <button 
          onClick={completeAccuracyTest}
          className="bg-green-500 text-white px-8 py-3 font-bold"
        >
          PERFECT SCORE! CONTINUE
        </button>
      )}

      {targets.length > 0 && (
        <button 
          onClick={completeAccuracyTest}
          className="bg-yellow-500 text-black px-8 py-3 font-bold"
        >
          FINISH ACCURACY TEST
        </button>
      )}
    </div>
  );

  const renderStrategyTest = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-yellow-500 mb-4">STRATEGIC THINKING TEST</h3>
        <p className="text-gray-400 mb-6">Answer tactical scenario questions. Choose the best course of action.</p>
      </div>

      <div className="bg-gray-800 p-6">
        <div className="mb-6">
          <span className="text-sm text-gray-400">Question {strategyQuestion + 1} of {strategyQuestions.length}</span>
          <div className="w-full bg-gray-700 h-2 mt-2">
            <div 
              className="bg-yellow-500 h-2 transition-all duration-300"
              style={{ width: `${((strategyQuestion + 1) / strategyQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h4 className="text-xl text-gray-100 mb-6">
          {strategyQuestions[strategyQuestion].question}
        </h4>

        <div className="space-y-3">
          {strategyQuestions[strategyQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => answerStrategy(index)}
              className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200"
            >
              <span className="font-bold text-yellow-500 mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="text-center space-y-8">
      <div>
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-yellow-500 mb-4">APTITUDE TEST COMPLETE</h3>
        <p className="text-gray-400">Your results have been recorded and submitted for evaluation.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6">
          <Zap className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-gray-100 mb-2">Reaction Time</h4>
          <div className="text-3xl font-bold text-blue-500">{testResults.reactionTime}%</div>
        </div>
        
        <div className="bg-gray-800 p-6">
          <Target className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-gray-100 mb-2">Accuracy</h4>
          <div className="text-3xl font-bold text-green-500">{testResults.accuracy}%</div>
        </div>
        
        <div className="bg-gray-800 p-6">
          <Brain className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-gray-100 mb-2">Strategic Thinking</h4>
          <div className="text-3xl font-bold text-purple-500">{testResults.strategicThinking}%</div>
        </div>
      </div>

      <div className="bg-yellow-500 bg-opacity-10 border-2 border-yellow-500 p-6">
        <h4 className="text-2xl font-bold text-yellow-500 mb-2">OVERALL SCORE</h4>
        <div className="text-4xl font-bold text-yellow-500">{testResults.overallScore}%</div>
        <p className="text-gray-300 mt-2">
          {testResults.overallScore >= 90 ? 'EXCEPTIONAL - SPARTAN CANDIDATE' :
           testResults.overallScore >= 80 ? 'EXCELLENT - ODST CANDIDATE' :
           testResults.overallScore >= 65 ? 'GOOD - MARINE CANDIDATE' :
           'ADDITIONAL TRAINING RECOMMENDED'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gray-800 border border-gray-700 p-8">
          {currentTest === 'reaction' && renderReactionTest()}
          {currentTest === 'accuracy' && renderAccuracyTest()}
          {currentTest === 'strategy' && renderStrategyTest()}
          {currentTest === 'completed' && renderResults()}
        </div>
      </div>
    </div>
  );
};