console.log('500px:', _500px);
var photos = [],
	user = {},
	currentPage = 1,
	level = "popular";


_500px.init({
	sdk_key: '53645629fd94ea7c62a3c8301e302c05ed7c421c',
});


$('#loginButton').on('click', function() {
	_500px.login(function(res) {
		console.log('res:', res);
		_500px.api('/users', function (response) {
		    console.log("Your username is ", response);
		    user = response.data.user;
		    $('#welcomeUser').append("<span>Welcome " + response.data.user.firstname + " " + response.data.user.lastname+"</span>");
		    console.log($('#welcomeUser'));
		});

	});
});

$('#profileButton').on('click', function() {

	_500px.getAuthorizationStatus(function(status) {
		console.log('status:', status);
	});
		_500px.api('/photos', {username: user.username},  function (response) {
			console.log('user response:', response);
			$('.photoContainer').empty();
			photos = response.data.photos;
			_.each(response.data.photos, function(item) {
				$('.photoContainer').append("<img class='pxImage' data-target='modal' src='"+ item.image_url + "''>");
			});
		});

});
var getPhotos = function(page) {
	_500px.api('/photos', { feature: level, page: page }, function (response) {
	    console.log(response.data.photos);
	    $('.photoContainer').empty();
	    photos = response.data.photos;
	    _.each(response.data.photos, function(item) {
	    	$('.photoContainer').append("<img class='pxImage' data-target='modal' src='"+ item.image_url + "''>");
	    });
	});
};

getPhotos(currentPage);

$('.nextPageButton').on('click', function() {
	currentPage+=1;
	getPhotos(currentPage);
});

$('.previousPageButton').on('click', function() {
	if (currentPage != 1) {
		currentPage-=1;
		getPhotos(currentPage);
	} 
});

$('#level').on('change', function() {
	console.log('level changed');
	page = 1;
	level = $('#level').val().toLowerCase();
	getPhotos(page);
});

$('.pxImage').on('click', function() {
	console.log('.pxImage clicked');
	$('#modal').modal('toggle');
});