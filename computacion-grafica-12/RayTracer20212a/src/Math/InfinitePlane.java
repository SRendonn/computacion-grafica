/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Math;

import Scene.Material;
import Scene.Colour;
import Scene.Shader; 

/**
 *
 * @author User
 */
public class InfinitePlane implements Intersectable {
    Vector4 normal;
    double distance;
    Material material;
    
    /**
     * This class handles the information for infinite planes
     * @param normal    normal vector of the surface
     * @param distance  d value of the Ax + By + Cz = D equation
     * @param material  material of the plane
     */
    public InfinitePlane(Vector4 normal, double distance, Material material) {
        this.normal = normal;
        normal.normalize();
        this.material = material;
        this.distance = distance;
    }
    
    /**
     * Compute the intersection of the plane and a given ray
     * Three cases:
     * 1. No solution (the plane is parallel to the ray).
     *    In this case return that there are no solutions.
     *    I.E. return new Solutions (0, 0, 0)
     * 
     * 2. The intersecion of the plane is behind the camera (s < 0).
     *    In this case return that there are no solutions.
     *    I.E. return new Solutions (0, 0, 0)
     * 
     * 3. The intersection of the plane is in front of the camera (s > 0).
     *    In this case return one solution (s).
     * 
     * @param ray Ray to intersect the plane with
     * @return A solution. If there are no valid solutions, the first
     *   parameter in the solution (solutionsNumber) must be 0.
     */
    public Solutions intersect(Ray ray) {
        return new Solutions(0, 0, 0);
    }
    
    /**
     * The normal is simply the normal attribute
     * @param p Point to find the normal at. Makes no difference for an 
     * infinite plane.
     * @return normal vector of the infinite plane
     */
    public Vector4 computeNormal(Point p) {
        return normal;
    }
    
    /**
     * Call the shader to compute the color
     * @param ray ray to determine the intersection with the plane
     * @param minT parameter of the ray at the intersection point
     * @return Colour, computed by the shader
     */
    public Colour callShader(Ray ray, double minT) {
        Point p = ray.evaluate(minT);
        return Shader.computeColor(p, normal, material);
    }
    
    /**
     * Returns the material of the plane, to be used by the Shader
     * @return 
     */
    public Material getMaterial() {
        return material;
    }    
        
}
