const woobleSpeed = 6; //Velocidad de movimiento de las monedas
const wobbleDistance = 0.08

function Coin(initialPosition){ //Mayusculas por ser constructora
    //Cuando empieza todos los actores tendran una posicion inicial
    this.basePosition = this.pos = initialPosition.plus(new Vector(0.2, 0.1))
    //Inicializamos 2 variables en la misma linea
    //Todos los actores tendran un tamaño
    this.size = new Vector(0.6, 0.6);
    //Efecto de onda o tiemble
    this.wobble = Math.PI * 2 * Math.random(); //Nos da un numero aleatorio entre 0 y 2 PI

}

Coin.prototype.type = 'coin' //tipo de elemento

Coin.prototype.act = function(step){
 
    this.wobble += step * woobleSpeed;
    //Realmente se mueve en circulo pero solo movemos en el eje Y

    let wobblePosition = Math.sin(this.wobble) * wobbleDistance; //Por la distancia que dejamos que se mueva la moneda
    this.pos = this.basePosition.plus(new Vector(0,wobblePosition));
   //NO hacemos que desaparezcan desde aqui.

}