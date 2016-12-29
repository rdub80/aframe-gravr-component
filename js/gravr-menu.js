
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
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
			console.log("loop "+this.profileBtns[e].id);
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

	switch(btn.id) {
	    
	    case 'setMagnify':
			console.log("set " + btn.id);

	      break;
	    case 'setContrast':
			console.log("set " + btn.id);

	      break;
	    case 'setFuseDelay':
			console.log("set " + btn.id);

	      break;
	    case 'setFov':
			console.log("set " + btn.id);

	      break;
	    case 'setBlinder':
			if(btn.is('selected')){
				document.querySelector('a-ring[id="keyhole"]').setAttribute('visible', true);
			}else{
				document.querySelector('a-ring[id="keyhole"]').setAttribute('visible', false);
			}

	      break;
	    case 'setUIBounds':
			if(btn.is('selected')){
				document.querySelector('a-entity[id="usrBounds"]').setAttribute('visible', true);
			}else{
				document.querySelector('a-entity[id="usrBounds"]').setAttribute('visible', false);
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
		document.querySelector('a-entity[id="usrBounds"]').setAttribute('visible', false);
	    console.log('close it');

	}

/**
 * gravrcomponent for A-Frame.
 

AFRAME.registerComponent('gravr', {

  	schema: {
  		
  		default: ''
     
  	},

	init: function() {		
	},

	remove: function() {
	}


});*/
/*






*/