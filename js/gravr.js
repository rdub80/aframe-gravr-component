
// create cookie function to come...

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}



// get/set cookies for gravr
    var usrName = "anonymous",
    var usrHash = "",
    var usrProfileUrl = "http:\/\/gravr.io",
	var usrHeight = 1.6; // default
	var usrFov = 80; // default
    var usrBoundData = ["0.75","0.75","-0.75","-0.75"],
	var usrContrast = 0; // default
	var usrMagnify = 0; // default
	var usrBlinder = 0; // default
	var usrBlinderColor = "light", 
	var fuseDelay = 1000; // default (ms)


// get cookie values if cookie already exists

if( getCookie(usrHash) != "" ){
	
	getCookie(c_UsrName);
	getCookie(c_UsrHeight);
	getCookie(c_UsrFov);
	getCookie(c_UsrBoundTop);
	getCookie(c_UsrBoundRight);
	getCookie(c_UsrBoundBottom);
	getCookie(c_UsrBoundLeft);
	getCookie(c_UsrContrast);
	getCookie(c_UsrMagnify);
	getCookie(c_UsrBlinder);
	getCookie(c_FuseDelay);

} else {

	// here we prompt setup of values
	// later we can connect with the service to get updated data on gravr.io API with user email

    usrName = "anonymous",
    usrHash = "abcdefghijklmnopqrstuvwxyz1234567890",
    usrProfileUrl = "http:\/\/gravr.io",
	usrHeight = 1.8;
	usrFov = 90; 
    usrBoundData = ["0.75","0.75","-0.75","-0.75"],
	usrContrast = 0; 
	usrMagnify = 0; 
	usrBlinder = 0; 
	usrBlinderColor = "light", 
	fuseDelay = 1000; 

	createCookie(c_UsrHeight, usrHeight);
	createCookie(c_UsrFov, usrFov);
	createCookie(c_UsrBoundData, usrBoundData);
	createCookie(c_UsrContrast, usrContrast);
	createCookie(c_UsrMagnify, usrMagnify);
	createCookie(c_UsrBlinder, usrBlinder);
	createCookie(c_FuseDelay, fuseDelay);

}
