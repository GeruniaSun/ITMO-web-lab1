public class Calculator {
    public static boolean calcHit(int x, float y, int r){
        if (x > 0 && y < 0) return false;
        else if (x >= 0 && y >= 0) return y <= (float) r/2 && x <= r;
        else if (x < 0 && y >= 0) return y <= x + (float) r/2;
        else return x * x + y * y <= (float) (r * r) / 4;
    }
}
