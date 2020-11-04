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
	// 게임 성공 및 실패, 취소 여부 팝업창 메시지로 띄울 함수
	gamePopUpMessage( message ) {
		this.popUp.classList.remove('pop-up__hide');
		this.popUpMessage.innerText = message;
	}
};

export default PopUp;