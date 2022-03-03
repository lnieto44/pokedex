//Variaveis
var pokemonesUL = document.getElementById('pokemones');
const formulario = document.querySelector('form');
const siguienteButton = document.getElementById('siguiente');
const previousButton = document.getElementById('anterior');

var Lista_pokemon= [];
var primeraTarjeta = 1;
var porPagina = 12;
var UltimaTarjeta = porPagina;

//Inicialização
inicia();

//Eventos
formulario.addEventListener('submit', event =>{
  event.preventDefault();
  const inputValue = event.target.search.value;
  console.log(inputValue);
  search(inputValue);
});

siguienteButton.addEventListener('click',siguiente);
previousButton.addEventListener('click',anterior);


//Metodos
async function getPokemons() {
  for (let i = primeraTarjeta; i <= UltimaTarjeta; i++) {
    Lista_pokemon.push(await fetchPokemon(i));
  }
  mostrarPokemon();
}

async function fetchPokemon(id) {
  const URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const response = await fetch(URL);
  const pokemon = await response.json();
  return pokemon;
  
}

function obtenerTipos(pokemon) {
  const types = pokemon.types.map((typeInfo) => typeInfo.type.name);
  let spanHtml = ``;
  types.forEach((element) => {
    spanHtml += `<span class="badge badge-primary text-capitalize m-1 p-2 ${element}">${element}</span>`;
  });

  return spanHtml;
}

function isPokemon(pokemon){
  return pokemon == Lista_pokemon;
}

async function search(value){
  pokemonesUL.innerHTML = '';

  if(value == '') {
    Lista_pokemon= [];
    getPokemons();
    mostrarPokemon();
    return
  }

  try{
    const pokemon = await fetchPokemon(value.toLowerCase());
    Lista_pokemon= [];
    Lista_pokemon.push(pokemon);
    mostrarPokemon();
  }catch(e){
    pokemonesUL.innerHTML = `
    <div class="alert alert-danger" role="alert">
      Algo salio mal
    </div>
    `
  }
}


function mostrarPokemon(){
  Lista_pokemon.forEach((pokemon) =>{
      let typesHTML = obtenerTipos(pokemon);
      pokemonesUL.innerHTML += 
      `
        <li class="p-2 m-2">
          <div class="card  border-0 shadow-sm" style="width: 18rem;">
            <div class="card-header">
              <h6 class="card-subtitle mb-2 text-muted">Nº ${pokemon.id}</h6>
            </div>
            <div class="card-body" style="text-align: center">
              <img src="${pokemon.sprites.front_default}">
              <div class="card-body">
                <h5 class="card-tittle text-capitalize">${pokemon.name}</h5>
                ${typesHTML}
              </div>
            </div>
            
        </div> 
        </li>
      `
    });
}
function inicia(){
  pokemonesUL.innerHTML = '';
  Lista_pokemon= [];
  getPokemons();   
}


//Controle da paginação
function siguiente(){
  primeraTarjeta = UltimaTarjeta + 1;
  UltimaTarjeta = UltimaTarjeta + porPagina;

  if(primeraTarjeta > 250){
    return
  }

  inicia();
}
function anterior(){
  primeraTarjeta = primeraTarjeta - porPagina;
  UltimaTarjeta = UltimaTarjeta - porPagina;

  if(primeraTarjeta < 1){
    return
  }
  inicia()
}







