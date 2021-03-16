const users = []

const addUser = ({id, username, room}) =>{

    username = username.toLowerCase().trim()
    room = room.toLowerCase().trim()

    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    const duplicateUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(duplicateUser){
        return {
            error: 'Username is in user!'
        }
    }

    const user = {id,username,room}
    users.push(user)
    return { user }
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) =>{
    const user = users.find((user)=>{
        return user.id === id
    })
    return user
}

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    const roomUsers = users.filter((user)=>{
        return user.room == room
    })
    return roomUsers
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}