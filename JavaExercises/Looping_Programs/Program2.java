package NeuroFleetX.JavaExercises.Looping_Programs;
// Program2.java
// Find the sum of first N natural numbers

import java.util.Scanner;

public class Program2 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();

        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }

        System.out.println("Sum = " + sum);
        sc.close();
    }
}
