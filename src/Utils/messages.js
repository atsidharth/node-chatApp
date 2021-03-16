const generateMsg =(text,username)=>{
    return{
        text,
        createdAt: new Date().getTime(),
        username
    }
}

const generateLocMsg = (url,username) =>{
   return{
    url,
    createdAt: new Date().getTime(),
    username      
   } 
}

module.exports = {
    generateMsg,
    generateLocMsg
}    