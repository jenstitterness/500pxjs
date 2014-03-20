
var photos = [],
	user = null,
	currentPage = 1,
	level = "popular",
	category = "",
	profile = false;


// Init 500px library with key. Input your sdk key here.
// See developers.500px.com/ for more info.
_500px.init({
	sdk_key: '',
});

/*
* Set up button events.
*
*/

// Home button. reset vars
$('#homeButton').on('click', function() {
	currentPage = 1;
	level = "popular";
	profile = false;
	category = "";
	getPhotos(currentPage);
});

// Login to 500px.
// Chrome doesn't like to login. Use safari.
$('#loginButton').on('click', function() {
	_500px.login(function(res) {
		_500px.api('/users', function (response) {
		    user = response.data.user;
		    $('#welcomeUser').append("<span>Welcome, " + response.data.user.firstname + " " + response.data.user.lastname+"</span>");
		});

	});
});

// Profile Button. Load Users image's.
$('#profileButton').on('click', function() {
	_500px.getAuthorizationStatus(function(status) {
		if (status === "authorized" && user && user.id) {
			page = 1;
			category = '';
			profile = true;
			_500px.api('/photos', {feature: 'user', user_id: user.id, page: page, image_size: 3},  function (response) {
				// console.log('user response:', response);
				$('.photoContainer').empty(); // clear photo container

				photos = response.data.photos;
				_.each(response.data.photos, function(item) {
					$('.photoContainer').append("<img data-imgid='"+item.id+"' class='pxImage' data-target='modal' src='"+ item.image_url + "''>");
				});

				setUpImages(); // load click events again.

			});
		}
	});


});

// Get photos from 500px
var getPhotos = function(page) {
	var params = {
		page: page,
		only: category,
		image_size: 3
	};

	params.feature = level;

	if (profile === true) { params.feature = 'user'; params.user_id = user.id; }


	_500px.api('/photos', params, function (response) {
	    console.log(response.data.photos);
	    $('.photoContainer').empty();
	    photos = response.data.photos;
	    _.each(response.data.photos, function(item) {
	    	$('.photoContainer').append("<img data-imgid='"+item.id+"'class='pxImage' data-target='modal' src='"+ item.image_url + "''>");
	    });
	    setUpImages();
	});
};

var getPhoto = function(id) {
	// console.log('FETCHING:', id);
	_500px.api('/photos/'+ id, {image_size: 5}, function (response) {
	    // console.log('getphoto', response.data.photo);

			// build url. just adding image_url doesn't work
	    var url = "<img src='" + response.data.photo.image_url + "'>";
	    var name = response.data.photo.name;

			// build modal
	    $('.modalImageContainer').empty().append(url);
	    $('#myModalLabel').empty().append(name);
	    $('#modal').modal();
	});
};


// Navigation buttons.
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

// Change 500px level
$('#level').on('change', function() {
	page = 1;
	level = $('#level').val().toLowerCase();
	getPhotos(page);
});

// Change 500px category
$('#category').on('change', function() {
	page = 1;
	category = $('#category').val().toLowerCase();
	if (category === "All Categoreies") {
		category = "";
	}
	getPhotos(page);
});

// Get larger photo
var  setUpImages = function() {
	$('img').on('click', function(evt) {

		getPhoto($(evt.currentTarget).data('imgid'));

	});
}

// Load photos
getPhotos(currentPage);
