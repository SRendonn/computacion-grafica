---
layout: cover
background: /cover_balls.jpg
---

# Presentación del proyecto

Computación Gráfica - Sebastián Rendón Giraldo


---
layout: center
---
# Introducción

En los últimos años se ha popularizado la creación de exhibiciones virtuales por parte de museos alrededor del mundo, con el fin de <a href="https://doi.org/10.1109/MC.2006.108" target="_blank">permitir a más personas acceder e interactuar con los artículos del museo</a>. Gracias a la mejora en potencia gráfica de los nuevos computadores, es posible realizar este tipo de exhibiciones desde la mayoría de dispositivos, incluyendo exhibiciones con VR y AR. Inspirado por estas exhibiciones y pensado como tributo y recurso educativo, el propósito de este proyecto consiste en realizar una exhibición de este tipo, que muestre la historia de la computación gráfica, desde la década de los 50 hasta el presente.

---
layout: center
---
# Problema
Hay poca información de caracter expositivo sobre la computación gráfica, en especial para un usuario de internet común. Por ende, existe también una carencia de un entorno virtual interactivo donde se pueda conocer la historia de la computación gráfica, que es la razón por la que estos entornos virtuales son posibles en primer lugar.
---
layout: image-left
image: /cranbrook_art_museum_shapeshifters.png
---
# Estado del arte
- Actualmente, la mayoría de los grandes museos contienen exposiciones virtuales, a través del modelado 360, que consiste en la creación de un modelo 3D a partir de fotografías.
- Existen soluciones como <a href="https://matterport.com">Matterpot</a>, que escanean y digitalizan (utilizando WebGL) estas exhibiciones.

<p class="absolute left-8 bottom-2"><a href="https://cranbrookartmuseum.org/exhibition/christy-matson-crossings/">Christy Matson: Crossings - Cranbrook Art Museum</a></p>

---
layout: image-right
image: /xbox_museum.png
---
# Museo de Xbox
El <a href="https://museum.xbox.com/">museo de Xbox</a> consiste en una exhibición virtual compuesta por 6 escenarios diferentes, donde el usuario explora y aprende sobre la historia de Xbox y generar su propio museo personal con los datos de su cuenta.

---
layout: center
---
# Propuesta de solución
Realizar una investigación de los acontecimientos y productos más importantes para la computación gráfica a lo largo de los años. Crear a partir de esta investigación, una exhibición 3D utilizando Three.js, en forma de línea de tiempo que contenga estos acontecimientos y productos. No se planea actualmente una implementación con soporte para VR o AR, pero es una opción que no se descarta en un futuro. Consistiría, por ejemplo, de elementos como:

- 1950: Proyectos SAGE y el lápiz óptico.
- 1980: La era dorada de los videojuegos.
- 1990: La aparición del modelado 3D.
- 2000: La adopción de CGI.