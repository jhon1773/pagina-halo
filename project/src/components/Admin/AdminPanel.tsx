import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Filter, Search, Eye, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { candidateService } from '../../services/candidateService';
import { Candidate, CandidateStatus, Division } from '../../types';

export const AdminPanel: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<any>({});
  const [filters, setFilters] = useState({
    status: 'all' as CandidateStatus | 'all',
    division: 'all' as Division | 'all',
    search: ''
  });
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [candidates, filters]);

  const loadData = () => {
    const allCandidates = candidateService.getAllCandidates();
    setCandidates(allCandidates);
    setStats(candidateService.getRecruitmentStats());
  };

  const applyFilters = () => {
    let filtered = candidates;

    if (filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.division !== 'all') {
      filtered = filtered.filter(c => c.division === filters.division);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.personalInfo.firstName.toLowerCase().includes(search) ||
        c.personalInfo.lastName.toLowerCase().includes(search) ||
        c.personalInfo.email.toLowerCase().includes(search) ||
        c.id.toLowerCase().includes(search)
      );
    }

    setFilteredCandidates(filtered);
  };

  const getStatusIcon = (status: CandidateStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in-review': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      case 'in-review': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  const getDivisionColor = (division: Division) => {
    switch (division) {
      case 'marine': return 'text-green-500';
      case 'odst': return 'text-orange-500';
      case 'spartan': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-800 border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Candidates</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.total || 0}</p>
          </div>
          <Users className="h-8 w-8 text-gray-500" />
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-500">{stats.byStatus?.approved || 0}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">In Review</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.byStatus?.['in-review'] || 0}</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Avg Score</p>
            <p className="text-2xl font-bold text-blue-500">
              {stats.averageScores ? Math.round(
                (stats.averageScores.marine + stats.averageScores.odst + stats.averageScores.spartan) / 3
              ) : 0}%
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-500" />
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-gray-800 border border-gray-700 p-6 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-200">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 text-gray-100 pl-10 pr-4 py-2 focus:border-yellow-500 focus:outline-none"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as CandidateStatus | 'all' }))}
          className="bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 focus:border-yellow-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="in-review">In Review</option>
        </select>

        <select
          value={filters.division}
          onChange={(e) => setFilters(prev => ({ ...prev, division: e.target.value as Division | 'all' }))}
          className="bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 focus:border-yellow-500 focus:outline-none"
        >
          <option value="all">All Divisions</option>
          <option value="marine">Marines</option>
          <option value="odst">ODST</option>
          <option value="spartan">Spartan</option>
        </select>
      </div>
    </div>
  );

  const renderCandidateTable = () => (
    <div className="bg-gray-800 border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">
          Candidates ({filteredCandidates.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Division</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Registered</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-100">
                      {candidate.personalInfo.firstName} {candidate.personalInfo.lastName}
                    </div>
                    <div className="text-sm text-gray-400">{candidate.personalInfo.email}</div>
                    <div className="text-xs text-gray-500">{candidate.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getDivisionColor(candidate.division)}`}>
                    {candidate.division.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(candidate.status)}
                    <span className={`ml-2 text-sm ${getStatusColor(candidate.status)}`}>
                      {candidate.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  {candidate.testResults.overallScore}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {formatDate(candidate.registrationDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className="text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No candidates match your filters</p>
        </div>
      )}
    </div>
  );

  const renderCandidateDetail = () => {
    if (!selectedCandidate) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 border border-gray-700 max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-yellow-500">Candidate Details</h3>
            <button
              onClick={() => setSelectedCandidate(null)}
              className="text-gray-400 hover:text-gray-300"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-200 mb-3">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400">Name:</span> <span className="text-gray-100">{selectedCandidate.personalInfo.firstName} {selectedCandidate.personalInfo.lastName}</span></div>
                <div><span className="text-gray-400">Email:</span> <span className="text-gray-100">{selectedCandidate.personalInfo.email}</span></div>
                <div><span className="text-gray-400">Age:</span> <span className="text-gray-100">{selectedCandidate.personalInfo.age}</span></div>
                <div><span className="text-gray-400">Nationality:</span> <span className="text-gray-100">{selectedCandidate.personalInfo.nationality}</span></div>
                <div><span className="text-gray-400">Education:</span> <span className="text-gray-100">{selectedCandidate.personalInfo.education}</span></div>
                <div><span className="text-gray-400">Physical Condition:</span> <span className="text-gray-100">{selectedCandidate.personalInfo.physicalCondition}</span></div>
                <div><span className="text-gray-400">Military Experience:</span> <span className="text-gray-100">{selectedCandidate.personalInfo.militaryExperience ? 'Yes' : 'No'}</span></div>
                <div><span className="text-gray-400">Division:</span> <span className={getDivisionColor(selectedCandidate.division)}>{selectedCandidate.division.toUpperCase()}</span></div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-200 mb-3">Test Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{selectedCandidate.testResults.reactionTime}%</div>
                    <div className="text-sm text-gray-400">Reaction Time</div>
                  </div>
                </div>
                <div className="bg-gray-700 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{selectedCandidate.testResults.accuracy}%</div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                </div>
                <div className="bg-gray-700 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">{selectedCandidate.testResults.strategicThinking}%</div>
                    <div className="text-sm text-gray-400">Strategic Thinking</div>
                  </div>
                </div>
                <div className="bg-gray-700 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{selectedCandidate.testResults.overallScore}%</div>
                    <div className="text-sm text-gray-400">Overall Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-200 mb-3">Status Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400">Current Status:</span> 
                  <div className="flex items-center mt-1">
                    {getStatusIcon(selectedCandidate.status)}
                    <span className={`ml-2 ${getStatusColor(selectedCandidate.status)}`}>
                      {selectedCandidate.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div><span className="text-gray-400">Candidate ID:</span> <span className="text-gray-100 font-mono text-xs">{selectedCandidate.id}</span></div>
                <div><span className="text-gray-400">Registered:</span> <span className="text-gray-100">{formatDate(selectedCandidate.registrationDate)}</span></div>
                <div><span className="text-gray-400">Last Updated:</span> <span className="text-gray-100">{formatDate(selectedCandidate.lastUpdate)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-yellow-500 tracking-wider mb-2">COMMAND CENTER</h2>
          <p className="text-gray-400">UNSC Recruitment Administration Panel</p>
        </div>

        {renderStatsCards()}
        {renderFilters()}
        {renderCandidateTable()}
        {renderCandidateDetail()}
      </div>
    </div>
  );
};