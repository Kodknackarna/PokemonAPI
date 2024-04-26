window.addEventListener('load', () : void => {
    console.log('loaded');
    sectionSetup();
    navSetup();
    pokedexSetup();
    //searchPokemon();
});

function sectionSetup() : void {
    const sectionRefs = document.querySelectorAll('.section') as NodeListOf<HTMLElement>;
    sectionRefs.forEach(section => section.classList.add('d-none'));
}

function navSetup() : void {
    const navItemRefs = document.querySelectorAll('.nav-item') as NodeListOf<HTMLElement>;
    navItemRefs.forEach(navItem => {
        navItem.addEventListener('click', (event : MouseEvent) : void => {
            // I HTML : data-id -> i JS/TS : dataset.id
            // data-hund -> dataset.hund
            // data-fix-name -> dataset.fixName
            toggleSectionDisplay((event.target as HTMLElement).dataset.id);
        });
    });
}

function toggleSectionDisplay(section : string | undefined) : void {
    const pokedexSectionRef = document.querySelector('#pokedexSection') as HTMLElement;
    const searchSectionRef = document.querySelector('#searchSection') as HTMLElement;
    const generatorSectionRef = document.querySelector('#generatorSection') as HTMLElement;

    if(section) {
        switch (section) {
            case 'pokedex':
                pokedexSectionRef.classList.remove('d-none');
                searchSectionRef.classList.add('d-none');
                generatorSectionRef.classList.add('d-none');
                break;
            case 'search':
                pokedexSectionRef.classList.add('d-none');
                searchSectionRef.classList.remove('d-none');
                generatorSectionRef.classList.add('d-none');
                break;
            case 'generate':
                pokedexSectionRef.classList.add('d-none');
                searchSectionRef.classList.add('d-none');
                generatorSectionRef.classList.remove('d-none');
                break;
            default:
                console.log('Någonting gick väldigt, väldigt snett...');
        }
    }
}
// const input = document.getElementsByClassName('generatePokemonByType');
// for (let i = 0; i < input.length; i++) {
//     input[i].addEventListener('click', function() => {
//         console.log((input[i] as HTMLElement).id)
//     });
    
// }

const input = document.getElementsByClassName('generatePokemonByType');
for (let i = 0; i < input.length; i++) {
    input[i].addEventListener('click', function(this: HTMLElement) {
        // generetePokemon(this.id);
        console.log(this.id);
        fetchPokemonByType(this.id);
    });
}

async function fetchPokemonByType(id : string) {
    const pokemonType = id;

    const pokemons = await fetchAllPokemons();
    const filteredPokemon = await Promise.all(pokemons.filter(pokemon => pokemon !== undefined).map(pokemons => fetchPokemonDetails(pokemons.url)));
    if(filteredPokemon.length>0){
        const filteredPokemonTypes = filteredPokemon.filter(pokemon => 
            pokemon !== undefined && pokemon.types.some(type => type.type.name.toLowerCase() === id)
        );
    
        if (filteredPokemonTypes.length > 0) {
            
                filteredPokemonTypes.forEach(pokemon => {
                    if (pokemon) { // Lägg till en kontroll här för att säkerställa att pokemon inte är undefined
                        renderPokemonType(pokemon);
                    }
                });
            
        } else {
            console.log("No pokemon of that type found");
        }
    } 
}

async function renderPokemonType(pokemon : Pokemon) {
    const sectionRef = document.querySelector('#pokemonTypeContainer') as HTMLElement;
    console.log(sectionRef);
    
        const cardRef = createCard(pokemon);
        
        sectionRef.appendChild(cardRef);
}



async function searchPokemon() {
    const input = document.getElementById('searchField') as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();
    

    const pokemons = await fetchAllPokemons();
    const filteredPokemons = pokemons.find(pokemon => pokemon.name.toLowerCase() === searchTerm);

    if (filteredPokemons) {
        const detailedPokemon = await fetchPokemonDetails(filteredPokemons.url);
        console.log(detailedPokemon);
        if(detailedPokemon) {
        renderPokemon([detailedPokemon]);
    
        } 
        else {
            console.log("pokemon not found")
        }
    } else {
        console.log("No Pokemon found for:", searchTerm);
    }
}
document.getElementById('searchButton')?.addEventListener('click', function() {searchPokemon()});

function renderPokemon(pokemonList : Pokemon[]) : void {
    const sectionRef = document.querySelector('#pokemonContainer') as HTMLElement;
    console.log(sectionRef);
    
    pokemonList.forEach(pokemon => {
        const cardRef = createCard(pokemon);
        
        sectionRef.appendChild(cardRef);
    });
}


async function pokedexSetup() : Promise<void> {
    const pokemonGeneralList : PokemonGeneral[] = await fetchAllPokemons();
    const pokemonPromises : Promise<Pokemon | undefined>[] = [];
    
    for(let i = 0; i < 151; i++) {
        pokemonPromises.push(fetchPokemonDetails(pokemonGeneralList[i].url));
    }

    const pokemonList : Pokemon[] = (await Promise.all(pokemonPromises)).filter((pokemon) : pokemon is Pokemon => pokemon !== undefined);
    
    renderPokedex(pokemonList);
}

async function fetchAllPokemons() : Promise<PokemonGeneral[]> {
    try {
        const response = await fetch('https://santosnr6.github.io/Data/pokemons.json');
        if(!response.ok) {
            throw ('Någonting gick snett');
        } else {
            const data : PokemonGeneral[] = await response.json();
            return data;
            
        }
        return [];
    } catch(error) {
        console.log(error);
        return [];
    }

}

async function fetchPokemonDetails(url : string) : Promise<Pokemon | undefined> {
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw ('Någonting gick snett!');
        } else {
            const data : Pokemon = await response.json();
            // console.log(data.stats[0].stat.name + ': ' + data.stats[0].base_stat);
            // console.log(data);
            return data;
        }
    } catch(error) {
        console.log(error);
        return undefined;
    }
    
}

function renderPokedex(pokemonList : Pokemon[]) : void {
    const sectionRef = document.querySelector('#pokedexContainer') as HTMLElement;
    console.log(sectionRef);
    
    pokemonList.forEach(pokemon => {
        const cardRef = createCard(pokemon);
        // console.log(cardRef);
        sectionRef.appendChild(cardRef);
    });
}

function createCard(pokemon : Pokemon) : HTMLElement {
    const cardRef = document.createElement('article') as HTMLElement;
    cardRef.classList.add('pokemon-card');

    const cardTemplate = `
        <div class="card-top">
            <img src="${pokemon.sprites.front_default}" alt="Image of ${pokemon.name}}" class="card-sprite">
        </div>
        <div class="card-middle">
            <h2>${capitalizeWords(pokemon.name)}</h2>
            <h3>${pokemon.types.length === 2 ? capitalizeWords(pokemon.types[0].type.name) + ' / ' + capitalizeWords(pokemon.types[1].type.name) : capitalizeWords(pokemon.types[0].type.name)}</h3>
        </div>
        <div class="card-bottom">
            <p class="card-stat">Attack: ${ pokemon.stats[1].base_stat }</p>
            <p class="card-stat">Defense: ${ pokemon.stats[2].base_stat } </p>
            <p class="card-stat">Sp. Attack: ${ pokemon.stats[3].base_stat } </p>
            <p class="card-stat">Sp. Defense: ${ pokemon.stats[4].base_stat } </p>
            <p class="card-stat">HP: ${ pokemon.stats[0].base_stat } </p>
            <p class="card-stat">Speed: ${ pokemon.stats[5].base_stat } </p>
            <p class="card-stat card-stat--span-two">Total: ${ calculateTotal(pokemon) } </p>
        </div>
    `;

    // Ternary operator
    // { statement ? detta görs om statement === sant : annars görs detta! }

    cardRef.innerHTML = cardTemplate;

    return cardRef;
}

function calculateTotal(pokemon : Pokemon) : number {
    let total : number = 0;
    pokemon.stats.forEach(stat => total += stat.base_stat);

    return total;
}

function capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

type PokemonGeneral = {
    name : string,
    url : string
}

type Pokemon = {
    name : string,
    types : Types[],
    stats : Stats[],
    sprites : Sprites
}

type Sprites = {
    front_default : string
}

type Stats = {
    base_stat : number,
    stat : Stat
}

type Stat = {
    name : string
}

type Types = {
    type : Type
}

type Type = {
    name : string
}