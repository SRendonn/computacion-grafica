#include "colors.inc"

light_source {
    <5, 5, -5>
    color White
}

sphere {
   <0,0,0>, 3
   normal {
     bump_map {
       jpeg "assets/earthbump1k.jpg"
       map_type 1
       bump_size 50
     }
   }
   pigment { 
     image_map {
       jpeg "assets/earthmap1k.jpg"
       map_type 1
     }
   }
   finish {
     ambient 0.2
     diffuse 0.5
     phong 0.5
     phong_size 1000
   }
   rotate 180*y
}

camera {
	location <0, 0, -10>
	look_at <0, 0, 0>	
}