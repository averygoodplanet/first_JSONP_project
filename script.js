$(document).ready( function () {
	var description_array = {
		term: "cream puffs",
		location: "650 Mission St*San Francisco* CA",
		ywsid: "c_DiXp-d5eEttXsSIfY9Tg",
		};

	function generateURL () { 
		var trailingEndURL = jQuery.param(description_array);
		var formattedURL = "http://api.yelp.com/business_review_search?" + trailingEndURL;
		return formattedURL;
	};
	
	console.log("output:"+generateURL());

	$.ajax({
		dataType: "json",
		url: generateURL(),
		cache: false,
		success: function (result, textStatus) {
			console.log("textStatus"+textStatus);
		}
	});
	
	$.getJSON(generateURL(), function (data) {
		console.log(data.businesses[0].name);
	});
	
});