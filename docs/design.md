HobbyFind 웹서비스의 개발 및 디자이너 협업을 위한 **Airbnb 스타일 가이드 기반 디자인 시스템 정의서**입니다. 전반적인 인터페이스는 여백과 타이포그래피를 강조하는 에어비앤비 특유의 미니멀 무드를 계승하며, 사용자 제어가 필요한 핵심 트리거에 시그니처 포인트 컬러를 부여하여 직관성을 극대화합니다.

---

## 1. 디자인 시스템 개요 (Design System Overview)

* **브랜드 아이덴티티**: 누구나 부담 없이 자신만의 취미 공간을 탐색하는 '친근함'과 '정돈된 신뢰감'을 전달합니다.
* **전반적인 톤앤매너**: 배경과 경계선의 요소를 최소화한 미니멀리즘(Minimalism) 레이아웃을 채택합니다. 화이트 배경에 짙은 차콜 색상 텍스트를 사용하여 콘텐츠 가독성을 최우선으로 확보합니다.
* **UI 키 비주얼 가이드**:
* **둥근 모서리(Radius)**: 카드, 버튼, 인풋 창에 일관되게 `rounded-xl(12px)` 또는 `rounded-2xl(16px)` 값을 적용하여 부드러운 인상을 줍니다.
* **선 요소**: 그림자 효과를 채우는 대신 `1px` 두께의 얇은 뉴트럴 선(`border-neutral-200`)으로 영역을 분할하여 깔끔함을 유지합니다.



---

## 2. TailwindCSS 색상 팔레트 (Color Palette)

에어비앤비의 시그니처 로즈 컬러 계열을 HobbyFind 고유 브랜드 컬러로 정의하고, 문자열과 배경은 피로도가 낮은 차콜 및 오프화이트 계열로 구성합니다.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#FF385C', // 시그니처 핑키시 레드 (포인트 컬러, 활성화 북마크, 메인 버튼)
          600: '#E61E4D', // 호버 및 액티브 버튼 상태
        },
        neutral: {
          50: '#F7F7F7',  // 옅은 회색 배경 (마이페이지 대시보드, 인풋 비활성화 배경)
          200: '#DDDDDD', // 일반 경계선 및 디바이더 컬러
          500: '#717171', // 부가 설명 텍스트, 카테고리 기본 상태 글자색
          900: '#222222', // 메인 타이틀, 본문 글자색, 필터 활성화 텍스트
        }
      }
    }
  }
}

```

| 용도 | Tailwind 클래스 | 색상 코드 (HEX) | 디자인 적용 기준 |
| --- | --- | --- | --- |
| **메인 배경** | `bg-white` | `#FFFFFF` | 홈, 카테고리, 로그인 전체 바탕 화면 |
| **기본 본문 텍스트** | `text-neutral-900` | `#222222` | 기본 타이틀 및 본문 폰트 컬러 (가독성 확보) |
| **보조 텍스트** | `text-neutral-500` | `#717171` | 카테고리 설명문, 카드 내 서브 정보 서체 |
| **컴포넌트 경계선** | `border-neutral-200` | `#DDDDDD` | 상단 바 하단 라인, 카드 보더, 폼 테두리 |
| **포인트 인디케이터** | `text-brand-500` | `#FF385C` | 활성화된 북마크 하트 아이콘, 주요 제출 버튼 |

---

## 3. 페이지 구현 가이드 (Page Implementations)

### 3.1. 루트 페이지 (`/`)

* **상단 바 및 필터**: 상단 고정 바 하단에 필터 버튼들이 일렬로 배치됩니다. 필터를 누르면 화면 이동 없이 하단 그리드의 아이템들이 즉시 정렬됩니다.
* **Hero 섹션**: 에어비앤비 홈의 심플 폰트 레이아웃을 참조하여, 거대한 배너 이미지 대신 여백을 강조한 담백한 타이포그래피 문구를 좌측 정렬로 배치합니다.
* **메인 콘텐츠**: 화면을 가득 채우는 가변형 카드 그리드 구조로 18개의 취미 정보를 나열합니다.

### 3.2. 카테고리별 페이지 (`/category/[type]`)

* **상단 구조**: 진입한 카테고리명(예: `운동형`)을 굵은 헤드라인 서체로 표기하고 바로 하단에 간단한 카테고리 요약 소개를 배치합니다.
* **본문 리스트**: 해당 대분류 영역에 부합하는 고정 취미 카드 6개만 격자 형태로 렌더링합니다. 로그인 세션이 유효한 유저에게는 카드 우측 상단에 북마크(하트) 버튼 아이콘이 활성화됩니다.

### 3.3. 로그인 및 회원가입 페이지 (`/login`, `/signup`)

* **레이아웃 규칙**: 화면 중앙에 최대 너비 `450px`의 컴팩트한 사각형 화이트 박스 형태 폼을 구성합니다.
* **컴포넌트 배치**: 아이디, 비밀번호 입력 창을 수직형 층상 구조로 엮어 테두리 선이 결합하는 형태로 구현하고, 하단에 브랜드 컬러 배경의 전면 버튼을 배치합니다.

### 3.4. 마이페이지 (`/mypage`)

* **통계 대시보드**: 상단에 연한 무채색 패널(`bg-neutral-50`)을 구성하여 북마크한 총 개수를 요약 노출하고, 카테고리별 분포 현황을 직관적인 바 차트(Bar Chart) 혹은 파이 차트(Pie Chart) 그래픽 요소로 인클루드합니다.
* **목록 영역**: 하단에는 유저가 선택하여 저장해 둔 북마크 취미 카드들이 그리드로 배치되며, 하트 아이콘 재클릭 시 리스트에서 즉시 제거되는 해제 인터랙션이 구동됩니다.

---

## 4. 레이아웃 컴포넌트 (Layout Components)

### 4.1. 헤더 (Topbar Component)

에어비앤비 고유의 상단 바 구조를 인용하여 구조적 수평 배치를 적용합니다.

```tsx
// 컴포넌트 구조 예시 (Next.js / TailwindCSS)
export default function Topbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white px-6 py-4 md:px-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* 서비스 메인 로고 영역 */}
        <div className="text-brand-500 text-xl font-bold tracking-tight cursor-pointer">
          HobbyFind
        </div>
        
        {/* 우측 유저 인증 세션 상태 메뉴 컨트롤 영역 */}
        <div className="flex items-center gap-4 text-sm font-semibold text-neutral-900">
          {/* 비회원 로그인 상태일 때 노출 스위칭 */}
          <button className="hover:bg-neutral-50 px-3 py-2 rounded-full transition">로그인</button>
          <button className="bg-brand-500 text-white px-4 py-2 rounded-full hover:bg-brand-600 transition">회원가입</button>
        </div>
      </div>
    </header>
  );
}

```

### 4.2. 카테고리 필터 UI (Filter Bar Component)

아이콘 또는 간결한 텍스트 탭 형태로 상단 내비게이션 하단에 롤링 영역을 확보합니다.

```tsx
export function CategoryFilter() {
  return (
    <div className="flex items-center gap-8 border-b border-neutral-200 bg-white px-6 py-3 md:px-20 overflow-x-auto scrollbar-none">
      {/* 활성화 상태: text-neutral-900, 하단 테두리 선 보강 */}
      <button className="border-b-2 border-neutral-900 pb-2 text-sm font-semibold text-neutral-900 min-w-max">
        전체 보기
      </button>
      {/* 비활성화 상태: text-neutral-500, 호버 시 불투명도 조절 */}
      <button className="border-b-2 border-transparent pb-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 min-w-max transition">
        운동형
      </button>
    </div>
  );
}

```

### 4.3. 취미 카드 컴포넌트 (Hobby Card Component)

에어비앤비 숙소 카드와 일치하는 위계 구조를 적용하여 상단에는 고정 비율 이미지, 하단에는 메인 정보를 배치합니다.

* **구조도**: `[이미지 컨테이너 (Aspect Ratio 고정)] -> [대분류 태그] -> [취미 타이틀명]`
* **북마크 하트 위치**: 이미지 컨테이너 우측 상단 내부에 `absolute` 배치하여 비주얼 요소를 최소화합니다.

---

## 5. 상호작용 패턴 (Interaction Patterns)

* **카드 호버 애니메이션 (Hover Effect)**:
* 데스크톱 환경에서 카드 영역에 마우스 오버 시, 카드가 위로 튀어오르는 무거운 모션 대신 내부 이미지 자산만 미세하게 스케일업(`scale-105 transition-transform duration-300`)되도록 제어해 세련된 시각 변화를 줍니다.


* **북마크 토글 인터랙션 (Bookmark Toggle)**:
* 회원 로그인 상태에서 빈 하트 아이콘을 클릭하면 시그니처 로즈 컬러(`#FF385C`)가 스케일 다운 패딩 모션과 함께 내부를 가득 채우며 활성화 상태로 천천히 변환됩니다.


* **인증 에러 제어 (Validation Feedback)**:
* 로그인 및 가입 입력 폼에서 인증 에러가 감지되면 인풋 전체 영역이 흔들리는 애니메이션 효과(Shake Effect)와 함께 테두리에 얇은 적색 경고선이 동적 활성화되어 시인성을 제고합니다.



---

## 6. 반응형 브레이크포인트 (Breakpoints)

TailwindCSS 고유의 중단점 해상도 기준 매칭 규칙에 따라 컬럼 수 및 내부 패딩 그리드를 아래 마크다운 표 구조 규격에 맞추어 유기적으로 압축·해제합니다.

| 중단점 접두사 | 최소 너비 (Min-width) | 적용 디바이스 유형 | 카드 그리드 컬럼 수 명세 (`grid-cols-*`) |
| --- | --- | --- | --- |
| **초기 상태 (기본)** | `320px` | 모바일 세로 모드 | `grid-cols-1` (수직 단일 배치, 카드 전면 채우기) |
| **sm** | `640px` | 모바일 가로 / 소형 태블릿 | `grid-cols-2` (좌우 분할 2열 정렬 시작) |
| **md** | `768px` | 일반 태블릿 환경 | `grid-cols-2` (내부 여백 확장 및 상단 바 최적화) |
| **lg** | `1024px` | 데스크톱 모니터 일반 | `grid-cols-3` (중형 화면 안정적 3열 레이아웃) |
| **xl / 2xl** | `1280px` 이상 | 와이드 와이드스크린 | `grid-cols-4` (최대 폭 `1280px` 컨테이너 내 4열 배치) |

### 해상도별 레이아웃 조절 클래스 예시

```tsx
// 18개 고정 취미 카드가 배치되는 메인 그리드 컨테이너 예시
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 px-6 py-8 md:px-20 mx-auto max-w-7xl">
  {/* 내부 HobbyCard 컴포넌트 루프 바인딩 */}
</div>

```