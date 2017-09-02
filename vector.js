//Lo usamos para saber donde esta todo en el tablero
function Vector(x, y){ //recibe las coordenadas
    this.x = +x; //Usamos el operador unario para asegurarnos de que el contenido es un numero y no un string
    this.y = +y; //Usamos el operador unario para asegurarnos de que el contenido es un numero y no un string

}

Vector.prototype.plus = function(otherVector){
    
    return new Vector(this.x + +otherVector.x, this.y + +otherVector.y)
    //Creamos un vector nuevo con la suma de los 2
 
}

Vector.prototype.times = function(factorMultiplication){

    return new Vector(this.x * factorMultiplication, this.y * factorMultiplication)

}