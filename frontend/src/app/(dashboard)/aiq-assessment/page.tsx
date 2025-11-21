'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AIQ_QUESTIONS, ANSWER_OPTIONS } from '@/lib/aiqQuestions';
import { generateAIQResult } from '@/lib/aiqCalculation';
import { Button } from '@/components/ui/Button';
import { Lightbulb, ArrowLeft } from 'lucide-react';

export default function AIQAssessmentPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(AIQ_QUESTIONS.length).fill(0));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    // Auto-advance to next question with smooth transition
    if (currentQuestion < AIQ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    } else {
      // Last question answered - submit
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: number[]) => {
    setIsSubmitting(true);

    try {
      // Generate AIQ result
      const result = generateAIQResult(finalAnswers);

      // Mock mode: Save to localStorage
      const assessmentId = 'aiq-' + Date.now();
      const assessmentData = {
        assessment_id: assessmentId,
        ...result,
        answers: finalAnswers
      };

      localStorage.setItem('aiq_current_result', JSON.stringify(assessmentData));
      localStorage.setItem(`aiq_result_${assessmentId}`, JSON.stringify(assessmentData));

      // Real mode preparation (Supabase):
      // const { data, error } = await supabase
      //   .from('aiq_assessments')
      //   .insert({
      //     answers: finalAnswers,
      //     ...result.capabilities,
      //     aiq_type: result.aiqType,
      //     confidence_level: result.confidenceLevel
      //   })
      //   .select()
      //   .single();

      // Navigate to results
      setTimeout(() => {
        router.push(`/aiq-assessment/results/${assessmentId}`);
      }, 500);
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = AIQ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / AIQ_QUESTIONS.length) * 100;
  const estimatedMinutes = Math.max(0, Math.ceil((AIQ_QUESTIONS.length - currentQuestion) * 0.5));

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">분석 중...</p>
          <p className="text-sm text-gray-600 mt-2">당신의 AI 활용 스타일을 분석하고 있습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AIQ Personality Assessment
          </h1>
          <p className="text-gray-600">
            당신의 AI 활용 스타일을 발견하세요
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} / {AIQ_QUESTIONS.length}
            </span>
            <span className="font-medium">{Math.round(progress)}% 완료</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          {/* Dimension Tag */}
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            {question.dimension}
          </div>

          {/* Question */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {question.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {ANSWER_OPTIONS.map((option) => {
              const isSelected = answers[currentQuestion] === option.value;

              return (
                <button
                  key={option.value}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                      : 'border-gray-200 hover:border-indigo-300 bg-white hover:shadow-sm'
                  }`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <span className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation & Tips */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center text-sm text-gray-600">
            <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
            <span>⏱ 약 {estimatedMinutes}분 남음</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Lightbulb className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">
                💡 Tip
              </p>
              <p className="text-sm text-blue-800">
                정답은 없습니다. 평소 업무 습관을 솔직히 선택하세요.
                일관성 있는 답변이 더 정확한 분석 결과를 제공합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Dots (Mobile-friendly indicator) */}
        <div className="mt-8 flex justify-center gap-1.5">
          {AIQ_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentQuestion
                  ? 'w-8 bg-indigo-600'
                  : index < currentQuestion
                  ? 'w-1.5 bg-indigo-400'
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
