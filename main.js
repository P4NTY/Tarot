// Zmienna globalna przechowująca stan wybranych rzeczy
const result = {
    question: '',
    questions: [],
    answers: []
}
// Stos kart odrzuconych
const trash = [];

// Odsłonięciue wyniku
const _showResult = () => {
    document.querySelector('.result').classList.remove('hidden');
    document.querySelector('.questions').classList.add('hidden');
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
    if ( !!card.short ) div.style.backgroundImage = encodeURI(`url(/Tarot/pictures/${card.name}_${card.position}.png)`);
    else  div.style.backgroundImage = encodeURI(`url(/Tarot/pictures/${card.type}_${card.name}_${card.position}.png)`);
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
    const description = document.getElementById('description');
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
    }
}

// Akceptacja karty
function choiceStage(question, deck, level = 1) {
    const board = document.getElementById('board');
    const box = document.getElementById('showChoice');
    box.innerHTML = `<h1 class="stage"></h1>
    <div>
    <button id="YES">✅</button>
    <section class="preview"></section>
    <button id="NO">❌</button>
    </div>`;
    box.classList.remove('hidden');
    document.querySelector('.questions').classList.add('hidden');

    // Dodanie pytania
    box.querySelector('.stage' ).innerText = `${result.question}: ${question[level]}`;

    // Rozpatrywanie karty
    const card = drawCard(deck.shift());
    box.querySelector('.preview').appendChild(card);
    // Zatwierdzenie kary
    box.querySelector('#YES').addEventListener( 'click', function () {
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
            box.classList.add('hidden');
            seeDescription();
        }
    } )

    // Odrzucenie karty
    box.querySelector('#NO').addEventListener( 'click', function () {
        trash.push( card );
        choiceStage(question,deck,level);
    } )
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
    })
    // Tworzenie kafelków z pytaniami
    Object.keys(question).forEach( elem => {
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
        document.getElementById('quest').appendChild(section);
    })
    // Dodanie zdarzenia na wybór pytania
    document.querySelectorAll( '#quest section' ).forEach( section => {
        section.addEventListener( 'click', function() {
            result.question = this.getAttribute('data-name');
            choiceStage(question[this.getAttribute('data-name')], shuffle(deck));
            _showResult();
        })
    })
})
.catch((error) => console.error('Wystąpił błąd: ' + error) );