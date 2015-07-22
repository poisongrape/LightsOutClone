//************* PROJECT INFORMATION *************

/*************
 * Author: Christopher Dancarlo Danan
 * Created: July 14, 2015
 * Modified: July 17, 2015
 * Purpose: Game logic for Lights Out clone project.
*************/

//************* GLOBAL VARIABLES *************

//Levels.
var levelOne = [33, 34, 35, 43, 44, 45, 53, 54, 55],  //1 move to solve.
	levelTwo = [0, 1, 10, 11, 8, 9, 18, 19, 88, 89, 98, 99, 80, 81, 90, 91],  //4 moves to solve.
	levelThree = [31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 56, 57, 58],  //10  moves to solve.
	levelFour = [0, 1, 2, 7, 8, 9, 10, 13, 16, 19, 20, 23, 26, 29, 31, 32, 33, 36, 37, 38, 43, 46, 53, 56, 63, 66, 70, 71, 72, 77, 78, 79, 82, 87, 92, 97],  //10 moves to solve.
	currentLevel = 1;  //Default start at level 1.

//Sounds.
//var clickBeep = new Audio("assets/sounds/Beep_Click_Cell.m4a");  //Used whenever player clicks a cell.
var secret = new Audio("assets/sounds/Vane_Easter_Egg.m4a");  //Used for easter egg.

//Most recent move made by the player.
var lastClicked;

//Boolean to determine if sounds are muted or not.
var mute = false;

//************* FUNCTIONS *************

//References: 	http://stackoverflow.com/questions/6893080/html5-audio-play-sound-repeatedly-on-click-regardless-if-previous-iteration-h
//				https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Older_way_to_register_event_listeners
/*************
 * Purpose: Plays a beeping sound whenever a cell is clicked.
 			The function allows the sound to play while a previous iteration of the sound is still playing.
 			New audio elements are created and removed when the sound finishes (akin to Unity).
 * Input: None.
 * Output: Beeping sound is made.
*************/
var clickBeep = function(){
	var audio = document.createElement("audio");
	audio.src = "assets/sounds/Beep_Click_Cell.m4a";
	audio.addEventListener("ended", function(){
		document.removeChild(this);
	}, false);
	audio.play();
};

/*************
 * Purpose: Toggle the cell passed into the function "on" or "off".
 * Input:
 			-id: The id of the cell that is being toggled. Only integer numbers should be passed in.
 * Output: The cell's class will be switched to the opposite of it's previous state (i.e. class will read "on" or "off").
*************/
var toggle = function(id){
	$("#" + id).toggleClass("off");
	$("#" + id).toggleClass("on");
};

/*************
 * Purpose: Calculate the cells that are affected by a click and toggle them.
 * Input: 
 			-clickedID: the id of the cell that is clicked.
 * Output: The clicked cell and the surrounding cells are toggled on/off.
*************/
var toggleCells = function(clickedID){
	var leftID = clickedID - 1,
		rightID = clickedID + 1,
		topID = clickedID - local_data_cols,
		bottomID = clickedID + local_data_cols,
		topLeftID = topID - 1,
		topRightID = topID + 1,
		bottomLeftID = bottomID - 1,
		bottomRightID = bottomID + 1;

	//Toggle the clicked cell on/off.
	toggle(clickedID);

	//Toggle the surrounding cells on/off:
	//Left side
	//The if-statement prevents wrapped cells from being activated.
	if(leftID % local_data_cols !== (local_data_cols - 1) &&
		topLeftID % local_data_cols !== (local_data_cols - 1) &&
		bottomLeftID % local_data_cols !== (local_data_cols - 1)){
		toggle(leftID);
		toggle(topLeftID);
		toggle(bottomLeftID);
	}

	//Middle
	toggle(topID);
	toggle(bottomID);

	//Right side
	//The if-statement prevents wrapped cells from being activated.
	if(rightID % local_data_cols !== 0 &&
		topRightID % local_data_cols !== 0 &&
		bottomRightID % local_data_cols !== 0){
		toggle(rightID);
		toggle(topRightID);
		toggle(bottomRightID);
	}
};

/*************
 * Purpose: Check if the board is in a win state.
 * Input: None.
 * Output: Return true if the player won, else return false.
*************/
var win = function(){
	var cellsOn = $(".on");  //Array to hold all cells with class "on"; if array is empty, then all cells are off (i.e. player won the game).

	if(cellsOn.length === 0){
		return true;
	} else{
		return false;
	}
};

/*************
 * Purpose: Configure the game board based on the level.
 * Input:
 			-level: the level to be loaded, stored as an array with cellIDs that are to be turned on.
 * Output: The game board is configured.
*************/
var loadLevel = function(level){
	level.forEach(function(cellID){
		toggle(cellID);
	});
};

/*************
 * Purpose: Restart the current level. First, it turns off all cells. Then, it calls chooseLevel() to reload the current level.
 * Input: None.
 * Output: Calls chooseLevel() to reload the current level.
*************/
var restart = function(level){
	//Turn off all cells.
	for(var i = 0; i < local_data_numCells; i++){
		if($("#" + i).hasClass("on")){
			toggle(i);
		}
	}

	//Reload current level.
	chooseLevel();
};

/*************
 * Purpose: Choose which level to load based on current level number.
 * Input: None.
 * Output: The next level is chosen and loaded.
*************/
var chooseLevel = function(){
	//Load next level based on current level.
	switch(currentLevel){
		case 2:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 2");
			loadLevel(levelTwo);
			break;
		case 3:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 3");
			loadLevel(levelThree);
			break;
		case 4:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 4");
			loadLevel(levelFour);
			break;
		case 5:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 5");
			loadLevel(levelFive);
			break;
		default:
			$("#levelIndicator").empty();
			$("#levelIndicator").text("Level 1");
			loadLevel(levelOne);
			currentLevel = 1;
	}
};

//************* MAIN *************

var main = function(){
	"use strict";

	console.log("HEY VANE!!!");

	loadLevel(levelOne);  //Start on level 1.
	$("#levelIndicator").text("Level 1");

	//Player clicked a cell on the game board.
	$("#gameBoard td").on("click", function(cell){
		if(mute === false){
			clickBeep();
		}
		var clickedID = parseInt($(cell.target).attr("id"));  //Save id of clicked cell; used later to toggle other cells as on/off.
		lastClicked = clickedID;
		
		toggleCells(clickedID);

		if(win()){
			console.log("You won!");
			currentLevel++;
			chooseLevel();
		}
	});
	
	//Player clicked Restart Button.
	$("#restartButton").on("click", function(){
		console.log("Restart button clicked.");
		console.log("Restarting level " + currentLevel);
		//Can't simply use chooseLevel() function since it flips the cells' current status.
		//This means that cells won't go back to the original level configuration, so I must use a different technique or modify that function.
		restart();
	});

	//Player clicked Undo Button.
	$("#undoButton").on("click", function(){
		console.log("Clicked Undo button");
		toggleCells(lastClicked);
	});

	//Player clicked Mute Button.
	$("#muteButton").on("click", function(){
		console.log("Clicked Mute button");
		mute = !mute;
		console.log(mute);
	});

	//Easter egg!!!
	$("#shh").on("click", function(){
		secret.play();
	});
};

$(document).ready(main);

//t
//fflvd
//Thank you, God!