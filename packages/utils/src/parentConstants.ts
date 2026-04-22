// 부모님용 퀴즈: "자식을 얼마나 아시나요"
// 점수 키는 자식용(QUESTIONS)과 동일하게 유지하여 Store/계산 로직을 공유합니다.
//  - interest: 자식에 대한 지식 (이름/사이즈/꿈/일상/건강)
//  - intimacy: 자식과의 정서적 거리감·대화·스킨십
//  - expression: 애정/지지를 밖으로 드러내는 능력 (말·행동·용돈 포함)
//  - tsundere: 속으론 다 알지만 표현 안 하는 부모 (돌부처형 판별)
//  - sns: 자식 자랑을 동네/동창회/SNS에 과도하게 하는 성향 (자랑꾼 판별)
import type { Effects, Question } from "./constants";

export type { Effects };

export const PARENT_QUESTIONS: Question[] = [
	// --- PART 1. 기초 탐구 (자식에 대한 지식) ---
	{
		id: 1,
		q: "자식 이름 한자(漢字)의 뜻을 지금도 정확히 설명해주실 수 있나요?",
		options: [
			{
				text: "획순까지 외우고 있다 (ex. 빛날 현, 밝을 준)",
				effects: { interest: 20, expression: 5 },
			},
			{
				text: "뜻은 아는데 한자까지는 가물가물하다",
				effects: { interest: 10 },
			},
			{
				text: "좋은 뜻으로 지은 건 기억난다",
				effects: { interest: 5, intimacy: -5 },
			},
			{
				text: "솔직히 한글 이름인 줄 알았다",
				effects: { interest: 0, intimacy: -10 },
			},
		],
	},
	{
		id: 2,
		q: "지금 당장 자식 옷/신발을 선물한다면 사이즈를 바로 말씀하실 수 있나요?",
		options: [
			{
				text: "옷 95, 신발 260, 발볼까지 줄줄 나온다",
				effects: { interest: 20, expression: 10 },
			},
			{
				text: "대충 어른 사이즈 정도로 맞출 수 있다",
				effects: { interest: 10 },
			},
			{
				text: "옷이나 신발 둘 중 하나만 기억난다",
				effects: { interest: 5 },
			},
			{
				text: "전혀 모른다. 그래서 용돈으로 드린다",
				effects: { interest: 0, expression: 5, sns: 1 },
			},
		],
	},
	{
		id: 3,
		q: "자식의 휴대폰 번호를 외우고 계신가요?",
		options: [
			{
				text: "010... 자다가도 읊을 수 있다",
				effects: { interest: 15, intimacy: 10 },
			},
			{
				text: "앞자리는 아는데 뒷자리는 헷갈린다",
				effects: { interest: 5, intimacy: 5 },
			},
			{
				text: "즐겨찾기에서 눌러서 건다",
				effects: { interest: 0 },
			},
			{
				text: "번호를 바꾼 것도 몰랐다",
				effects: { interest: -5, intimacy: -10 },
			},
		],
	},
	{
		id: 4,
		q: "자식이 최근 앓았거나 지금 복용 중인 약을 알고 계신가요?",
		options: [
			{
				text: "비염 약까지 다 꿰고 있다",
				effects: { interest: 20, intimacy: 10 },
			},
			{
				text: "감기 걸렸던 것 정도는 안다",
				effects: { interest: 10 },
			},
			{
				text: "어디 아팠다고 들은 것 같긴 한데…",
				effects: { interest: 0, intimacy: -5 },
			},
			{
				text: "우리 애는 원래 튼튼하다 (모름)",
				effects: { interest: -10, intimacy: -10 },
			},
		],
	},
	{
		id: 5,
		q: "자식의 생일과 태어난 시각을 정확히 기억하고 계신가요?",
		options: [
			{
				text: "태몽, 진통 시간까지 완벽히 기억한다",
				effects: { interest: 20, intimacy: 10, expression: 5 },
			},
			{
				text: "생일과 대략적인 시각은 안다",
				effects: { interest: 15 },
			},
			{
				text: "날짜는 아는데 시각은 잊었다",
				effects: { interest: 8 },
			},
			{
				text: "음력/양력이 헷갈린다",
				effects: { interest: 0, intimacy: -5 },
			},
		],
	},

	// --- PART 2. 관계 탐구 (자식과의 친밀도) ---
	{
		id: 6,
		q: "자식에게 전화가 왔을 때 첫 마디는?",
		options: [
			{
				text: '"어~ 우리 아들/딸 웬일이야~" (반가운 하이톤)',
				effects: { intimacy: 20, expression: 15 },
			},
			{
				text: '"왜, 무슨 일 있어?" (일단 걱정부터)',
				effects: { intimacy: 10, interest: 5 },
			},
			{
				text: '"바빠? 짧게 말할게" (용건부터)',
				effects: { intimacy: 5, expression: -5 },
			},
			{
				text: '"어." (무뚝뚝, 속으론 반가움)',
				effects: { intimacy: 0, tsundere: 10 },
			},
		],
	},
	{
		id: 7,
		q: "자식한테 스마트폰 사용법을 물어봤을 때, 자식이 짜증을 냈습니다. 반응은?",
		options: [
			{
				text: '"그래, 바쁘지? 다음에 물어볼게" (웃어넘김)',
				effects: { intimacy: 20, expression: 10 },
			},
			{
				text: "속으론 서운하지만 티는 안 낸다",
				effects: { intimacy: 5, tsundere: 10 },
			},
			{
				text: '"됐다, 내가 알아서 할게" (퉁명스레 끊음)',
				effects: { intimacy: -5, tsundere: 5, expression: -5 },
			},
			{
				text: "동창회 가서 '요새 애들은…' 한탄한다",
				effects: { intimacy: -5, sns: 1 },
			},
		],
	},
	{
		id: 8,
		q: "자식과의 카톡 대화 스타일은?",
		options: [
			{
				text: "이모티콘·사진·짤까지 주고받는다",
				effects: { intimacy: 15, expression: 15 },
			},
			{
				text: '"밥은?", "도착함?" 짧지만 매일 본다',
				effects: { intimacy: 10, interest: 5 },
			},
			{
				text: "필요할 때만 용건으로 연락한다",
				effects: { intimacy: 0, expression: 5 },
			},
			{
				text: "읽씹이 잦다 (속으론 자주 열어본다)",
				effects: { intimacy: -5, tsundere: 10 },
			},
		],
	},
	{
		id: 9,
		q: "자식의 손을 마지막으로 꼭 잡아주신 적이 언제인가요?",
		options: [
			{
				text: "얼마 전에도 손 잡고 걸었다 (스킨십 자연스러움)",
				effects: { intimacy: 20, expression: 15 },
			},
			{
				text: "명절·경조사 때 잠깐 잡아본다",
				effects: { intimacy: 8, expression: 5 },
			},
			{
				text: "다 컸는데 새삼스럽게… 망설여진다",
				effects: { intimacy: 0, tsundere: 10, expression: -5 },
			},
			{
				text: "성인이 된 뒤로는 잡아본 기억이 없다",
				effects: { intimacy: -10, expression: -10 },
			},
		],
	},
	{
		id: 10,
		q: '자식이 뜬금없이 "사랑해요"라고 카톡을 보냈습니다. 반응은?',
		options: [
			{
				text: '"엄빠도 사랑해~❤️" (하트 답장)',
				effects: { expression: 20, intimacy: 15 },
			},
			{
				text: '"응, 고맙다" (짧지만 따뜻하게)',
				effects: { expression: 10, intimacy: 10 },
			},
			{
				text: '"무슨 일 있어? 돈 필요해?"',
				effects: { tsundere: 10, expression: -5 },
			},
			{
				text: "읽고 답은 못 한다 (다음 날 어색함)",
				effects: { expression: -15, tsundere: 5 },
			},
		],
	},

	// --- PART 3. 심화 탐구 (자식을 이해하는 깊이) ---
	{
		id: 11,
		q: "자식이 혼자 있는 시간에 주로 무엇을 하는지 아시나요?",
		options: [
			{
				text: "취미·루틴(운동·게임·영상 등)까지 안다",
				effects: { interest: 20, intimacy: 15 },
			},
			{
				text: "대충 스마트폰 본다 정도로 짐작한다",
				effects: { interest: 8 },
			},
			{
				text: "일하느라 바쁘겠지… 정도로만 안다",
				effects: { interest: 3, intimacy: -5 },
			},
			{
				text: "한 번도 궁금해한 적이 없다",
				effects: { interest: -10, intimacy: -10 },
			},
		],
	},
	{
		id: 12,
		q: "자식이 요즘 가장 이루고 싶어 하는 꿈이 무엇인지 아시나요?",
		options: [
			{
				text: "진로·목표를 구체적으로 들어본 적 있다",
				effects: { interest: 20, intimacy: 15 },
			},
			{
				text: "얼추 방향은 안다 (자세히는 모름)",
				effects: { interest: 10 },
			},
			{
				text: "'잘되면 좋겠다' 정도로만 빈다",
				effects: { interest: 5, expression: 5, sns: 1 },
			},
			{
				text: "꿈? 안정적으로만 살면 됐지",
				effects: { interest: 0, intimacy: -5 },
			},
		],
	},
	{
		id: 13,
		q: "자식이 요즘 가장 힘들어하는 일이 무엇인지 아시나요?",
		options: [
			{
				text: "고민을 직접 털어놓은 적이 있다",
				effects: { interest: 15, intimacy: 20 },
			},
			{
				text: "표정·말투 변화로 눈치챈 적이 있다",
				effects: { interest: 10, intimacy: 10, tsundere: 5 },
			},
			{
				text: "힘든 건 알겠는데 묻기가 조심스럽다",
				effects: { interest: 5, tsundere: 10, expression: -5 },
			},
			{
				text: "다 큰 애가 알아서 해결하겠지",
				effects: { interest: -10, intimacy: -15 },
			},
		],
	},
	{
		id: 14,
		q: "다음 생에도 가족으로 만난다면?",
		options: [
			{
				text: "다시 부모로! 더 따뜻하게 안아줄게",
				effects: { intimacy: 20, expression: 20 },
			},
			{
				text: "이번엔 내가 자식으로! 받은 사랑 돌려주고 싶다",
				effects: { intimacy: 15, expression: 10 },
			},
			{
				text: "친구로! 계급장 떼고 여행 다니고 싶다",
				effects: { intimacy: 10 },
			},
			{
				text: "이번 생으로 충분하다 (말은 이렇게 해도…)",
				effects: { intimacy: -5, tsundere: 10 },
			},
		],
	},
];
