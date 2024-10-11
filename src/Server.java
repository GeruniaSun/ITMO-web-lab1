import com.fastcgi.FCGIInterface;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
//TODO плашку на y на фронте по значениям
public class Server {
    public static void main(String[] args) {

        var logger = ServerLogger.getLogger("main");

        logger.info("server started!!!!!!!!!!!!!!!!!!!!!!!");
        //var fcgiInterface = new FCGIInterface();

        while (new FCGIInterface().FCGIaccept() >= 0) {
            logger.info("start getting req");
            try {
                logger.info("start trying");

                var requestBody = readRequestBody();
                logger.info("get raw request\n" + requestBody);

                var request = Request.fromRaw(requestBody);
                logger.info("request accepted\n" + request);

                var response = new Response(request);
                logger.info("response created");

                var content = """
                     {
                         "x": "%d",
                         "y": "%f",
                         "r": "%d",
                         "hit": "%s",
                         "currTime": "%s",
                         "execTime": "%s"
                     }""".formatted(response.getX(), response.getY(), response.getR(), response.getHit(),
                        response.getCurrentTime(),
                        String.format( "%.4f",
                                (double) (System.currentTimeMillis() - response.getExecutionStart())/1000));

                var httpResponse = """
                     HTTP/1.1 200 OK
                     Content-Type: application/json
                     Access-Control-Allow-Origin: *
                     Content-Length: %d

                     %s
                     """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
                 System.out.println(httpResponse);

                logger.info("response sent");
                logger.info(response.toString());

            } catch (Exception e) {
                logger.info("error occurred" + e.getMessage());
                System.out.println(Response.badResponse("400 Bad request", e.getMessage()));
                //sendJsonErr(String.format("{\"error\": %s}", e));
            }
        }

        logger.info("server is dead");
    }

    private static String readRequestBody() throws IOException {
        FCGIInterface.request.inStream.fill();
        var contentLength = FCGIInterface.request.inStream.available();
        var buffer = ByteBuffer.allocate(contentLength);
        var readBytes =
                FCGIInterface.request.inStream.read(buffer.array(), 0, contentLength);
        var requestBodyRaw = new byte[readBytes];
        buffer.get(requestBodyRaw);
        buffer.clear();

        return new String(requestBodyRaw, StandardCharsets.UTF_8);
    }

}
