const ACTORS = {
    'o': Coin,
    '@': Player,
    'v' : Lava,
    '=': Lava,
    'v': Lava
};//Tres tipos de lava cada una se gestiona a su forma

const MAX_STEP = 0.05
const gameAudioCoin = new Audio('./coin.wav')
const gameAudioVictory = new Audio('./victory.wav')

function Level(plan){ //es un constructor

    if (!validateLevel(plan)) throw new Error('You need a player and a coin');//Controlamos si el nivel es correcto

    this.width = plan[0].length; //tamaño de uno de los elementos, es decir el ancho
    this.height = plan.length; //tamaño de elementos. Es decir la altura de pantalla
    this.status = null; //El estado del juego
    this.finishDelay = null //Desde que morimos hasta que reinicia. Modificamos la velocidad de FPS

    //Creamos un grid para pintar el juego
    this.grid = [];
    this.actors = []; //Gestionamos los actores 
    //lo hemos creado abajo directamente this.actor = null; 

    plan.forEach(function(line,index) {//Ponemos y porque seria el eje y de nuestro juego es decir cada elemento del array
           let gridLine = []           
           for (let key in line) {
                let x = line[key];//Recorremos cada linea del eje y que contiene cada elemento en el eje x
                                        //Cada key en un array es la posicion de un objeto
                let characterType                       

                let Actor = ACTORS[x]
                //Actor funciona como un constructor
               
                if (Actor) this.actors.push(new Actor(new Vector(key,index), x))

                if (x === 'x') characterType = 'wall'; //Si lo que tenemos en posicion x es igual a X  es un muro
                else if (x === '!') characterType = 'lava';

                gridLine.push(characterType); //Creamos un array con lo que realmente tenemos en esa linea(este seria el eje x)
           } 
        
           this.grid.push(gridLine);//y esa linea la añadimos a otro array que formaria el eje y       
    }, this);

    //Guardamos la referencia a nuestro jugador
    
    //Cogemos el primer elemento como nuestro player
    this.player = this.actors.filter(item => item.type === 'player')[0];
}

//Controlamos si el juego a terminado
Level.prototype.isFinished = function(){
    return (this.status !== null && this.finishDelay < 0 ) //Si se cumple devuelve true si no false
     
}

Level.prototype.animate = function(step, keysPressed){

    if (this.status !== null) this.finishDelay -= step;

    //Con esto controlamos que los pasitos sean de  0.05 siempre
    while(step > 0){
        let thisStep = Math.min(step, MAX_STEP)
        this.actors.forEach(actor => actor.act(thisStep, this, keysPressed));//step,level,y key pressed
        //Para suavizar la animacion damos pasos pequeños de 0.05
        step -= thisStep;
    }


}

function validateLevel(level) {
    //Para que el juego funcione tiene que haber un jugador y una moneda
    //Some Devuelve true si algo en el array cumple la condicion
    return level.some(row => row.indexOf('@') !== -1) && level.some(row => row.indexOf('o') !== -1)
    
}

//Detectar obstaculos
Level.prototype.obstacleAt = function (position, size){
    let xStart = Math.floor(position.x ) //Para detectar colisiones lo que hacemos es detectar el pixel menor mas cercano en x.
    let xEnd = Math.ceil(position.x + size.x) //Para detectar colisiones lo que hacemos es detectar el pixel mayor mas cercano en x. Y con el tamaño para
    //calcular el final de mi posicion
    let yStart = Math.floor(position.y )
    let yEnd = Math.ceil(position.y + size.y)

    if (xStart < 0 || xEnd > this.width || yStart < 0) return 'wall'; //LO hacemos para no salirnos de la pantalla
    if (yEnd > this.height) return 'lava'; //Devolvemos lava como si hubieramos muerto
    
    for (let y = yStart; y < yEnd; y++){ //Solo comprobamos los pixels que nos interesan no todo el mapa
        for (let x = xStart; x < xEnd; x++){
            let fieldType = this.grid[y][x];
            if (fieldType) return fieldType;
        }

    }

}
Level.prototype.playerTouched = function (type, actor) {
    //Controlamos lo que esta tocando el jugador
    if (type === 'lava' & this.status === null){
        this.status = 'lost';
        this.finishDelay = 1; //Tiempo para reiniciar el level y ver como morimos
    } else if(type === 'coin') {
        playAudio('coin')
        this.actors = this.actors.filter(otherActor => otherActor !== actor); //Devolvemos todo lo que sea diferente a mi como objeto unico
        
        if (!remainCoins(this.actors)){
           
            this.finishDelay = 2;
             playAudio('victory')
            this.status = 'won';
            this.finishDelay = 2; //2 segundos de victoria
        }
    }
}

function remainCoins (actors){
    return actors.some(actor => actor.type === 'coin'); //Comprobamos si queda alguna moneda en todo el array de actores
}

function playAudio(sound){
        gameAudioCoin.pause();
        gameAudioVictory.pause()
        gameAudioCoin.currentTime = 0;
        gameAudioVictory.currentTime = 0;
        if (sound === 'coin') gameAudioCoin.play() ;
        else if (sound === 'victory') gameAudioVictory.play();
}

Level.prototype.actorAt = function (actor) {
    let actorTouch;
    this.actors.map(item => {
        if( actor !== item && 
            actor.pos.x + actor.size.x > item.pos.x && //POr la izquierda. Es decir si la posicion  x del actor mas u tamaño
            //(lo que es el actor completo desde su x 0) es mayor que la posicion x del item (es decir su x 0) entonces estamos tocandos
            actor.pos.x < item.pos.x + item.size.x && //Por la derecha
            actor.pos.y + actor.size.y > item.pos.y && //Por arriba
            actor.pos.y < item.pos.y + item.size.y //Por abajo
        ){
            
            actorTouch = item
        }
    })
    
    return actorTouch;
}