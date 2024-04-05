package com.example.webchatserver;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;


//this servlets takes room number and return the user active in that chat
@WebServlet(name = "userInroomServlets", value = "/user-Inroom-servlets/*")
public class userInroomServlets extends HttpServlet {


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
        }

    }

    public void destroy() {
    }
}