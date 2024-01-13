let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
	x: boardWidth / 2 - playerWidth / 2,
	y: boardHeight - playerHeight - 5,
	width: playerWidth,
	height: playerHeight,
	velocityX: playerVelocityX,
};

let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3 * ballDirection();
let ballVelocityY = 2;

let ball = {
	x: boardWidth / 2,
	y: boardHeight / 2,
	width: ballWidth,
	height: ballHeight,
	velocityX: ballVelocityX,
	velocityY: ballVelocityY,
};

let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3;
let blockMaxRows = 10;
let blockCount = 0;

let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload = function () {
	board = document.getElementById("board");
	board.height = boardHeight;
	board.width = boardWidth;
	context = board.getContext("2d");

	context.fillStyle = "pink";
	context.fillRect(player.x, player.y, player.width, player.height);

	requestAnimationFrame(update);
	document.addEventListener("keydown", movePlayer);

	createBlock();
};

function update() {
	requestAnimationFrame(update);
	if (gameOver) {
		return;
	}
	context.clearRect(0, 0, board.width, board.height);

	context.fillStyle = "pink";
	context.fillRect(player.x, player.y, player.width, player.height);

	context.fillStyle = "whiteS";
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;
	context.fillRect(ball.x, ball.y, ball.width, ball.height);

	if (ball.y <= 0) {
		ball.velocityY *= -1;
	} else if (ball.x < 0 || ball.x + ball.width >= boardWidth) {
		ball.velocityX *= -1;
	} else if (ball.y + ball.height >= boardHeight) {
		context.font = "20px sans-serif";
		context.fillText("Koniec gry! Naciśnij spacje by zacząć od nowa!", 40, 400);
		gameOver = true;
	}

	if (topCollision(ball, player)) {
		ball.velocityY *= -1;
	} else if (leftCollision(ball, player) || rightCollision(ball, player)) {
		ball.velocityX *= -1;
	}

	for (let i = 0; i < blockArray.length; i++) {
		let block = blockArray[i];
		if (!block.break) {
			if (topCollision(ball, block) || bottomCollision(ball, block)) {
				block.break = true;
				ball.velocityY *= -1;
				blockCount -= 1;
				score += 100;
			} else if (leftCollision(ball, block) || rightCollision(ball, block)) {
				block.break = true;
				block.velocityX *= -1;
				blockCount -= 1;
				score += 100;
			}
			context.fillStyle = "skyblue";
			context.fillRect(block.x, block.y, block.width, block.height);
		}
	}

	if (blockCount == 0) {
		//nastepny level
		score += 1000;
		blockRows = Math.min(blockRows + 1, blockMaxRows);
		createBlock();
	}

	context.font = "20px sans-serif";
	context.fillText(score, 10, 25);
}

function outOfBounds(xPosition) {
	return xPosition < 0 || xPosition + playerWidth > boardWidth;
}

function movePlayer(key) {
	if (key.code == "Space") {
		restartGame();
	}
	if (key.code == "ArrowLeft") {
		let nextPlayerX = player.x - player.velocityX;
		if (!outOfBounds(nextPlayerX)) {
			player.x = nextPlayerX;
		}
	} else if (key.code == "ArrowRight") {
		let nextPlayerX = player.x + player.velocityX;
		if (!outOfBounds(nextPlayerX)) {
			player.x = nextPlayerX;
		}
	}
}

function detectCollision(elementOne, elementTwo) {
	return (
		elementOne.x < elementTwo.x + elementTwo.width && //lewy górny róg 1 nie sięga prawego górnego rogu 2
		elementOne.x + elementOne.width > elementTwo.x && //prawy górny róg 1 sięga lewego górnego rogu 2
		elementOne.y < elementTwo.y + elementTwo.height && //lewy dolny rog 1 nie sięga lewego dolnego rogu 2
		elementOne.y + elementOne.height > elementTwo.y //prawy dolny róg 1 sięga lewego dolnego rogu 2
	);
}

function topCollision(ball, block) {
	//1 jest nad 2 (piłka nad blokiem)
	return detectCollision(ball, block) && ball.y + ball.height >= block.y;
}

function bottomCollision(ball, block) {
	//1 jest pod 2 (pilka jest pod blockiem)
	return detectCollision(ball, block) && block.y + block.height >= ball.y;
}

function leftCollision(ball, block) {
	//1 jest po lewej stronie 2 (pilka po lewej stronie bloku)
	return detectCollision(ball, block) && ball.x + ball.width >= block.x;
}

function rightCollision(ball, block) {
	//1 jest po prawej stronie 2 (pilka po prawiej stronie bloku)
	return detectCollision(ball, block) && block.x + block.width >= ball.x;
}

function createBlock() {
	blockArray = [];
	for (let col = 0; col < blockColumns; col++) {
		for (let row = 0; row < blockRows; row++) {
			let block = {
				x: blockX + col * blockWidth + col * 10,
				y: blockY + row * blockHeight + row * 10,
				width: blockWidth,
				height: blockHeight,
				break: false,
			};
			blockArray.push(block);
		}
	}
	blockCount = blockArray.length;
}

function restartGame() {
	gameOver = false;
	player = {
		x: boardWidth / 2 - playerWidth / 2,
		y: boardHeight - playerHeight - 5,
		width: playerWidth,
		height: playerHeight,
		velocityX: playerVelocityX,
	};
	ball = {
		x: boardWidth / 2,
		y: boardHeight / 2,
		width: ballWidth,
		height: ballHeight,
		velocityX: 3 * ballDirection(),
		velocityY: ballVelocityY,
	};
	blockArray = [];
	score = 0;
	blockRows = 3;
	createBlock();
}

function ballDirection() {
	let directionNumber = Math.floor(Math.random() * 2);
	if (directionNumber) {
		console.log("1");
		return 1;
	} else {
		console.log("-1");
		return -1;
	}
}
