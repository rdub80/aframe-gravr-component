if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

// setup gravr variable defaults
var userName = "anonymous",
    hash = "",
    profileUrl = "http:\/\/gravr.io",
    profileIcon = "default",
    heightData = 1.6,
    fovData = 80,
    boundData = [],
    contrastData = 0,
    magnifyData = 0,
    blinderData = 0, 
    blinderColorData = "light", 
    fuseDelayData = 0, 
    jsonData = {}, 
    activeProfile = {},
    gravrProfiles = [],
    clearGravr;

// parse data from json feed
var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

getJSON('/js/example.json').then(function(data) {
    
    jsonData = data.entry[0];

    //pull main profiles data
    userName = jsonData.displayName;
    hash = jsonData.hash;
    profileUrl = jsonData.profileUrl;

    //push profiles into button array
    for (var key in jsonData.profileData[0]) {
      if (jsonData.profileData[0].hasOwnProperty(key)) {
        gravrProfiles.push(key);
      }
    }
    //execute default profile
    updateGravr(jsonData, gravrProfiles[0]);

}, function(status) { //error detection....
  	console.log('JSON Error');
});


function updateGravr(obj, profile) {

	var activeProfile = obj.profileData[0];

	for (var key in activeProfile) {
		if (activeProfile.hasOwnProperty(key)) {
			if(key === profile){
				profileIcon = activeProfile[key][0].icon;
				heightData = activeProfile[key][0].height;
				fovData = activeProfile[key][0].fov;
				boundData = [
							activeProfile[key][0].bounds[0].top,
				        	activeProfile[key][0].bounds[0].right,
				        	activeProfile[key][0].bounds[0].bottom,
				        	activeProfile[key][0].bounds[0].left
				        	];
				contrastData = activeProfile[key][0].contrast;
				magnifyData = activeProfile[key][0].magnification;
				blinderData = activeProfile[key][0].blinder;
				blinderColorData = activeProfile[key][0].blinderColor;
				fuseDelayData = activeProfile[key][0].fuseDelay;
			}
		}
	}

    //view detail panel
    var txtProfile = document.querySelector('#profileSelection');
    var txtUserHeight = document.querySelector('#userHeight');
    var txtFov = document.querySelector('#fov');
    var txtContrast = document.querySelector('#contrast');
    var txtMagnify = document.querySelector('#magnify');
    var txtBlinder = document.querySelector('#blinder');
    var txtFuseDelay = document.querySelector('#fuseDelay');

    // calculate height in feet
    var inches = (heightData*100*0.393700787).toFixed(0);
    var feet = Math.floor(inches / 12);
    inches %= 12;

    txtProfile.setAttribute('bmfont-text','text', 'Active Profile: '+ profileIcon);
    txtUserHeight.setAttribute('bmfont-text','text', 'Your height: '+ heightData + 'meters / '+ feet + 'ft ' + inches + 'in');
    txtFov.setAttribute('bmfont-text','text', 'Your field of vision: '+ fovData + 'degree');
    txtContrast.setAttribute('bmfont-text','text', 'UI Contrast: '+ contrastData*100 + '%');
    txtMagnify.setAttribute('bmfont-text','text', 'UI Magnification: '+ magnifyData*100 + '%');
    txtBlinder.setAttribute('bmfont-text','text', 'Blinder set to: '+ blinderData*100 + '%, color mode: ' + blinderColorData);
    txtFuseDelay.setAttribute('bmfont-text','text', 'Delay time for gaze click: '+ fuseDelayData + 'ms');

    applyToSet();
}


/**
 * gravrButton component for A-Frame.
*/ 

AFRAME.registerComponent('gravr-button', {

	schema: {
		trigger: {
			default: 'click'
		},
		prop: {
		 	default: 'opacity'
		},
		over: {
		 	default: '0.75'
		},
		out: {
		 	default: '1.0'
		}
	},

	boundClickHandler: undefined,
	boundMouseEnterHandler: undefined,
	boundMouseLeaveHandler: undefined,

	init: function() {		
		this.boundClickHandler = this.clickHandler.bind(this);
		this.el.addEventListener(this.data.trigger, this.boundClickHandler);

		this.boundMouseEnterHandler = this.mouseEnterHandler.bind(this);
		this.el.addEventListener('mouseenter', this.boundMouseEnterHandler);

		this.boundMouseLeaveHandler = this.mouseLeaveHandler.bind(this);
		this.el.addEventListener('mouseleave', this.boundMouseLeaveHandler);
	},
    clickHandler: function() { 
    	if(this.el.parentElement.is('selected') && !this.el.parentElement.is('tab')){
	    	this.el.parentElement.removeState('selected');
    	}else{
	    	this.el.parentElement.addState('selected');
    	}
    },
    mouseEnterHandler: function() { 
    	this.el.setAttribute('material', this.data.prop, this.data.over);
    	this.el.parentElement.addState('hovering');
    },
    mouseLeaveHandler: function() { 
    	this.el.setAttribute('material', this.data.prop, this.data.out);
    	this.el.parentElement.removeState('hovering');
    },
	remove: function() {
		this.el.removeEventListener('click', this.boundClickHandler);
		this.el.removeEventListener('mouseEnter', this.boundMouseEnterHandler);
		this.el.removeEventListener('mouseLeave', this.boundMouseLeaveHandler);
    	this.el.parentElement.removeState('hovering');
    	this.el.parentElement.removeState('selected');
	}

});



AFRAME.registerComponent('gravr-menu', {

  	init: function () {

		this.btnApply = document.querySelector('a-entity[id="apply"]');
		this.btnApply.addEventListener('stateadded', function (evt) {
			if (evt.detail.state === 'selected') {
	    		console.log('apply');
			}
		});

		this.btnCancel = document.querySelector('a-entity[id="cancel"]');
		this.btnCancel.addEventListener('stateadded', function (evt) {
			if (evt.detail.state === 'selected') {
	    		closeMenu();
			}
		});

		//profile buttons
		this.profileBtns = document.querySelectorAll('a-entity[mixin="profileTab"]');

		for (var e = 0; e < this.profileBtns.length; e++) {

			this.profileBtns[e].addState('tab');
			this.profileBtns[e].addEventListener('stateadded', function (evt) {
				if (evt.detail.state === 'selected') {
					this.setAttribute('material','opacity','1');
					this.firstChild.setAttribute('material', 'src', 'url(i/' + this.id + '_on.png)');
		    		updateTabs(this);
				}
			});
			this.profileBtns[e].addEventListener('stateremoved', function (evt) {
				if (evt.detail.state === 'selected') {
					this.setAttribute('material','opacity','0');
					this.firstChild.setAttribute('material', 'src', 'url(i/' + this.id + '.png)');
				}
			});
		}
		//default selected
		this.profileBtns[this.profileBtns.length-1].addState('selected');
	
		//profile buttons
		this.panelButtons = document.querySelectorAll('a-entity[mixin="panelButton"]');

		for (var e = 0; e < this.panelButtons.length; e++) {
			this.panelButtons[e].addEventListener('stateadded', function (evt) {
				if (evt.detail.state === 'selected') {
					this.firstChild.setAttribute('material', 'src', 'url(i/icn_' + this.id + '_on.png)');
		    		showPanels(this);
				}
			});
			this.panelButtons[e].addEventListener('stateremoved', function (evt) {
				if (evt.detail.state === 'selected') {
					this.firstChild.setAttribute('material', 'src', 'url(i/icn_' + this.id + '.png)');
		    		showPanels(this);				
				}
			});
		}

		//settings buttons
		this.settingsButtons = document.querySelectorAll('a-entity[class="settingsBtn"]');

		for (var e = 0; e < this.settingsButtons.length; e++) {
			this.settingsButtons[e].addEventListener('stateadded', function (evt) {
				if (evt.detail.state === 'selected') {
			    	setValue(this);
				}
			});
			this.settingsButtons[e].addEventListener('stateremoved', function (evt) {
				if (evt.detail.state === 'selected') {
		    		setValue(this);		
				}
			});
		}

	}

});

function updateTabs(tab) {
	var profileTabs = document.querySelectorAll('a-entity[mixin="profileTab"]');	
	for (var e = 0; e < profileTabs.length; e++) {
		if(profileTabs[e] != tab){
			profileTabs[e].removeState('selected');
		}
	}
	if(Object.keys(jsonData).length){ //update profile if json loaded
		updateGravr(jsonData, tab.id);
	}
}

function showPanels(btn) {
	var infoPanel = document.querySelector('a-entity[id="infoPanel"]');	
	var settingsPanel = document.querySelector('a-entity[id="settingsPanel"]');	

	switch(btn.id) {
	    
	    case 'info':

			if(btn.is('selected')){
				infoPanel.setAttribute('visible', true);
			}else{
				infoPanel.setAttribute('visible', false);				
			}

	      break;
	    case 'settings':

			if(btn.is('selected')){
				settingsPanel.setAttribute('visible', true);
			}else{
				settingsPanel.setAttribute('visible', false);				
			}

	      break;
	    case 'voice':

			console.log("toggle " + btn.id);
	}
}



function setValue(btn) {
	console.log("setValue ---" + btn.id);
	var blinder = document.querySelector('a-ring[id="keyhole"]');
	var bounds = document.querySelector('a-entity[id="usrBounds"]');
    var cameraEl = document.querySelector('#gravr-cam');
    var cursor = document.querySelector('#cursor');
    var rotateTimer = document.querySelector('#rotateTimer');

	switch(btn.id) {
	    
	    case 'setMagnify':
			console.log("set " + btn.id);

	    break;
	    case 'setContrast':
			console.log("set " + btn.id);

	    break;
	    case 'setFuseDelay':
			if(btn.is('selected')){
				cursor.setAttribute('cursor','fuseTimeout', fuseDelayData);
				rotateTimer.setAttribute('animation','dur', fuseDelayData);
			}else{
				cursor.setAttribute('cursor','fuseTimeout', 1500);
				rotateTimer.setAttribute('animation','dur', 1500);
			}
		break;
	    case 'setFov':
			if(btn.is('selected')){
				cameraEl.setAttribute('camera','fov', fovData);
			}else{
				cameraEl.setAttribute('camera','fov', 80);
			}

	    break;
	    case 'setBlinder':
			if(btn.is('selected')){
				blinder.setAttribute('visible', true);
			}else{
				blinder.setAttribute('visible', false);
			}

	    break;
	    case 'setUIBounds':
			if(btn.is('selected')){
				bounds.setAttribute('visible', true);
				moveUI(bounds, cameraEl);
			}else{
				bounds.setAttribute('visible', false);
			}
	}
}


function closeMenu() {

	var panelButtons = document.querySelectorAll('a-entity[mixin="panelButton"]');	
	for (var e = 0; e < panelButtons.length; e++) {
		if(panelButtons[e].is('selected')){
			panelButtons[e].removeState('selected');
		}
	}
	var settingsButtons = document.querySelectorAll('a-entity[class="settingsBtn"]');	
	for (var e = 0; e < settingsButtons.length; e++) {
		if(settingsButtons[e].is('selected')){
			settingsButtons[e].removeState('selected');
		}
	}

	document.querySelector('a-entity[id="cancel"]').removeState('selected');
	document.querySelector('a-entity[gravr-menu]').setAttribute('visible', false);
	document.querySelector('a-entity[gravr-menu]').setAttribute('scale', "0.00001 0.00001 0.00001");
	document.querySelector('a-entity[id="usrBounds"]').setAttribute('visible', false);
    console.log('close it');
}

/**/


function applyToSet() {

//set profile data
    var cameraEl = document.querySelector('#gravr-cam');

    cameraEl.setAttribute('camera','userHeight', heightData);
    cameraEl.setAttribute('camera','fov', fovData);
    
    var keyhole = document.querySelector('#keyhole');
    if(blinderData == 0){
	    keyhole.setAttribute('visible', false);
	}else if(blinderData == 0.75){
	    keyhole.setAttribute('visible', true);
	}

    var cursor = document.querySelector('#cursor');
    var rotateTimer = document.querySelector('#rotateTimer');

	cursor.setAttribute('cursor','fuseTimeout', fuseDelayData);
	rotateTimer.setAttribute('animation','dur', fuseDelayData);

//adjust test environment
  	var myHeight = document.querySelector('a-box[id="heightBar"]');

  	myHeight.setAttribute('height',heightData);
  	myHeight.setAttribute('position','0.125 '+heightData/2+' -0.005');

}


function moveUI(boundsEl, cameraEl) {

    var posX =  Math.round(cameraEl.object3D.getWorldPosition().x * 100) / 100;
    var posZ =  Math.round(cameraEl.object3D.getWorldPosition().z * 100) / 100;
    var height =  Math.round(cameraEl.object3D.getWorldPosition().y * 100) / 100;
    var pos = posX + " " + height + " " + posZ;

    console.log("pos: " + pos);
    boundsEl.setAttribute('position', pos );
}





AFRAME.registerComponent('teleport', {

	schema: {
		trigger: {
			default: 'click'
		},
		height: {
		 	default: '1.6'
		},
		rotation: {
		 	default: '0 0 0'
		}
	},

	boundClickHandler: undefined,
	boundMouseEnterHandler: undefined,
	boundMouseLeaveHandler: undefined,

	init: function() {		
		this.boundClickHandler = this.clickHandler.bind(this);
		this.el.addEventListener(this.data.trigger, this.boundClickHandler);

		this.boundMouseEnterHandler = this.mouseEnterHandler.bind(this);
		this.el.addEventListener('mouseenter', this.boundMouseEnterHandler);

		this.boundMouseLeaveHandler = this.mouseLeaveHandler.bind(this);
		this.el.addEventListener('mouseleave', this.boundMouseLeaveHandler);
	},
    clickHandler: function() { 
 
		document.querySelector('a-entity[gravr-menu]').setAttribute('visible', false);
		document.querySelector('a-entity[gravr-menu]').setAttribute('scale', "0.00001 0.00001 0.00001");

		var origCam = document.querySelector('#gravr-cam');
		var camCase1 = document.querySelector('#gravr-cam-case1');
		var camCase2 = document.querySelector('#gravr-cam-case2');
		var camCase3 = document.querySelector('#gravr-cam-case3');
		var uiCase1 = document.querySelector('#ui-case1');
		var uiCase2 = document.querySelector('#ui-case2');
		var uiCase3 = document.querySelector('#ui-case3');

		var kitchen = document.querySelector('#kitchen');
		var bed = document.querySelector('#bed');
		var sofa = document.querySelector('#sofa');

		var init = document.querySelector('#init');

		uiCase1.setAttribute('visible', false);
		uiCase2.setAttribute('visible', false);
		uiCase3.setAttribute('visible', false);

		kitchen.setAttribute('visible', true);
		bed.setAttribute('visible', true);
		sofa.setAttribute('visible', true);

		origCam.setAttribute('camera', 'active', true);

		switch(this.el.id) {
		    
		    case 'kitchen':
				camCase1.setAttribute('camera', 'active', true);
				uiCase1.setAttribute('visible', true);
				uiCase2.setAttribute('visible', false);
				uiCase3.setAttribute('visible', false);

				kitchen.setAttribute('visible', false);
				bed.setAttribute('visible', true);
				sofa.setAttribute('visible', true);
				init.setAttribute('visible', true);

		      break;
		    case 'bed':
				camCase2.setAttribute('camera', 'active', true);
				uiCase1.setAttribute('visible', false);
				uiCase2.setAttribute('visible', true);
				uiCase3.setAttribute('visible', false);

				kitchen.setAttribute('visible', true);
				bed.setAttribute('visible', false);
				sofa.setAttribute('visible', true);
				init.setAttribute('visible', true);

		      break;
		    case 'sofa':
				camCase3.setAttribute('camera', 'active', true);
				uiCase1.setAttribute('visible', false);
				uiCase2.setAttribute('visible', false);
				uiCase3.setAttribute('visible', true);

				kitchen.setAttribute('visible', true);
				bed.setAttribute('visible', true);
				sofa.setAttribute('visible', false);
				init.setAttribute('visible', true);

		      break;
		    case 'init':
				origCam.setAttribute('camera', 'active', true);
				uiCase1.setAttribute('visible', false);
				uiCase2.setAttribute('visible', false);
				uiCase3.setAttribute('visible', false);

				kitchen.setAttribute('visible', true);
				bed.setAttribute('visible', true);
				sofa.setAttribute('visible', true);
				init.setAttribute('visible', false);

		}


    },
    mouseEnterHandler: function() { 
    	this.el.setAttribute('material', 'opacity', '0.75');
    	this.el.addState('hovering');
    },
    mouseLeaveHandler: function() { 
    	this.el.setAttribute('material', 'opacity', '0.25');
    	this.el.removeState('hovering');
    },
	remove: function() {
		this.el.removeEventListener('click', this.boundClickHandler);
		this.el.removeEventListener('mouseEnter', this.boundMouseEnterHandler);
		this.el.removeEventListener('mouseLeave', this.boundMouseLeaveHandler);
    	this.el.removeState('hovering');
    	this.el.removeState('selected');
	}

});




/**
 * gravrcomponent for A-Frame.
*/ 

AFRAME.registerComponent('gravr', {

  	schema: {
  		
  		default: ''
     
  	},

	init: function() {		
	},

	update: function() {

	},

	moveUI: function(newPosition) {
    	var pos = newPosition.x +" 0 "+ newPosition.z;
	    document.querySelector('#usrBounds').setAttribute('position', pos );
	}


});
/*

var scene = document.querySelector('a-scene');
if (scene.hasLoaded) {
  run();
} else {
  scene.addEventListener('loaded', run);
}
function run () {
  var entity = scene.querySelector('a-entity');
  entity.setAttribute('material', 'color', 'red');
}

*/
