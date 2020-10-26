'use strict';

import Field from '/src/field.js';
import * as sound from '/src/sound.js';
import PopUp from '/src/popup.js';

const Game = class Game {
	constructor( carrotSize, gameCount, carrotCount, bugCount ) {
		this.carrotSize = carrotSize;
		this.gameCount = gameCount;
		this.carrotCount = carrotCount;
		this.bugCount = bugCount;

// 게임 버튼, 타이머, 스코어
		this.gameBtn = document.querySelector('.game__button');
		this.gameTimer = document.querySelector('.timer');
		this.gameScore = document.querySelector('.score');
		this.gameBtn.addEventListener('click', this.gameStart);

		this.started = false; // 게임 시작 여부 판단할 변수
		this.score = 9; // 게임 스코어 저장하는 변수
		this.timer = undefined; // setInterval 저장할 변수 ( 종료하거나 성공시 함수 종료 위해)
		this.countDownSecond = undefined; // 제한시간

		// 필드 모듈
		this.gameField = new Field(carrotSize, carrotCount, bugCount);
		this.gameField.setClickListener(this.onItemClick);
		// 팝업 모듈
		this.gameFinishBanner = new PopUp();
	}

	// gameField에 랜덤으로 이미지 추가
	initGame() {
		this.gameField.init();
	};

	// 게임 시작 여부에 따라 시작 및 정지
	gameStart = () => {
		if (this.started === true) {
			this.stopGame();
		} else {
			this.startGame();
		}
		this.started = !this.started;
	};

	// 게임 시작
	startGame() {
		sound.playMainSound();
		this.gameFinishBanner.popUpHide();
		this.timeAndScoreShow();
		this.initGame();
		this.CountDownTime();
	}

// 게임 정지
	stopGame() {
		sound.playStopMainSound();
		this.gameField.removeImg();
		this.timeAndScoreHide();
		this.gameFinishBanner.gameStopMsg();
		clearInterval(this.timer);
	}

	// 이미지 클릭 처리 ( 점수 카운트 감소 및 성공 여부 출력 )
	onItemClick = ( item ) => {
		if (item === 'carrot') {
			this.score++;
			this.updateScoreBoard();
			if (this.score === this.carrotCount) {
				this.finishGame(true, '성공!');
			}
		} else if (item === 'bug') {
			this.finishGame(false, '벌레 클릭 실패!');
		}
	};

	// 게임 성공, 실패에 따른 함수 실행 및 메시지 전달
	finishGame( win, message ) {
		if (win) {
			sound.playWinSound();
			this.gameStart();

			clearInterval(this.timer);
		} else {
			sound.playBugSound();
			this.gameStart();

			clearInterval(this.timer);
		}
	}

	// 게임 타임, 스코어 가리는 함수 및 스코어 초기화
	timeAndScoreHide() {
		this.gameTimer.classList.add('timer__hide');
		this.gameScore.classList.add('score__hide');
		this.gameBtn.innerHTML = `<i class="fas fa-play"></i>`;
	}

// 게임 타임, 스코어 보여주는 함수
	timeAndScoreShow() {
		this.gameTimer.innerHTML = `0:${this.gameCount}`;
		this.gameScore.innerHTML = `${this.carrotCount}`;
		this.gameTimer.classList.remove('timer__hide');
		this.gameScore.classList.remove('score__hide');
		this.gameBtn.innerHTML = `<i class="fas fa-times"></i>`;
	}

// 업데이트 스코어
	updateScoreBoard() {
		this.gameScore.innerText = this.carrotCount - this.score;
	}

// 시간제한 카운트 다운 시작
	CountDownTime() {
		this.score = 0;
		this.countDownSecond = this.gameCount;
		this.timer = setInterval(() => {
			this.gameTimer.innerHTML = `0:${this.countDownSecond}`;
			this.countDownSecond -= 1;
			// 게임 실패 ( 시간 초과 )
			if (this.countDownSecond < 0) {
				this.finishGame(false, '시간 초과!');
			}
			// 남은 시간 4초 이내 경고 사운드
			if (this.countDownSecond < 5) {
				sound.playAlertSound();
			}

		}, 1000);

	};
};
export default Game;