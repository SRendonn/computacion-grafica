/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Math;

import Scene.Material;
import Scene.Shader;
import Scene.Colour;


/**
 *
 * @author User
 */
public class Triangle implements Intersectable  {
    /** Vertex 1 */
    Point v1;
    /** Vertex 2 */
    Point v2;
    /** Vertex 3 */
    Point v3;
    
    /** Parameter a in the plane equation */
    double a;
    /** Parameter b in the plane equation */
    double b;
    /** Parameter c in the plane equation */
    double c;
    /** Parameter d in the plane equation */
    double d;

    /** Normal vector of this triangle */
    Vector4 normal;
    
    /** Material of the triangle */
    Material material;

    /**
     * Construct a Triangle given the three vertices that form it.
     * @param v1 first vertex
     * @param v2 second vertex
     * @param v3 third vertex
     */
    public Triangle(Point v1, Point v2, Point v3, Material material) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.material = material;
        
        Vector4 vec1 = new Vector4(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
        Vector4 vec2 = new Vector4(v3.x - v1.x, v3.y - v1.y, v3.z - v1.z);
        normal = Vector4.crossProduct(vec1, vec2);
        normal.normalize();
        a = normal.getX();
        b = normal.getY();
        c = normal.getZ();
        d = -(a * v1.x + b * v1.y + c * v1.z);
    }

    public Triangle(Point v1, Point v2, Point v3) {
        this(v1, v2, v3, new Material());
    }
    
    
    /**
     * Returns the solution intersecting this triangle with a given ray
     * @param ray Ray to intersect the triangle with
     * @return solutions to the ray-triangle intersection.
     */
    @Override
    public Solutions intersect(Ray ray) {
        Solutions solution = new Solutions(0, 0, 0);

        double [][] coef = new double[3][3];        
        double [] constants = new double[3];
        
        Point p0 = ray.p0;
        Vector4 u = ray.u;
        
        // Create the matrix to solve the system
        coef[0][0] = u.getX();
        coef[0][1] = v1.x - v2.x;
        coef[0][2] = v1.x - v3.x;
        constants[0] = v1.x - p0.x;
        
        coef[1][0] = u.getY();
        coef[1][1] = v1.y - v2.y;
        coef[1][2] = v1.y - v3.y;
        constants[1] = v1.y - p0.y;
        
        coef[2][0] = u.getZ();
        coef[2][1] = v1.z - v2.z;
        coef[2][2] = v1.z - v3.z;
        constants[2] = v1.z - p0.z;
        
        ThreeByThreeSystem tbts = new ThreeByThreeSystem(coef, constants);
        double determinant = tbts.getDeterminant();
        
        // The system has no solution.
        // The ray is parallel to the triangle 
        if(determinant == 0) {
            return solution;
        }
        
        double [] values = tbts.computeSystem();
        double s = values[0];
        double beta = values[1];
        double gamma = values[2];
        double alpha = 1 - beta - gamma;
        
        // Theck whether the ray intersects the ray
        if (0 <= alpha && alpha <= 1 &&
            0 <= beta && beta <= 1 &&
            0 <= gamma && gamma <= 1) {
            solution = new Solutions(1, s, 0);
        }
        
        return solution;
    }
    
    /**
     * Returns the material of this triangle
     * @return material of this triangle
     */
    @Override
    public Material getMaterial() {
        return material;
    }
    
    /**
     * Set the material of this triangle
     * @param material Material of this triangle
     */
    public void setMaterial(Material material) {
        this.material = material;
    }
    
    /**
     * Calls the shader at the point of intersection
     * @param ray Ray that intersects this triangle
     * @param minT Value of the parameter at the intersection
     * @return Color of this triangle at the intersection
     */
    @Override
    public Colour callShader(Ray ray, double minT) {
        Point point = ray.evaluate(minT);
        //UVCoordinates uvCoordinates = computeUV(point);
        return Shader.computeColor(point, normal, material);        
    }
    
    /**
     * Returns the normal of this triangle
     * @return Normal of this triangle
     */
    public Vector4 computeNormal(Point p) {
        return normal;
    }
    
    /*
    public UVCoordinates computeUV(Point p) {
        return new UVCoordinates(0, 0);
        
    }
    */
    
    @Override
    public String toString() {
        return "Triangle{" + "v1=" + v1 + ", v2=" + v2 + ", v3=" + v3 + ", a=" + a + ", b=" + b + ", c=" + c + ", d=" + d + '}';
    }

    
    public static void main(String [] args) {
        Point p1 = new Point(-1, -1, -5);
        Point p2 = new Point(+3, -1, -5);
        Point p3 = new Point(-1, +3, -5);
        Ray ray1 = new Ray(new Point(0, 0, 0), new Vector4(0, 0, -1));
        Ray ray2 = new Ray(new Point(5, 5, 0), new Vector4(0, 0, -1));
        Ray ray3 = new Ray(new Point(-5, 0, 0), new Vector4(1, 0, 0));
        Triangle triangle = new Triangle(p1, p2, p3);
        Solutions solution = triangle.intersect(ray3);
        System.out.println("Soluciones: " + solution.numSolutions + " Intersección: " + ray3.evaluate(solution.t1));
    }
    
}
