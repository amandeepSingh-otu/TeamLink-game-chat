package com.example.webchatserver;
import java.io.*;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.apache.commons.lang3.RandomStringUtils;

@WebServlet(name = "roomInfoServlets", value = "/room-info-servlets")
public class roomInfoServlets extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/plain");

        // send the random code as the response's content
        PrintWriter out = response.getWriter();
        String roomName="";
        for(Map.Entry<String,ChatRoom> room : ChatServer.roomList.entrySet()) {
            roomName += (room.getKey() + ",");
        }
        out.println(roomName);

    }

    public void destroy() {
    }
}