'use strict';

import Field, { ItemType } from './field.js';
import * as sound from './sound.js';
import PopUp from './popup.js';
import { BUG_COUNT, CARROT_COUNT } from './main.js';


export const Reason = Object.freeze({
	win   : 'win',
	lose  : 'lose',
	cancel: 'cancel'
});

// Builder Pattern
export const GameBuilder = class GameBuilder {
	WithCarrotSize( num ) {
		this.carrotSize = num;
		return this;
	}

	WithGameCount( count ) {
		this.gameCount = count;
		return this;
	}

	WithCarrotCount( num ) {
		this.carrotCount = num;
		return this;
	}

	WithBugCount( num ) {
		this.bugCount = num;
		return this;
	}

	build() {
		return new Game(
			this.carrotSize,
			this.gameCount,
			this.carrotCount,
			this.bugCount
		);
	}
};

class Game {
	constructor( carrotSize, gameCount, carrotCount, bugCount ) {
		this.carrotSize = carrotSize;
		this.gameCount = gameCount;
		this.carrotCount = carrotCount;
		this.bugCount = bugCount;
		this.level = 1;
		// 레벨 표시
		this.gameLevel = document.querySelector('.game__level');
		// 게임 버튼, 타이머, 스코어
		this.gameBtn = document.querySelector('.game__button');
		this.gameTimer = document.querySelector('.timer');
		this.gameScore = document.querySelector('.score');
		this.gameBtn.addEventListener('click', this.gameStart);

		this.started = false; // 게임 시작 여부 판단할 변수
		this.score = 9; // 게임 스코어 저장하는 변수
		this.timer = undefined; // setInterval 저장할 변수 ( 종료하거나 성공시 함수 종료 위해)
		this.countDownSecond = undefined; // 제한시간
		// 움직이는 벌레 타이머
		this.bugTimer = undefined;
		// 필드 모듈
		this.gameField = new Field(carrotSize, carrotCount, bugCount);
		this.gameField.setClickListener(this.onItemClick);
		// 팝업 모듈
		this.gameFinishBanner = new PopUp();
	}

	// 콜백으로 전달할 함수
	setGameStopListener( onGameStop ) {
		this.onGameStop = onGameStop;
	}

	// gameField에 랜덤으로 이미지 추가
	initGame() {
		this.gameField.init(this.carrotCount, this.bugCount);
	};

	// 게임 시작 여부에 따라 시작 및 정지
	gameStart = () => {
		if (this.started === true) {
			this.stopGame(Reason.cancel);
		} else {
			this.startGame();
		}
		this.started = !this.started;
	};

	// 이미지 클릭 처리 ( 점수 카운트 감소 및 성공 여부 출력 )
	onItemClick = ( item ) => {
		if (item === ItemType.carrot) {
			this.score++;
			this.updateScoreBoard();
			if (this.score === this.carrotCount) {
				this.stopGame(Reason.win);
				this.started = false;
			}
		} else if (item === ItemType.bug) {
			this.stopGame(Reason.lose);
			this.started = false;
		}
	};

	// 게임 난이도 설정 및 화면에 출력
	levelUp( reason ) {
		switch (reason) {
			case Reason.win:
				// 게임 이겼을 시에 level +1
				this.level++;
				this.gameLevel.innerText = `level : ${this.level}`;
				// 난이도를 위해 carrot,bug count +1
				this.carrotCount++;
				this.bugCount++;
				break;
			case Reason.lose:
				this.level = 1;
				this.gameLevel.innerText = `level : ${this.level}`;
				this.carrotCount = CARROT_COUNT;
				this.bugCount = BUG_COUNT;
				break;
		}
	}

	// 게임 시작
	startGame() {
		sound.playMainSound();
		this.gameFinishBanner.popUpHide();
		this.initGame();
		this.timeAndScoreShow();
		this.countDownTime();
		this.setIntervalAndExecute(this.randomMoveBug, 2);
	}

	// 게임 정지
	stopGame( reason ) {
		sound.playStopMainSound();
		this.gameField.removeImg();
		this.timeAndScoreHide();
		this.onGameStop && this.onGameStop(reason);
		this.gameField.bugArray = [];
		clearInterval(this.timer);
		clearInterval(this.bugTimer);
	}

	// 게임 타임, 스코어 가리는 함수 및 스코어 초기화
	timeAndScoreHide() {
		this.gameTimer.classList.add('timer__hide');
		this.gameScore.classList.add('score__hide');
		this.gameBtn.classList.add('game__button-hide');
		this.gameBtn.innerHTML = `<i class="fas fa-play"></i>`;
	}

	// 게임 타임, 스코어 보여주는 함수
	timeAndScoreShow() {
		this.gameTimer.innerHTML = `0:${this.gameCount}`;
		this.gameScore.innerHTML = `${this.carrotCount}`;
		this.gameBtn.classList.remove('game__button-hide');
		this.gameTimer.classList.remove('timer__hide');
		this.gameScore.classList.remove('score__hide');
		this.gameBtn.innerHTML = `<i class="fas fa-times"></i>`;
	}

	// 업데이트 스코어
	updateScoreBoard() {
		this.gameScore.innerText = this.carrotCount - this.score;
	}

	// 랜덤한 위치로 움직이는 벌레
	moveBug() {
		const x1 = 0;
		const y1 = 0;
		const x2 = this.gameField.fieldRect.width - this.carrotSize;
		const y2 = this.gameField.fieldRect.height - this.carrotSize;

		for (let i = 0; i < this.gameField.bugArray.length; i++) {
			let x = this.gameField.randomNumber(x1, x2);
			const y = this.gameField.randomNumber(y1, y2);
			this.gameField.bugArray[i].style.left = `${x}px`;
			this.gameField.bugArray[i].style.top = `${y}px`;
		}
	}

	// 시간제한 카운트 다운 시작
	countDownTime() {
		this.score = 0;
		this.countDownSecond = this.gameCount;
		this.timer = setInterval(() => {
			this.gameTimer.innerHTML = `0:${this.countDownSecond}`;
			this.countDownSecond -= 1;
			// 게임 실패 ( 시간 초과 )
			if (this.countDownSecond < 0) {
				this.stopGame(Reason.lose);
				this.started = false;
			}
			// 남은 시간 4초 이내 경고 사운드
			if (this.countDownSecond < 5) {
				sound.playAlertSound();
			}
		}, 1000);
	};

	// setIntervalAndExecute 함수의 파라미터로 전달될 callback 함수
	randomMoveBug = () => {
		this.moveBug();
	};

	setIntervalAndExecute( callback, second ) {
		setTimeout(callback, 100);
		this.bugTimer = setInterval(callback, second * 1000);
		return this.bugTimer;
	}
}

