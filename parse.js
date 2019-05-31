var count=1;

function addClue(clue){
	Add = document.createElement("DIV");
	Add.style.width="400px";
	var sentence="";
	
	if(clue.type=='direct'||clue.type=='anti'){
		sentence=makeSentence(clue);
	}else if(clue.type=='xor'){
		var sentence1 = makeSentence(clue.directPart);
		if(cats[lookUpIndex(clue.directPart.firstProperty.category,cats)].usage!='name'){
			sentence1=sentence1.charAt(0).toLowerCase()+sentence1.slice(1);
		}
		hold=clue.antiPart;
		hold.type='direct';
		var sentence2=makeSentence(hold);
		if(cats[lookUpIndex(clue.antiPart.firstProperty.category,cats)].usage!='name'){
			sentence2=sentence2.charAt(0).toLowerCase()+sentence2.slice(1);
		}
		sentence = 'Either '+sentence1+' or '+sentence2+', but not both'
	}else if(clue.type=='before'){
		sentence = clue.firstPerson+' went to Kennywood before '+clue.secondPerson;
	}
	
	Add.innerText = count.toString()+'. '+sentence+'.';
	count++;
	document.getElementById("clueBox").appendChild(Add);
	document.getElementById("clueBox").appendChild(document.createElement("BR"));
	
}



function makeSentence(clue){
	var firstNoun='';
	var secondNoun='';
	var verb = '';
	var order = getRandInt(0,2);
	if(cats[lookUpIndex(clue.firstProperty.category,cats)].usage=='ordinal'){
		order=0;
	}
	if(cats[lookUpIndex(clue.firstProperty.category,cats)].usage=='name'){
		order=1;
	}
	if(order==0){
			var hold=clue.firstProperty;
			clue.firstProperty=clue.secondProperty;
			clue.secondProperty=hold;
	}
	firstInd = lookUpIndex(clue.firstProperty.category,cats);
	secondInd=lookUpIndex(clue.secondProperty.category,cats);
	
	if(cats[firstInd].usage=='possession'){
		if(cats[firstInd].article){
			firstNoun = 'The person with a '+clue.firstProperty.value+cats[firstInd].addon;
		}else{
			firstNoun = 'The person with '+clue.firstProperty.value+cats[firstInd].addon;
		}
	}else if(cats[firstInd].usage =='name'){
		firstNoun = clue.firstProperty.value+cats[firstInd].addon;
	}else if(cats[firstInd].usage == 'adjective'){
		firstNoun = 'The '+clue.firstProperty.value+cats[firstInd].addon+' person';
	}else if(cats[firstInd].usage=='classify'){
		if(cats[firstInd].article){
			firstNoun = 'The '+clue.firstProperty.value+cats[firstInd].addon;
		}else{
			firstNoun = clue.firstProperty.value+cats[firstInd].addon;
		}
	}else if(cats[firstInd].usage == 'enjoyment'){
		firstNoun = 'The person who likes '+clue.firstProperty.value+cats[firstInd].addon;
	}
	
	if(cats[secondInd].usage=='ordinal'){
		secondNoun = clue.secondProperty.value;
	}else	if(cats[secondInd].article){
		secondNoun = 'a '+clue.secondProperty.value+cats[secondInd].addon;
	}else{
		secondNoun = clue.secondProperty.value+cats[secondInd].addon;
	}
	
	if(clue.type=='direct'){
		if(cats[secondInd].usage=='ordinal'){
			verb=' went'+cats[secondInd].addon+' on ';
		}else if(cats[secondInd].usage=='possession'){
			verb = ' has ';
		}else if(cats[secondInd].usage=='enjoyment'){
			verb = ' likes ';
		}else{
			verb = ' is ';
		}
	}else if(clue.type=='anti'){
		if(cats[secondInd].usage=='ordinal'){
			verb = ' did not go '+cats[secondInd].addon+'on '
		}else if(cats[secondInd].usage=='possession'){
			verb = ' does not have ';
		}else if(cats[secondInd].usage=='enjoyment'){
			verb = ' does not like ';
		}else{
			verb = ' is not ';
		}
	}
	
	
	return firstNoun+verb+secondNoun;
}