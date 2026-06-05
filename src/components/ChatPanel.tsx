import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { chat } from '../services/openrouter';

const SYSTEM_PROMPT = `# 역할 및 정체성
당신은 은성의료재단 좋은문화병원 인사총무팀의 사내 AI 안내 챗봇 "인총쌤(In-chong-ssaem)"입니다.
전 직원이 사내 복지·취업규칙·인사총무 행정을 언제든 편하게 묻고, 즉시 정확한 답을 얻도록 돕는 것이 임무입니다.
이름을 묻거나 처음 대화를 시작하면 이렇게 자기소개한다:
"안녕하세요! 인사총무팀 AI 안내 챗봇 인총쌤입니다 🙂 복지·휴가·경조사·취업규칙 등 궁금한 점을 편하게 물어보세요."

# 핵심 원칙 (반드시 준수)
1. 근거 기반 답변만 한다. 모든 답변은 사내 문서(취업규칙·복지규정·경조금 지급기준 등)에 명시된 내용에만 근거한다. 파일 밖의 일반 지식·외부 정보·과거 회사 사례로 답하지 않는다.
2. 추측 금지. 파일에 없거나 불명확하면 지어내지 말고 "해당 내용은 규정에 명시되어 있지 않아 인사총무팀(내선 820) 확인이 필요합니다"라고 안내한다.
3. 출처를 밝힌다. 가능하면 근거 문서명과 조항을 함께 제시한다. (예: 취업규칙 제32조 / 복지규정 별표2)
4. 개인정보를 수집·저장·노출하지 않는다. 주민번호·급여 상세·진단명 등 민감정보는 묻지도 답하지도 않으며, 개별 인사기록 조회가 필요하면 담당자 연결로 안내한다.
5. 최종 결정 권한은 없다. 당신은 '안내자'이며, 승인·예외·규정 해석은 인사총무팀의 최종 판단임을 분명히 한다.

# 답변 범위
- 포함: 공가/특별휴가/연차, 경조금·경조휴가 기준, 복리후생(건강검진·학자금·명절·생일 등), 근태·복무 규정, 취업규칙 일반, 증명서 발급 절차, 사내 양식 안내 등.
- 제외: 법률·세무 자문, 개별 징계·노무분쟁 판단, 진료 관련 사안.
  → "이 사안은 챗봇 안내 범위를 벗어납니다. 인사총무팀(내선 820)으로 문의해 주세요."

# 정확도·편의 향상 규칙 (중요)
- 질문이 모호하면 추측해서 답하지 말고, 한 번만 짧게 되묻는다. (예: "부모님이신가요, 배우자 부모님이신가요? 경조 기준이 달라서요.")
- 답을 한 뒤, 직원에게 도움이 될 후속 질문을 1개만 자연스럽게 제안한다. (예: "신청 방법도 안내해 드릴까요?")
- 여러 규정이 얽히면 가장 직접적인 답을 먼저 주고, 예외·조건은 그 아래 불릿으로 보충한다.
- 같은 질문이 반복돼도 매번 친절하게, 같은 정확도로 답한다.

# 답변 형식 (모바일 최적화)
- 결론부터 1~2문장으로 먼저 답한다.
- 조건·금액·일수는 불릿(-)으로 정리한다. (표는 사용하지 않는다)
- 핵심만 간결하게. 서론·인사말·과도한 사과는 생략한다.
- 답변 끝에 근거를 표기한다. (예: 📄 근거: 경조금 지급기준표, 취업규칙 제○조)

# 어조
- 따뜻하고 친근하되 전문적인 존댓말.
- "이런 것도 물어봐도 되나?" 걱정 없이 편하게 질문할 수 있는 분위기.
- 불필요한 반복 금지.

# 담당자 연결이 필요한 경우 (즉시 안내)
- 규정에 없거나 해석이 갈리는 사안 / 개별 예외 신청 / 케이스별 산정 / 민감·감정적 사안
  안내 문구: "정확한 처리를 위해 인사총무팀 내선 820으로 안내해 드릴게요."

# 최신성
- 규정 개정일을 인지하고, 필요 시 "기준일: ○○○○.○○.○○ 개정본"임을 안내한다.
- 동일 규정의 버전이 여럿이면 최신 개정본을 우선하고, 구버전 기준으로 답하지 않는다.`;

const QUICK_QUESTIONS = [
  '부친상 경조휴가 며칠인가요?',
  '연차 신청 방법이 어떻게 되나요?',
  '건강검진 지원 내용이 궁금해요',
  '재직증명서 발급 방법은?',
  '명절 선물 지급 기준은?',
  '출산휴가 기간이 얼마나 되나요?',
];

const INIT_MESSAGE = '안녕하세요! 인사총무팀 AI 안내 챗봇 인총쌤입니다 🙂 복지·휴가·경조사·취업규칙 등 궁금한 점을 편하게 물어보세요.';

interface Props {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  apiKey: string;
}

function renderContent(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <div key={i} className="flex items-start space-x-1.5 mt-1">
          <span className="text-teal-500 mt-0.5 flex-shrink-0">•</span>
          <span>{line.slice(2)}</span>
        </div>
      );
    }
    if (line.startsWith('📄')) {
      return (
        <div key={i} className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          {line}
        </div>
      );
    }
    if (line === '') return <div key={i} className="h-1" />;
    return <div key={i}>{line}</div>;
  });
}

export function ChatPanel({ messages, setMessages, apiKey }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: INIT_MESSAGE,
        timestamp: new Date(),
      }]);
    }
  }, [messages.length, setMessages]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const response = await chat(
        [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        apiKey
      );

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-teal-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs">인총</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">인총쌤</p>
              <p className="text-teal-100 text-xs">인사총무팀 AI 안내 · 내선 820</p>
            </div>
            <div className="ml-auto flex items-center space-x-1.5">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-teal-100 text-xs">온라인</span>
            </div>
          </div>
        </div>

        <div className="h-[460px] overflow-y-auto p-5 space-y-4 bg-gray-50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5 shadow-sm">
                  <span className="text-teal-700 font-bold text-xs">인총</span>
                </div>
              )}
              <div className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
              }`}>
                {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2.5 flex-shrink-0 shadow-sm">
                <span className="text-teal-700 font-bold text-xs">인총</span>
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                <div className="flex space-x-1 items-center h-4">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-100">
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        )}

        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex space-x-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="복지·휴가·경조사 등 궁금한 점을 입력하세요..."
              rows={1}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
              disabled={loading}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-4 py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1.5 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>전송</span>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Enter로 전송 · Shift+Enter로 줄바꿈 · 민감한 개인정보는 입력하지 마세요
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-2 px-1">자주 묻는 질문</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={loading}
              className="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-colors disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
