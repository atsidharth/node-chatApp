const socket = io()

const $message = document.querySelector('#msg-form')
const $messageFormInput = $message.querySelector('input')
const $messageFormButton = $message.querySelector('button')
const $locationButton = document.querySelector('#shareLoc')
const $messages = document.querySelector('#messages')


const messageTemplate = document.querySelector('#msg-template').innerHTML
const locationTemplate = document.querySelector('#loc-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix : true})


socket.on('locationMsg',(urlObj)=>{
    console.log(urlObj)
    const html = Mustache.render(locationTemplate,{
        locationUrl: urlObj.url,
        createdAt: moment(urlObj.createdAt).format('h:m a'),
        user: urlObj.username
    })
    $messages.insertAdjacentHTML('beforeend',html)
   
})


socket.on('message',(msg)=>{                // called from server
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:m a'),
        user: msg.username
    })
    $messages.insertAdjacentHTML('beforeend',html)
   
})

$message.addEventListener('submit',(e)=>{       //called from browser
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const data = e.target.elements.msg.value
 
    socket.emit('sendMesage', data, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message delivered.')
    })
})


$locationButton.addEventListener('click',()=>{
    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Geolaction not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        const location = {latitude:position.coords.latitude,longitude:position.coords.longitude}
         socket.emit('sendLocation',location,(error)=>{
            $locationButton.removeAttribute('disabled') 
            if(error){
                return console.log(error)
            }
            console.log('Location shared.')
         })
    })
})

socket.on('roomData',({room, users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join',{username, room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})