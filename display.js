function createElement(type, className){ //Funcion auxiliar que nos ayuda a crear elementos
    //Crear elementos en javaScript
    let element = document.createElement(type);
    
    if (className){
     if (className === 'player') element.className = className +' player::after';
     else element.className = className //Si nos pasan nombre para la clase lo añadimos
    }
    return element

}

const SCALE = 30

function DOMDisplay (parent, level){
    //Tenemos un padre(basandonos en la estructura jerarquica de html)
    this.wrap = parent.appendChild(createElement('div','game')); //Añadimos un hijo a nuestro padre. En este caso un elemento div con un name
    this.level = level;
    //Le pasamos al wrap es decir al div-game la tabla con las clases de style aplicadas gracias al drawBackground
    this.wrap.appendChild(this.drawBackground())
    this.actorLayer = null;
}

//Como hemos visto ptotypes ahora lo cambiamos a protypes

DOMDisplay.prototype.drawBackground = function(){
        let table = createElement('table','background');
        //Podemos asignar propiedades directamente
        table.style.width = this.level.width *SCALE + 'px';//El elemento level que tenemos en app.js con el length de uno de ellos.
        //  Pero no vale solo con eso necesitamos una escala
        //Por cada elemento de array una fila
        //Ahora tenemos ya la proppiedad width del elemeto level calculada, es decir esta en level
        //La tabla sola no nos sirve vamos a poner flas y columnas
       this.level.grid.forEach(function(row) {
           let rowElement = createElement('tr');
           table.appendChild(rowElement); //Añadimos las filas
           rowElement.style.height = SCALE + 'px'
            //Ahora a por las columnas
            row.forEach(type => {
                rowElement.appendChild(createElement('td',type))
            })

       }, this);

       return table;
}

DOMDisplay.prototype.drawActors = function(){
    //Aqui pintamos los actores.
    //Cada actor tiene un wrapper, un elemento HTML que sera un div

    let actorsWrap = createElement('div')
    this.level.actors.map( actor => {

        //Creamos los rectangulos de cada uno, es decir le añadimos otro div
        let actorElement = createElement('div',`actor ${actor.type}`);
        let rect = actorsWrap.appendChild(actorElement);
        rect.style.width = actor.size.x * SCALE + 'px';//Esto es de vector y tiene dos propiedades x e y
        rect.style.height = actor.size.y * SCALE + 'px';
        //Necesitamos tambien las medidas desde el 0.0
        rect.style.left = actor.pos.x * SCALE + 'px';
        rect.style.top = actor.pos.y  *SCALE + 'px';
    })

    return actorsWrap;

}

//NEcesitamos un metodo de ayuda que necesitamos para gestionar los
//elementos dinámicos, los que se mueven es decir los frames

DOMDisplay.prototype.drawFrame = function(){
    //Lo que hacemos es borrar y crear los elementos dinamicos 
    //Que esto pasa infinitamente
    if (this.actorLayer) this.wrap.removeChild(this.actorLayer);
    this.actorLayer = this.wrap.appendChild(this.drawActors());
    //Gestionamos si status tiene algo para gestionar los estados del juego
    this.wrap.className = 'game ' + (this.level.status || '');
    //Siempre que ejecutemos un frame movemos el display
    this.moveDisplay();
}

DOMDisplay.prototype.clear = function(){

    this.wrap.parentNode.removeChild(this.wrap)//Desde el padre me eliminas
}

DOMDisplay.prototype.moveDisplay = function(){
    let width = this.wrap.clientWidth;//this.wrap que es el que tiene todo el juego.Todos los html tienen esa propiedad
    let height = this.wrap.clientHeight;
    //Lo movemos siempre que los margenes sean 1/3 del total
    let margin = width / 3; 

    let left = this.wrap.scrollLeft;
    let right = left + width;
    let top = this.wrap.scrollTop;
    let bottom = top + height;

    let player = this.level.player;
    //Calculamos el centro del jugador
    let playerCenter = player.pos.plus(player.size.times(0.5)).times(SCALE) //Por la scala del juego

    if (playerCenter.x < left + margin) this.wrap.scrollLeft = playerCenter.x - margin;
    else if (playerCenter.x > right - margin) this.wrap.scrollLeft = playerCenter.x + margin - width;//TODO
    if (playerCenter.y < top + margin) this.wrap.scrollTop = playerCenter.y - margin;
    else if (playerCenter.y > bottom - margin) this.wrap.scrollTop = playerCenter.y + margin - height;
}   