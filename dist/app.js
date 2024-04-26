"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
window.addEventListener('load', () => {
    console.log('loaded');
    sectionSetup();
    navSetup();
    pokedexSetup();
});
function sectionSetup() {
    const sectionRefs = document.querySelectorAll('.section');
    sectionRefs.forEach(section => section.classList.add('d-none'));
}
function navSetup() {
    const navItemRefs = document.querySelectorAll('.nav-item');
    navItemRefs.forEach(navItem => {
        navItem.addEventListener('click', (event) => {
            toggleSectionDisplay(event.target.dataset.id);
        });
    });
}
function toggleSectionDisplay(section) {
    const pokedexSectionRef = document.querySelector('#pokedexSection');
    const searchSectionRef = document.querySelector('#searchSection');
    const generatorSectionRef = document.querySelector('#generatorSection');
    if (section) {
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
const input = document.getElementsByClassName('generatePokemonByType');
for (let i = 0; i < input.length; i++) {
    input[i].addEventListener('click', function () {
        console.log(this.id);
        fetchPokemonByType(this.id);
    });
}
function fetchPokemonByType(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const pokemonType = id;
        const pokemons = yield fetchAllPokemons();
        const filteredPokemon = yield Promise.all(pokemons.filter(pokemon => pokemon !== undefined).map(pokemons => fetchPokemonDetails(pokemons.url)));
        if (filteredPokemon.length > 0) {
            const filteredPokemonTypes = filteredPokemon.filter(pokemon => pokemon !== undefined && pokemon.types.some(type => type.type.name.toLowerCase() === id));
            if (filteredPokemonTypes.length > 0) {
                filteredPokemonTypes.forEach(pokemon => {
                    if (pokemon) {
                        renderPokemonType(pokemon);
                    }
                });
            }
            else {
                console.log("No pokemon of that type found");
            }
        }
    });
}
function renderPokemonType(pokemon) {
    return __awaiter(this, void 0, void 0, function* () {
        const sectionRef = document.querySelector('#pokemonTypeContainer');
        console.log(sectionRef);
        const cardRef = createCard(pokemon);
        sectionRef.appendChild(cardRef);
    });
}
function searchPokemon() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = document.getElementById('searchField');
        const searchTerm = input.value.toLowerCase();
        const pokemons = yield fetchAllPokemons();
        const filteredPokemons = pokemons.find(pokemon => pokemon.name.toLowerCase() === searchTerm);
        if (filteredPokemons) {
            const detailedPokemon = yield fetchPokemonDetails(filteredPokemons.url);
            console.log(detailedPokemon);
            if (detailedPokemon) {
                renderPokemon([detailedPokemon]);
            }
            else {
                console.log("pokemon not found");
            }
        }
        else {
            console.log("No Pokemon found for:", searchTerm);
        }
    });
}
(_a = document.getElementById('searchButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { searchPokemon(); });
function renderPokemon(pokemonList) {
    const sectionRef = document.querySelector('#pokemonContainer');
    console.log(sectionRef);
    pokemonList.forEach(pokemon => {
        const cardRef = createCard(pokemon);
        sectionRef.appendChild(cardRef);
    });
}
function pokedexSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        const pokemonGeneralList = yield fetchAllPokemons();
        const pokemonPromises = [];
        for (let i = 0; i < 151; i++) {
            pokemonPromises.push(fetchPokemonDetails(pokemonGeneralList[i].url));
        }
        const pokemonList = (yield Promise.all(pokemonPromises)).filter((pokemon) => pokemon !== undefined);
        renderPokedex(pokemonList);
    });
}
function fetchAllPokemons() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://santosnr6.github.io/Data/pokemons.json');
            if (!response.ok) {
                throw ('Någonting gick snett');
            }
            else {
                const data = yield response.json();
                return data;
            }
            return [];
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
function fetchPokemonDetails(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw ('Någonting gick snett!');
            }
            else {
                const data = yield response.json();
                return data;
            }
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    });
}
function renderPokedex(pokemonList) {
    const sectionRef = document.querySelector('#pokedexContainer');
    console.log(sectionRef);
    pokemonList.forEach(pokemon => {
        const cardRef = createCard(pokemon);
        sectionRef.appendChild(cardRef);
    });
}
function createCard(pokemon) {
    const cardRef = document.createElement('article');
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
            <p class="card-stat">Attack: ${pokemon.stats[1].base_stat}</p>
            <p class="card-stat">Defense: ${pokemon.stats[2].base_stat} </p>
            <p class="card-stat">Sp. Attack: ${pokemon.stats[3].base_stat} </p>
            <p class="card-stat">Sp. Defense: ${pokemon.stats[4].base_stat} </p>
            <p class="card-stat">HP: ${pokemon.stats[0].base_stat} </p>
            <p class="card-stat">Speed: ${pokemon.stats[5].base_stat} </p>
            <p class="card-stat card-stat--span-two">Total: ${calculateTotal(pokemon)} </p>
        </div>
    `;
    cardRef.innerHTML = cardTemplate;
    return cardRef;
}
function calculateTotal(pokemon) {
    let total = 0;
    pokemon.stats.forEach(stat => total += stat.base_stat);
    return total;
}
function capitalizeWords(str) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}
