'use strict';
const CARROT_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 20;
const GAME_COUNT = 15;

// 게임 구역
const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
// 게임 버튼, 타이머, 스코어
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.timer');
const gameScore = document.querySelector('.score');
// 게임 팝업창 ( 메시지 )
const popUp = document.querySelector('.pop-up');
const popUpMessage = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');
// 게임 BGM
const gameMainSound = new Audio('./sound/bg.mp3');
const carrotClickSound = new Audio('./sound/carrot_pull.mp3');
const bugClickSound = new Audio('./sound/bug_pull.mp3');
const gameWinSound = new Audio('./sound/game_win.mp3');
const alertSound = new Audio('./sound/alert.wav');

let started = false; // 게임 시작 여부 판단할 변수
let score = 9; // 게임 스코어 저장하는 변수
let timer = undefined; // setInterval 저장할 변수 ( 종료하거나 성공시 함수 종료 위해)
let countDownSecond = undefined; // 제한시간

// 사운드 재생
function playSound( sound ) {
	sound.currentTime = 0;
	let promise = sound.play();
	if (promise !== undefined) {
		promise.then(_ => {
			// Autoplay started
		})
			.catch(error => {
				console.log('audio error : ' + error);
			});
	}
}
// 사운드 정지
function stopSound(sound) {
	sound.pause();
}

// pop-up
// pop-up창 숨기는 함수
function popUpHide() {
	popUp.classList.add('pop-up__hide');
}

// 게임 성공 pop-up창 띄우는 함수
function gameSuccessMsg( message ) {
	popUp.classList.remove('pop-up__hide');
	popUpMessage.innerText = message;
}

// 게임 실패 pop-up창 띄우는 함수
function GameFailMsg( message ) {
	popUp.classList.remove('pop-up__hide');
	popUpMessage.innerText = message;
}

// 게임 정지 pop-up창 띄우는 함수
function gameStopMsg() {
	popUp.classList.remove('pop-up__hide');
	popUpMessage.innerHTML = '다시하기!';
}

// 게임 타임, 스코어 가리는 함수 및 스코어 초기화
function timeAndScoreHide() {
	gameTimer.classList.add('timer__hide');
	gameScore.classList.add('score__hide');
	gameBtn.innerHTML = `<i class="fas fa-play"></i>`;
}

// 게임 타임, 스코어 보여주는 함수
function timeAndScoreShow() {
	gameTimer.innerHTML = `0:${GAME_COUNT}`;
	gameScore.innerHTML = `${CARROT_COUNT}`;
	gameTimer.classList.remove('timer__hide');
	gameScore.classList.remove('score__hide');
	gameBtn.innerHTML = `<i class="fas fa-times"></i>`;
}

// 게임 시작 여부에 따라 시작 및 정지
function gameStart() {
	if (started === true) {
		stopGame();
	} else {
		startGame();
	}
	started = !started;
}

// 업데이트 스코어
function updateScoreBoard() {
	gameScore.innerText = CARROT_COUNT - score;
}

// 시간제한 카운트 다운 시작
function CountDownTime() {
	score = 0;
	countDownSecond = GAME_COUNT;
	timer = setInterval(() => {
		gameTimer.innerHTML = `0:${countDownSecond}`;
		countDownSecond -= 1;
		// 게임 실패 ( 시간 초과 )
		if (countDownSecond < 0) {
			finishGame(false, '시간 초과!');
		}
		// 남은 시간 4초 이내 경고 사운드
		if (countDownSecond < 5) {
			playSound(alertSound);
		}

	}, 1000);
}

// 이미지 클릭 처리 ( 점수 카운트 감소 및 성공 여부 출력 )
function imgClickCarrotAndBug( event ) {
	let imgName = event.target.className;
	if (imgName === 'carrot') {
		field.removeChild(event.target);
		score++;
		updateScoreBoard();
		playSound(carrotClickSound);
		if (score === CARROT_COUNT) {
			finishGame(true, '성공!');
		}
	} else if (imgName === 'bug') {
		playSound(bugClickSound);
		finishGame(false, '벌레 클릭 실패!');
	}
}

// 게임 시작
function startGame() {
	playSound(gameMainSound);
	popUpHide();
	timeAndScoreShow();
	initGame();
	CountDownTime();
}

// 게임 정지
function stopGame() {
	stopSound(gameMainSound);
	removeImg();
	timeAndScoreHide();
	gameStopMsg();
	clearInterval(timer);
}

// 게임 성공, 실패에 따른 함수 실행 및 메시지 전달
function finishGame( win, message ) {
	if (win) {
		playSound(gameWinSound);
		gameStart();
		gameSuccessMsg(message);
		clearInterval(timer);
	} else {
		playSound(bugClickSound);
		gameStart();
		GameFailMsg(message);
		clearInterval(timer);
	}
}

// game field 이미지 삭제
function removeImg() {
	field.innerHTML = '';
}

// 각각의 이미지를 gameField에 위치시킬 x,y값 랜덤 구하는 함수
const randomNumber = ( minValue, maxValue ) => Math.floor(Math.random() * ( maxValue - minValue ) + minValue);

// gameField에 랜덤으로 이미지 추가
const initGame = () => {
	removeImg();
	addItem('carrot', CARROT_COUNT, 'img/carrot.png');
	addItem('bug', BUG_COUNT, 'img/bug.png');
};

// carrot,bug 이미지를 count만큼 gameField에 배치
const addItem = ( className, count, imgPath ) => {
	const x1 = 0;
	const y1 = 0;
	const x2 = fieldRect.width - CARROT_SIZE;
	const y2 = fieldRect.height - CARROT_SIZE;
	for (let i = 0; i < count; i++) {
		const item = document.createElement('img');
		item.setAttribute('class', className);
		item.setAttribute('src', imgPath);
		item.style.position = 'absolute';
		const x = randomNumber(x1, x2);
		const y = randomNumber(y1, y2);

		item.style.left = `${x}px`;
		item.style.top = `${y}px`;
		field.appendChild(item);
	}
};


// 게임 시작버튼 이벤트리스너
gameBtn.addEventListener('click', gameStart);
popUpRefresh.addEventListener('click', gameStart);
// 이미지 클릭 이벤트리스너
field.addEventListener('click', imgClickCarrotAndBug);

