
// create cookie function
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
	var camHeight = 1.6; // default
	var camFov = 80; // default
	var usrBoundTop = 180; // default 
	var usrBoundRight = 180; // default 
	var usrBoundBottom = 180; // default 
	var usrBoundLeft = 180; // default 
	var usrContrast = 0; // default
	var usrMagnify = 0; // default
	var clickDelay = 1000; // default (ms)


// get cookie values if cookie already exists

if( getCookie(c_CamHeight) != "" ){
	
	getCookie(c_CamHeight);
	getCookie(c_CamFov);
	getCookie(c_UsrBoundTop);
	getCookie(c_UsrBoundRight);
	getCookie(c_UsrBoundBottom);
	getCookie(c_UsrBoundLeft);
	getCookie(c_UsrContrast);
	getCookie(c_UsrMagnify);
	getCookie(c_ClickDelay);

} else {

	// here we prompt setup of values
	// later we can connect with the service to get updated data on gravr.io API with user email

	camHeight = 1.8;
	camFov = 90;
	usrBoundTop = 180;
	usrBoundRight = 180;
	usrBoundBottom = 180;
	usrBoundLeft = 180;
	usrContrast = 0.5;
	usrMagnify = 0.5;
	clickDelay = 1000;

	createCookie(c_CamHeight, camHeight);
	createCookie(c_CamFov, camFov);
	createCookie(c_UsrBoundTop, usrBoundTop);
	createCookie(c_UsrBoundRight, usrBoundRight);
	createCookie(c_UsrBoundBottom, usrBoundBottom);
	createCookie(c_UsrBoundLeft, usrBoundLeft);
	createCookie(c_UsrContrast, usrContrast);
	createCookie(c_UsrMagnify, usrMagnify);
	createCookie(c_ClickDelay, clickDelay);

}


// create component

AFRAME.registerComponent('gravr', {
 schema: { type: 'vec3' },
 update: function () {
   var userheight = camHeight;
   var fov = camFov;
   var UIBounds = [-0, 0, 0, -0]; //(top, right, left, bottom)
   var UIContrast = 0; 
   var UIMagnify = 0; 
   var gazeDelay = 1000; //(ms)
   var object3D = this.el.object3D;
   var data = this.data;
   object3D.position.set(data.x, data.y, data.z);
 }
});


// create profile menu

// now 
// 1. read cookie data and button
// 2. make button clickable and associate trigger function to apply gravr values

// later 
// 1. read json feed from gravr profile
// 2. iterate through profile sets building buttons for each preset array


// activate profile menu

// 1. read current camera gaze x y z position
// 2. place gravr profile button on center of view
// 3. fade out is gaze control is not hovering
// 4. make visible on shake - https://github.com/alexgibson/shake.js/
// 5. refresh gaze xyz for new profile button positioning (like 1.)


