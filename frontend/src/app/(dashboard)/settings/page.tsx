'use client';

import { useState } from 'react';
import { User, Bell, Lock, Globe, Palette, Database, Building2, CheckCircle, Upload } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'role'>('profile');
  const [userRole, setUserRole] = useState<'candidate' | 'company'>('candidate');
  const [companyVerified, setCompanyVerified] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">설정</h1>
        <p className="mt-2 text-gray-600">계정 및 환경설정을 관리하세요</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1 rounded-lg border border-gray-200 bg-white p-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5" />
              <span>프로필</span>
            </button>
            <button
              onClick={() => setActiveTab('role')}
              className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium ${
                activeTab === 'role'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Building2 className="h-5 w-5" />
              <span>역할 관리</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bell className="h-5 w-5" />
              <span>알림</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium ${
                activeTab === 'security'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Lock className="h-5 w-5" />
              <span>보안</span>
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="space-y-6 lg:col-span-3">
          {/* Role Management */}
          {activeTab === 'role' && (
            <>
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">계정 역할</h2>
                <p className="mt-1 text-sm text-gray-600">
                  개인 사용자와 기업 사용자 역할을 전환하세요
                </p>

                <div className="mt-6 space-y-4">
                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      userRole === 'candidate'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setUserRole('candidate')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="h-8 w-8 text-indigo-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">개인 사용자</h3>
                          <p className="text-sm text-gray-600">
                            AI 활용 능력 검사를 받고, 스킬을 추적하며, 채용 기회를 찾습니다
                          </p>
                        </div>
                      </div>
                      {userRole === 'candidate' && (
                        <CheckCircle className="h-6 w-6 text-indigo-600" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      userRole === 'company'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setUserRole('company')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-8 w-8 text-indigo-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">기업 사용자</h3>
                          <p className="text-sm text-gray-600">
                            맞춤 평가를 생성하고, 지원자를 평가하며, 채용 프로세스를 관리합니다
                          </p>
                        </div>
                      </div>
                      {userRole === 'company' && (
                        <CheckCircle className="h-6 w-6 text-indigo-600" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    역할 변경
                  </button>
                </div>
              </div>

              {/* Company Verification */}
              {userRole === 'company' && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">기업 인증</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        맞춤 평가를 생성하려면 기업 인증이 필요합니다
                      </p>
                    </div>
                    {companyVerified && (
                      <div className="flex items-center space-x-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span>인증 완료</span>
                      </div>
                    )}
                  </div>

                  {!companyVerified ? (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          회사명 *
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                          placeholder="주식회사 OOO"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          회사 웹사이트
                        </label>
                        <input
                          type="url"
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                          placeholder="https://www.company.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          사업자 등록증 또는 재직 증명서 *
                        </label>
                        <div className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 hover:border-gray-400">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              파일을 클릭하거나 드래그하여 업로드
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              PDF, PNG, JPG (최대 10MB)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-sm text-blue-900">
                          <strong>인증 절차:</strong> 제출하신 서류는 영업일 기준 2-3일 내에
                          검토됩니다. 인증이 완료되면 이메일로 알려드립니다.
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setCompanyVerified(true)}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                          인증 신청
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-lg bg-green-50 p-4">
                      <p className="text-sm text-green-900">
                        기업 인증이 완료되었습니다. 이제 맞춤 평가를 생성하고 지원자를
                        평가할 수 있습니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">프로필 정보</h2>
            <p className="mt-1 text-sm text-gray-600">
              공개 프로필에 표시될 정보를 관리하세요
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  프로필 사진
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                    JD
                  </div>
                  <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    변경
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    이름
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    이메일
                  </label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">직업</label>
                <input
                  type="text"
                  defaultValue="Frontend Developer"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  자기소개
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  defaultValue="열정적인 프론트엔드 개발자입니다."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  취소
                </button>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  저장
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">알림 설정</h2>
            <p className="mt-1 text-sm text-gray-600">
              받고 싶은 알림을 선택하세요
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">이메일 알림</p>
                  <p className="text-sm text-gray-600">
                    새로운 챌린지 및 배지 정보를 이메일로 받습니다
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">챌린지 완료 알림</p>
                  <p className="text-sm text-gray-600">
                    챌린지 평가가 완료되면 알림을 받습니다
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">잡 매칭 알림</p>
                  <p className="text-sm text-gray-600">
                    새로운 채용 공고가 매칭되면 알림을 받습니다
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">주간 리포트</p>
                  <p className="text-sm text-gray-600">
                    매주 AI 사용량 리포트를 받습니다
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
          <>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">보안 설정</h2>
            <p className="mt-1 text-sm text-gray-600">
              계정 보안을 강화하세요
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  비밀번호 변경
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">2단계 인증 (2FA)</p>
                  <p className="text-sm text-gray-600">
                    추가 보안 계층으로 계정을 보호하세요
                  </p>
                </div>
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  활성화
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-900">위험 구역</h2>
            <p className="mt-1 text-sm text-red-600">
              이 작업은 되돌릴 수 없습니다
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">계정 삭제</p>
                <p className="text-sm text-red-600">
                  모든 데이터가 영구적으로 삭제됩니다
                </p>
              </div>
              <button className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                계정 삭제
              </button>
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
