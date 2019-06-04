var count=1;

function addClue(clue){
	Add = document.createElement("DIV");
	Add.style.width="400px";
	var sentence="";
	
	if(clue.type=='direct'||clue.type=='anti'){
		sentence=makeSentence(clue);
	}else if(clue.type=='xor'){
		var sentence1 = makeSentence(clue.directPart);
		if(usedCategories[lookUpIndex(clue.directPart.firstProperty.category,usedCategories)].usage!='name'){
			sentence1=sentence1.charAt(0).toLowerCase()+sentence1.slice(1);
		}
		hold=clue.antiPart;
		hold.type='direct';
		var sentence2=makeSentence(hold);
		if(usedCategories[lookUpIndex(clue.antiPart.firstProperty.category,usedCategories)].usage!='name'){
			sentence2=sentence2.charAt(0).toLowerCase()+sentence2.slice(1);
		}
		sentence = 'Either '+sentence1+' or '+sentence2+', but not both'
	}else if(clue.type=='before'){
		sentence = makeSentence(clue);
	}
	
	Add.innerText = count.toString()+'. '+sentence+'.';
	Add.setAttribute('class','active');
	var newSpace=document.createElement("BR");
	newSpace.setAttribute('id',count.toString()+'space');
	Add.setAttribute('id',count.toString());
	count++;
	Add.onclick=function(){
		if(this.className=='active'){
			document.getElementById("activeClues").removeChild(this);
			var space=document.getElementById(this.id+'space')
			document.getElementById("activeClues").removeChild(space);
			document.getElementById("usedClues").appendChild(this);
			document.getElementById("usedClues").appendChild(space);
			this.style.textDecoration ="line-through";	
			this.setAttribute('class','used');
		}else if(this.className=='used'){
			document.getElementById("usedClues").removeChild(this);
			var space=document.getElementById(this.id+'space')
			document.getElementById("usedClues").removeChild(space);
			document.getElementById("activeClues").appendChild(this);
			document.getElementById("activeClues").appendChild(space);
			this.style.textDecoration ="none";
			this.setAttribute('class','active');
		}
	}
	document.getElementById("activeClues").appendChild(Add);
	document.getElementById("activeClues").appendChild(newSpace);
}




function makeSentence(clue){
	var firstNoun='';
	var secondNoun='';
	var verb = '';
	var order = getRandInt(0,2);
	if(usedCategories[lookUpIndex(clue.firstProperty.category,usedCategories)].usage=='ordinal'){
		order=0;
	}
	if(usedCategories[lookUpIndex(clue.firstProperty.category,usedCategories)].usage=='name'){
		order=1;
	}
	if(order==0){
		if(clue.type!='before'){
			var hold=clue.firstProperty;
			clue.firstProperty=clue.secondProperty;
			clue.secondProperty=hold;
		}
	}
	
	firstNoun=makeFirstNoun(clue.firstProperty);
	secondNoun=makeSecondNoun(clue.secondProperty);
	
	firstInd= lookUpIndex(clue.firstProperty.category,usedCategories);
	secondInd= lookUpIndex(clue.secondProperty.category,usedCategories);
	
	if(clue.type=='direct'){
		if(usedCategories[secondInd].usage=='ordinal'){
			verb=' went'+usedCategories[secondInd].addon+' on ';
		}else if(usedCategories[secondInd].usage=='possession'){
			verb = ' has ';
		}else if(usedCategories[secondInd].usage=='enjoyment'){
			verb = ' likes ';
		}else{
			verb = ' is ';
		}
	}else if(clue.type=='anti'){
		if(usedCategories[secondInd].usage=='ordinal'){
			verb = ' did not go '+usedCategories[secondInd].addon+'on '
		}else if(usedCategories[secondInd].usage=='possession'){
			verb = ' does not have ';
		}else if(usedCategories[secondInd].usage=='enjoyment'){
			verb = ' does not like ';
		}else{
			verb = ' is not ';
		}
	}else if(clue.type=='before'){
		secondNoun=makeFirstNoun(clue.secondProperty);
		if(usedCategories[lookUpIndex(clue.firstProperty.category,usedCategories)].usage!='name'){
			secondNoun=secondNoun.charAt(0).toLowerCase()+secondNoun.slice(1);
		}
		
		verb=' went to Kennywood before '
	}
	
	
	return firstNoun+verb+secondNoun;
}


function makeFirstNoun(property){
	var noun='';
	ind = lookUpIndex(property.category,usedCategories);
	
	if(usedCategories[ind].usage=='possession'){
		if(usedCategories[ind].article){
			noun = 'The person with a '+property.value+usedCategories[ind].addon;
		}else{
			noun = 'The person with '+property.value+usedCategories[ind].addon;
		}
	}else if(usedCategories[ind].usage =='name'){
		noun = property.value+usedCategories[ind].addon;
	}else if(usedCategories[ind].usage == 'adjective'){
		noun = 'The '+property.value+usedCategories[ind].addon+' person';
	}else if(usedCategories[ind].usage=='classify'){
		if(usedCategories[ind].article){
			noun = 'The '+property.value+usedCategories[ind].addon;
		}else{
			noun = property.value+usedCategories[ind].addon;
		}
	}else if(usedCategories[ind].usage == 'enjoyment'){
		noun = 'The person who likes '+property.value+usedCategories[ind].addon;
	}
	return noun;
}


function makeSecondNoun(property){
	var noun='';
	ind=lookUpIndex(property.category,usedCategories);
	
	if(usedCategories[ind].usage=='ordinal'){
		noun = property.value;
	}else	if(usedCategories[ind].article){
		noun = 'a '+property.value+usedCategories[ind].addon;
	}else{
		noun = property.value+usedCategories[ind].addon;
	}
	
	return noun;
}