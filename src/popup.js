'use strict';

const PopUp = class PopUp {
	constructor() {
		this.popUp = document.querySelector('.pop-up');
		this.popUpMessage = document.querySelector('.pop-up__message');
		this.popUpRefresh = document.querySelector('.pop-up__refresh');
		this.popUpRefresh.addEventListener('click', () => {
			this.onClick && this.onClick();
		});
	}
	setClickListener( onClick ) {
		this.onClick = onClick;
	}
	// pop-up창 숨기는 함수
	popUpHide() {
		this.popUp.classList.add('pop-up__hide');
	}
	// 게임 성공 pop-up창 띄우는 함수
	gameSuccessMsg( message ) {
		this.popUp.classList.remove('pop-up__hide');
		this.popUpMessage.innerText = message;
	}

// 게임 실패 pop-up창 띄우는 함수
	GameFailMsg( message ) {
		this.popUp.classList.remove('pop-up__hide');
		this.popUpMessage.innerText = message;
	}

// 게임 정지 pop-up창 띄우는 함수
	gameStopMsg() {
		this.popUp.classList.remove('pop-up__hide');
		this.popUpMessage.innerHTML = '다시하기!';
	}
};

export default PopUp;