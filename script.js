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
	
	var requestURL = "http://api.yelp.com/business_review_search?term=cream%20puffs&location=650%20Mission%20St%2ASan%20Francisco%2A%20CA&ywsid=c_DiXp-d5eEttXsSIfY9Tg";
	
	$.ajax({
		dataType: "jsonp",
		url: requestURL,
		success: function (data) {
			console.log(data)
		}
	});
	
	$.getJSON(generateURL(), function (data) {
		console.log(data.businesses[0].name);
	});
	
});