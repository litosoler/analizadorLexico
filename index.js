let fs = require('fs');
let archivo = fs.readFileSync('programa.txt', 'utf-8');

let state = '';
let token = '';
let tokens = [];
let response;
archivo = deleteSpaces(archivo);
getTokens(archivo);
console.log(response.succes ? tokens : false );




function deleteSpaces(archivo){
    let accumulator = '';
    for( let i = 0; i < archivo.length; i++){
        let caracter = archivo[i]; 
        if( ![' ', '\n', '\r'].includes(caracter) ){
            accumulator += caracter;
        }
    }
    return accumulator;
}

function getTokens(archivo){
    let succes = true;
    for( let i = 0; i < archivo.length; i++){
        const caracter = archivo[i];
        switch (state) {
            case '':
                initialState(caracter);
                break;
            case 'type':
                typeState(caracter);
                break;
            case 'textString':
                textStringState(caracter);
                break;
            case 'id':
                idState(caracter);
                break;
            case 'digit':
                digitState(caracter);
                break;
            default:
                tokens.push('an error occurred');
                succes = false;
                break;
        }
        if(!succes) break;
    }
    response = {
        tokens,
        succes
    }
}

function initialState(caracter){
    if( ['e', 'c'].includes(caracter)){
        state = 'type';
        token = caracter;
    } else if( caracter == '='){
        tokens.push(caracter);
    }else if( caracter == '\'' ){
        state = 'textString';
        token = caracter;
    }else if( caracter.match(/[0-9]/g)){
        state = 'digit';
        token = caracter;
    }else if(caracter.match(/[A-Za-z]/g)){
        state = 'id';
        token = caracter;
    } else {
        state = 'error';
    }
}
function typeState(caracter){
    var regex = /[A-Za-z0-9]/g;
    const options = [
        'e', 'en', 'ent', 'ente', 'enter', 'entero',
        'c', 'ca', 'cad', 'cade', 'caden', 'cadena'
    ]
    const toEvaluate = token + caracter;
    if( options.includes( toEvaluate )){
        if(toEvaluate === 'cadena' || toEvaluate === 'entero'){
            tokens.push(toEvaluate);
            state = '';
            token = '';
        }else{
            token += caracter;
        }
    }else if( caracter.match(regex) ){
        token += caracter;
        state = 'id';
    }else{
        state = 'error';
    }
}

function textStringState(caracter){
    var regex = /[A-Za-z0-9]/g;
    
    if( caracter.match(regex) ){
        token += caracter;
    }else if( caracter = '\'' ){
        tokens.push(token);
        token = '';
        state = '';
    }else{
        state = 'error';
    }
}

function idState(caracter){
    var regex = /[A-Za-z0-9]/g;
    
    if( caracter.match(regex) ){
        token += caracter;
    }else if( caracter == '=' || caracter == ';' ){
        tokens.push(token, caracter);
        token = '';
        state = '';
    }else{
        state = 'error';
    }
}

function digitState(caracter){ 
    if( caracter.match(/[0-9]/g) ){
        token += caracter;
    } else if( caracter.match(/[a-zA-Z]/) ){
        token += caracter;
        state = 'id'; 
    } else if( caracter == '=' || caracter == ';' ){
        tokens.push(token, caracter);
        token = '';
        state = '';
    }else{
        state = 'error';
    }
}