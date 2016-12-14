// setup variables
var buttons = ["yes","no"],
    profileBtns = [],
    userName = "anonymous",
    hash = "",
    profileUrl = "http:\/\/gravr.io",
    heightData = 1.6,
    fovData = 80,
    boundData = [],
    contrastData = 0,
    magnifyData = 0,
    blinderData = 0, 
    blinderColorData = "light", 
    fuseDelayData = 0, 
    collapsed = true, 
    jsonData = {}, 
    gravrProfile = {},
    clearGravr;

// parse data from json feed to come
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

getJSON('/js/sample.json').then(function(data) {
    
    jsonData = data.entry[0];

    //pull main profiles data
    userName = jsonData.displayName;
    hash = jsonData.hash;
    profileUrl = jsonData.profileUrl;

    //push profiles into button array
    for (var key in jsonData.profileData[0]) {
      if (jsonData.profileData[0].hasOwnProperty(key)) {
        profileBtns.push(key);
      }
    }
    console.log(profileBtns[0]);
    //execute user profiles function
    updateGravr(jsonData, profileBtns[0]);

}, function(status) { //error detection....
  console.log('JSON Error');
});


function updateGravr(obj, profile) {

  var gravrProfile = obj.profileData[0];

  for (var key in gravrProfile) {
    if (gravrProfile.hasOwnProperty(key)) {
      if(key === profile){
        heightData = gravrProfile[key][0].height;
        fovData = gravrProfile[key][0].fov;
        boundData = [
                    gravrProfile[key][0].bounds[0].top,
                    gravrProfile[key][0].bounds[0].right,
                    gravrProfile[key][0].bounds[0].bottom,
                    gravrProfile[key][0].bounds[0].left
                    ];
        contrastData = gravrProfile[key][0].contrast;
        magnifyData = gravrProfile[key][0].magnification;
        blinderData = gravrProfile[key][0].blinder;
        blinderColorData = gravrProfile[key][0].blinderColor;
        fuseDelayData = gravrProfile[key][0].fuseDelay;
      }
    }
  }

  console.log(Object.keys(gravrProfile)[0] + 'userName:' + userName + 'heightData:' +heightData + 'fovData:' + fovData);

    //view detail panel

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

    txtUserHeight.setAttribute('bmfont-text','text', 'Your height: '+ heightData + 'meters / '+ feet + 'ft ' + inches + 'in');
    txtFov.setAttribute('bmfont-text','text', 'Your field of vision: '+ fovData + 'degree');
    txtContrast.setAttribute('bmfont-text','text', 'UI Contrast: '+ contrastData*100 + '%');
    txtMagnify.setAttribute('bmfont-text','text', 'UI Magnification: '+ magnifyData*100 + '%');
    txtBlinder.setAttribute('bmfont-text','text', 'Blinder set to: '+ blinderData*100 + '%, color mode: ' + blinderColorData);
    txtFuseDelay.setAttribute('bmfont-text','text', 'Delay time for gaze click: '+ fuseDelayData + 'ms');


}

//  scene.
// Gaining access to the internal three.js scene graph.

//setAttribute helper function
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}


//Component to change to apply profile values on click/fuse.
AFRAME.registerComponent('gravr', {

  schema: {
      trigger: {
          default: 'click'
      }
  },

  init: function () {
    
//    this.gravrInitSetup(); //hard coded menu for now
    this.btnMain = document.querySelector('a-entity[id="gravr"]');
    this.profile = document.querySelector('a-entity[gravr-profile]'); //#mainButton
    this.btnYes = document.querySelector('a-entity[id="yes"]');
    this.btnNo = document.querySelector('a-entity[id="no"]');

    this.btnDefault = document.querySelector('a-entity[id="default"]');
    this.btnAirplane = document.querySelector('a-entity[id="airplane"]');
    this.btnBed = document.querySelector('a-entity[id="bed"]');
    this.btnSpecial = document.querySelector('a-entity[id="special"]');
    this.btnSettingsPanel = document.querySelector('a-entity[id="settings"]');

    this.btnYes.setAttribute('visible', false);
    this.btnNo.setAttribute('visible', false);

    this.profile.addEventListener(this.data.trigger, this.showControls.bind(this));
    this.btnYes.addEventListener(this.data.trigger, this.doGravr.bind(this));
    this.btnNo.addEventListener(this.data.trigger, this.closeGravr.bind(this));

    this.btnDefault.addEventListener(this.data.trigger, this.switchProfile.bind(this));
    this.btnAirplane.addEventListener(this.data.trigger, this.switchProfile.bind(this));
    this.btnBed.addEventListener(this.data.trigger, this.switchProfile.bind(this));
    this.btnSpecial.addEventListener(this.data.trigger, this.switchProfile.bind(this));

    this.btnSettingsPanel.addEventListener(this.data.trigger, this.showPanel.bind(this));
    this.panelShowing = false;

  },

  gravrInitSetup: function(){
    
    console.log("gravr-init-setup");
    var scene = document.querySelector('a-scene[gravr]');

    var gravrUI = document.createElement('a-entity');
    gravrUI.setAttribute("id", "gravr2");
    //gravrUI.setAttribute("shake2show");
    gravrUI.setAttribute('visible', true);
    gravrUI.setAttribute("geometry", "primitive: box; height:0.25; width:0.25; depth:0.05;");
    gravrUI.setAttribute('material', 'color', 'red');
    gravrUI.setAttribute('position', { x: 0, y: 0, z: 0 });

    for (var i = 0; i < buttons.length; i++) {
      var entity = document.createElement('a-entity');
      setAttributes(entity, {
        "id": buttons[i], 
        "geometry": "primitive: box; height:0.15; width:0.15; depth:0.05;"
      });
      entity.setAttribute('material', 'color', 'green');
      entity.setAttribute('position', { x: i*0.25 , y: 1, z: 0 });
      gravrUI.appendChild(entity);
    }

    for (var i = 0; i < profileBtns.length; i++) {
      var entity = document.createElement('a-entity');
      setAttributes(entity, {
        "id": profileBtns[i], 
        "geometry": "primitive: box; height:0.15; width:0.15; depth:0.05;"
      });
      entity.setAttribute('material', 'color', 'pink');
      entity.setAttribute('position', { x: i*0.25 , y: 0.5, z: 0 });
      gravrUI.appendChild(entity);
    }

    scene.appendChild(gravrUI);


    console.log("gravrUI Y "+gravrUI.object3D.getWorldPosition().y)
    console.log("gravrUI x "+gravrUI.object3D.getWorldPosition().x)
    console.log("gravrUI z "+gravrUI.object3D.getWorldPosition().z)

  },


  // time out for gravr module
  hideMenuTimer: function () {
    menuTimer = window.setTimeout(doHideMenu, 2000);
  },

  doHideMenu: function () {

    collapsed = true;

    var gravrModal = document.querySelector('#gravr');  
    this.btnYes.setAttribute('visible', false);
    this.btnNo.setAttribute('visible', false);
    gravrModal.setAttribute('visible', false);

    console.log("That was really slow!" + collapsed);

  },

  clearHideTimer: function () {
    window.clearTimeout(menuTimer);
  },


  showControls: function (evt) {
    if (collapsed) {

        evt.target.emit('gravrover');
        console.log('showControls ' + collapsed);
        this.btnYes.setAttribute('visible', true);
        this.btnNo.setAttribute('visible', true);
        collapsed = false;
        this.btnYes.emit('fadein');
        this.btnNo.emit('fadein');
    
    }

  },
  
  closeGravr: function (evt) {

    if (!collapsed) {
      this.btnYes.emit('fadeout');
      this.btnNo.emit('fadeout');
      
      this.doHideMenu();

    }else{
      console.log("btns are hidden")
    }


  },
  switchProfile: function (evt) {

    this.btnMain.setAttribute('material', 'src', 'url(i/panel-base-'+evt.target.id+'.jpg)');
    updateGravr(jsonData, evt.target.id);

  },
  
  showPanel: function (evt) {

    var settingsPanel = document.querySelector('#settingsPanel');
    var settingsPanelPin = document.querySelector('#settingsPanelPin');

    if(this.panelShowing){
      evt.target.setAttribute('material', 'src', 'url(i/icn_'+evt.target.id+'.jpg)');
      settingsPanel.emit('fadeout');
      settingsPanelPin.emit('fadeout');
      this.panelShowing = true;
    }else{
      evt.target.setAttribute('material', 'src', 'url(i/icn_'+evt.target.id+'_on.jpg)');
      settingsPanel.emit('fadein');
      settingsPanelPin.emit('fadein');
      this.panelShowing = false;
    }

  },

  doGravr: function (evt) {


//set profile data
    var cameraEl = document.querySelector('#gravr-cam');

    cameraEl.setAttribute('camera','userHeight', heightData);
    cameraEl.setAttribute('camera','fov', fovData);
    
    document.querySelector('a-curvedimage[id="light"]').setAttribute('visible', false);
    document.querySelector('a-curvedimage[id="dark"]').setAttribute('visible', false);

    var blinderEl = document.querySelector('a-curvedimage[id="'+blinderColorData+'"]');
    blinderEl.setAttribute('visible', true);
    blinderEl.setAttribute('radius', 1-blinderData);



//adjust test environment


    //see height on height bar

  	var myHeight = document.querySelector('a-box[id="heightBar"]');

  	myHeight.setAttribute('height',heightData);
  	myHeight.setAttribute('position','0.125 '+heightData/2+' -0.005');

	
  }

});