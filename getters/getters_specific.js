

//=============================================
// getter specific

function computeMethodName( attr ) {
	return "get" +  attr.Name.charAt(0).toUpperCase() + attr.Name.substr(1);
}

function processParameter( attr, method, param ) {
	param.DirectionKind = 3; //IUMLParameterDirectionKind.pdkReturn;
}

//=============================================

