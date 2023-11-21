var vote = 0;
		
function checkStar(id){
	vote = id[0];
	var subId = id.substring(1);
			
	for (var i = 1; i <= 5; i++){
		if (i <= vote)
			$("#" + i + subId).css("color", "orange");
		else
			$("#" + i + subId).css("color", "black");
	}
}
		
function sendReview(){
	var jsonObj = {};
	jsonObj.vote = vote;
	jsonObj.comment = $("textarea").val();
	jsonObj.codiceAnimazione = $("input[name=animation]").val();
	var jsonStr = JSON.stringify(jsonObj);
	
	if(!checkForm())
		return false;
	
	$.ajax({
		url:"./ReviewControl",
		type: "POST",
		data: "json=" + encodeURIComponent(jsonStr),
		success: function(result){
					if(result.error){
						$("#errorComment").html(result.error);
						return;
					}
					
					var strVote = "";
					for (var i = 0; i < result.vote; i++){
					strVote += "<i class='fa fa-star fa-lg'></i>";
					}
					  
				    $("#newReview").html("User: " + result.user + "<br/> Voto: " + strVote + "<br/> Commento: <br/>" + result.comment)
				     
			}
	});
}

function checkForm(){
	var comment = reviewForm.comment;
	var spanError = document.getElementById("errorComment");
	
	var patternComment = /^.{1,255}$/g;
	
	if(!patternComment.test(comment.value)){
		spanError.innerHTML = "Il commento non pu&ograve; essere vuoto o avere pi&ugrave; di 255 caratteri";
		comment.focus();
		return false;
	}
	
	return true;
}