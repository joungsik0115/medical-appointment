interface Props {
  onResetKey: () => void;
}

export function Header({ onResetKey }: Props) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">인총</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">인총쌤</h1>
            <p className="text-xs text-gray-400 mt-0.5">은성의료재단 좋은문화병원 인사총무팀 AI</p>
          </div>
        </div>
        <button
          onClick={onResetKey}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          API 키 변경
        </button>
      </div>
    </header>
  );
}
