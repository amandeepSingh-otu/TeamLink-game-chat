package com.example.webchatserver;
import java.io.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import jakarta.websocket.server.PathParam;
import org.apache.commons.lang3.RandomStringUtils;

@WebServlet(name = "userInroomServlets", value = "/user-Inroom-servlets/*")
public class userInroomServlets extends HttpServlet {

    //static so this set is unique

    /**
     * Method generates unique room codes
     * **/

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String userName="";
        response.setContentType("text/plain");
        String code = request.getPathInfo().substring(1,6);
        if(code!=null && code.length()==5) {
            Map<String, String> users = ChatServer.roomList.get(code).getUsers();
            for (Map.Entry<String, String> user : users.entrySet()) {
                userName += (user.getValue() + ",");
            }
            // send the random code as the response's content
            PrintWriter out = response.getWriter();
            out.println(userName);
        }
        else{
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

    }

    public void destroy() {
    }
}