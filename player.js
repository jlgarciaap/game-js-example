const playerSpeed = 6;
const gravity = 28;
const jumpSpeed = 16;

const audioGameOver = new Audio('./gameOver.wav')

function Player(initialPosition){
    this.pos = initialPosition.plus(new Vector(0,-0.7));
    this.size = new Vector(0.9,1.7); //Para asegurarnos de que este apoyado en el suelo seria el 1.7 - 0.7 del pos de arriba
                                    //Es decir todo depende su posicion inicial y el tamaño al ponerl 1.5 para que sea mas alto..
    this.speed = new Vector(0,0)//Velocidad inicial

}

Player.prototype.type = 'player';

Player.prototype.moxeX = function (step,level,keys){
    this.speed.x = 0;
    if(keys.left) this.speed.x -= playerSpeed;
    if(keys.right) this.speed.x += playerSpeed;
    let motion = new Vector(this.speed.x * step,0);
    let newPosition = this.pos.plus(motion);

    let obstacle = level.obstacleAt(newPosition,this.size);
    if (obstacle) {
        level.playerTouched(obstacle);
    } else {
    this.pos = newPosition;
    }
}

Player.prototype.moxeY = function (step,level,keys){
    this.speed.y += step * gravity; //Aqui o saltamos o no por eso mezclamos el step y la gravedad
    let motion = new Vector(0,this.speed.y * step);
    let newPosition = this.pos.plus(motion);

    let obstacle = level.obstacleAt(newPosition,this.size);
    if (obstacle) {
        level.playerTouched(obstacle);
        if (keys.up && this.speed.y > 0) this.speed.y = -jumpSpeed;
        else this.speed.y = 0;
    } else {
     this.pos = newPosition;
    }
    
}


Player.prototype.act = function(step, level, keysPressed){
    //Como primero se mueve y luego se pinta nos da igual el orden y que esten separados
    this.moxeX(step,level,keysPressed)
    this.moxeY(step,level,keysPressed)

    let otherActor = level.actorAt(this);//Pasamos el actor nuestro osea el player
    if (otherActor) level.playerTouched(otherActor.type, otherActor)
   
    if(level.status === 'lost'){
        audioGameOver.play()
        this.pos.y -= step;
        this.size.y -= step;
    }
}

