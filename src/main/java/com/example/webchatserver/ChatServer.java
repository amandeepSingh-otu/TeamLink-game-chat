package com.example.webchatserver;


import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


/**
 * This class represents a web socket server, a new connection is created and it receives a roomID as a parameter
 * **/
@ServerEndpoint(value="/ws/{roomID}")
public class    ChatServer {

    // contains a hashmap about rooms and their ids
    public static Map<String, ChatRoom> roomList = new HashMap<String, ChatRoom>();

    // you may add other attributes as you see fit



    @OnOpen
    public void open(@PathParam("roomID") String roomID, Session session) throws IOException, EncodeException {


        String userId=session.getId();
        for (Map.Entry<String, ChatRoom> room : roomList.entrySet()) {
            if(room.getValue().getUsers().size()==0){
                roomList.remove(room.getValue().getCode());
            }
        }
        //check if room already exist or not
        if(roomList.containsKey(roomID)){
            //we are putting user in the room , but they haven't entered the name yet
            roomList.get(roomID).setUserName(userId,"");
        }
        else{
            //room doesnot exist so creating a new room
            roomList.put(roomID,new ChatRoom(roomID,userId));
        }
        //ask user to enter the message to get started
        for(String chat: roomList.get(roomID).messHistory){
            session.getBasicRemote().sendText(chat);
        }
        session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"Enter your UserName below to get started\"}");


    }

    @OnClose
    public void close(Session session) throws IOException, EncodeException {
        String userId = session.getId();
        String roomTobeRemoved="";

        // do things for when the connection closes
        for (Map.Entry<String, ChatRoom> room : roomList.entrySet()) {
            if (room.getValue().inRoom(userId)) {
                String userName = room.getValue().getUserName(userId);
                roomTobeRemoved = room.getValue().getCode();
                for (Session peer : session.getOpenSessions()) {
                    if (room.getValue().inRoom(peer.getId())) {
                            peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"" + userName + " has left the chat\"}");


                    }
                }
                room.getValue().removeUser(userId);
                //if there is no one in room, room is going to be deleted

            }

        }




    }

    @OnMessage
    public void handleMessage(String comm, Session session) throws IOException, EncodeException {
//        example getting unique userID that sent this message
        String userId = session.getId();
        JSONObject jsonmsg = new JSONObject(comm);
        String roomId= (String) jsonmsg.get("roomId");
        String type = (String)  jsonmsg.get("type");
        String message = (String) jsonmsg.get("msg");
        System.out.println(message);

        if(roomList.containsKey(roomId)){
            //if they don't have name this is their first message
            if(Objects.equals(roomList.get(roomId).getUserName(userId), "")){
            for(Session peer: session.getOpenSessions()) {
                roomList.get(roomId).setUserName(userId,message);
                if (roomList.get(roomId).inRoom(peer.getId()) && peer.getId() != userId) {
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"" + message + " has joined the room\"}");
                }

                if (peer.getId() == userId){
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"" + message + ", We glad you are here!\"}");
                }
            }

            }
            //other case it's not their first message, so just send the message to everyOne including them
            else{
                for(Session peer: session.getOpenSessions()) {
                    if (roomList.get(roomId).inRoom(peer.getId())) {
                        peer.getBasicRemote().sendText("{\"type\": \"chat\",\"userName\":\""+roomList.get(roomId).getUserName(userId)+"\", \"message\":\" " + message +"\"}");

                    }
            }
                //adding message history so we can show the new use
                roomList.get(roomId).messHistory.add("{\"type\": \"chat\", \"message\":\""+roomList.get(roomId).getUserName(userId)+" : " + message +"\"}");
        }
        }




    }


}