'use strict';
import PopUp from '/src/popup.js';
import Game from '/src/game.js';

const CARROT_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 20;
const GAME_COUNT = 15;


// 게임 모듈
const game = new Game(CARROT_SIZE,GAME_COUNT,CARROT_COUNT,BUG_COUNT)

// 팝업 모듈
const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
	game.gameStart();
});
