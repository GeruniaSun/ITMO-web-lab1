import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;

public class Response {
    private final int x;
    private final float y;
    private final int r;
    private final String currentTime;
    private final long executionStart;
    private final String hit;

    private static final HashSet<Integer> CORRECT_X =
            new HashSet<>(List.of(-4, -3, -2, -1, 0, 1, 2, 3, 4));
    private static final HashSet<Integer> CORRECT_R =
            new HashSet<>(List.of(1, 2, 3, 4, 5));

    public Response(Request request) {
        if (!CORRECT_X.contains(request.x()) || !CORRECT_R.contains(request.r())
                || request.y() < -3 || request.y() > 3) throw new IllegalArgumentException("Wrong parameters!");
        this.x = request.x();
        this.y = request.y();
        this.r = request.r();
        this.currentTime = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                .format(LocalDateTime.now());
        this.executionStart = System.currentTimeMillis();
        this.hit = Calculator.calcHit(request.x(), request.y(), request.r())? "hit!": "miss";
    }

    public static String badResponse(String state, String message) {
        return """
                HTTP/1.1 %s
                Content-Type: text/plain
                Content-Length: %d

                %s
                """.formatted(state, message.getBytes(StandardCharsets.UTF_8).length, message);
    }

    public long getExecutionStart() {
        return executionStart;
    }

    public String getCurrentTime() {
        return currentTime;
    }

    public int getX() {
        return x;
    }

    public float getY() {
        return y;
    }

    public int getR() {
        return r;
    }

    public String getHit() {
        return hit;
    }

    @Override
    public String toString() {
        return "Response{" +
                "x=" + x +
                ", y=" + y +
                ", r=" + r +
                ", currentTime='" + currentTime + '\'' +
                ", executionStart=" + executionStart +
                ", hit=" + hit +
                '}';
    }
}
