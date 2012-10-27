package breakingfree;

import java.io.IOException;
import javax.servlet.http.*;

public class BreakingFreeServlet extends HttpServlet {
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        resp.setContentType("text/plain");
        resp.getWriter().println("Hello, world");
    }
}