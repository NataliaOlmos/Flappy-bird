//config
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
//ctx.fillRect(0,0,500,500)

//globals
let gravity = .98
let interval
let frames = 0 
let images = {
    bg: "https://i.imgur.com/eNytwgA.png",
    bird: "https://i.imgur.com/nnOXDvk.png",
    pipe1: "https://i.imgur.com/YaHT4GQ.png",
    pipe2: "https://i.imgur.com/t7nP5Bv.png",
    floor: "https://i.imgur.com/KovnIuV.png"
}

//NEW
let keys = {}//para la detección de teclas(listeners)
let pipes = []
//classes
class GameObject{
    constructor(config ={}){
        this.x = config.x || 0
        this.y = config.y || 0
        this.width = config.width || canvas.width
        this.height = config.height || canvas.height - 80
        this.img = new Image()
        this.img.src = config.image || images.bg    
    }
    draw = () =>{
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    isTouching = (item) => {
        return    (this.x < item.x + item.width) &&
                    (this.x + this.width > item.x) &&
                    (this.y < item.y +item.height) &&
                    (this.y + this.height > item.y);
    }
}

//intances
let bg = new GameObject()
let floor = new GameObject({
    y:canvas.height - 80,
    height: 80,
    image: images.floor
})
let bird = new GameObject({
    x:150,
    y:200,
    width:40,
    height:30,
    image: images.bird
})

//mods
bird.vy = 0
bird.jumpStrength = 3

bird.move = function () {
    if (this.y < 50) return
    if (keys[32] || keys[38]) { //datos de la izquierda del objeto
        this.y-- //levantarlo dl piso un poco
        this.vy = 0
        this.vy += -this.jumpStrength * 2
    }
}

bird.draw = function (){
    //NEW
    this.move()

    if((this.y + this.height) < floor.y){
        this.y += this.vy
        this.vy += gravity //aceleración
    } else {
        this.vy = 0
        this.y = floor.y - this.height
    }
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)

}

bg.draw = function (){
    if (this.x > canvas.width) this.x = 0
    this.x += .2
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    ctx.drawImage(this.img, this.x - this.width, this.y, this.width, this.height)
}



floor.draw = function ()  {
    if((this.x + this.width) < 0){
        this.x = 0
    }
    this.x-= 3
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    //dónde va el segundo
    ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)

}

//main functions
let start = () => interval = setInterval(update, 1000/60)
function update(){
    ctx.clearRect(0,0, canvas.width, canvas.height)
    frames++
    console.log(frames)
    bg.draw()
    floor.draw()
    bird.draw()
    //generate and draw pipes
    if(frames%200===0) generatePipes()  //espaciado
    drawPipes()
    //si no está en update no está
    checkCollition()
}
function stop(){
    clearInterval(interval)
}//create pause, stop, partial stop(bg, flappy)


//aux functions


//EL CORAZÓN DEL JUEGO:
function generatePipes(){
    //1.Generar la de arriba
    //2.Generar la de abajo
    //3.Deben permitir el paso de flappy --((alturaTotal-gap) - random = pipe2)
    let gap= 150
    let minHeight= 80
    let randomHeight = Math.floor(
        Math.random() * (canvas.height - floor.height - gap - minHeight) + minHeight)
    let height2 = (canvas.height - floor.height - randomHeight -gap)
    let pipe1 = new GameObject({
        x:canvas.width-100,
        y:0,
        width:80,
        height:randomHeight,
        image:images.pipe1
    })
    pipes.push(pipe1)
    let pipe2 = new GameObject({
        x:canvas.width-100,
        y:randomHeight+gap,
        width:100,
        height:height2,
        image:images.pipe2
   })
   pipes.push(pipe2)
}

function drawPipes(){
    pipes.forEach(pipe=>{
        pipe.x--
        pipe.draw()
})
}

function checkCollition(){
    pipes.forEach(pipe=>{
        if(pipe.isTouching(bird)) stop()
    })
}
//listeners
addEventListener('keydown', e =>{  //guardamos en tiempo real la tecla que se presiona
    keys[e.keyCode]= true //keys = {32:true}
})

addEventListener('keyup', e =>{
    keys[e.keyCode] = false // keys = {...state,32:false}
})

setTimeout(start,3000)