import { Briefcase, MapPin, DollarSign, Clock, Building } from 'lucide-react';

export default function JobsPage() {
  // Mock data for demonstration
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: '서울, 한국',
      salary: '6000만 - 8000만원',
      type: 'Full-time',
      aiSkillMatch: 92,
      postedAt: '2일 전',
    },
    {
      id: 2,
      title: 'AI Engineer',
      company: 'AI Startup',
      location: '판교, 한국',
      salary: '7000만 - 1억원',
      type: 'Full-time',
      aiSkillMatch: 88,
      postedAt: '1주 전',
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Global Company',
      location: '원격',
      salary: '5000만 - 7000만원',
      type: 'Remote',
      aiSkillMatch: 85,
      postedAt: '3일 전',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">잡 매칭</h1>
          <p className="mt-2 text-gray-600">
            AI 스킬에 맞는 채용 공고를 찾아보세요
          </p>
        </div>
        <div className="rounded-lg bg-yellow-50 px-4 py-2">
          <span className="text-sm font-medium text-yellow-800">준비중</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">매칭된 잡</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">24</p>
            </div>
            <div className="rounded-full bg-indigo-100 p-3">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">지원한 잡</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">8</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">평균 매칭률</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">88%</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Building className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option>모든 위치</option>
          <option>서울</option>
          <option>판교</option>
          <option>원격</option>
        </select>

        <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option>모든 타입</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Remote</option>
        </select>

        <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option>매칭률 높은 순</option>
          <option>최신 순</option>
          <option>연봉 높은 순</option>
        </select>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {mockJobs.map((job) => (
          <div
            key={job.id}
            className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                    {job.title}
                  </h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {job.aiSkillMatch}% 매칭
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{job.company}</p>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    React
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    TypeScript
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    AI Tools
                  </span>
                </div>
              </div>

              <div className="ml-6 flex flex-col items-end space-y-2">
                <span className="text-xs text-gray-500">{job.postedAt}</span>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  지원하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Message */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">잡 매칭 기능 준비중</h3>
        <p className="mt-2 text-sm text-gray-600">
          AI 스킬 기반 자동 잡 매칭 기능이 곧 출시됩니다.
          <br />
          위의 목록은 데모 데이터입니다.
        </p>
      </div>
    </div>
  );
}
