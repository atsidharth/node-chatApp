const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMsg} = require('./Utils/messages')
const {generateLocMsg} = require('./Utils/messages')
const {addUser, removeUser, getUsersInRoom, getUser} = require('./Utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const pubDir = path.join(__dirname, '../public')

app.use(express.static(pubDir))

io.on('connection',(socket)=>{
 
    socket.on('join',({username, room},callback)=>{
        const {error, user} = addUser({id : socket.id, username, room})

        if(error){
           return callback(error)
        }
        socket.join(user.room)                           // creates a room with websocket
        socket.emit('message',generateMsg('Welcome '+user.username,'Admin'))
        socket.broadcast.to(user.room).emit('message',generateMsg(user.username+' has joined the chat.','Admin'))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMesage',(msg, callback)=>{
       const {room, username} = getUser(socket.id)
       const filter = new Filter()
       if(filter.isProfane(msg)){
            return callback('Bad words not allowed.')
       } console.log(msg)
       io.to(room).emit('message',generateMsg(msg,username))
       callback()
    })

    socket.on('sendLocation',(location,callback)=>{
        const {room, username} = getUser(socket.id)
        io.to(room).emit('locationMsg',generateLocMsg('https://google.com/maps?q='+location.latitude+','+location.longitude, username))
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMsg(user.username+' has left the chat.','Admin'))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })
})


server.listen(port,()=>{
    console.log('Server is up in ',port)
})