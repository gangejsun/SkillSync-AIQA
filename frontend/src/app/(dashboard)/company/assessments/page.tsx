'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, BarChart3, Users, Eye, Edit, Trash2 } from 'lucide-react';

interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  assessment_type: 'coding' | 'prompt_engineering';
  estimated_time_minutes: number;
  passing_score: number;
  is_public: boolean;
  company_only: boolean;
  created_at: string;
  tags: string[];
}

interface AssessmentStats {
  total_applicants: number;
  completed_count: number;
  passed_count: number;
  average_score: number;
}

export default function CompanyAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [stats, setStats] = useState<Record<string, AssessmentStats>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'coding' | 'prompt_engineering'>('all');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      // In production, this would call the actual API
      // For now, using mock data
      const mockAssessments: Assessment[] = [
        {
          id: '1',
          title: 'Senior Full-Stack Developer Challenge',
          description: 'Build a full-stack application with authentication',
          difficulty: 'hard',
          category: 'fullstack',
          assessment_type: 'coding',
          estimated_time_minutes: 120,
          passing_score: 75,
          is_public: true,
          company_only: false,
          created_at: new Date().toISOString(),
          tags: ['react', 'node.js', 'postgresql'],
        },
        {
          id: '2',
          title: 'AI Prompt Engineering Assessment',
          description: 'Create effective prompts for various AI tasks',
          difficulty: 'medium',
          category: 'ai',
          assessment_type: 'prompt_engineering',
          estimated_time_minutes: 60,
          passing_score: 70,
          is_public: true,
          company_only: false,
          created_at: new Date().toISOString(),
          tags: ['ai', 'prompting', 'claude'],
        },
      ];

      setAssessments(mockAssessments);

      // Mock stats
      const mockStats: Record<string, AssessmentStats> = {
        '1': {
          total_applicants: 45,
          completed_count: 32,
          passed_count: 24,
          average_score: 78,
        },
        '2': {
          total_applicants: 28,
          completed_count: 25,
          passed_count: 20,
          average_score: 82,
        },
      };

      setStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    // In production, call API to delete
    setAssessments(assessments.filter((a) => a.id !== id));
  };

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || assessment.assessment_type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-gray-500">Loading assessments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assessments</h1>
          <p className="mt-2 text-gray-600">
            Create and manage custom assessments for candidates
          </p>
        </div>
        <Link
          href="/company/assessments/create"
          className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          <span>Create Assessment</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border-none bg-transparent focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="coding">Coding</option>
            <option value="prompt_engineering">Prompt Engineering</option>
          </select>
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {filteredAssessments.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No assessments found</h3>
            <p className="mt-2 text-gray-600">
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first assessment to get started'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <Link
                href="/company/assessments/create"
                className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5" />
                <span>Create Assessment</span>
              </Link>
            )}
          </div>
        ) : (
          filteredAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {assessment.title}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        assessment.assessment_type === 'coding'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {assessment.assessment_type === 'coding' ? 'Coding' : 'Prompt Engineering'}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        assessment.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800'
                          : assessment.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {assessment.difficulty}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{assessment.description}</p>
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <span>⏱️ {assessment.estimated_time_minutes} min</span>
                    <span>🎯 Passing: {assessment.passing_score}%</span>
                    <span>
                      {assessment.is_public ? '🌐 Public' : '🔒 Private'}
                    </span>
                    {assessment.company_only && <span>🏢 Company Only</span>}
                  </div>
                  {assessment.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {assessment.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="ml-6 flex items-center space-x-2">
                  <Link
                    href={`/company/assessments/${assessment.id}`}
                    className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5 text-gray-600" />
                  </Link>
                  <Link
                    href={`/company/assessments/${assessment.id}/edit`}
                    className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5 text-gray-600" />
                  </Link>
                  <button
                    onClick={() => handleDelete(assessment.id)}
                    className="rounded-lg border border-red-300 p-2 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              {stats[assessment.id] && (
                <div className="mt-4 grid grid-cols-4 gap-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {stats[assessment.id].total_applicants}
                      </div>
                      <div className="text-xs text-gray-500">Applicants</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {stats[assessment.id].completed_count}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {stats[assessment.id].passed_count}
                    </div>
                    <div className="text-xs text-gray-500">Passed</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {stats[assessment.id].average_score}%
                    </div>
                    <div className="text-xs text-gray-500">Avg Score</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
