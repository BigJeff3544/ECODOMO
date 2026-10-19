import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class Main {

    public static void main(String[] args) throws IOException {

        HttpServer server = HttpServer.create(
            new InetSocketAddress(8080), 0
        );

        server.createContext("/api/contact", exchange -> {

            // Allow our React website to communicate with Java
            exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin",
                "http://localhost:5173"
            );

            exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "POST, OPTIONS"
            );

            exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
            );

            // Handle the browser's CORS preflight request
            if (exchange.getRequestMethod().equals("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
                exchange.close();
                return;
            }

            // Only accept POST requests
            if (!exchange.getRequestMethod().equals("POST")) {
                sendResponse(exchange, 405,
                    "Only POST requests are allowed.");
                return;
            }

            try {
                // Read the information sent by React
                InputStream input = exchange.getRequestBody();
                String formData = new String(
                    input.readAllBytes(),
                    StandardCharsets.UTF_8
                );

                // Convert the submitted fields into a map
                Map<String, String> fields = new HashMap<>();

                for (String pair : formData.split("&")) {
                    String[] parts = pair.split("=", 2);

                    String key = URLDecoder.decode(
                        parts[0], StandardCharsets.UTF_8
                    );

                    String value = parts.length > 1
                        ? URLDecoder.decode(
                            parts[1], StandardCharsets.UTF_8
                        )
                        : "";

                    fields.put(key, value);
                }

                String name = fields.getOrDefault("name", "").trim();
                String email = fields.getOrDefault("email", "").trim();
                String subject = fields.getOrDefault("subject", "").trim();
                String message = fields.getOrDefault("message", "").trim();

                // Basic server-side validation
                if (name.isEmpty() || email.isEmpty()
                        || subject.isEmpty() || message.isEmpty()) {
                    sendResponse(exchange, 400,
                        "Please complete all contact form fields.");
                    return;
                }

                // Process the message on the Java backend
                System.out.println("\n===== NEW CONTACT MESSAGE =====");
                System.out.println("Name: " + name);
                System.out.println("Email: " + email);
                System.out.println("Subject: " + subject);
                System.out.println("Message: " + message);
                System.out.println("===============================\n");

                sendResponse(exchange, 200,
                    "Thank you, " + name
                    + "! Your message was received by our Java backend.");

            } catch (Exception error) {
                error.printStackTrace();

                sendResponse(exchange, 500,
                    "Something went wrong while processing your message.");
            }
        });

        server.start();

        System.out.println("BUILDCORE Java backend is running!");
        System.out.println("Contact API: http://localhost:8080/api/contact");
    }

    private static void sendResponse(
            HttpExchange exchange, int status, String message)
            throws IOException {

        byte[] response = message.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set(
            "Content-Type", "text/plain; charset=UTF-8"
        );

        exchange.sendResponseHeaders(status, response.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(response);
        }
    }
}