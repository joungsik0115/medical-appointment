import { useState } from 'react';

interface Props {
  onSubmit: (key: string) => void;
}

export function ApiKeyModal({ onSubmit }: Props) {
  const [key, setKey] = useState('');
  const [save, setSave] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    if (save) localStorage.setItem('openrouter_key', key.trim());
    onSubmit(key.trim());
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-white font-bold text-xl">인총</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">인총쌤</h1>
          <p className="text-gray-500 mt-2 text-sm">은성의료재단 좋은문화병원 인사총무팀 AI 안내 챗봇</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              OpenRouter API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1.5">
              OpenRouter에서 발급받은 API 키를 입력하세요
            </p>
          </div>

          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={save}
              onChange={e => setSave(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-600">브라우저 로컬 스토리지에 키 저장</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 active:bg-teal-800 transition-colors"
          >
            시작하기
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          API 키는 브라우저에서만 사용되며 외부 서버로 전송되지 않습니다
        </p>
      </div>
    </div>
  );
}
