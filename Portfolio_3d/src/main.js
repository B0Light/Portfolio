import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import GUI from 'lil-gui'
import { gsap } from 'gsap'

/**
 * 기본 설정
 */
// 디버그 GUI
const gui = new GUI()
gui.hide() // 개발 중에는 주석 처리

// 캔버스
const canvas = document.querySelector('#webgl')

// 씬 (PDF/문서 느낌)
const scene = new THREE.Scene()
scene.fog = new THREE.Fog('#f5f5f5', 40, 120) // PDF 느낌에 맞게 밝은 안개 조정

/**
 * 텍스처
 */
const textureLoader = new THREE.TextureLoader()

// 바닥 텍스처 (PDF/종이 느낌)
// const floorColorTexture = textureLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg')
// floorColorTexture.repeat.set(40, 40) // 필드 크기에 맞게 텍스처 반복 증가
// floorColorTexture.wrapS = THREE.RepeatWrapping
// floorColorTexture.wrapT = THREE.RepeatWrapping

// PDF/문서 느낌을 위한 종이 텍스처 (또는 단색 사용)
const paperTexture = textureLoader.load('data:image/svg+xml;base64,' + btoa(`
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#fefefe"/>
  <circle cx="20" cy="20" r="0.5" fill="#f5f5f5" opacity="0.3"/>
  <circle cx="80" cy="60" r="0.3" fill="#f0f0f0" opacity="0.2"/>
  <circle cx="50" cy="90" r="0.4" fill="#f8f8f8" opacity="0.3"/>
  <circle cx="10" cy="70" r="0.2" fill="#f2f2f2" opacity="0.2"/>
</svg>`))
paperTexture.repeat.set(20, 20)
paperTexture.wrapS = THREE.RepeatWrapping
paperTexture.wrapT = THREE.RepeatWrapping

/**
 * 월드
 */
// 물리 세계
const world = new CANNON.World()
world.broadphase = new CANNON.NaiveBroadphase()
world.gravity.set(0, -9.82, 0)

// 기본 재질
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.4,
        restitution: 0.3,
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// 바닥
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

/**
 * 3D 오브젝트들
 */
// 바닥 (PDF/문서 느낌)
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100), // 5배 크기로 확장 (20 x 5 = 100)
    new THREE.MeshStandardMaterial({
        map: paperTexture,
        color: '#ffffff', // 흰색 베이스
        roughness: 0.8, // 종이 느낌을 위한 거칠기
        metalness: 0.0 // 금속성 제거
    })
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

// 포트폴리오 섹션 박스들 - 문서 블록 스타일
const portfolioBoxes = []

// 문서 블록처럼 직사각형 형태로 변경
const documentBlockGeometry = new THREE.BoxGeometry(8, 0.2, 4) // 얇고 넓은 문서 블록 형태

// About 섹션 - 문서의 헤더처럼
const aboutBox = new THREE.Mesh(
    documentBlockGeometry,
    new THREE.MeshStandardMaterial({ 
        color: '#e74c3c', // 문서의 중요 섹션 색상
        roughness: 0.7,
        metalness: 0.1
    })
)
aboutBox.position.set(0, 0.1, 15) // 문서 상단 (헤더 위치)
aboutBox.userData = { type: 'about' }
scene.add(aboutBox)
portfolioBoxes.push(aboutBox)

// Projects 섹션 - 문서의 본문처럼
const projectsBox = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.2, 6), // 본문은 더 크게
    new THREE.MeshStandardMaterial({ 
        color: '#3498db', // 문서의 링크/참조 색상
        roughness: 0.7,
        metalness: 0.1
    })
)
projectsBox.position.set(0, 0.1, 0) // 문서 중앙 (본문 위치)
projectsBox.userData = { type: 'projects' }
scene.add(projectsBox)
portfolioBoxes.push(projectsBox)

// Contact 섹션 - 문서의 푸터처럼
const contactBox = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.2, 3), // 푸터는 작게
    new THREE.MeshStandardMaterial({ 
        color: '#27ae60', // 문서의 긍정적 액션 색상
        roughness: 0.7,
        metalness: 0.1
    })
)
contactBox.position.set(0, 0.1, -15) // 문서 하단 (푸터 위치)
contactBox.userData = { type: 'contact' }
scene.add(contactBox)
portfolioBoxes.push(contactBox)

// 추가 문서 요소들 (텍스트 라인처럼)
const textLineGeometry = new THREE.BoxGeometry(10, 0.1, 0.5)
const textLineMaterial = new THREE.MeshStandardMaterial({ 
    color: '#7f8c8d', 
    roughness: 0.8,
    metalness: 0.05
})

// About 섹션의 텍스트 라인들
for(let i = 0; i < 3; i++) {
    const textLine = new THREE.Mesh(textLineGeometry, textLineMaterial)
    textLine.position.set(0, 0.05, 12 - i * 1)
    scene.add(textLine)
}

// Projects 섹션의 텍스트 라인들
for(let i = 0; i < 5; i++) {
    const textLine = new THREE.Mesh(textLineGeometry, textLineMaterial)
    textLine.position.set(0, 0.05, 3 - i * 1)
    scene.add(textLine)
}

// Contact 섹션의 텍스트 라인들
for(let i = 0; i < 2; i++) {
    const textLine = new THREE.Mesh(textLineGeometry, textLineMaterial)
    textLine.position.set(0, 0.05, -12 - i * 1)
    scene.add(textLine)
}

// 추가 문서 요소들
// 문서 제목 (헤더 위쪽)
const titleGeometry = new THREE.BoxGeometry(15, 0.3, 2)
const titleMaterial = new THREE.MeshStandardMaterial({ 
    color: '#2c3e50', 
    roughness: 0.7,
    metalness: 0.1
})
const titleBlock = new THREE.Mesh(titleGeometry, titleMaterial)
titleBlock.position.set(0, 0.15, 22)
scene.add(titleBlock)

// 문서 마진/경계선들
const marginGeometry = new THREE.BoxGeometry(0.2, 0.05, 50)
const marginMaterial = new THREE.MeshStandardMaterial({ 
    color: '#bdc3c7', 
    roughness: 0.9,
    metalness: 0.05
})

// 왼쪽 마진
const leftMargin = new THREE.Mesh(marginGeometry, marginMaterial)
leftMargin.position.set(-18, 0.025, 0)
scene.add(leftMargin)

// 오른쪽 마진
const rightMargin = new THREE.Mesh(marginGeometry, marginMaterial)
rightMargin.position.set(18, 0.025, 0)
scene.add(rightMargin)

// 문서 섹션 구분선들
const dividerGeometry = new THREE.BoxGeometry(16, 0.05, 0.2)
const dividerMaterial = new THREE.MeshStandardMaterial({ 
    color: '#95a5a6', 
    roughness: 0.8,
    metalness: 0.05
})

// About와 Projects 사이 구분선
const divider1 = new THREE.Mesh(dividerGeometry, dividerMaterial)
divider1.position.set(0, 0.025, 8)
scene.add(divider1)

// Projects와 Contact 사이 구분선
const divider2 = new THREE.Mesh(dividerGeometry, dividerMaterial)
divider2.position.set(0, 0.025, -8)
scene.add(divider2)

// 플레이어 (구체) - PDF 문서 느낌 (문서 커서처럼)
const playerGeometry = new THREE.SphereGeometry(0.2, 32, 32) // 조금 더 작게
const playerMaterial = new THREE.MeshStandardMaterial({ 
    color: '#2c3e50', // 문서의 텍스트 색상 느낌
    metalness: 0.1,
    roughness: 0.6
})
const player = new THREE.Mesh(playerGeometry, playerMaterial)
player.position.set(0, 1, 20) // 문서의 시작 부분에서 시작
scene.add(player)

// 플레이어 물리 바디
const playerShape = new CANNON.Sphere(0.2)
const playerBody = new CANNON.Body({ mass: 1 })
playerBody.addShape(playerShape)
playerBody.position.set(0, 1, 20) // 문서의 시작 부분에서 시작
world.addBody(playerBody)

/**
 * 조명 (PDF/문서 느낌)
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.8) // 밝은 백색 주변광
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.6) // 부드러운 백색 직광
directionalLight.position.set(10, 20, 10) // PDF 문서를 읽는 느낌의 조명 위치
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048 // 그림자 해상도 증가
directionalLight.shadow.mapSize.height = 2048
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 60 // 더 먼 거리까지 그림자
directionalLight.shadow.camera.top = 30 // 더 큰 필드에 맞게 그림자 범위 확장
directionalLight.shadow.camera.right = 30
directionalLight.shadow.camera.bottom = -30
directionalLight.shadow.camera.left = -30
directionalLight.shadow.radius = 8 // 부드러운 그림자
directionalLight.shadow.blurSamples = 25
scene.add(directionalLight)

/**
 * 크기
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // 크기 업데이트
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // 카메라 업데이트
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // 렌더러 업데이트
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * 카메라
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)
camera.position.set(0, 25, 30) // 문서의 시작 부분을 보도록 조정
scene.add(camera)

/**
 * 컨트롤
 */
const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false
}

// 마우스 컨트롤 변수들
let isMouseDown = false
let mouseX = 0
let mouseY = 0
let cameraAngleX = -1.3 // 탑뷰를 위해 아래를 보는 각도
let cameraAngleY = 0
const cameraDistance = 15 // 탑뷰를 위해 거리 증가
const cameraHeight = 20 // 탑뷰를 위해 높이 대폭 증가
let cameraDistanceTarget = cameraDistance

// 키보드 이벤트
window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.forward = true
            break
        case 'KeyS':
        case 'ArrowDown':
            keys.backward = true
            break
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = true
            break
        case 'KeyD':
        case 'ArrowRight':
            keys.right = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.forward = false
            break
        case 'KeyS':
        case 'ArrowDown':
            keys.backward = false
            break
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = false
            break
        case 'KeyD':
        case 'ArrowRight':
            keys.right = false
            break
    }
})

// 마우스 이벤트 (모든 마우스 버튼)
window.addEventListener('mousedown', (event) => {
    isMouseDown = true
    mouseX = event.clientX
    mouseY = event.clientY
    canvas.style.cursor = 'grabbing'
})

window.addEventListener('mouseup', (event) => {
    isMouseDown = false
    canvas.style.cursor = 'grab'
})

// 우클릭 컨텍스트 메뉴 비활성화
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault()
})

window.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const deltaX = event.clientX - mouseX
        const deltaY = event.clientY - mouseY
        
        cameraAngleY -= deltaX * 0.005 // 탑뷰에 맞게 감도 조정
        cameraAngleX -= deltaY * 0.005
        
        // X축 회전 제한 (탑뷰를 위해 아래쪽 시야 제한)
        cameraAngleX = Math.max(-Math.PI * 0.49, Math.min(-Math.PI * 0.1, cameraAngleX))
    }
    
    mouseX = event.clientX
    mouseY = event.clientY
})

// 마우스 휠로 줌 인/아웃
window.addEventListener('wheel', (event) => {
    cameraDistanceTarget += event.deltaY * 0.02
    cameraDistanceTarget = Math.max(8, Math.min(30, cameraDistanceTarget)) // 탑뷰에 맞게 범위 조정
})

/**
 * 렌더러
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#f8f8f8') // PDF/문서 느낌의 밝은 배경
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 그림자 설정
floor.receiveShadow = true
player.castShadow = true
portfolioBoxes.forEach(box => {
    box.castShadow = true
    box.receiveShadow = true
})

// 새로운 문서 요소들도 그림자 설정
titleBlock.castShadow = true
titleBlock.receiveShadow = true

/**
 * 애니메이션
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

// 로딩 완료 처리
setTimeout(() => {
    const loading = document.querySelector('.loading')
    loading.classList.add('hidden')
}, 2000)

// 포트폴리오 박스 호버 애니메이션 (문서 블록 느낌)
portfolioBoxes.forEach((box, index) => {
    // 문서 블록이 살짝 위아래로 떠오르는 애니메이션
    gsap.to(box.position, {
        duration: 3 + index * 0.5, // 각 블록마다 다른 속도
        y: 0.1 + Math.sin(index) * 0.05,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    })
    
    // 텍스트가 살짝 강조되는 느낌의 스케일 애니메이션
    gsap.to(box.scale, {
        duration: 4 + index * 0.3,
        x: 1 + Math.sin(index * 2) * 0.02,
        z: 1 + Math.cos(index * 2) * 0.02,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    })
})

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // 플레이어 움직임 (카메라 방향 기준)
    const force = 5
    
    // 카메라 방향 벡터 계산
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    
    // 카메라의 오른쪽 방향 벡터 계산 (up 벡터와 방향 벡터의 외적)
    const cameraRight = new THREE.Vector3()
    cameraRight.crossVectors(cameraDirection, camera.up).normalize()
    
    // 앞뒤 움직임을 위한 정규화된 방향 (Y축 제거)
    const forwardDirection = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize()
    const rightDirection = new THREE.Vector3(cameraRight.x, 0, cameraRight.z).normalize()
    
    // 움직임 벡터 초기화
    let moveX = 0
    let moveZ = 0
    
    // 키 입력에 따른 움직임 계산
    if (keys.forward) {
        moveX += forwardDirection.x * force
        moveZ += forwardDirection.z * force
    }
    if (keys.backward) {
        moveX -= forwardDirection.x * force
        moveZ -= forwardDirection.z * force
    }
    if (keys.left) {
        moveX -= rightDirection.x * force
        moveZ -= rightDirection.z * force
    }
    if (keys.right) {
        moveX += rightDirection.x * force
        moveZ += rightDirection.z * force
    }
    
    // 플레이어 속도 설정
    playerBody.velocity.x = moveX
    playerBody.velocity.z = moveZ

    // 물리 세계 업데이트
    world.step(1/60, deltaTime, 3)

    // 플레이어 위치 동기화
    player.position.copy(playerBody.position)
    player.quaternion.copy(playerBody.quaternion)

    // 카메라 컨트롤 (마우스로 회전 가능)
    const targetDistance = cameraDistanceTarget
    
    // 카메라 위치 계산 (구면 좌표계)
    const cameraX = player.position.x + Math.sin(cameraAngleY) * Math.cos(cameraAngleX) * targetDistance
    let cameraY = player.position.y + cameraHeight + Math.sin(cameraAngleX) * targetDistance
    const cameraZ = player.position.z + Math.cos(cameraAngleY) * Math.cos(cameraAngleX) * targetDistance
    
    // 카메라가 플레이어보다 아래로 내려가지 않도록 제한 (탑뷰)
    const minCameraHeight = player.position.y + 10 // 탑뷰를 위해 플레이어보다 최소 10만큼 위에 위치
    cameraY = Math.max(cameraY, minCameraHeight)
    
    // 부드러운 카메라 이동 (탑뷰에 맞게 안정적으로)
    camera.position.x += (cameraX - camera.position.x) * 0.1
    camera.position.y += (cameraY - camera.position.y) * 0.1
    camera.position.z += (cameraZ - camera.position.z) * 0.1
    
    camera.lookAt(player.position)

    // 렌더
    renderer.render(scene, camera)

    // 다음 프레임 호출
    window.requestAnimationFrame(tick)
}

tick()

/**
 * 인터랙션
 */
// 레이캐스터용 마우스 벡터
const raycastMouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

window.addEventListener('click', (event) => {
    // 왼쪽 클릭이고 마우스 드래그 중이 아닐 때만 박스 클릭 이벤트 처리
    if (event.button === 0 && !isMouseDown) {
        raycastMouse.x = (event.clientX / sizes.width) * 2 - 1
        raycastMouse.y = -(event.clientY / sizes.height) * 2 + 1

        raycaster.setFromCamera(raycastMouse, camera)
        const intersects = raycaster.intersectObjects(portfolioBoxes)

        if (intersects.length > 0) {
            const clickedBox = intersects[0].object
            const type = clickedBox.userData.type
            
            // 문서 블록 클릭 애니메이션 (강조 효과)
            gsap.to(clickedBox.position, {
                duration: 0.3,
                y: 0.3, // 블록이 살짝 떠오름
                yoyo: true,
                repeat: 1,
                ease: "back.out(1.7)"
            })
            
            gsap.to(clickedBox.scale, {
                duration: 0.2,
                x: 1.1,
                y: 2, // 높이만 강조
                z: 1.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            })

            // 콘솔에 메시지 출력 (실제로는 모달이나 다른 UI로 대체)
            console.log(`${type} 섹션이 클릭되었습니다!`)
            
            // 여기에 포트폴리오 상세 정보를 보여주는 로직 추가
            showPortfolioSection(type)
        }
    }
})

function showPortfolioSection(type) {
    const messages = {
        about: "안녕하세요! 저는 웹 개발자입니다.",
        projects: "제가 만든 프로젝트들을 확인해보세요!",
        contact: "연락처: your-email@example.com"
    }
    
    alert(messages[type] || "포트폴리오 정보")
} 