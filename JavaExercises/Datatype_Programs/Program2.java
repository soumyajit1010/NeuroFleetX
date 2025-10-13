package NeuroFleetX.JavaExercises.Datatype_Programs;


public class Program2 {
    public static void main(String[] args) {
        int num = 10;
        double convertedNum = num;  // Implicit conversion (int → double)
        System.out.println("Implicit Conversion: int to double = " + convertedNum);

        double value = 9.78;
        int intValue = (int) value;  // Explicit conversion (double → int)
        System.out.println("Explicit Conversion: double to int = " + intValue);
    }
}
