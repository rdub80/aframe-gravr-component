// parse data from json feed to come

var heightData = 1.85;
var fovData = 80;
var contrastData = 0;
var magnifyData = 0;


//Component to change to apply profile values on click/fuse.
AFRAME.registerComponent('gravr-profile', {

  schema: {
      trigger: {
          default: 'click'
      }
  },

  init: function () {

    var scene = document.querySelector('a-scene');

    this.btnYes = document.querySelector('a-entity[id="yes"]');
    this.btnNo = document.querySelector('a-entity[id="no"]');

    this.btnYes.setAttribute('visible', false);
    this.btnNo.setAttribute('visible', false);
    this.collapsed = true;

    this.el.addEventListener(this.data.trigger, this.showControls.bind(this));
    
    this.btnYes.addEventListener(this.data.trigger, this.doGravr.bind(this));

    this.btnNo.addEventListener(this.data.trigger, this.closeGravr.bind(this));
  },

  showControls: function (evt) {
  	console.log('openGravr'+this.collapsed);

    if (this.collapsed) {
        console.log('showControls'+ this.btnYes.getAttribute('visible'));
        this.btnYes.setAttribute('visible', true);
        this.btnNo.setAttribute('visible', true);
        this.collapsed = false;
    }

  },
  
  closeGravr: function (evt) {

    var gravrModal = document.querySelector('a-entity[id="gravr"]');
    
    this.btnYes.setAttribute('visible', false);
    this.btnNo.setAttribute('visible', false);    

	this.collapsed = true; //have to fix the collapse expand menu

    setTimeout(function(){
	    if (gravrModal.getAttribute('visible') === true) {
	        this.collapsed = true;
		    gravrModal.setAttribute('visible', false);
	        console.log('closeGravr'+this.collapsed);
	    }     
    }, 1500);

  },
  
  doGravr: function (evt) {

    var COLORS = ['red', 'green', 'blue'];
      
    var randomIndex = Math.floor(Math.random() * COLORS.length);
      
    this.btnYes.setAttribute('material', 'color', COLORS[randomIndex]);
    this.btnNo.setAttribute('material', 'color', COLORS[randomIndex]);

//set profile data

	var cameraEl = document.querySelector('a-entity[camera]');

    cameraEl.setAttribute('camera','userHeight', heightData);
    cameraEl.setAttribute('camera','fov', fovData);


//adjust test environment
	
	var myHeight = document.querySelector('a-box[id="heightBar"]');


	myHeight.setAttribute('height',heightData);
	myHeight.setAttribute('position','0.125 '+heightData/2+' -0.005');

	var txtUserHeight = document.querySelector('a-entity[id="userHeight"]');
	var txtFov = document.querySelector('a-entity[id="fov"]');
	var txtContrast = document.querySelector('a-entity[id="contrast"]');
	var txtMagnify = document.querySelector('a-entity[id="magnify"]');

    var inches = (heightData*100*0.393700787).toFixed(0);
    var feet = Math.floor(inches / 12);
    inches %= 12;

    txtUserHeight.setAttribute('bmfont-text','text', 'Your height: '+ heightData + 'meters / '+ feet + 'ft ' + inches + 'in');
    txtFov.setAttribute('bmfont-text','text', 'Your field of vision: '+ fovData + 'degree');
    txtContrast.setAttribute('bmfont-text','text', 'UI Contrast: '+ contrastData*100 + '%');
    txtMagnify.setAttribute('bmfont-text','text', 'UI Magnification: '+ magnifyData*100 + '%');

    console.log('doGravr'+cameraEl);
	
  }

});