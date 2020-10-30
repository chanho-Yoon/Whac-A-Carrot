'use strict';

import PopUp from './popup.js';
import { GameBuilder, Reason } from './game.js';
import * as sound from './sound.js';

const CARROT_SIZE = 80;
export const CARROT_COUNT = 5;
export const BUG_COUNT = 5;
const GAME_COUNT = 15;

// 게임 모듈
const game = new GameBuilder()
	.WithCarrotSize(CARROT_SIZE)
	.WithGameCount(GAME_COUNT)
	.WithCarrotCount(CARROT_COUNT)
	.WithBugCount(BUG_COUNT)
	.build();

// 팝업 모듈
const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
	game.gameStart();
});

// 콜백으로 값을 받아 popUp창에 나타낼 메시지 함수 호출
game.setGameStopListener(( reason ) => {
	let message;
	switch (reason) {
		case Reason.win:
			message = '성공👍🏻';
			sound.playWinSound();
			game.levelUp(Reason.win); // 게임 이겼을 시 레벨업
			break;
		case Reason.cancel:
			message = '취소❌';
			sound.playAlertSound();
			game.levelUp(Reason.lose) // 게임 취소시 레벨 초기화
			break;
		case Reason.lose:
			message = '실패😂';
			sound.playBugSound();
			game.levelUp(Reason.lose) // 게임 실패시 레벨 초기화
			break;
		default :
			console.log('error');
			break;
	}
	gameFinishBanner.gamePopUpMessgae(message);
});
