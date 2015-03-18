//Userlist data array for filling in infobox
var userListData = [];

//DOM ready
$(document).ready(function(){
	populateTable();
});

$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

$('#btnAddUser').on('click', addUser);

//Fill table with data
function populateTable(){
	var tableContent = '';

	//jquery ajax call for json
	$.getJSON('/users/userlist', function(data){

		//userListData is the array of every object returned in the userlist collection - each user entry is 
		//an object literal contained within this array of all user entries

		userListData = data;

		//create a table html snippet for each object returned in the json array
		$.each(data, function(key,val){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});

		$('#userList table tbody').html(tableContent);
	});
};

function showUserInfo(e){
	e.preventDefault();

	//thisUserName is gotten from the <a> tags rel attribute which we wrote 
	var thisUserName = $(this).attr('rel');
	//.map creates a new array with the results of calling a function on every element in an array
	//what is returned is an array of all usernames from the json object (without the extra user data like email, id, etc)
	//then we get the index of the particular username from the event in this new array and assign it to arrayPosition

	var arrayPosition = userListData.map(function(arrayItem){
		return arrayItem.username;
	}).indexOf(thisUserName); //array.map.indexOf is considered chaining

	//store the object with matching username at that index of the whole json array
	var thisUserObject = userListData[arrayPosition];

	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);

};

//using ajax!
function addUser(e){
	e.preventDefault;

	//basic validation - keeps track of no input
	var errorCount = 0;
	$('#addUser input').each(function(index, val){
		if($(this).val() === ''){
			errorCount++;
		}
	});

	if(errorCount === 0){
		var newUser = {
			'username' : $('#addUser fieldset input#inputUserName').val(),
			'email' : $('#addUser fieldset input#inputUserEmail').val(),
			'fullname' : $('#addUser fieldset input#inputUserFullName').val(),
			'age' : $('#addUser fieldset input#inputUserAge').val(),
			'location' : $('#addUser fieldset input#inputUserLocation').val(),
			'gender' : $('#addUser fieldset input#inputUserGender').val()
		}

		//use ajax to post the object to the userlist collection in mongodb
		//the post route is at /users/adduser
		//ajax chaining
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response){
			if (response.msg === ''){
				//clear form
				$('#addUser fieldset input').val('');
				populateTable();
			}
			else {
				alert('Error: ' + response.msg);
			}
		});
	}
	else {
		//if error count
		alert('Please fill in all fields');
		return false;
	}
};