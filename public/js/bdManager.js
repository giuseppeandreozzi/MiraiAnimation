
function loadBD(){
	if ($("option:checked").val() == ""){
		$("#cofanetto").hide();
		return;
	}
	
	var jsonObj = {};
	jsonObj.codiceCofanetto = $("option:checked").val();
	var jsonStr = JSON.stringify(jsonObj);
	
	$.ajax({
		url:"CofanettoAdminControl",
		type: "POST",
		data: "json=" + encodeURIComponent(jsonStr),
		dataType: "json",
		success: function(result){
			$("#editBD textarea[name=contenuto]").val(result.contenuto);
			$("#editBD input[name=prezzo]").val(result.prezzo);
			
			$("#cofanetto").show();
			
		}
	});
}

function checkForm(form){
	var contenuto = form.contenuto;
	var prezzo = form.prezzo;
	
	var patternContenuto = /^.{1,100}$/g;
	var patternPrezzo = /^\d{1,}$/g;
	
	if (!patternContenuto.test(contenuto.value)){
		$("#" + form.id + " .errorContenuto").html("Contenuto non valido<br/>");
		contenuto.focus();
		return false;
	}
	
	if (!patternPrezzo.test(prezzo.value) || prezzo.value < 1){
		$("#" + form.id + " .errorPrezzo").html("Inserire un prezzo valido (maggiore di 0) <br/>");
		prezzo.focus();
		return false;
	}
	
	return true;
}