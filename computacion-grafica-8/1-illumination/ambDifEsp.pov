#include "colors.inc"

plane {
	y, -2
	pigment {Pink}	
}

sphere {
    <-3,6,0>, 1
    pigment { Red }
    finish {
      ambient 0.1
      diffuse 0.0
      phong 0.0
      phong_size 0
    }
}

sphere {
    <0,6,0>, 1
    pigment { Red }
    finish {
      ambient 0.0
      diffuse 0.35
      phong 0.0
      phong_size 0
    }
}

sphere {
    <3,6,0>, 1
    pigment { Red }
    finish {
      ambient 0.0
      diffuse 0.0
      phong 0.35
      phong_size 100
    }
}

sphere {
   <0,9,0>, 1
   pigment { Red }
   finish {
     ambient 0.1
     diffuse 0.35
     phong 0.35
     phong_size 100
   }
}


light_source {
    <10, 10, -10>
    color White
}

camera {
	location <0, 9, -10>
	look_at <0, 6, 0>	
}