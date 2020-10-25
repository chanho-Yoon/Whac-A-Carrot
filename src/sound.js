'use strict';

// 게임 BGM
const gameMainSound = new Audio('./sound/bg.mp3');
const carrotClickSound = new Audio('./sound/carrot_pull.mp3');
const bugClickSound = new Audio('./sound/bug_pull.mp3');
const gameWinSound = new Audio('./sound/game_win.mp3');
const alertSound = new Audio('./sound/alert.wav');

export function playMainSound() {
	playSound(gameMainSound);
}

export function playCarrotSound() {
	playSound(carrotClickSound);
}

export function playBugSound() {
	playSound(bugClickSound);
}

export function playWinSound() {
	playSound(gameWinSound);
}

export function playAlertSound() {
	playSound(alertSound);
}

export function playStopMainSound() {
	stopSound(gameMainSound);
}

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
function stopSound( sound ) {
	sound.pause();
}