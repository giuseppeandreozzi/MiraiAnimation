function loadUser() {
	if ($("option:checked").val() == ""){
		$("#userDiv").hide();
		return;
	}
	
	var jsonObj = {};
	jsonObj._csrf = $("input[name=_csrf]").attr('value');
	jsonObj.codiceUtente = $("option:checked").val();
			
	$.ajax({
		url:"/infoUtente",
		type: "POST",
		data: jsonObj,
		dataType: "json",
		success: function(result){
			$("#editForm input[name=username]").val(result.username);
			$("#editForm input[name=mail]").val(result.email);
			$("#editForm input[name=nome]").val(result.nome);
			$("#editForm input[name=cognome]").val(result.cognome);
			$("#editForm input[name=dataNascita]").val(result.dataNascita);
			$("#editForm input[name=city]").val(result.indirizzo.città);
			$("#editForm input[name=via]").val(result.indirizzo.via);
			$("#editForm input[name=cap]").val(result.indirizzo.CAP);
			if (result.tipo == "user") {
				$("#editForm input[value=user]").click();
			} else if (result.tipo == "admin") {
				$("#editForm input[value=admin]").click();
			}
			
			$("#userDiv").show();
				     
		}
	});
}

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
	
	if (tipo != "admin" && tipo != "user"){
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