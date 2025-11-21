'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    category: 'general',
    assessment_type: 'coding' as 'coding' | 'prompt_engineering',
    problem_statement: '',
    starter_code: '',
    evaluation_criteria: '',
    estimated_time_minutes: 60,
    max_attempts: 3,
    passing_score: 70,
    is_public: true,
    company_only: false,
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, call API to create assessment
      console.log('Creating assessment:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to assessments list
      router.push('/company/assessments');
    } catch (error) {
      console.error('Error creating assessment:', error);
      alert('Failed to create assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/company/assessments"
          className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Assessments</span>
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Create New Assessment</h1>
        <p className="mt-2 text-gray-600">
          Design a custom assessment to evaluate candidates
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assessment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                placeholder="e.g., Senior Full-Stack Developer Challenge"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                placeholder="Brief description of what this assessment evaluates"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assessment Type *
                </label>
                <select
                  value={formData.assessment_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assessment_type: e.target.value as 'coding' | 'prompt_engineering',
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="coding">Coding Challenge</option>
                  <option value="prompt_engineering">Prompt Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                placeholder="e.g., fullstack, frontend, ai, backend"
              />
            </div>
          </div>
        </div>

        {/* Assessment Content */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Assessment Content</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Problem Statement *
              </label>
              <textarea
                required
                value={formData.problem_statement}
                onChange={(e) =>
                  setFormData({ ...formData, problem_statement: e.target.value })
                }
                rows={6}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
                placeholder={
                  formData.assessment_type === 'coding'
                    ? 'Detailed problem description with requirements, constraints, and examples...'
                    : 'Describe the scenario and what kind of prompt the candidate should create...'
                }
              />
            </div>

            {formData.assessment_type === 'coding' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Starter Code (Optional)
                </label>
                <textarea
                  value={formData.starter_code}
                  onChange={(e) => setFormData({ ...formData, starter_code: e.target.value })}
                  rows={8}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="// Initial code template for candidates"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Custom Evaluation Criteria (Optional)
              </label>
              <textarea
                value={formData.evaluation_criteria}
                onChange={(e) =>
                  setFormData({ ...formData, evaluation_criteria: e.target.value })
                }
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="Additional criteria beyond standard evaluation (e.g., specific patterns, approaches, or requirements you want AI to check for)"
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.assessment_type === 'prompt_engineering'
                  ? 'AI will use unified prompt quality criteria (Clarity, Specificity, Structure, Examples) plus your custom criteria'
                  : 'AI will evaluate correctness, code quality, efficiency, and best practices plus your custom criteria'}
              </p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Assessment Settings</h2>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estimated Time (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.estimated_time_minutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimated_time_minutes: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Attempts
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.max_attempts}
                  onChange={(e) =>
                    setFormData({ ...formData, max_attempts: parseInt(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passing_score}
                  onChange={(e) =>
                    setFormData({ ...formData, passing_score: parseInt(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Public (visible to all users)
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.company_only}
                  onChange={(e) =>
                    setFormData({ ...formData, company_only: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Company Only (only employees of your company can take this)
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                  placeholder="Add tags (e.g., react, typescript, ai)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-indigo-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/company/assessments"
            className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}
