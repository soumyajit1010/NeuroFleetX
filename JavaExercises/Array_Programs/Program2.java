package NeuroFleetX.JavaExercises.Array_Programs;// Program2.java
// Find the largest element in an array

public class Program2 {
    public static void main(String[] args) {
        int[] arr = {25, 47, 12, 89, 56};
        int max = arr[0];

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max)
                max = arr[i];
        }

        System.out.println("Largest element = " + max);
    }
}
