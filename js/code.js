const urlBase = 'http://cop4331spcontact.com/LAMPAPI';
const extension = 'php';

let UserID = 0;
let FirstName = "";
let LastName = "";
var editContactFirst = "";
var editContactLast = "";
var editContactEmail = "";
var editContactPhone = "";

function doLogin()
{
	UserID = 0;
	FirstName = "";
	LastName = "";

	let Login = document.getElementById("loginName").value;
	let Password = document.getElementById("loginPassword").value;

	if(validateLogin(Login, Password))
	{
		document.getElementById("loginResult").innerHTML = "invalid username or password";
		return;
	}

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Login: Login,Password: Password};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				UserID = jsonObject.ID;

				if( UserID < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				FirstName = jsonObject.FirstName;
				LastName = jsonObject.LastName;

				saveCookie();

				window.location.href = "home.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignUp()
{
    FirstName = document.getElementById("signUpFirstName").value;
    LastName = document.getElementById("signUpLastName").value;

    let signUpName = document.getElementById("signUpName").value;
    let signUpPassword = document.getElementById("signUpPassword").value;

    if(validateSignUp(FirstName, LastName, signUpName, signUpPassword))
	{
		document.getElementById("signUpResult").innerHTML = "invalid signup";
		return;
	}

    let tmp =
    {
        FirstName: FirstName,
        LastName: LastName,
		Login: signUpName,
		Password: signUpPassword

    }

    let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
            if(this.status == 409)
            {
                document.getElementById("signUpResult").innerHTML = "User already exists";
                return;
            }
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("signUpResult").innerHTML = "User has been added";
                let jsonObject = JSON.parse(xhr.responseText);
                UserID = jsonObject.id;
                FirstName = jsonObject.FirstName;
                LastName = jsonObject.LastName;
                saveCookie();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signUpResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "FirstName=" + FirstName + ",LastName=" + LastName + ",UserID=" + UserID + ";expires=" + date.toGMTString();
}

function readCookie()
{
	UserID = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "FirstName" )
		{
			FirstName = tokens[1];
		}
		else if( tokens[0] == "LastName" )
		{
			LastName = tokens[1];
		}
		else if( tokens[0] == "UserID" )
		{
			UserID = parseInt( tokens[1].trim() );
		}
	}

	if( UserID < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		console.log("Logged in");
	}
}

function logOut()
{
	UserID = 0;
	FirstName = "";
	LastName = "";
	document.cookie = "FirstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let newContactFirst = document.getElementById("firstName").value;
    let newContactLast = document.getElementById("lastName").value;
    let newContactNumber = document.getElementById("phoneNumber").value;
    let newContactEmail = document.getElementById("email").value;

	if(validateAddContract(newContactFirst, newContactLast, newContactNumber, newContactEmail))
	{
		document.getElementById("contactAddResult").innerHTML = "invalid Contact";
		return;
	}

	let tmp =
    {
        FirstName: newContactFirst,
        LastName: newContactLast,
        Phone: newContactNumber,
        Email: newContactEmail,
        UserID: UserID
    };

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err.message);
	}

}

function deleteContact()
{
    let tmp =
    {
        FirstName: editContactFirst,
        LastName: editContactLast,
        UserID: UserID
    };

    let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				console.log("Contact has been deleted");
				window.location.href = "search.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
        console.log(err.message);
	}
}

function deleteMessage()
{
	if(confirm("Are you sure you want to delete this contact?")==true)
	{
		deleteContact();
	}
}

function saveContactinfo(i)
{
	editContactFirst = document.getElementById("first_Name" + i);
	editContactLast = document.getElementById("last_Name" + i);
	editContactEmail = document.getElementById("email" + i);
	editContactPhone = document.getElementById("phone" + i);
}

function editContact(id)
{
	let newEditFirst = document.getElementById("firstName");
	let newEditLast = document.getElementById("lastName");
	let newEditEmail = document.getElementById("email");
	let newEditPhone = document.getElementById("phoneNumber");

	if(newEditFirst != "")
	{
		editContactFirst = newEditFirst + id;
	}

	if(newEditLast != "")
	{
		editContactLast = newEditLast + id;
	}

	if(newEditEmail != "")
	{
		editContactEmail = newEditEmail + id;
	}

	if(newEditPhone != "")
	{
		editContactPhone = newEditPhone + id;
	}

	let tmp = {
		Phone: editContactPhone,
		Email: editContactEmail,
		newFirstName: editContactFirst,
		newLastName: editContactLast,
		ID: id
	}

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
		xhr.onreadystatechange = function () {
			if(this.readyState == 4 && this.status == 200) {
				console.log("Contact has been updated");
				window.location.href = "search.html";
			}
		};
		xhr.send(jsonPayload);
	}	catch (err) {
		console.log(err.message);
	}

}

function loadContacts()
{
	let tmp =
	{
		search: "",
		UserID: UserID
	};

	let jsonPayload = JSON.stringify(tmp);
	const index = []

	let url = urlBase + '/SearchContacts.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.error){
					console.log(jsonObject.error);
					return;
				}
				let text = "<table border='1'>"
				for(let i = 0; i < jsonObject.results.length; i++)
				{
					index[i] = jsonObject.results[i].ID
					text += "<tr id='row" + i + "'>"
					text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
										text += "<td><button type='button' id=editdeletebutton class='buttonsEdit' onclick='enableButton();' > Select</button></td>";
					text += "</button>";
					text += "<tr/>";
				}
				text += "</table>"
                document.getElementById("tbody").innerHTML = text;
			}
		};
		xhr.send(jsonPayload);
	} catch (err){
		console.log(err.message);
	}

}

function searchContact()
{
	const srch = document.getElementById("searchName").value;
	const firstandlast = srch.toUpperCase().split(' ');
	const table = document.getElementById("contacts");
	const tr = table.getElementsByTagName("tr");

	for(let i = 0; i < tr.length; i++)
	{
		const td_fn = tr[i].getElementsByTagName("td")[0];
		const td_ln = tr[i].getElementsByTagName("td")[1];

		if(td_fn && td_ln)
		{
			const txtValue_fn = td_fn.textContent || td_fn.innerText;
			const txtValue_ln = td_ln.textContent || td_ln.innerTextl;
			tr[i].style.display = "none";

			for(selection of firstandlast)
			{
				if(txtValue_fn.toUpperCase().indexOf(selection) > -1)
				{
					tr[i].style.display = "";
				}
				if(txtValue_ln.toUpperCase().indexOf(selection) > -1)
				{
					tr[i].style.display = "";
				}
			}
		}
	}
	let firstNameVal = document.getElementById("firstName").value;
	firstNameVal = firstNameVal + FirstName;
	document.getElementById("firstName").value = firstNameVal;
}

function validateLogin(Login, Password)
{
	if(Login == "")
	{
		console.log("Login is blank.");
		return true;
	}

	if(Password == "")
	{
		console.log("Password is blank.");
		return true;
	}
}
function validateSignUp(FirstName, LastName, signUpName, signUpPassword)
{
	var regex = /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)(?=[^!#%]*[!#%])[A-Za-z0-9!#%]{8,32}$/;

	if(FirstName == "")
	{
		console.log("First name is blank.");
		return true;
	}

	if(LastName == "")
	{
		console.log("Last name is blank.");
		return true;
	}

	if(signUpName == "")
	{
		console.log("Username is blank.");
		return true;
	}

	if(signUpPassword == "")
	{
		console.log("Password is blank");
		return true;
	}

	if(regex.test(signUpPassword) == false)
	{
		console.log("Password is invalid.");
		return true;
	}

	return false;

}

function validateAddContract(FirstName, LastName, phoneNumber, emailAddress)
{
	var regexPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

	var regexEmail = /.*@[a-z0-9.-]*/i;

	if(FirstName == "")
	{
		console.log("First name is blank.");
		return true;
	}

	if(LastName == "")
	{
		console.log("Last name is blank.");
		return true;
	}

	if(phoneNumber == "")
	{
		console.log("Phone number is blank.");
		return true;
	}
	if(regexPhone.test(phoneNumber) == false)
	{
		console.log("Phone number is invalid.");
		return true;
	}

	if(emailAddress == "")
	{
		console.log("Email is blank");
		return true;
	}

	if(regexEmail.test(emailAddress) == false)
	{
		console.log("Email is invalid.");
		return true;
	}

	return false;
}
// Updated
