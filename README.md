# aframe-gravr-component
A profile menu for the [A-Frame](https://aframe.io) component of gravr.io (under construction) 

# gravr
A Globally Recognized Avatar for VR on the web


Like Automattics [Gravatar API](https://www.gravatar.com), gravr.io (under construction) will give you the possibility to register via email and create a VR profile with multiple presets of virtual enviroment setups to quickly adjust your VR environment to your (real) local environment.


A server request with give your app a JSON file that lists your user data and VR presets, so you can easily adjust your VR setup if you are squeezed into a seat on an airplane or lounging on your couch.


---


##Considerations:
Avatars in VR shouldn't only be a gymmicky mesh reconstruction of ourselves, like [Oculus avatars](http://www.theverge.com/2016/10/6/13177082/oculus-rift-avatars-vr-virtual-reality/in/12953919). A VR avatar should be seen as a physical representation of ourselves with our comfort and usability in mind and based on a reflection of our real life environment.
User comfort is an important issue in this space, especially since technology still has to catch up with latency and frame-rates. Like we saw at Oculus Connect with the [Guardian System](https://www.youtube.com/watch?v=g95GpyaI1e8&index=10&list=PLL2xVXGs1SP7RjXUBwur43flR7tRcbYLD), we have to make sure the user doesn't get sea sick.


I am focussing on improving VR adaption on the web. With _gravr_ I am giving the user the possibility to create user profiles and carry them from VR experience to VR experience across the device agnostic web.


I released another AFrame component [aframe-shake2show-component](https://github.com/rdub80/aframe-shake2show-component)
in tandem to this project in order to give users of simple Cardboard headsets an additional input. This shake/tap input doesn't require touching the screen and can be triggered while being immersed in VR.


An additional way to trigger an action/function for anyone that doesn't have external inputs, remotes, controllers, bluetooth gadgets or sensors. 


Below are properties that give the user room for customization and feedback - interesting for WebVR developers and UI designers.


---




## Properties


| Property                       | Description                                                    | Default Value |
| ----------------------------   | ------------------------------------------------------------   | ------------- |
| height                         | camera setting for the height of the user                      | 1.6           |
| fov                            | camera setting for field of vision                             | 80            |
| bounds{top,right,bottom,left}  | user defined UI view boundaries                                | 0, 0, 0 ,0    |
| contrast                       | user defined increase of readability by increasing contrast    | 0             |
| magnification                  | user defined increase scale of UI elements                     | 0             |
| blinder                        | vignette/keyhole experience against discomfort                 | 0             |
| blinderColor                   | light or dark vignette                                         | light         |
| fuseDelay                      | user defined gaze click timing                                 | 1500          |




_fov_ will give the user the possibility to adjust the lens distortion of the VR headset.


_bounds_ will provide the WebVR developers important feedback on a comfortable range of their viewers head movement. This will guide the placement and arrangement of UI elements in a smart and inclusive way.


With _fuseDelay_, the user can define how fast and slow gaze triggered clicks get executed.



### Preview Demo


[Demo](http://rolanddubois.com/webvr/gravr-component/)


### Dependencies


[aframe-shake2show-component](https://github.com/rdub80/aframe-shake2show-component)


You need a [camera](https://aframe.io/docs/0.3.0/components/camera.html) component in your scene. 


Your web browser must support the `devicemotion` event for this plugin to work. Shake.js uses built-in feature detection to determine if it can run in your web browser. It will terminate silently on non-supporting browsers.


http://w3c.github.io/deviceorientation/spec-source-orientation.html




