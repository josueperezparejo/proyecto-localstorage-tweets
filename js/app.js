// Variables & Selectores
const listaTweets = document.querySelector('#lista-tweets');
const formulario = document.querySelector('#formulario');
let tweets = [];

// Eventos
eventListeners();

function eventListeners() {
     formulario.addEventListener('submit', agregarTweet);

     document.addEventListener('DOMContentLoaded', () => {
          tweets = JSON.parse(localStorage.getItem('tweets')) || [];
          crearHTML();
     });
}

// Funciones
function agregarTweet(event) {
     event.preventDefault();
     const tweet = document.querySelector('#tweet').value;

     if (tweet === '') {
          mostrarError('El campo no puede ir Vacio');
          return;
     }

     const tweetObj = {
          id: Date.now(),
          texto: tweet
     }

     tweets = [...tweets, tweetObj];

     Swal.fire({
          icon: 'success',
          title: 'Agregado Correctamente',
          showConfirmButton: false,
          timer: 1500
     })

     crearHTML();

     formulario.reset();
}

function mostrarError(error) {
     const alerta = document.querySelector('.alert-active');

     if (!alerta) {
          const mensajeError = document.createElement('p');
          mensajeError.textContent = error;
          mensajeError.classList.add('error', 'alert-active', 'my-2', 'rounded', 'rounded-2');

          const formulario = document.querySelector('.formulario');
          formulario.appendChild(mensajeError);

          setTimeout(() => {
               mensajeError.remove();
          }, 3000);
     }
}

function crearHTML() {
     limpiarHTML();

     if (tweets.length > 0) {
          tweets.forEach((tweet) => {

               const li = document.createElement('li');
               li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

               const tweetP = document.createElement('p');
               tweetP.classList.add('my-0', 'px-2')
               tweetP.textContent = tweet.texto;

               const botonBorrar = document.createElement('a');
               botonBorrar.classList.add('borrar-tweet', 'fw-bold')
               botonBorrar.innerText = 'X';
               botonBorrar.onclick = function (event) {
                    borrarTweet(event)
               };

               li.appendChild(tweetP);
               li.appendChild(botonBorrar);

               li.dataset.tweetId = tweet.id;

               listaTweets.appendChild(li);
          });
     } else {
          const mensaje = document.createElement('p');
          mensaje.classList.add('fw-bold', 'text-center')
          mensaje.textContent = 'Aun no hay Tweets Agrega Algo...';

          listaTweets.appendChild(mensaje);
     }

     sincronizarStorage();
}

function borrarTweet(event) {
     event.preventDefault();

     // sweetalert
     Swal.fire({
          title: 'Estas Seguro?',
          text: "No podras recuperarlo!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Eliminarlo!'
     }).then((result) => {
          if (result.isConfirmed) {
               Swal.fire(
                    'Eliminado!',
                    'Eliminado Correctamente.',
                    'success'
               )

               const id = event.target.parentElement.dataset.tweetId;
               tweets = tweets.filter(tweet => tweet.id != id);
               crearHTML();
          }
     })
}

function sincronizarStorage() {
     localStorage.setItem('tweets', JSON.stringify(tweets));
}

function limpiarHTML() {
     while (listaTweets.firstChild) {
          listaTweets.removeChild(listaTweets.firstChild);
     }
}