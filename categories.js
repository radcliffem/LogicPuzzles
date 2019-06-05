var names= {'type': 'category',
	'name':'name',
	'usage':'name',
	'values': [[['Mary'],['John'],['Susan'],['Jessica'],['Brandon']]],
	'addon': ''
	};

var day = {'type': 'ordinal',
		'name':'day',
		'usage': 'ordinal',
		'article': false,
		'values': [[['Monday'],['Tuesday'],['Wednesday'],['Thursday'],['Friday']]],
		'standard': [[['Monday'],['Tuesday'],['Wednesday'],['Thursday'],['Friday']]],
		'table':[{'name':'Monday'},{'name':'Tuesday'},{'name':'Wednesday'},{'name':'Thursday'},{'name':'Friday'}],
		'addon': ' to Kennywood '};

var options = {
	
	'houses': {'type': 'category',
		'name': 'house',
		'usage': 'possession',
		'article': true,
		'values': [[['red'],['beige'],['grey'],['yellow'],['white']]],
		'addon': ' house'
		},
		
	'nationality': {'type': 'category',
		'name': 'nationality',
		'usage': 'adjective',
		'values': [[['English'], ['Polish'], ['German'],['French'],['Chinese']]],
		'addon': ''
		},
	
	'pets' :{'type':'category',
		'name': 'pets',
		'usage': 'possession',
		'article': true,
		'values': [[['dog'],['cat'],['fish'],['bunny']]],
		'addon': ''
		},
	
	'eyes' :{'type': 'category',
		'name': 'eyes',
		'usage': 'possession',
		'article': false,
		'values': [[['green'],['blue'],['brown'],['hazel'],['violet']]],
		'addon': ' eyes'
		},
		
	'job': {'type':'category',
		'name': 'job',
		'usage': 'classify',
		'article': true,
		'values': [[['architect'],['baker'],['lawyer'],['programmer'],['teacher'],['housecleaner']]],
		'addon': ''
		},
	
	'hobby': {'type':'category',
		'name': 'hobby',
		'usage': 'enjoyment',
		'article': false,
		'values':[[['reading'],['cooking'],['gardening'],['video games'],['drawing'],['sewing']]],
		'addon':''
		},
	
	'icecream' : {'type':'category',
		'name': 'ice cream',
		'usage': 'enjoyment',
		'article': false,
		'values':[[['chocolate'], ['strawberry'], ['vanilla'], ['pistachio'], ['Rocky Road'], ['neopolitan']]],
		'addon': ' ice cream'
		}
}
