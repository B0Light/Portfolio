# 🌟 3D 인터랙티브 포트폴리오

Bruno Simon의 포트폴리오에서 영감을 받은 3D 인터랙티브 포트폴리오 사이트입니다.

## ✨ 주요 기능

- **3D 환경**: Three.js를 사용한 몰입감 있는 3D 공간
- **물리 엔진**: Cannon.js를 통한 실제적인 물리 시뮬레이션  
- **인터랙티브 조작**: WASD 키로 캐릭터 이동
- **포트폴리오 섹션**: 클릭 가능한 3D 오브젝트들
- **반응형 디자인**: 모바일과 데스크톱 지원

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

## 🎮 조작법

- **이동**: `WASD` 키 또는 방향키
- **상호작용**: 컬러 박스들을 클릭해서 포트폴리오 섹션 보기
- **카메라**: 자동으로 플레이어를 따라갑니다

## 🛠 기술 스택

- **Three.js** - 3D 그래픽
- **Cannon.js** - 물리 엔진  
- **GSAP** - 애니메이션
- **Vite** - 번들러
- **Lil-GUI** - 디버깅 도구

## 📁 프로젝트 구조

```
Portfolio_3d/
├── src/
│   ├── main.js      # 메인 Three.js 로직
│   └── style.css    # 스타일시트
├── index.html       # HTML 엔트리 포인트
├── package.json     # 프로젝트 설정
└── vite.config.js   # Vite 설정
```

## 🎨 커스터마이징

### 포트폴리오 섹션 추가하기

`src/main.js`에서 새로운 박스를 추가할 수 있습니다:

```javascript
const newBox = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshStandardMaterial({ color: '#your-color' })
)
newBox.position.set(x, 0.5, z)
newBox.userData = { type: 'your-section' }
scene.add(newBox)
portfolioBoxes.push(newBox)
```

### 텍스처 변경하기

바닥 텍스처나 재질을 변경하려면:

```javascript
const yourTexture = textureLoader.load('path/to/your/texture.jpg')
// 또는 color로 간단히
new THREE.MeshStandardMaterial({ color: '#your-color' })
```

## 📱 모바일 최적화

- 터치 이벤트 지원
- 성능 최적화된 렌더링
- 반응형 UI 레이아웃

## 🔧 고급 기능 추가하기

1. **더 복잡한 3D 모델**: GLTF 로더 사용
2. **파티클 시스템**: 눈, 별 등의 효과
3. **음향 효과**: Web Audio API 연동
4. **VR/AR 지원**: WebXR API 활용

## 🤝 기여하기

1. 이 레포지토리를 포크하세요
2. 새로운 브랜치를 만드세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 열어주세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 