const mainData = {
    deck: [],
    question: []
};

const results = [];
// Zmienna globalna przechowująca stan wybranych rzeczy
let result = {
    question: '',
    questions: [],
    answers: []
}
// Stos kart odrzuconych
const trash = [];

function kit_template() {
    const kit = document.createElement('article');
    kit.id = `kit_${results.length+1}`;
    
    const questions = document.createElement('article');
    questions.classList.add('questions');
    questions.innerHTML = `<h1> Wybierz co chcesz zrobić: </h1><section class="quest"></section>`;
    kit.appendChild(questions);

    const choice = document.createElement('article');
    choice.classList.add('showChoice','hidden');
    kit.appendChild(choice);

    const result = document.createElement('article');
    result.classList.add('result','hidden');
    result.innerHTML = `<section class="board" ></section><div><section class="description"></section><button>Kolejne rozdanie</button></div></article>`;
    kit.appendChild(result);

    return kit;
}

// Odsłonięciue wyniku
const _showResult = () => {
    const current = document.getElementById(`kit_${results.length + 1}`);
    current.querySelector('.result').classList.remove('hidden');
    current.querySelector('.questions').classList.add('hidden');
    setTimeout(()=>current.scrollIntoView({ behavior: 'smooth' }) , 10);
}

// Tasowanie tali
function shuffle(deck) {
    // Kopia tali
    let oldDeck = [...deck];
    const shuffled = [];
    // Losowanie kolejności talii
    do {
        const number = Math.floor(Math.random() * (oldDeck.length) ), // Wybieranie karty
            position = Math.floor(Math.random() * 10)%2; // Ustalanie pozycji karty
        shuffled.push( {
            name: oldDeck[number].name,
            description: oldDeck[number][position],
            position: position,
            type: oldDeck[number].type,
            short: oldDeck[number].short
        } );
        // Wyrzucanie pobraniej karty z losowania
        oldDeck = [...oldDeck.slice(0,number), ...oldDeck.slice(number + 1)];
    } while (shuffled.length < deck.length);

    return shuffled;
}

// Rysowania karty
function drawCard( card ) {
    const div = document.createElement('div');
    //Usatelenie typu karty
    div.classList.add('card', (card.position === 1 ? 'normal':'reversed'));
    if ( !!card.short ) div.classList.add('big');
    else div.classList.add('small');
    if ( !!card.type ) div.classList.add(card.type);
    // Dodanie obrazka
    if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
        if ( !!card.short ) div.style.backgroundImage = encodeURI(`url(/pictures/${card.name}_${card.position}.png)`);
        else  div.style.backgroundImage = encodeURI(`url(/pictures/${card.type}_${card.name}_${card.position}.png)`);
    } else {
        if ( !!card.short ) div.style.backgroundImage = encodeURI(`url(/Tarot/pictures/${card.name}_${card.position}.png)`);
        else  div.style.backgroundImage = encodeURI(`url(/Tarot/pictures/${card.type}_${card.name}_${card.position}.png)`);
    }
    
    // Dodanie tytułu
    const title = document.createElement('div'),
        name = document.createElement('h2'),
        addiciton = document.createElement('h4');
    title.classList.add('title');
    name.innerText = card.name;
    title.appendChild(name);
    addiciton.innerText = !!card.short ? card.short : card.type;
    title.appendChild(addiciton);
    div.appendChild(title);

    // Dodanie opisu
    const desc = document.createElement('p');
    desc.classList.add('description');
    desc.innerText = card.description;
    div.appendChild(desc);
    
    return div;
}

// Budowa opisu układu tarota
function seeDescription() {
    const current = document.getElementById(`kit_${results.length + 1}`);
    const description = current.querySelector('.result section.description');
    const title = document.createElement('h2');
    title.innerText = result.question;
    description.appendChild(title);

    for( let i = 0 ; i < 5 ; i++ ) {
        const section = document.createElement('section');

        const quest = document.createElement('h3');
        quest.innerText = result.questions[i];
        section.appendChild(quest);

        const answer = document.createElement('p');
        answer.innerHTML = `<b>${result.answers[i][0]} ${result.answers[i][1]}</b> - ${result.answers[i][2]}`;
        section.appendChild(answer);

        description.appendChild(section);

        section.addEventListener('mouseover', (event) => {
            const getParentID = (elem) => elem.parentElement.id ? elem.parentElement : getParentID(elem.parentElement);
            const kit = getParentID(event.target);
            const child = Array(...
                (event.target.nodeName === 'B' ? 
                    event.target.parentElement.parentElement.parentElement.children 
                    : event.target.parentElement.parentElement.children)
                ).map(
                    (element,index) => element === event.target.parentElement ? index : false
                ).filter( x => x)[0];
            if (!child) return ;
            console.log(child)
            const card = kit.querySelector(`.board > div:nth-child(${child})`);
            card.classList.add('select');
        }, false);
        section.addEventListener("mouseout", (event) => {
            const getParentID = (elem) => elem.parentElement.id ? elem.parentElement : getParentID(elem.parentElement);
            const kit = getParentID(event.target);
            const child = Array(...
                (event.target.nodeName === 'B' ? 
                        event.target.parentElement.parentElement.parentElement.children 
                        : event.target.parentElement.parentElement.children)
                    ).map(
                        (element,index) => element === event.target.parentElement ? index : false
                    ).filter( x => x)[0];
            if (!child) return ;
            const card = kit.querySelector(`.board > div:nth-child(${child})`);
            card.classList.remove('select');
        }, false);
    }
    _showResult();
    results.push(result);
    current.querySelector('.result button').addEventListener('click', function (event) {
        event.target.classList.add('hidden');
        const breaker = document.createElement('hr');
        document.body.appendChild(breaker);
        document.body.appendChild(kit_template());
        const current = document.getElementById(`kit_${results.length + 1}`);

        createList(current.querySelector('.questions .quest'), mainData.question, mainData.deck);
        setTimeout(()=>current.scrollIntoView({ behavior: 'smooth' }) , 10);
    })
    result = {
        question: '',
        questions: [],
        answers: []
    };
}

// Akceptacja karty
function choiceStage(question, deck, level = 1) {
    const current = document.getElementById(`kit_${results.length + 1}`);
    const box = current.querySelector('.showChoice');
    box.innerHTML = `<h1 class="stage"></h1><div><button id="YES">✅</button><section class="preview"></section><button id="NO">❌</button></div>`;
    box.classList.remove('hidden');
    document.querySelector('.questions').classList.add('hidden');

    // Dodanie pytania
    box.querySelector('.stage').innerText = `${result.question}: ${question[level]}`;

    // Rozpatrywanie karty
    const card = drawCard(deck.shift());
    box.querySelector('.preview').appendChild(card);
    // Zatwierdzenie kary
    box.querySelector('#YES').addEventListener( 'click', function () {
        const current = document.getElementById(`kit_${results.length + 1}`);
        const board = current.querySelector('.board');
        const box = current.querySelector('.showChoice');

        // Dodanie karty do układu
        card.style.gridArea = 'a' + (level -1);
        board.appendChild(card);

        // Dodanie opisu
        result.questions.push(question[level]);
        result.answers.push( [
            card.querySelector('.title h2').innerText
            ,card.querySelector('.title h4').innerText
            ,card.querySelector('.description').innerText
        ] )

        // Koniec układania ?
        if (level < 5 ) choiceStage(question,deck,++level);
        else {
            seeDescription();
            box.classList.add('hidden');
        }
    } )

    // Odrzucenie karty
    box.querySelector('#NO').addEventListener( 'click', function () {
        trash.push( card );
        choiceStage(question,deck,level);
    } )
}

// Tworzenie kafelków z pytaniami
function createList(box, question, deck) {
    Object.keys(question).map( elem => {
        const section = document.createElement('section');
        section.classList.add('toSelect');
        section.setAttribute('data-name',elem);
        // Dodanie tytułu / nazwy kategorii
        const name = document.createElement('h2');
        name.innerText = elem;
        section.appendChild(name);
        // Budowa listy pytań
        const ul = document.createElement('ul');
        Object.keys(question[elem]).forEach( number => {
            const li = document.createElement('li');
            li.innerText = question[elem][number];
            ul.appendChild(li);
        })
        section.appendChild(ul);
        box.appendChild(section);
    });

    // Dodanie zdarzenia na wybór pytania
    document.querySelectorAll( '.quest section' ).forEach( section => {
        section.addEventListener( 'click', function(event) {
            section.parentElement.style.visibility = "hidden";
            result.question = this.getAttribute('data-name');           
            choiceStage(question[this.getAttribute('data-name')], shuffle(deck));
        })
    })
}

// Pobieramy oba pliki JSON jednocześnie za pomocą funkcji fetch()
Promise.all([
  fetch('./jsons/question.json'),
  fetch('./jsons/cards.json')
])
.then(function(responses) {
  // Odpowiedzi są zwracane jako obiekt Response, więc trzeba je przekonwertować na dane JSON
  return Promise.all(responses.map(function(response) {
    return response.json();
  }));
})
.then( function(data) {
    // Przypisanie response na zmienne i sprzetworzenie card na talię
    const [question,tarot] = data;
    const deck = [...tarot.big];
    Object.keys(tarot.small).forEach( key => {
        tarot.small[key].forEach( (card) => deck.push({...card, type: key}) )
    });
    mainData.deck = deck;
    mainData.question = question;
    const current = document.getElementById(`kit_${results.length + 1}`);
    createList(current.querySelector('.questions .quest'), question, deck);
})
.catch((error) => console.error('Wystąpił błąd: ' + error));