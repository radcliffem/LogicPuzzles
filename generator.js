var allSolutions=[];
var solution = [];
var solved = false;
var cats=[];

document.getElementById("submit").onclick=function(){
	width=document.getElementById("width").value;
	height=document.getElementById("height").value;
	if(width>4||height>4){
		alert("Sorry, you cannot have more than 4 categories or more than 4 people.");
	}else{
		pickCategories(width,height);
		makePuzzle(cats);
		turnOff(document.getElementsByName("setup"));
	}	
}


function turnOff(elements){
	for(var i=0;i<elements.length;i++){
		elements[i].style.display="none";
	}
}


function turnOn(elements){
	for(var i=0;i<elements.length;i++){
		elements[i].style.display="block";
	}
}


//width indicates the number of categories in play 
//(i.e., width = solution[0].length)

function generateClue(){
	
	var width=cats.length;
	var height=solution.length;
	
	var pickType=getRandInt(0,4);
	if(pickType==0){
		return generateDirectClue(width,height)
	}else if(pickType==1){
		return generateAntiClue(width,height);
	}else if(pickType==2){
		return generateBeforeClue(width,height);
	}else if(pickType==3){
		return generateXorClue(width,height);
	}
}


function generateDirectClue(width,height){
	var j=getRandInt(0,height);
	var i=getRandInt(0,width-1);
	var k=getRandInt(i+1,width);
	
	var newClue={};
	newClue.type='direct';
	newClue.firstProperty={category:cats[i].name,value:solution[j][i]};
	newClue.secondProperty={category:cats[k].name,value:solution[j][k]};
	return newClue;
}

function generateAntiClue(width,height){
	var j=getRandInt(0,height-1);
	var i=getRandInt(j+1,height);
	var k=getRandInt(0,width-1);
	var l=getRandInt(k+1,width);
	var newClue={};
	newClue.type='anti';
	newClue.firstProperty={category:cats[k].name,value:solution[j][k]};
	newClue.secondProperty={category:cats[l].name,value:solution[i][l]};
	return newClue;
}
	
function generateXorClue(width,height){
	var newClue={};
	newClue.type='xor';
	newClue.directPart=generateDirectClue(width,height);
	newClue.antiPart=generateAntiClue(width,height);
	return newClue;
}
	
function generateBeforeClue(width,height){
	var j=getRandInt(0,height-1);
	var i=getRandInt(j+1,height);
	var k=1;
	while(k==1){
		k=getRandInt(0,width);
	}
	
	var newClue={};
	newClue.type='before';
	newClue.category=cats[k].name;
	if(lookUpIndex(solution[j][1],day.table)<lookUpIndex(solution[i][1], day.table)){
		newClue.firstProperty={category:cats[k].name,value:solution[j][k]};
		newClue.secondProperty={category:cats[k].name,value:solution[i][k]};
	}else{
		newClue.firstProperty={category:cats[k].name,value:solution[i][k]};
		newClue.secondProperty={category:cats[k].name,value:solution[j][k]};
	}
	return newClue;
}
	
	

function pickCategories(width,height){
	cats.push(names);
	names.values[0]=permute(names.values[0]);
	while(names.values[0].length>height){
		names.values[0].pop();
	}
	
	cats.push(day);
	while(day.values[0].length>height){
		day.values[0].pop();
		day.standard[0].pop();
	}
	
	var keys=Object.keys(options);
	keys = permute(keys);
	for(var i=0;i<width-1;i++){
		cats.push(options[keys[i]]);
		options[keys[i]].values[0]=permute(options[keys[i]].values[0]);
		while(options[keys[i]].values[0].length>height){
			options[keys[i]].values[0].pop();
		}
	}
}


function makePuzzle(cats){
	
	allSolutions=generatePossible(cats[0].values,cats[1].values);
	for(var i=2;i<cats.length;i++){
		allSolutions = generatePossible(allSolutions,cats[i].values);
	}
	solution=allSolutions[getRandInt(0,allSolutions.length-1)];
	makeGrid(solution);
		
	var possibleSolutions=Array.from(allSolutions);
		
	var keepClues = [];
	var newPossible = [];
	var xorcount=1
	
	while(solved==false){
		newPossible = [];
		var newClue = generateClue();
		
		if(xorcount<3||newClue.type!='xor'){
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
	while(reducible){
		for(var i=0;i<clues.length;i++){
			var test = Array.from(clues);
			test.splice(i,1);
			var possibleSolutions = Array.from(allSolutions);
			for(var j=0;j<test.length;j++){
				possibleSolutions = processClue(test[j],possibleSolutions);
			}
			if(possibleSolutions.length==1){
				i=clues.length;
				clues = test;
			}
			if(i==clues.length-1){
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
	var ind=lookUpIndex(clue.category,cats);
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
	firstInd = lookUpIndex(clue.firstProperty.category,cats);
	secondInd=lookUpIndex(clue.secondProperty.category,cats);
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
	firstInd = lookUpIndex(clue.firstProperty.category,cats);
	secondInd=lookUpIndex(clue.secondProperty.category,cats);
	
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
