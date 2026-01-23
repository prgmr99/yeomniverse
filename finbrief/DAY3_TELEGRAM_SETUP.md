# Day 3 - 텔레그램 봇 생성 가이드

## 🤖 Step 1: BotFather에서 봇 생성

### 1-1. 텔레그램 앱 실행
- 모바일 또는 데스크톱에서 텔레그램 실행

### 1-2. BotFather 검색
1. 검색창에 `@BotFather` 입력
2. 공식 Bot (파란 체크마크) 선택

### 1-3. 봇 생성
**명령어 순서:**

```
1. /start
2. /newbot
3. 봇 이름 입력: FinBrief Bot
4. 봇 사용자명 입력: finbrief_news_bot (또는 원하는 이름 + _bot)
```

### 1-4. API 토큰 저장
BotFather가 다음과 같은 메시지를 보냅니다:
```
Done! Congratulations on your new bot.
You will find it at t.me/finbrief_news_bot
You can now add a description, about section and profile picture.

Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**이 토큰을 복사하세요!** (예: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

---

## 📱 Step 2: Chat ID 확인

### 방법 1: 봇에게 메시지 보내기
1. 생성한 봇 `@finbrief_news_bot` 검색
2. `/start` 또는 아무 메시지 전송
3. 브라우저에서 다음 URL 접속:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
4. JSON 응답에서 `"chat":{"id":123456789}` 찾기
5. 이 숫자가 당신의 Chat ID입니다

### 방법 2: @userinfobot 사용
1. 텔레그램에서 `@userinfobot` 검색
2. `/start` 전송
3. `Id:` 뒤의 숫자가 Chat ID

---

## ⚙️ Step 3: .env 파일 설정

`finbrief/.env` 파일을 열어서:

```bash
GEMINI_API_KEY=AIzaSyDL9K2W7Pt2ZbihmggyI6GAWVoaM3LAt5s

# 여기에 추가
TELEGRAM_BOT_TOKEN=여기에_봇_토큰_붙여넣기
TELEGRAM_CHAT_ID=여기에_Chat_ID_붙여넣기
```

**예시:**
```bash
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

---

## ✅ 준비 완료 체크리스트

- [ ] BotFather에서 봇 생성
- [ ] 봇 토큰 복사
- [ ] Chat ID 확인
- [ ] `.env` 파일에 두 값 입력

완료되면 저에게 알려주세요! 바로 코드 구현을 시작하겠습니다.
