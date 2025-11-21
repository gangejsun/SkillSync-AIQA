'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AIQ_TYPE_INFO, type AIQResult } from '@/lib/aiqCalculation';
import { CAPABILITY_DESCRIPTIONS } from '@/lib/aiqQuestions';
import { Button } from '@/components/ui/Button';
import { Download, Share2, TrendingUp, Award, ArrowRight } from 'lucide-react';

export default function AIQResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [result, setResult] = useState<AIQResult & { assessment_id: string; answers: number[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResult();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadResult = async () => {
    try {
      // Mock mode: Load from localStorage
      const stored = localStorage.getItem(`aiq_result_${params.id}`);
      if (stored) {
        const data = JSON.parse(stored);
        setResult(data);
      } else {
        // Fallback to current result
        const current = localStorage.getItem('aiq_current_result');
        if (current) {
          setResult(JSON.parse(current));
        }
      }

      // Real mode preparation (Supabase):
      // const { data, error } = await supabase
      //   .from('aiq_assessments')
      //   .select('*')
      //   .eq('aiq_assessment_id', params.id)
      //   .single();
      // if (data) setResult(data);
    } catch (error) {
      console.error('Failed to load result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-4">결과를 찾을 수 없습니다</p>
          <Button onClick={() => router.push('/aiq-assessment')}>
            다시 평가하기
          </Button>
        </div>
      </div>
    );
  }

  const typeInfo = AIQ_TYPE_INFO[result.aiqType];

  // Prepare radar chart data
  const radarData = Object.entries(result.capabilities).map(([key, value]) => ({
    capability: CAPABILITY_DESCRIPTIONS[key as keyof typeof CAPABILITY_DESCRIPTIONS].name,
    value: value,
    fullMark: 100
  }));

  // Calculate overall score (average of all capabilities)
  const overallScore = Math.round(
    Object.values(result.capabilities).reduce((sum, val) => sum + val, 0) /
    Object.values(result.capabilities).length
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card with Gradient */}
        <div className="relative overflow-hidden rounded-2xl mb-8 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
          <div className="relative p-8 md:p-12 text-white">
            <div className="text-center">
              <div className="text-7xl mb-4">{typeInfo.emoji}</div>
              <h1 className="text-4xl font-bold mb-3">{typeInfo.nameKo}</h1>
              <p className="text-xl opacity-90 mb-2">{typeInfo.name}</p>
              <p className="text-lg opacity-80 max-w-2xl mx-auto mb-6">
                {typeInfo.description}
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div>
                  <span className="opacity-75">Overall Score: </span>
                  <span className="font-bold text-2xl">{overallScore}/100</span>
                </div>
                <div className="h-8 w-px bg-white/30" />
                <div>
                  <span className="opacity-75">Confidence: </span>
                  <span className="font-bold text-2xl">
                    {(result.confidenceLevel * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              AI Capability Profile
            </h2>
            <div className="text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              8개 차원 분석
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="capability"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <Radar
                name="Your Score"
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>

          <p className="text-center text-sm text-gray-600 mt-4">
            각 축은 0-100점 척도로 평가됩니다
          </p>
        </div>

        {/* Detailed Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(result.capabilities).map(([key, value]) => {
            const desc = CAPABILITY_DESCRIPTIONS[key as keyof typeof CAPABILITY_DESCRIPTIONS];
            const percentage = value;

            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{desc.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{desc.name}</h3>
                      <p className="text-sm text-gray-600">{desc.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{key}</span>
                    <span className="text-lg font-bold text-indigo-600">{value}/100</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strengths & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">강점</h3>
            </div>
            <ul className="space-y-2">
              {typeInfo.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-semibold text-gray-900">추천 개선 사항</h3>
            </div>
            <ul className="space-y-2">
              {typeInfo.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">→</span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">다음 단계</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="flex items-center justify-center gap-2"
              onClick={() => {
                // Mock: Download as JSON
                const dataStr = JSON.stringify(result, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `aiq-result-${params.id}.json`;
                link.click();
              }}
            >
              <Download className="w-4 h-4" />
              결과 다운로드
            </Button>

            <Button
              variant="secondary"
              className="flex items-center justify-center gap-2"
              onClick={() => {
                // Mock: Share (copy link)
                navigator.clipboard.writeText(window.location.href);
                alert('링크가 복사되었습니다!');
              }}
            >
              <Share2 className="w-4 h-4" />
              결과 공유
            </Button>

            <Button
              variant="ghost"
              className="flex items-center justify-center gap-2"
              onClick={() => router.push('/challenges')}
            >
              스킬 테스트 시작
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/aiq-assessment')}
            >
              다시 평가하기
            </Button>
          </div>
        </div>

        {/* Completion Date */}
        <p className="text-center text-sm text-gray-500 mt-6">
          평가 완료: {new Date(result.completedAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}
