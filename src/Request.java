public record Request(int x, float y, int r) {
    public static Request fromRaw(String rawRequest) throws IllegalArgumentException {
        var params = rawRequest.split(":");
        return new Request(
                Integer.parseInt((params[1].split(",")[0])),
                Float.parseFloat((params[2].split(",")[0])),
                Integer.parseInt((params[3].replace("}", "").split(",")[0])));
    }

    @Override
    public String toString() {
        return "Request{" +
                "x=" + x +
                ", y=" + y +
                ", r=" + r +
                '}';
    }
}