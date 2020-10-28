'use strict';

import PopUp from './popup.js';
import GameBuilder from './game.js';

const CARROT_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 20;
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

// 콜백으로 값을 받아 pop창에 나타낼 메시지 함수 호출
game.setGameStopListener(( message ) => {
	switch (message) {
		case 'win':
			gameFinishBanner.gamePopUpMessgae('성공👍🏻');
			break;
		case 'cancel':
			gameFinishBanner.gamePopUpMessgae('취소❌');
			break;
		case 'lose':
			gameFinishBanner.gamePopUpMessgae('실패😂');
			break;
		default :
			console.log('error');
			break;
	}
});
