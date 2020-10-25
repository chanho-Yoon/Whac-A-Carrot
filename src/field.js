'use strict';

import * as sound from './sound.js';

const Field = class Field {
	// 게임 구역
	constructor( carrotSize, carrotCount, bugCount ) {
		this.carrotSize = carrotSize;
		this.carrotCount = carrotCount;
		this.bugCount = bugCount;

		this.field = document.querySelector('.game__field');
		this.fieldRect = this.field.getBoundingClientRect();
		this.field.addEventListener('click', this.onClick);
	}

	setClickListener( onItemClick ) {
		this.onItemClick = onItemClick;
	};

	onClick = ( event ) => {
		let imgName = event.target.className;
		if (imgName === 'carrot') {
			event.target.remove();
			sound.playCarrotSound();
			this.onItemClick && this.onItemClick('carrot');
		} else if (imgName === 'bug') {
			sound.playBugSound();
			this.onItemClick && this.onItemClick('bug');
		}
	};

	// game field 이미지 삭제
	removeImg() {
		this.field.innerHTML = '';
	}

// gameField에 랜덤으로 이미지 추가
	init() {
		this.removeImg();
		this.addItem('carrot', this.carrotCount, 'img/carrot.png');
		this.addItem('bug', this.bugCount, 'img/bug.png');
	};

// carrot,bug 이미지를 count만큼 gameField에 배치
	addItem( className, count, imgPath ) {
		const x1 = 0;
		const y1 = 0;
		const x2 = this.fieldRect.width - this.carrotSize;
		const y2 = this.fieldRect.height - this.carrotSize;
		for (let i = 0; i < count; i++) {
			const item = document.createElement('img');
			item.setAttribute('class', className);
			item.setAttribute('src', imgPath);
			item.style.position = 'absolute';
			const x = randomNumber(x1, x2);
			const y = randomNumber(y1, y2);

			item.style.left = `${x}px`;
			item.style.top = `${y}px`;
			this.field.appendChild(item);
		}
	};
};

// 각각의 이미지를 gameField에 위치시킬 x,y값 랜덤 구하는 함수
function randomNumber( minValue, maxValue ) {
	return Math.floor(Math.random() * ( maxValue - minValue ) + minValue);
}


export default Field;