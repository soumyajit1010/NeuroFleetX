package NeuroFleetX.JavaExercises.Conditional_Programs;// Program1.java
// Check if a number is even or odd

import java.util.Scanner;

public class Program1 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int num = sc.nextInt();

        if (num % 2 == 0)
            System.out.println(num + " is Even");
        else
            System.out.println(num + " is Odd");

        sc.close();
    }
}
