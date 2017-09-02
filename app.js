console.log("Ready")
//Usaremos canvas para pintar en el HTML. Un ejemplo básico explicado
/*
<canvas id="myCanvas" width="200" height="100" style="border:1px solid #d3d3d3">

<script>
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");  //Instanciamos el contexto en el que queremos trabajar
ctx.moveTo(0,0); //Posicionamos nuestro contexto en la posicion 0.0 del canvas, es decir esquina superior izquierda
ctx.lineTo(200,100); //Linea desde el width 200 hasta el heigth 100
ctx.stroke(); //Que rellene esa linea

*/
//Gestionamos el movimiento del player, flechas izq,der, arriba
const ARROW_CODES = {
    37: 'left',
    38: 'up',
    39: 'right'
}

let arrows = trackKeys(ARROW_CODES);

function trackKeys(keyCodes){
    let pressedKeys = {}
    function handler(event){
        if (keyCodes.hasOwnProperty(event.keyCode)) {
            //Controlamos cuando tenemos un evento keydown y un keyup
            let downPressed = event.type === 'keydown';
            //Va cambiando el estado el elemento en el diccionario
            pressedKeys[keyCodes[event.keyCode]] = downPressed;
            event.preventDefault()//Previene el uso por defecto de los eventos, como el scroll si no queremos que haga lo normal
        } 
    }
    //Gestionamos eventos que suceden en nuestra web
    addEventListener('keydown',handler); //Escuchamos cuando presionamos y le pasamos un handler que hara algo
    addEventListener('keyup',handler);

    return pressedKeys;

}
//Esta se ejecuta todo el rato
function runAnimation (frameFunction) {
    let lastTime = null;
    function frame(time){
        let stop = false;
        //Time cada cuantos milis ejecutaremos el frame
        if (lastTime !== null){
            //Cuanto pasa de un frame a otro(basico en juegos)
            let timeStep = Math.min(time - lastTime, 100) / 1000;//Se queda con el menor de dos numeros.
                                                            //Con esto hacemos que cada frame tenga intervalos cortos
            stop = frameFunction(timeStep) === false;
        }
        lastTime = time;
        //Funcion de todos los navegadores para repintar la ventana, es decir se llama a si mismo
        if (!stop) requestAnimationFrame(frame);
    }
    //Con esto llamammos la primera vez a la funcion frame y se ejecuta todo el rato hasta que tengamos
    //el stop o el juego se termine
    requestAnimationFrame(frame);    
}

//Para empezar los niveles
function runLevel(level,Display, callback){
    //inicializamos el display
    let display = new Display(document.body, level);
    //Llamamos a runAnimatioin para comenzar
    runAnimation(function(step){
        level.animate(step, arrows)
        display.drawFrame();
        if (level.isFinished()){
            display.clear();
            if(callback) callback(level.status); //Al callback si se lo pasamos le pasamos el level status
            return false; //Si no tenemos nada false
        }
    })
}
//Arrancamos el juego
function runGame(levels, Display){
    function startLevel (levelNumber){
        try { //Controlamos el validateLevel que esta en level.js
         var createdLevel = new Level(levels[levelNumber]); //Es var por el scope let tiene sope de bloque
    } catch (error) {
        console.log(error)
        return alert(error)
    }
    
    runLevel(createdLevel,Display,status =>{
        if (status === 'lost') startLevel(levelNumber)
        else if (levelNumber < levels.length - 1) startLevel(levelNumber + 1)
        else alert("¡¡¡YOU WIN!!!")
    }) 
    }

    startLevel(0);

}
/*
//Pasamos como padre el body
let level = new Level(GAME_LEVELS[0]);

let display = new DOMDisplay(document.body, level)
//display.drawBackground();*/

runGame(GAME_LEVELS, DOMDisplay)
