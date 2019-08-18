var SCREEN_OFFSET = 20;
var SCREEN_WIDTH  = 500;
var SCREEN_HEIGHT = 1000;
var SQUARE_WIDTH  = SCREEN_WIDTH/10;
var SQUARE_HEIGHT = SCREEN_HEIGHT/20;
var SIDE_PANEL_PREVIEW_SIZE_X = 300;
var SIDE_PANEL_PREVIEW_SIZE_Y = 200;
var PREVIEW_POSITION_X = SCREEN_WIDTH + SQUARE_WIDTH * 3;
var PREVIEW_POSITION_Y = SQUARE_HEIGHT * 3; 

var iOffsets = [[-1,0],[0,0],[1,0],[2,0]];
var iOffsets2 = [[0,-1],[0,0],[0,1],[0,2]];
var iOffsets3 = [[-2,0],[-1,0],[0,0],[1,0]];
var iOffsets4 = [[0,-2],[0,-1],[0,0],[0,1]];
var iOffsetsRotations = [iOffsets, iOffsets2, iOffsets3, iOffsets4];

var jOffsets = [[-1,-1],[-1,0],[0,0],[1,0]];
var jOffsets2 = [[0,1],[0,0],[0,-1],[1,-1]];
var jOffsets3 = [[-1,0],[0,0],[1,0],[1,1]];
var jOffsets4 = [[-1,1],[0,1],[0,0],[0,-1]];
var jOffsetsRotations = [jOffsets, jOffsets2, jOffsets3, jOffsets4];

var lOffsets = [[-1,0],[0,0],[1,0],[1,-1]];
var lOffsets2 = [[0,-1],[0,0],[0,1],[1,1]];
var lOffsets3 = [[-1,1],[-1,0],[0,0],[1,0]];
var lOffsets4 = [[-1,-1],[0,-1],[0,0],[0,1]];
var lOffsetsRotations = [lOffsets, lOffsets2, lOffsets3, lOffsets4];

var oOffsets = [[0,-1],[0,0],[1,-1],[1,0]];
var oOffsetsRotations = [oOffsets, oOffsets, oOffsets, oOffsets];

var sOffsets = [[-1,0],[0,0],[0,-1],[1,-1]];
var sOffsets2 = [[0,-1],[0,0],[1,0],[1,1]];
var sOffsets3 = [[-1,1],[0,1],[0,0],[1,0]];
var sOffsets4 = [[-1,-1],[-1,0],[0,0],[0,1]];
var sOffsetsRotations = [sOffsets, sOffsets2, sOffsets3, sOffsets4];

var tOffsets = [[-1,0],[0,0],[0,-1],[1,0]];
var tOffsets2 = [[0,-1],[0,0],[0,1],[1,0]];
var tOffsets3 = [[-1,0],[0,0],[0,1],[1,0]];
var tOffsets4 = [[-1,0],[0,0],[0,-1],[0,1]];
var tOffsetsRotations = [tOffsets, tOffsets2, tOffsets3, tOffsets4];

var zOffsets = [[-1,-1],[0,-1],[0,0],[1,0]];
var zOffsets2 = [[0,1],[1,-1],[0,0],[1,0]];
var zOffsets3 = [[-1,0],[0,1],[0,0],[1,1]];
var zOffsets4 = [[-1,1],[0,-1],[0,0],[-1,0]];
var zOffsetsRotations = [zOffsets, zOffsets2, zOffsets3, zOffsets4];

var shapesList = [[iOffsetsRotations, "cyan"], [jOffsetsRotations, "blue"], [lOffsetsRotations, "orange"], [oOffsetsRotations, "yellow"], [sOffsetsRotations, "green"], [tOffsetsRotations, "purple"], [zOffsetsRotations, "red"]]


var c = document.getElementById("tetrisCanvas");
var ctx = c.getContext("2d");
var blocks = new Array(10);

var yVal;
var xVal;
var rand;
var randNext;
var currentOffsets;
var nextOffsets;
var rotation;
var currentFillStyle;
var nextFillStyle;
var zPressed;
var xPressed;
var rotatePressed;
var score;
var levelLoopSpeed;
var currentLoopSpeed;
var level;
var totalRowClears; 

newGame();
nextBlock();
setTimeout(mainLoop, currentLoopSpeed);

function nextBlock(){
	xVal = 4;
	yVal = -1;

	if (typeof randNext !== 'undefined'){
		rand = randNext;
	}else{
		rand = Math.floor(Math.random() * shapesList.length);
	}
	randNext = Math.floor(Math.random() * shapesList.length);
	
	currentOffsets   = shapesList[rand][0][0];
	nextOffsets = shapesList[randNext][0][0];
	
	rotation = 0;
	
	currentFillStyle = shapesList[rand][1];
	nextFillStyle = shapesList[randNext][1];
	
	zPressed = false;
	xPressed = false;
	
	drawPreview();
}

function drawSquare(x, y, color){
	if (y < 0){
		return;
	}
	
	ctx.beginPath();
	ctx.fillStyle = "Black";
	ctx.rect(SQUARE_WIDTH*x + SCREEN_OFFSET, SQUARE_HEIGHT*y + SCREEN_OFFSET, SQUARE_WIDTH, SQUARE_HEIGHT);
	if (!color){
		ctx.fillStyle = currentFillStyle;
	}else{
		ctx.fillStyle = color;
	}
	ctx.fillRect(SQUARE_WIDTH*x + SCREEN_OFFSET + 2, SQUARE_HEIGHT*y + SCREEN_OFFSET + 2, SQUARE_WIDTH - 4, SQUARE_HEIGHT - 4);
	ctx.stroke();
	ctx.closePath();
}

function clearSquare(x, y){
	if (y < 0){
		return;
	}
	
	var leftXInc = -1;
	var rightXInc = 2;
	var upYInc = -1;
	var downYInc = 2;
	
	if (x - 1 >= 0 && x - 1 < blocks.length && blocks[x-1][y]){
		leftXInc += 2;
		rightXInc -= 2;
	}
	
	if (x + 1 < blocks.length && blocks[x+1][y]){
		rightXInc -= 2;
	}
	
	if (y - 1 >= 0 && x < blocks.length && blocks[x][y-1]){
		upYInc += 2;
		downYInc -= 2;
	}
	
	if (y + 1 < blocks[0].length && x < blocks.length && blocks[x][y+1]){
		downYInc -= 2;
	}
	
	ctx.clearRect(SQUARE_WIDTH*x + SCREEN_OFFSET + leftXInc, SQUARE_HEIGHT*y + SCREEN_OFFSET + upYInc, SQUARE_WIDTH + rightXInc, SQUARE_HEIGHT + downYInc);
}

function clearBlocks(){
	for (var i = 0; i < blocks.length; i++){
		blocks[i] = new Array(20);
		for (var j = 0; j < blocks[i].length; j++){
			blocks[i][j] = "";
		}
	}
	ctx.clearRect(SCREEN_OFFSET, SCREEN_OFFSET, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function drawTetromino(){
	var xVals = [xVal + currentOffsets[0][0], xVal + currentOffsets[1][0], xVal + currentOffsets[2][0], xVal + currentOffsets[3][0]];
	var yVals = [yVal + currentOffsets[0][1], yVal + currentOffsets[1][1], yVal + currentOffsets[2][1], yVal + currentOffsets[3][1]];
	
	for (var i = 0; i < xVals.length; i++){
		blocks[xVals[i]][yVals[i]] = currentFillStyle;
		drawSquare(xVals[i], yVals[i]);
	}
}

function drawPreview(){
	
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			clearSquare(PREVIEW_POSITION_X / SQUARE_WIDTH + currentOffsets[i][0] - 1, PREVIEW_POSITION_Y / SQUARE_HEIGHT + currentOffsets[j][1] - 1);
		}
	}
	
	
	var xVals = [PREVIEW_POSITION_X / SQUARE_WIDTH  + nextOffsets[0][0] - 1, 
				 PREVIEW_POSITION_X / SQUARE_WIDTH  + nextOffsets[1][0] - 1, 
				 PREVIEW_POSITION_X / SQUARE_WIDTH  + nextOffsets[2][0] - 1, 
				 PREVIEW_POSITION_X / SQUARE_WIDTH  + nextOffsets[3][0] - 1];
	var yVals = [PREVIEW_POSITION_Y / SQUARE_HEIGHT + nextOffsets[0][1] - 1,
				 PREVIEW_POSITION_Y / SQUARE_HEIGHT + nextOffsets[1][1] - 1, 
				 PREVIEW_POSITION_Y / SQUARE_HEIGHT + nextOffsets[2][1] - 1, 
				 PREVIEW_POSITION_Y / SQUARE_HEIGHT + nextOffsets[3][1] - 1];
	
	for (var i = 0; i < xVals.length; i++){
		drawSquare(xVals[i], yVals[i], nextFillStyle);
	}
}

function canMoveTetrominoDown(){
	var xVals = [xVal + currentOffsets[0][0], xVal + currentOffsets[1][0], xVal + currentOffsets[2][0], xVal + currentOffsets[3][0]];
	var yVals = [yVal + currentOffsets[0][1] + 1, yVal + currentOffsets[1][1] + 1, yVal + currentOffsets[2][1] + 1, yVal + currentOffsets[3][1] + 1];
	
	for (var i = 0; i < xVals.length; i++){
		if (yVals[i] >= blocks[0].length || blocks[xVals[i]][yVals[i]]){
			return false;
		}
	}
	
	return true;
}

function canMoveTetrominoHorizontally(dir){
	var xVals = [xVal + currentOffsets[0][0] + dir, xVal + currentOffsets[1][0] + dir, xVal + currentOffsets[2][0] + dir, xVal + currentOffsets[3][0] + dir];
	var yVals = [yVal + currentOffsets[0][1], yVal + currentOffsets[1][1], yVal + currentOffsets[2][1], yVal + currentOffsets[3][1]];
	
	for (var i = 0; i < xVals.length; i++){
		if (xVals[i] < 0 || xVals[i] >= blocks.length || blocks[xVals[i]][yVals[i]]){
			return false;
		}
	}
	
	return true;
}

function canRotate(dir){
	var rotate = true;
	
	if (dir == 1){
		var points = shapesList[rand][0][(rotation + 1) % 4]
	}else{
		var points = shapesList[rand][0][(((rotation - 1) % 4) + 4) % 4]
	}
	
	for (var i = 0; i < points.length; i++){
			var coordX = xVal + points[i][0];
			var coordY = yVal + points[i][1];
			
			if (coordX < 0 || coordX >= blocks.length || coordY >= blocks[0].length || blocks[coordX][coordY]){
				rotate = false;
				break;
			}
		}
	
	return rotate;
}


function clearTetromino(){
	var xVals = [xVal + currentOffsets[0][0], xVal + currentOffsets[1][0], xVal + currentOffsets[2][0], xVal + currentOffsets[3][0]];
	var yVals = [yVal + currentOffsets[0][1], yVal + currentOffsets[1][1], yVal + currentOffsets[2][1], yVal + currentOffsets[3][1]];
	
	for (var i = 0; i < xVals.length; i++){
		blocks[xVals[i]][yVals[i]] = "";
		clearSquare(xVals[i], yVals[i]);
	}
	
}

function drawBorder(){
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "black";
	ctx.rect(SCREEN_OFFSET, SCREEN_OFFSET, SCREEN_WIDTH, SCREEN_HEIGHT);
	ctx.rect(SCREEN_WIDTH + 20, SCREEN_OFFSET, SIDE_PANEL_PREVIEW_SIZE_X, SIDE_PANEL_PREVIEW_SIZE_Y);
	ctx.rect(SCREEN_WIDTH + 20, SCREEN_OFFSET + SIDE_PANEL_PREVIEW_SIZE_Y, SIDE_PANEL_PREVIEW_SIZE_X, SCREEN_HEIGHT - SIDE_PANEL_PREVIEW_SIZE_Y);
	ctx.stroke();
	ctx.closePath();
}

function drawStats(){
	ctx.font = "20px Georgia";
	ctx.fillStyle = "black";
	ctx.clearRect(SCREEN_WIDTH + 21, SCREEN_OFFSET + SIDE_PANEL_PREVIEW_SIZE_Y + 1, SIDE_PANEL_PREVIEW_SIZE_X - 2, SIDE_PANEL_PREVIEW_SIZE_Y - 2);
	ctx.fillText("Score: " + score, SCREEN_WIDTH + 30, SCREEN_OFFSET + SIDE_PANEL_PREVIEW_SIZE_Y + 22);
	ctx.fillText("Level: " + level, SCREEN_WIDTH + 30, SCREEN_OFFSET + SIDE_PANEL_PREVIEW_SIZE_Y + 42);
}

function newGame(){
	rotatePressed = false;
	levelLoopSpeed = 500;
	currentLoopSpeed = levelLoopSpeed;
	score = 0;
	level = 1;
	totalRowClears = 0;
	
	drawStats();
	clearBlocks();
}

function mainLoop(){
	clearTetromino();
	drawBorder();
	
	if (canMoveTetrominoDown()){
		yVal++;
		
		drawTetromino();
	}else{
		drawTetromino();
		
		var fullRowCount = 0;
		for (var y = 0; y < blocks[0].length; y++){
			var fullRow = true;
			for (var x = 0; x < blocks.length; x++){
				if (!blocks[x][y]){
					fullRow = false;
				}
			}
			if (fullRow){
				for (var x = 0; x < blocks.length; x++){
					blocks[x][y] = "";
					clearSquare(x, y);
					
					for (var y2 = y; y2 >= 1; y2--){
						if (blocks[x][y2-1]){
							blocks[x][y2] = blocks[x][y2-1];
							drawSquare(x, y2, blocks[x][y2-1]);
							
							blocks[x][y2-1] = "";
							clearSquare(x, y2-1);
						}
					}
				}
				fullRowCount++;
			}
		}
		
		var temp = totalRowClears;
		totalRowClears += fullRowCount;
		
		if (Math.floor(totalRowClears / 10) * 10 != Math.floor(temp / 10) * 10){
			level++;
			levelLoopSpeed -= 25;
		}
		
		if (fullRowCount == 1){
			score += level * 40;
		}else if (fullRowCount == 2){
			score += level * 100;
		}else if (fullRowCount == 3){
			score += level * 300;
		}else if (fullRowCount == 4){
			score += level * 1200;
		}
		
		drawBorder();
		drawStats();
		
		for (var i = 0; i < blocks.length; i++){
			if (blocks[i][0]){
				alert("Game Over");
				newGame();
				break;
			}
		}
		
		nextBlock();
	}
	
	rotatePressed = false;
	if (!xPressed){
		currentLoopSpeed = levelLoopSpeed;
	}
	setTimeout(mainLoop, currentLoopSpeed);
}

document.addEventListener('keydown', function(event) {
	if (!zPressed && yVal > 0){
		clearTetromino();
		drawBorder();
		if(event.keyCode == 37 && canMoveTetrominoHorizontally(-1)) {
			xVal--;
		}
		else if(event.keyCode == 39 && canMoveTetrominoHorizontally(1)) {
			xVal++;
		}
		
		if(event.keyCode == 38 && canRotate(1) && !rotatePressed) {
			rotation = (rotation + 1) % 4;
			currentOffsets = shapesList[rand][0][rotation]
			rotatePressed = true;
		}
		else if(event.keyCode == 40 && canRotate(-1) && !rotatePressed) {
			rotation = (((rotation - 1) % 4) + 4) % 4;
			currentOffsets = shapesList[rand][0][rotation]
			rotatePressed = true;
		}
		
		if(event.keyCode == 90) {
			while (canMoveTetrominoDown()){
				yVal++;
			}
			zPressed = true;
		}
		else if(event.keyCode == 88) {
			if (currentLoopSpeed >= 25){
				currentLoopSpeed = 25;
			}
			xPressed = true;
		}
		drawTetromino();
	}
});

document.addEventListener('keyup', function(event) {
	if(event.keyCode == 88) {
		xPressed = false;
	}
});

