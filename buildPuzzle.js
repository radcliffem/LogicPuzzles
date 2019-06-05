var allSolutions=[];
var solution = [];
var usedCategories=[];
var width;
var height;

document.getElementById("submit").onclick=function(){
	width=parseInt(document.getElementById("width").value)+1;
	height=parseInt(document.getElementById("height").value);
	if(width>5||height>4){
		alert("Sorry, you cannot have more than 4 categories or more than 4 people.");
	}else{
		pickCategories();
		makePuzzle();
		turnOff(document.getElementsByName("setup"));
	}	
}

function pickCategories(){
	usedCategories.push(names);
	names.values[0]=permute(names.values[0]);
	while(names.values[0].length>height){
		names.values[0].pop();
	}
	
	usedCategories.push(day);
	while(day.values[0].length>height){
		day.values[0].pop();
		day.standard[0].pop();
	}
	
	var keys=Object.keys(options);
	keys = permute(keys);
	for(var i=0;i<width-2;i++){
		usedCategories.push(options[keys[i]]);
		options[keys[i]].values[0]=permute(options[keys[i]].values[0]);
		while(options[keys[i]].values[0].length>height){
			options[keys[i]].values[0].pop();
		}
	}
}

function generateClue(){	
	var pickType=getRandInt(0,4);
	if(pickType==0){
		return generateDirectClue()
	}else if(pickType==1){
		return generateAntiClue();
	}else if(pickType==2){
		return generateBeforeClue();
	}else if(pickType==3){
		return generateXorClue();
	}
}

function generateDirectClue(){
	var j=getRandInt(0,height);
	var i=getRandInt(0,width-1);
	var k=getRandInt(i+1,width);
	
	var newClue={};
	newClue.type='direct';
	newClue.firstProperty={category:usedCategories[i].name,value:solution[j][i]};
	newClue.secondProperty={category:usedCategories[k].name,value:solution[j][k]};
	return newClue;
}

function generateAntiClue(){
	var j=getRandInt(0,height-1);
	var i=getRandInt(j+1,height);
	var k=getRandInt(0,width-1);
	var l=getRandInt(k+1,width);
	var newClue={};
	newClue.type='anti';
	newClue.firstProperty={category:usedCategories[k].name,value:solution[j][k]};
	newClue.secondProperty={category:usedCategories[l].name,value:solution[i][l]};
	return newClue;
}
	
function generateXorClue(){
	var newClue={};
	newClue.type='xor';
	newClue.directPart=generateDirectClue();
	newClue.antiPart=generateAntiClue();
	return newClue;
}
	
function generateBeforeClue(){
	var j=getRandInt(0,height-1);
	var i=getRandInt(j+1,height);
	var k=1;
	while(k==1){
		k=getRandInt(0,width);
	}
	
	var newClue={};
	newClue.type='before';
	if(lookUpIndex(solution[j][1],day.table)<lookUpIndex(solution[i][1], day.table)){
		newClue.firstProperty={category:usedCategories[k].name,value:solution[j][k]};
		newClue.secondProperty={category:usedCategories[k].name,value:solution[i][k]};
	}else{
		newClue.firstProperty={category:usedCategories[k].name,value:solution[i][k]};
		newClue.secondProperty={category:usedCategories[k].name,value:solution[j][k]};
	}
	return newClue;
}
	


function makePuzzle(){
	
	allSolutions=generatePossible(usedCategories[0].values,usedCategories[1].values);
	for(var i=2;i<width;i++){
		allSolutions = generatePossible(allSolutions,usedCategories[i].values);
	}
	solution=allSolutions[getRandInt(0,allSolutions.length-1)];
	makeGrid();
		
	var possibleSolutions=Array.from(allSolutions);
		
	var keepClues = [];
	var newPossible = [];
	var xorcount=1
	var solved=false;
	
	while(solved==false){
		newPossible = [];
		var newClue = generateClue();
		
		if(xorcount<5||newClue.type!='xor'){
			newPossible = processClue(newClue, possibleSolutions);
		}else{
			newPossible=possibleSolutions;
		}
		
		if(newPossible.length<possibleSolutions.length){
			keepClues.push(newClue);
			if(newClue.type=='xor'){xorcount+=1;}
			possibleSolutions = newPossible;
		}
		if(possibleSolutions.length==1){
			solved=true;
		}
	}

	keepClues = reduceClues(keepClues);
	
	for(var i=0;i<keepClues.length;i++){
		addClue(keepClues[i]);
	}
	
}
		

function reduceClues(clues){
	var reducible = true;
	var possibleSolutions = [];
	var test=[];
	var necessary=0;
	
	while(reducible){
		for(var i=necessary;i<clues.length-1;i++){
			test = Array.from(clues);
			possibleSolutions=Array.from(allSolutions);
			test.splice(i,1);
			for(var j=0;j<test.length;j++){
				possibleSolutions = processClue(test[j],possibleSolutions);
			}
			if(possibleSolutions.length==1){
				i=clues.length;
				clues = Array.from(test);
			}else{
				necessary=i+1;
				allSolutions = processClue(clues[i],allSolutions);
			}
			if(i==clues.length-2){
				reducible = false;
			}
		}
	}
	return clues;
}




function processClue(clue,solutionSet){

	if(clue.type=='anti'){
		return checkAnti(clue,solutionSet);
	}else if(clue.type=='direct'){
		return checkDirect(clue,solutionSet);
	}else if(clue.type=='xor'){
		return checkXor(clue,solutionSet);
	}else if(clue.type=='before'){
		return checkBefore(clue,solutionSet);
	}
}

function checkBefore(clue,solutionSet){
	var first=0;
	var second=0;
	var ind=lookUpIndex(clue.firstProperty.category,usedCategories);
	var usable=[];
	for(var i=0;i<solutionSet.length;i++){
		for(var j=0;j<solutionSet[i].length;j++){
			if(solutionSet[i][j][ind]==clue.firstProperty.value){
				first = j;
			}else if(solutionSet[i][j][ind]==clue.secondProperty.value){
				second=j;
			}
		}
		if(lookUpIndex(solutionSet[i][first][1],day.table)<lookUpIndex(solutionSet[i][second][1],day.table)){
			usable.push(solutionSet[i]);
		}
	}
	return usable;
}


function checkXor(clue, solutionSet){
	var usableFirst = checkDirect(clue.directPart, solutionSet);
	usableFirst = checkAnti(clue.antiPart, usableFirst);
	
	var usableSecond=checkDirect(clue.antiPart,solutionSet);
	usableSecond=checkAnti(clue.directPart,usableSecond);
	
	return usableFirst.concat(usableSecond);
}



function checkDirect(clue, solutionSet){
	firstInd = lookUpIndex(clue.firstProperty.category,usedCategories);
	secondInd=lookUpIndex(clue.secondProperty.category,usedCategories);
	var usable =[];
	
	for(var i=0;i<solutionSet.length;i++){
		for(var j=0;j<solutionSet[i].length;j++){
			if(solutionSet[i][j][firstInd]==clue.firstProperty.value){
				if(solutionSet[i][j][secondInd]==clue.secondProperty.value){
					usable.push(solutionSet[i]);
					j=solutionSet[i].length;
				}
			}
		}	
	}
	return usable;
}


function checkAnti(clue,solutionSet){
	firstInd = lookUpIndex(clue.firstProperty.category,usedCategories);
	secondInd=lookUpIndex(clue.secondProperty.category,usedCategories);
	
	var usable = [];
	for(var i=0;i<solutionSet.length;i++){
		for(var j=0;j<solutionSet[i].length;j++){
			if(solutionSet[i][j][firstInd]==clue.firstProperty.value){
				if(solutionSet[i][j][secondInd]!=clue.secondProperty.value){
					usable.push(solutionSet[i]);
					j=solutionSet[i].length;
				}
			}
		}
	}
	return usable;
}
