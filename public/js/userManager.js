
function checkEditForm(){
	var user = editForm.username;
	var tipo = $("input[name=tipo]:checked").val();
	
	var patternUser = /^[a-zA-Z0-9._-]{4,15}$/g;
	
	if(!patternUser.test(user.value)){
		spanError = document.getElementById("errorUserEdit");
		spanError.innerHTML = "L'username: <br/>" +
				"-deve essere lungo tra i 4 e 15 caratteri; <br/>" +
				"-pu&ograve; contenere solo lettere, numeri e caratteri speciali come \".\"  \"_\"  \"-\"<br/>";
		user.focus();
		
		return false;
	}
	
	if (tipo != "admin" && tipo != "registered"){
		spanError = document.getElementById("errorTipo");
		spanError.innerHTML = "Tipo non valido<br/>";

		return false;
	}
	
	return true;
}

function checkDelForm(){
	var user = deleteForm.username;
	
	var patternUser = /^[a-zA-Z0-9._-]{4,15}$/g;
	
	if(!patternUser.test(user.value)){
		spanError = document.getElementById("errorDel");
		spanError.innerHTML = "L'username: <br/>" +
				"-deve essere lungo tra i 4 e 15 caratteri; <br/>" +
				"-pu&ograve; contenere solo lettere, numeri e caratteri speciali come \".\"  \"_\"  \"-\"<br/>";
		user.focus();
		
		return false;
	}
		
	return true;
}