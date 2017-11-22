

//=============================================
// ctors specific

function computeMethodName( attr ) {
	return "";
}

function processParameter( attr, method, param ) {
	
}


function generateCtors( app ) {
	

	var factory = app.UMLFactory;

	var classes = GetAllClassesInProject( app );
	app.Log("found total of " + classes.length + " classes");
	
	for (var i = 0; i < classes.length; i++) {
		// compute method name
		// check if method exists
		// if yes, skip it
		// if no, create method
		// use all, except static, attributes as arguments

		var cls = classes[i];
		app.Log("processing class " + cls.Name);

		var methodName = cls.Name;
		
		// check if this method already exists
		var methods = GetAllMethodsOfAClass( app, cls );
		if( findByPredicate( methods, function(m) { return m.Name == methodName; } ) != null ) {
			// already exists
			app.Log("ctor already exists");
			continue;
		}
		
		// create ctor
		app.Log("creating ctor");
		var operation = factory.CreateOperation( cls );
		operation.Name = methodName;
		operation.SetStereotype("create");
		
		// find all non-static attributes, and add them as parameters
		var attrs = GetAllAttributesOfAClass( app, cls );
		
		for (var j = 0; j < attrs.length; j++) {
			var attr = attrs[j];
			
			if(attr.OwnerScope == 1) {
				// attribute is static, skip it
				continue;
			}
			
			// Create parameter
			var paramElem = factory.CreateParameter(operation);
			paramElem.Name = attr.Name;
			paramElem.Type_ = attr.Type_;
			paramElem.TypeExpression = attr.TypeExpression;
			
		}

	}
	
}


//=============================================

