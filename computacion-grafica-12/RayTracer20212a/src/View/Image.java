/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package View;

import Scene.Colour;
import Scene.Scene;
import Math.Ray;
import Math.Point;

/**
 *
 * @author htrefftz
 */
public class Image {
    int width;
    int height;
    Colour [][] image;

    public Image(int width, int height) {
        this.width = width;
        this.height = height;
        image = new Colour[height][width];
    }
    
    /**
     * Look at the scene from the origin (0, 0, 0) and through a 
 window that is 2 units (width) xIndex 2 units (height) and
 2 units away from the origin
     */
    public void generateImage() {
        Ray ray; Colour color;
        double deltaX = 2d / width;
        double deltaY = 2d / height;
        for(int yIndex = 0; yIndex < height; yIndex++) {
            for(int xIndex = 0; xIndex < width; xIndex++) {
                 Point p1 = new Point(-1 + xIndex * deltaX, 1 - yIndex * deltaY, -2d);
                //Point p1 = new Point(1 - yIndex * deltaY, -1 + xIndex * deltaX, -2d);
                Point p0 = new Point(0, 0, 0);
                ray = new Ray(p0, p1);
                color = Scene.intersectRay(ray); 
                image[yIndex][xIndex] = color;
            }
        }
    }
    
}
