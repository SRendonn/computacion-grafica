#version 3.6;

global_settings {
  assumed_gamma 2.2
}

#include "shapes.inc"
#include "colors.inc"
#include "textures.inc"
#include "metals.inc"

#declare Teapot_Texture = T_Chrome_5E;
#declare Teapot_Orientation = <-110, 20, 0>;

#include "teapot.inc"

camera {
   location  <0.0, 0.0, -10.0>
   angle 55 // direction <0.0, 0.0,  1.0>
   up        <0.0, 1.0,  0.0>
   right x*image_width/image_height
}

light_source { <10.0, 40.0, -30.0> colour White }

/* Floor */
plane {
   y, -8

   texture {
      pigment {
         checker color red 0.0 green 0.0 blue 0.0
                 color red 0.8 green 0.8 blue 0.8
         scale 5
      }
   }
}

/* Back wall */
 plane {
    z, 100
    hollow on
    texture { pigment { color red 0.1 green 0.1 blue 0.3 } }
}
