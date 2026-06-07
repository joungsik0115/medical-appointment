// 인총쌤 Google Chat HTTP Endpoint — Vercel Serverless Function

const MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-4-31b-it:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
];

const KNOWLEDGE = `
=== 좋은문화병원 취업규칙 핵심 요약 ===

[경조휴가 기준 — 별지1, 취업규칙 제44조]
경조사 휴가는 유급이며, 휴일·휴무일도 기간에 포함하여 계산한다.
- 본인 결혼: 6일
- 자녀 결혼: 2일
- 부모 사망: 5일 (양가 모두 적용)
- 배우자 사망: 5일
- 배우자 부모 사망: 5일
- 형제자매 사망: 3일
- 배우자 형제자매 사망: 3일
- 자녀 사망: 3일
- 조부모 사망: 2일 (양가 모두 적용)

[경조금 지급기준 — 별지2, 취업규칙 제56조, 개정 2026.03.01]
- 결혼(본인): 300,000원
- 결혼(자녀): 100,000원
- 조의(본인 사망): 500,000원
- 조의(배우자 사망): 300,000원
- 조의(부모 사망): 300,000원 (양쪽 모두 적용)
- 조의(자녀 사망): 300,000원
- 화환 지급: 본인·배우자·직계존비속 사망, 배우자부모 사망, 본인기준 상하 1代(부모·자녀)·조부모 인정

[연차 유급휴가 — 제39조, 제40조]
- 1년간 80% 이상 출근 시: 15일 연차 부여
- 1년 미만 또는 80% 미만 출근: 1개월 개근 시 1일 부여
- 3년 이상 근속: 매 2년마다 1일 가산 (최대 25일)
- 연차 미사용 시 1년 후 소멸 (병원 귀책 제외)
- 연차 사용 3일 전에 소속 부서장 승인 필요

[출산·육아 관련 휴가]
- 출산전후휴가: 90일 유급 (쌍태아 120일, 미숙아 100일) — 제42조
- 배우자 출산휴가: 20일 유급, 출산일로부터 120일 이내 3회 분할 가능 — 제41조(개정 2025.02.23)
- 육아휴직: 최대 1년(+6개월 추가 가능), 3회 분할 사용 가능 — 제11조의2
- 육아기 근로시간 단축: 만 12세 이하 자녀 양육 시 신청 가능, 1년 이내 — 제26조
- 유산·사산 휴가: 임신 15주 이내 10일 / 16~21주 30일 / 22~27주 60일 / 28주 이상 90일

[병가·공가]
- 병가: 업무상 부상·질병으로 2개월 유급병가 후 휴직 가능 — 제10조
- 공가: 병역법·민방위법·전시근로동원법 등 법령에 의한 소집기간은 유급 — 제43조

[근로시간 — 제26조]
- 1일 8시간, 주 40시간 (법정 한도 내 연장 가능)
- 급여 지급일: 매월 말일 전일 (휴일인 경우 그 전일) — 제47조

[정년 및 퇴직 — 제14조, 제52조]
- 정년: 만 60세 (생일이 있는 달 말일 퇴직)
- 퇴직금: 1년 이상 근속 시 계속근로기간 1년에 대해 30일분 이상 평균임금
- 퇴직금 중간정산: 주택구입, 전세보증금, 6개월 이상 요양 등 사유 시 가능

[건강검진 — 제59조]
- 일반직: 매년 1회 건강진단 실시
- 사무직: 매 2년에 1회

[직원 진료비 감면 — 별지3]
- 직원 본인: 진찰료·검사료 50%, 입원료·투약료·수술료 등 20~50% 감면
- 직원 직계: 30% 수준 감면 (항목별 상이)
- 형제자매: 20% 수준 감면

=== 휴양시설 이용 안내 ===

[신청 방법 — 모든 시설 1박만 신청 가능]
그룹웨어 로그인 → 왼쪽 메뉴 '공유물예약관리' → 원하는 날짜 클릭 → 글쓰기(병원명·부서·직책·이름·연락처·평수·인원 등) → 신청 → 관리자 승인 후 완료

[패널티 사유 — 해당 시 1년간 모든 휴양시설 이용 불가, 예외 없음]
- 하버타운 주차등록 없이 주차장 이용
- 하버타운 개인사용 시 선입금 미납
- 하버타운 규칙 위반
- 입·퇴실 사진, 퇴실확인서, 보고서 미제출
- 예약 변경 및 취소 (각 리조트별 기준 상이)
- 본인 아닌 타인이 대신 이용

[하버타운 (해운대 1504호)]
- 입·퇴실: 당일 13시 ~ 익일 12시
- 열쇠 수령: 입실 전 기획총무팀, 반납: 익일 기획총무팀
- 주차: 이용일 하루 전까지 유선(630-0819), 1대만 가능, 토·일 및 당일 신청 불가
- 예약 가능 시기: 개인 한 달 전, 부서 두 달 전
- 개인사용 요금: 선입금 필수 / 입금: 카카오뱅크 3333-15-1616567 박준형 (표기: 예약일+이름)
- 부서사용: 비용 없음
- 제출서류: 개인 — 입·퇴실 사진 각 5장 + 퇴실확인서 / 부서 — 사진 + 퇴실확인서 + 하버타운 보고서
- 사진 전송: 카카오톡 Nderson / 메일 ericpark@goodhospital.or.kr

[한화리조트]
- 예약: 이용일 두 달 전부터 신청 가능
- 취소·변경: 이용일 10일 전(밤 12시)까지

[ES리조트 (통영·제천·제주)]
- 예약: 기본 한 달 전부터 (35평·30평은 15일 전부터)
- 취소·변경: 이용일 10일 전(밤 12시)까지
- 이용 시 본인 신분증 필요
- 통영: 20평(4인) / 35평(6인), 제천: 20평(5인) / 30평(6인)

[에덴밸리 (양산)]
- 예약: 이용일 한 달 전부터
- 취소·변경: 이용일 4일 전(밤 12시)까지
- 이용 시 에덴밸리 회원카드 필요 (좋은강안병원 기획총무팀에서 수령)
- 객실: 16평(4인) / 23평(4인) / 32평(6인) / 46평(8인)

[문의처]
- 인사총무팀 내선: 820

=== 근로기준법 주요 조항 ===

[근로시간 — 제50조·제53조]
- 법정 근로시간: 1일 8시간, 1주 40시간 (휴게시간 제외)
- 연장근로: 당사자 합의 시 1주 12시간 한도 추가 가능

[휴게시간 — 제54조]
- 근로시간 4시간 → 30분 이상 / 8시간 → 1시간 이상 (근로 중 부여)

[휴일 — 제55조]
- 주 1회 이상 유급휴일 (주휴일)
- 관공서 공휴일·대체공휴일: 유급 적용

[연장·야간·휴일 가산수당 — 제56조]
- 연장근로: 통상임금의 50% 가산
- 야간근로(오후 10시~오전 6시): 50% 가산
- 휴일근로: 8시간 이내 50% 가산 / 8시간 초과 100% 가산

[연차 유급휴가 — 제60조]
- 1년간 80% 이상 출근: 15일 / 1년 미만: 월 개근 시 1일 (최대 11일)
- 3년 이상: 매 2년마다 1일 가산 (최대 25일)

[출산전후휴가 — 제74조]
- 단태아 90일 (출산 후 최소 45일 보장), 다태아 120일

[육아휴직 — 남녀고용평등법 제19조]
- 만 8세 이하(또는 초등 2학년 이하) 자녀 양육 시 신청 가능
- 자녀 1인당 최대 1년 6개월

[해고 제한 — 제23조·제26조]
- 정당한 이유 없는 해고 금지
- 해고 예고: 30일 전 통보 또는 30일분 통상임금

[임금 지급 원칙 — 제43조]
- 통화 직접 지급, 전액 지급, 매월 1회 이상 일정일 지급

[퇴직급여 — 근로자퇴직급여보장법 제8조]
- 1년 이상 근속 시 계속근로 1년당 30일분 이상 평균임금
- 퇴직 후 14일 이내 지급 원칙
`;

const SYSTEM_PROMPT = `# 역할 및 정체성
당신은 은성의료재단 좋은문화병원 인사총무팀의 사내 AI 안내 챗봇 "인총쌤"입니다.
전 직원이 사내 복지·취업규칙·인사총무 행정을 언제든 편하게 묻고, 즉시 정확한 답을 얻도록 돕는 것이 임무입니다.

# 핵심 원칙 (반드시 준수)
1. 근거 기반 답변만 한다. 모든 답변은 사내 문서(취업규칙·복지규정·경조금 지급기준 등)와 근로기준법·남녀고용평등법 등 관련 법령에 근거한다.
2. 추측 금지. 사내 규정과 법령 모두에 없거나 불명확하면 "해당 내용은 규정에 명시되어 있지 않아 인사총무팀(내선 820) 확인이 필요합니다"라고 안내한다.
3. 출처를 밝힌다. (예: 취업규칙 제32조 / 근로기준법 제60조)
4. 최종 결정 권한은 없다. 당신은 '안내자'이며, 승인·예외·규정 해석은 인사총무팀의 최종 판단임을 분명히 한다.

# 답변 형식
- 결론부터 1~2문장으로 먼저 답한다.
- 조건·금액·일수는 불릿(-)으로 정리한다.
- 핵심만 간결하게. 서론·인사말·과도한 사과는 생략한다.
- 답변 끝에 근거를 표기한다. (예: 📄 근거: 취업규칙 제○조)

# 어조
- 따뜻하고 친근하되 전문적인 존댓말.
- "이런 것도 물어봐도 되나?" 걱정 없이 편하게 질문할 수 있는 분위기.

# 사내 규정 원문 데이터
${KNOWLEDGE}`;

async function callAI(question) {
  const key = process.env.VITE_OPENROUTER_KEY || process.env.OPENROUTER_KEY;
  if (!key) throw new Error('OPENROUTER_KEY 환경변수 없음');

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: question },
  ];

  for (const model of MODELS) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://medical-appointment-nine.vercel.app',
          'X-Title': 'IntchongSaem-GChat',
        },
        body: JSON.stringify({ model, messages, max_tokens: 500 }),
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        console.log(`AI_FAIL ${model} status=${res.status} body=${errBody.slice(0, 200)}`);
        continue;
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) {
        console.log(`AI_OK ${model} len=${content.length}`);
        return content;
      }
      console.log(`AI_EMPTY ${model} data=${JSON.stringify(data).slice(0, 200)}`);
    } catch (e) {
      console.log(`AI_THROW ${model} err=${e?.message}`);
    }
  }

  return '죄송합니다, 일시적 오류가 발생했습니다. 인사총무팀 내선 820으로 문의해 주세요.';
}

function chatMessageResponse(text) {
  return {
    hostAppDataAction: {
      chatDataAction: {
        createMessageAction: {
          message: { text },
        },
      },
    },
  };
}

function extractMessageText(event) {
  return (
    event?.message?.text ||
    event?.chat?.messagePayload?.message?.text ||
    event?.commonEventObject?.parameters?.text ||
    ''
  );
}

function extractEventType(event) {
  return (
    event?.type ||
    event?.chat?.type ||
    event?.eventType ||
    (event?.message ? 'MESSAGE' : null) ||
    (event?.chat?.messagePayload?.message ? 'MESSAGE' : null) ||
    (event?.chat?.addedToSpacePayload ? 'ADDED_TO_SPACE' : null) ||
    (event?.chat?.removedFromSpacePayload ? 'REMOVED_FROM_SPACE' : null)
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const event = req.body || {};
    console.log('GCHAT_EVENT:', JSON.stringify(event));

    const type = extractEventType(event);
    console.log('GCHAT_TYPE:', type);

    if (type === 'ADDED_TO_SPACE') {
      const spaceName =
        event?.space?.displayName || event?.chat?.addedToSpacePayload?.space?.displayName || '스페이스';
      return res.json(chatMessageResponse(
        `✅ '${spaceName}'에 인총쌤이 연결되었습니다!\n\n` +
          `안녕하세요! 좋은문화병원 인사총무팀 AI 챗봇 '인총쌤'입니다 😊\n` +
          `복지·휴가·경조사·취업규칙·근로기준법 등 궁금한 점을 @인총쌤 으로 물어보세요.\n\n` +
          `📞 인사총무팀 내선: 820`
      ));
    }

    if (type === 'REMOVED_FROM_SPACE') {
      return res.status(200).json({});
    }

    const rawText = extractMessageText(event);
    const question = rawText.replace(/<users\/[^>]+>/g, '').replace(/@인총쌤/g, '').trim();
    console.log('GCHAT_QUESTION:', question);

    if (!question) {
      return res.json(chatMessageResponse(
        `안녕하세요! 좋은문화병원 인사총무팀 AI 챗봇 '인총쌤'입니다 😊\n` +
          `복지·휴가·경조사·취업규칙·근로기준법 등 궁금한 점을 편하게 물어보세요.\n\n` +
          `📞 인사총무팀 내선: 820`
      ));
    }

    const answer = await callAI(question);
    console.log('GCHAT_ANSWER_LEN:', answer.length);
    return res.json(chatMessageResponse(answer));
  } catch (err) {
    console.error('GCHAT_ERROR:', err?.message, err?.stack);
    return res.json(chatMessageResponse(
      '죄송합니다, 일시적 오류가 발생했습니다. 인사총무팀 내선 820으로 문의해 주세요.'
    ));
  }
}
