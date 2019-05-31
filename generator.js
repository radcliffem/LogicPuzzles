var allSolutions=[];
var solution = [];
var solved = false;
var allClues=[];
var cats=[];
var reducible = true;

document.getElementById("submit").onclick=function(){
	width=document.getElementById("width").value;
	height=document.getElementById("height").value;
	pickCategories(width,height);
	makePuzzle(cats);
	turnOff(document.getElementsByName("setup"));
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

function generateClues(solution){
	var clues=[];
	var direct=[];
	var anti=[];
	
	var width=cats.length;
	var height=solution.length;
	for(var j=0; j<height;j++){
		for(var i=0;i<width;i++){
			for(var k=i+1;k<width;k++){
				var newClue={};
				newClue.type='direct';
				newClue.firstProperty={category:cats[i].name,value:solution[j][i]};
				newClue.secondProperty={category:cats[k].name,value:solution[j][k]};
				clues.push(newClue);
				direct.push(newClue);	
			}
		}
		
		for(var i=j+1;i<height;i++){
			var newClue={};
			newClue.type='before';
			var personAday=solution[j][1];
			var personBday=solution[i][1];
			if(lookUpIndex(personAday,day.table)<lookUpIndex(personBday, day.table)){
				newClue.firstPerson=solution[j][0];
				newClue.secondPerson=solution[i][0];
			}else{
				newClue.firstPerson=solution[i][0];
				newClue.secondPerson=solution[j][0];
			}
			clues.push(newClue);
			for(var k=0;k<width;k++){
				for(var l=k+1;l<width;l++){
					var aClue={};
					aClue.type='anti';
					aClue.firstProperty={category:cats[k].name,value:solution[j][k]};
					aClue.secondProperty={category:cats[l].name,value:solution[i][l]};
					clues.push(aClue);
					anti.push(aClue);
				}
			}
		}
	}
	
	anti=permute(anti);
	direct=permute(direct);
	for(var i=0;i<direct.length;i++){
		var newClue={};
		newClue.type='xor';
		newClue.directPart=direct[i];
		newClue.antiPart=anti[i];
		clues.push(newClue);
	}
	
	
	return clues;
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
		
 	allClues = generateClues(solution);
	allClues=permute(allClues);
	var possibleSolutions=Array.from(allSolutions);
		
	var keepClues = [];
	var numClues = 0;
	var newPossible = [];
	var newClue = []
	var xorcount=1
	
	while(solved==false){
		newPossible = [];
		newClue = allClues[numClues];
		
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
		numClues++;
	}

	keepClues = reduceClues(keepClues);
	
	for(var i=0;i<keepClues.length;i++){
		addClue(keepClues[i]);
	}
	
}
		

function reduceClues(clues){
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
	var usable=[];
	for(var i=0;i<solutionSet.length;i++){
		for(var j=0;j<solutionSet[i].length;j++){
			if(solutionSet[i][j][0]==clue.firstPerson){
				first = j;
			}else if(solutionSet[i][j][0]==clue.secondPerson){
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