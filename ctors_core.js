
var app = new ActiveXObject("StarUML.StarUMLApplication");

//var selmgr = app.SelectionManager;


app.BeginGroupAction();	// to achieve single undo-redo action

try {

	app.Log("Generating...");
	generateCtors(app);
	
} catch(ex) {
	
	app.Log("exception " + ex.name + ": " + ex.message );
	
} finally {

	app.EndGroupAction();

	app.Log("Finished");
}



function findByPredicate(arr, predicate) {
	for(var i=0; i < arr.length; i++)
		if(predicate(arr[i]))
			return arr[i];
	return null;
}

function generate( computeMethodName, processParameter ) {

	var factory = app.UMLFactory;

	var classes = GetAllClassesInProject( app );
	app.Log("found total of " + classes.length + " classes");
	
	for (var i = 0; i < classes.length; i++) {
		// get all attributes
		// compute method name
		// check if method exists
		// if yes, skip it
		// if no, create method

		var cls = classes[i];
		app.Log("processing class " + cls.Name);

		var methods = GetAllMethodsOfAClass( app, cls );
		var attrs = GetAllAttributesOfAClass( app, cls );
		
		for (var j = 0; j < attrs.length; j++) {
			var attr = attrs[j];
			
			if(attr.Visibility == 0) {	// IUMLVisibilityKind.vkPublic
				// attribute is public, skip it
				continue;
			}
			
			// compute name for method
			var methodName = computeMethodName(attr);
			
			app.Log("method name: " + methodName);
			
			// check if this method already exists
			if( findByPredicate( methods, function(m) { return m.Name == methodName; } ) != null ) {
				// already exists
				app.Log("already exists");
				continue;
			}
			
			// create method
			app.Log("creating method " + methodName);
			var operation = factory.CreateOperation( cls );
			
			operation.Name = methodName;
			operation.OwnerScope = attr.OwnerScope;	// static/instance

			// Create UMLParameter element which is actually a return value
			var paramElem = factory.CreateParameter(operation);
			paramElem.Name = "";
			paramElem.Type_ = attr.Type_;
			paramElem.TypeExpression = attr.TypeExpression;
			
			processParameter( attr, operation, paramElem );
			
		}

	}

}

function GetAllAttributesOfAClass( app, cls ) {
	
	var attrs = [];
	
	var colCount = cls.MOF_GetCollectionCount("Attributes");
	for (var i = 0; i < colCount; i++){
		var colItem = cls.MOF_GetCollectionItem("Attributes", i);
	//	app.Log("found attribute: " + colItem.Name);
		attrs.push(colItem);
	}
	
	return attrs;
}

function GetAllMethodsOfAClass( app, cls ) {
	
	var methods = [];
	
	var colCount = cls.MOF_GetCollectionCount("Operations");
	for (var i = 0; i < colCount; i++){
		var colItem = cls.MOF_GetCollectionItem("Operations", i);
	//	app.Log("found method: " + colItem.Name);
		methods.push(colItem);
	}
	
	return methods;
}

function GetAllClassesInProject( app ) {
	
	var arr = [];
	VisitOwnedElement( app, app.GetProject(), function(elem) { return elem.IsKindOf("UMLClass"); }, arr );
	return arr;
}

function VisitOwnedElement(app, owner, filter, arrayOfElements){
    
	var elem;

    for (var i = 0; i < owner.GetOwnedElementCount(); i++){
        elem = owner.GetOwnedElementAt(i);
        
	//	app.Log("found elem: " + elem.GetClassName());

		if(arrayOfElements) {
			if(filter(elem)) {
				arrayOfElements.push(elem);
			}
		}
		
        if (elem.IsKindOf("UMLNamespace")) {
		//	app.Log("recursively going into namespace");
			VisitOwnedElement(app, elem, filter, arrayOfElements);
		}
    }
}

