document.addEventListener('DOMContentLoaded', function() {

    main();
    
    const botones = document.querySelectorAll('.quiz__number');
    
    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            const show = document.querySelector('.quiz__show');
            if(show) {
                show.classList.remove('quiz__show');
                show.classList.add('quiz__hidden');
            }
            const question = document.querySelector(`#country__${(e.target.value) - 1}`);

            if(question) {
                question.classList.remove('quiz__hidden');
                question.classList.add('quiz__show');
            }
        })
    });

    async function main() {
        const datos = await obtenerDatos();
        barajarDatos(datos);

        const preguntas = datos.slice(0, 40);

        const quiz = [];

        generarPreguntas(preguntas, quiz);

        mostrarPregunta(quiz);

        const opciones = document.querySelectorAll('.quiz__answers');
        const cantidadPuntos = document.querySelector('.quiz__span');
        let puntos = 0;
        let felicitaciones = 0;
        
        opciones.forEach( opcion => {
            opcion.addEventListener('click', function() {
                let buttonClick = opcion.children[0];
                let pregunta = buttonClick.name;
                let divGrid = opcion.parentElement;

                //
                const numeroPregunta = document.querySelector(`#pregunta__${(parseInt(pregunta) + 1)}`);
                numeroPregunta.classList.add('active');

                /* EN EL CASO DE QUE LA OPCION ELEGIDA SEA LA CORRECTA */
                if(quiz[pregunta].pais === buttonClick.value) {
                    opcion.classList.remove('quiz__answers');
                    opcion.classList.add('quiz__answers--select');

                    buttonClick.classList.remove('quiz__answer');
                    buttonClick.classList.add('quiz__answer--correct');

                    puntos = puntos + 1;
                    cantidadPuntos.textContent = puntos;
                }else {
                    /* EN EL CASO DE QUE LA OPCION ELEGIDA SEA INCORRECTA */
                    let buttonCorrect; 
                    opcion.classList.remove('quiz__answers');
                    opcion.classList.add('quiz__answers--select');

                    buttonClick.classList.remove('quiz__answer');
                    buttonClick.classList.add('quiz__answer--wrong');

                    for(let j = 0; j < divGrid.children.length; j++) {
                        buttonCorrect = divGrid.children[j].children[0];
                        
                        if(buttonCorrect.value === quiz[pregunta].pais){
                            buttonCorrect.classList.remove('quiz__answer');
                            buttonCorrect.classList.add('quiz__answer--correct');
                        }
                    }
                }

                divGrid.classList.add('bloqueado');
                felicitaciones++;

                if(felicitaciones === 10) {
                    eliminarPreguntas();
                    mostarCartel(puntos);
                }
            })
        })
    }

    function mostarCartel(puntos) {
        const questions = document.querySelector('.quiz__container');

        const divCongrats = document.createElement('div');
        divCongrats.classList.add('quiz__congrats');

        const imagen = document.createElement('img');
        imagen.classList.add('quiz__imagen');
        imagen.src = 'resources/congrats.png';
        imagen.width = "350px";
        imagen.height = "auto";

        const encabezado = document.createElement('h3');
        encabezado.classList.add('quiz__heading');
        encabezado.textContent = 'Congrats! You Completed the quiz.';
        
        const parrafo = document.createElement('p');
        parrafo.classList.add('quiz__point');
        parrafo.innerHTML = `You answer <span>${puntos}</span>/10 correctly`;

        const button = document.createElement('input');
        button.type = "button";
        button.classList.add('quiz__play');
        button.value = "Play again";
        button.addEventListener('click', volvarAJugar);

        divCongrats.appendChild(imagen);
        divCongrats.appendChild(encabezado);
        divCongrats.appendChild(parrafo);
        divCongrats.appendChild(button);

        questions.appendChild(divCongrats);
    }

    function volvarAJugar() {
        document.location.reload();
    }

    function eliminarPreguntas() {
        const questions = document.querySelector('.quiz__container');

        while(questions.firstChild) {
            questions.firstChild.remove();
        }
    }

    async function obtenerDatos() {
        const url = 'https://restcountries.com/v3.1/all';

        try {
            const response = await fetch(url);
            const resultado = await response.json();
            return resultado
        } catch(error) {
            console.log(error);
            mostrarError();
        }   
    }

    function mostrarError() {
        const error = document.querySelector('.quiz__page');

        const mensajeError = document.createElement('h3');
        mensajeError.classList.add('quiz__error');
        mensajeError.textContent = "Hubo un problema con red";

        error.appendChild(mensajeError);
    }

    function barajarDatos(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generarPreguntas(datos, array) {
        let opciones = [];

        for(let i = 0; i < datos.length; i++) {
            opciones.push(datos[i].name.common);

            if( (i + 1) % 4 == 0) {
                let obj = {
                    bandera: datos[i].flags.svg,
                    pais: datos[i].name.common,
                    opciones: opciones
                }

                opciones = [];
                array.push(obj);
            }
        }
    }

    function mostrarPregunta(array) {
        const contenedor = document.querySelector('.quiz__page');

        let primeraPregunta = true;
        let numero = 0;

        array.forEach(country => {
            const {bandera, opciones} = country;
            barajarDatos(opciones);

            let divpage = document.createElement('div');

            if(primeraPregunta) {
                divpage.classList.add('quiz__show');
                primeraPregunta = false;
            } else {
                divpage.classList.add('quiz__hidden');
            }

            divpage.id = `country__${numero}`;

            let divContenedor = document.createElement('div');
            divContenedor.classList.add('quiz__question');

            let primerParrafo = document.createElement('p');
            primerParrafo.classList.add('quiz__parrafo');
            primerParrafo.textContent = 'Which country does this flag';

            let imagen = document.createElement('img');
            imagen.src = `${bandera}`;
            imagen.classList.add('quiz__img');
            imagen.alt = "flag";

            let segundoParrafo = document.createElement('p');
            segundoParrafo.classList.add('quiz__parrafo');
            segundoParrafo.textContent = 'belong to?';

            divContenedor.appendChild(primerParrafo);
            divContenedor.appendChild(imagen);
            divContenedor.appendChild(segundoParrafo);

            divpage.appendChild(divContenedor);

            let contenedorGrid = document.createElement('div');
            contenedorGrid.classList.add('quiz__grid');

            for(let i = 0; i < opciones.length; i++) {
                let divAnswer = document.createElement('div');
                divAnswer.classList.add('quiz__answers');

                let buttonAnswer = document.createElement('button');
                buttonAnswer.classList.add('quiz__answer');
                buttonAnswer.name = `${numero}`;
                buttonAnswer.value = `${opciones[i]}`;
                buttonAnswer.textContent = `${opciones[i]}`;

                divAnswer.appendChild(buttonAnswer);
                contenedorGrid.appendChild(divAnswer);
            }

            numero++;

            divpage.appendChild(contenedorGrid);
            contenedor.append(divpage);
        });
    }
});