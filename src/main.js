'use strict';
import PopUp from '/src/popup.js';
import Field from '/src/field.js';
import * as sound from '/src/sound.js';

const CARROT_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 20;
const GAME_COUNT = 15;

// 게임 버튼, 타이머, 스코어
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.timer');
const gameScore = document.querySelector('.score');

// 팝업 모듈
const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
	gameStart();
});
// 필드 모듈
const gameField = new Field(CARROT_SIZE, CARROT_COUNT, BUG_COUNT);
gameField.setClickListener(onItemClick);

let started = false; // 게임 시작 여부 판단할 변수
let score = 9; // 게임 스코어 저장하는 변수
let timer = undefined; // setInterval 저장할 변수 ( 종료하거나 성공시 함수 종료 위해)
let countDownSecond = undefined; // 제한시간

// 이미지 클릭 처리 ( 점수 카운트 감소 및 성공 여부 출력 )
function onItemClick( item ) {
	if (item === 'carrot') {
		score++;
		updateScoreBoard();
		if (score === CARROT_COUNT) {
			finishGame(true, '성공!');
		}
	} else if (item === 'bug') {
		finishGame(false, '벌레 클릭 실패!');
	}
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
			sound.playAlertSound();
		}

	}, 1000);
}

// gameField에 랜덤으로 이미지 추가
const initGame = () => {
	gameField.init();
};

// 게임 시작
function startGame() {
	sound.playMainSound();
	gameFinishBanner.popUpHide();
	timeAndScoreShow();
	initGame();
	CountDownTime();
}

// 게임 정지
function stopGame() {
	sound.playStopMainSound();
	gameField.removeImg();
	timeAndScoreHide();
	gameFinishBanner.gameStopMsg();
	clearInterval(timer);
}

// 게임 성공, 실패에 따른 함수 실행 및 메시지 전달
function finishGame( win, message ) {
	if (win) {
		sound.playWinSound();
		gameStart();
		gameFinishBanner.gameSuccessMsg(message);
		clearInterval(timer);
	} else {
		sound.playBugSound();
		gameStart();
		gameFinishBanner.GameFailMsg(message);
		clearInterval(timer);
	}
}


// 게임 시작버튼 이벤트리스너
gameBtn.addEventListener('click', gameStart);

