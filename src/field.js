'use strict';

import * as sound from './sound.js';

export const ItemType = Object.freeze({
	carrot: 'carrot',
	bug   : 'bug'
});

const Field = class Field {
	// 게임 구역
	constructor( carrotSize, carrotCount, bugCount ) {
		this.carrotSize = carrotSize;
		this.carrotCount = carrotCount;
		this.bugArray = []; // bug 움직이기 위해서 각각의 bug객체 저장할 배열
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
			this.onItemClick && this.onItemClick(ItemType.carrot);
		} else if (imgName === 'bug') {
			sound.playBugSound();
			this.onItemClick && this.onItemClick(ItemType.bug);
		}
	};

	// game field 이미지 삭제
	removeImg() {
		this.field.innerHTML = '';
	}

// gameField에 랜덤으로 이미지 추가
	init(carrotCount, bugCount) {
		this.removeImg();
		this.addItem(ItemType.carrot, carrotCount, 'img/carrot.png');
		this.addItem(ItemType.bug, bugCount, 'img/bug.png');
	};
// 각각의 이미지를 gameField에 위치시킬 x,y값 랜덤 구하는 함수
	randomNumber( minValue, maxValue ) {
		return Math.floor(Math.random() * ( maxValue - minValue ) + minValue);
	}
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
			const x = this.randomNumber(x1, x2);
			const y = this.randomNumber(y1, y2);

			item.style.left = `${x}px`;
			item.style.top = `${y}px`;
			this.field.appendChild(item);

			if(item.className === ItemType.bug) {
				this.bugArray.push(item);
			}
		}
	};
};



export default Field;