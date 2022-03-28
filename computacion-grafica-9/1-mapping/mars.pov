#include "colors.inc"

light_source {
    <10, 10, -10>
    color White
}

sphere {
   <0,0,0>, 3
   normal {
     bump_map {
       jpeg "assets/marsbump1k.jpg"
       map_type 1
       bump_size 20
     }
   }
   pigment { 
     image_map {
       jpeg "assets/mars_1k_color.jpg"
       map_type 1
     }
   }
   finish {
     ambient 0.2
     diffuse 0.5
     phong 0.5
     phong_size 1000
   }
}

camera {
	location <0, 0, -10>
	look_at <0, 0, 0>	
}