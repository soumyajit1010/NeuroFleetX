package NeuroFleetX.JavaExercises.Array_Programs;
// Program3.java
// Calculate the sum of array elements

public class Program3 {
    public static void main(String[] args) {
        int[] arr = {5, 10, 15, 20, 25};
        int sum = 0;

        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }

        System.out.println("Sum of array elements = " + sum);
    }
}
