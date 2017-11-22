

//=============================================
// setter specific

function computeMethodName( attr ) {
	return "set" +  attr.Name.charAt(0).toUpperCase() + attr.Name.substr(1);
}

function processParameter( attr, method, param ) {
	// set name of parameter
	param.Name = attr.Name ;
}

//=============================================

