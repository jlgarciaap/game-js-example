function Lava(initialPosition, characterType){
    this.pos = initialPosition;
    this.size = new Vector(1,1);
    //Tenemos varios tipos de lava
    if(characterType === '=') this.speed = new Vector(2, 0)//Movimiento horizontal
    else if(characterType === '|') this.speed = new Vector(0,2)//Movimiento vertical
    else if(characterType === 'v'){
        this.speed = new Vector(0, 3);
        //Cuando toque el suelo nos interesa que reaparezca en su posicion original
        this.respawnPosition = initialPosition;
    }
}

Lava.prototype.type = 'lava'

//COn todos los actores con el mismo metodo podemos generalizar mogollon como en level.js y el metodo act
Lava.prototype.act = function(step, level){
   //En level realmente recibimos todo el constructor de level(esto se llama desde alli)
    
   let newPosition = this.pos.plus(this.speed.times(step)) //La velocidad siempre por el step
    if (!level.obstacleAt(newPosition, this.size)) this.pos = newPosition;//Si no tenemos obstaculo nos movemos a la nueva posicion
    else if(this.respawnPosition) this.pos = this.respawnPosition;//Si tenemos posicion de reaparicion pues reaparece
    else this.speed = this.speed.times(-1);//Si no date la vuelta, es decir multiplica por -1


}