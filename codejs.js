let foundCars = 0;
let dumbCars = 0;
let playing = false;
let theWord;
let token;
let sections = ["newgame","gimage","gcontrols"];
const letters = document.querySelectorAll("#gchars >span ");
let displayedString = document.getElementById("word2guess");
const myHeaders = new Headers();
let delayTime = 2000; 
var audiotouche = document.getElementById("touche");
var audiowin = document.getElementById("win");
var audioloose = document.getElementById("perdu");


async function testFetch() {
    let result = "";
    try {
        let response = await fetch("http://quoridorarena.ps8.academy/newGame", {
            headers: {
                'token': token 
            }
        });
        if (!response.ok) {
            console.error("Bad response from the server");
            return;
        }
        let jsondata = await response.json();
        result = jsondata["wordLength"];
    } catch (error) {
        console.error("Error while connecting to quoridorarena.ps8.academy/newGame:", error);
    }
    return result;
}

function initialView() {
      sections.forEach((elem) => {
            let section = document.getElementById(elem);
            section.classList.remove("playing");
            section.classList.add("notplaying");
      });
}

async function displayMinus(){
   theWord= await testFetch();
   let result="";
   for(let i=0 ; i<theWord; i++)
            result += "_";
      result = result.split("");
      displayedString.innerText = result.join(" ");
}

async function newGame() {
    dumbCars = 0;
    console.log("new game...");
    sections.forEach((elem) => {
        let section = document.getElementById(elem);
        section.classList.remove("notplaying");
        section.classList.add("playing");
        document.getElementById("connexion").classList.add("notplaying");
        for (let i = 1; i <= 7; i++) {
            let errstep = document.getElementById("i" + i)
            errstep.classList.add("noerror");
        }
    });
    try {
        document.getElementById("chargement").style.display = "block";
        const response = await fetch("http://quoridorarena.ps8.academy/newGame", {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        });
        if (!response.ok && response.status === 400) {
            resetGameState();
            messageContainer.textContent = "Vous êtes connecté à "+ localStorage.getItem('dernierUser');
            return;
        }

        let jsondata = await response.json();
        document.getElementById("chargement").style.display = "none";

        theWord = jsondata["wordLength"];
        displayMinus();
        playing = true;
        document.getElementById("menu").style.display = "block"; //affiche le bouton menu
        foundCars = 0;
        for (let i = 0; i < letters.length; i++) {
            letters[i].classList.remove("ok");
            letters[i].classList.remove("ko");

        document.getElementById("authBlock").style.display = "none";
        document.getElementById("newgame").style.display = "none";
        document.getElementById("gimage").style.display = "block";
        document.getElementById("gcontrols").style.display = "block";
        document.getElementById("deco").style.display = "none";
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function continueGameQuitter() {
    console.log("continue game quitter...");
    try {
        document.getElementById("chargement").style.display = "block";
        const response = await fetch("http://quoridorarena.ps8.academy/gameState", {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        });

        if (!response.ok) { 
            if (response.status === 498) {
                alert("Votre session a expiré. Veuillez vous reconnecter.");
                localStorage.removeItem('token');
                window.location.href = "HANGMAN.html";
                return;
            }
            if (response.status === 400) { 
                newGame();
                messageContainer.textContent = "Vous êtes connecté à "+ localStorage.getItem('dernierUser');
                return;
            }
        }
        let gameState = await response.json();
        document.getElementById("chargement").style.display = "none";

        if (gameState && gameState.hasOwnProperty('wordLength')) {

            sections.forEach((elem) => {
                let section = document.getElementById(elem);
                section.classList.remove("notplaying");
                section.classList.add("playing");
                for (let i = 1; i <= 7; i++) {
                    errstep = document.getElementById("i" + i)
                    errstep.classList.add("noerror");
                }
            });
            
            const username = localStorage.getItem('dernierUser');
            console.log(username);
            alert("Rebonjour "+ username);
            messageContainer.textContent = "Vous êtes connecté à "+ username;
            theWord = gameState.wordLength;
            dumbCars = gameState.nbErrors;

            const incorrectLetters = gameState.incorrectLetters;
            incorrectLetters.forEach(letter => {
                letters[letter.charCodeAt(0) - "A".charCodeAt(0)].classList.add("ko");
            });

            const correctLetters = gameState.correctLetters;
            displayedString.innerText = correctLetters.join(" ");
            console.log(correctLetters);

            correctLetters.forEach(letter => {
                let letterIndex = letter.charCodeAt(0) - "A".charCodeAt(0);
                if (letterIndex >= 0 && letterIndex < letters.length) {
                    letters[letterIndex].classList.add("ok");
                }
            });

            for (let i = 1; i <= dumbCars; i++) {
                console.log(i);
                document.getElementById("i" + i).classList.remove("noerror");
            }

            playing = true;

            document.getElementById("menu").style.display = "block";
            document.getElementById("menu").style.display = "block";
            document.getElementById("gimage").style.display = "block";
            document.getElementById("gcontrols").style.display = "block";
            document.getElementById("newgame").style.display = "none";
            document.getElementById("deco").style.display = "none";
 
            console.log("Partie en cours reprise !");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du gameState:', error);
        alert("Une erreur s'est produite lors de la récupération des données du jeu. Veuillez réessayer plus tard.");
    }
}

async function continueGame() {
    console.log("continue game...");
    try {
        document.getElementById("chargement").style.display = "block";
        const response = await fetch("http://quoridorarena.ps8.academy/gameState", {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        });
        if (!response.ok && playing==true) {
            console.error("Bad response from the server");
            return;
        }
        
        document.getElementById("authBlock").style.display = "none";

        let gameState = await response.json();
        document.getElementById("chargement").style.display = "none";

        if (gameState && gameState.hasOwnProperty('wordLength')) {

            sections.forEach((elem) => {
                let section = document.getElementById(elem);
                section.classList.remove("notplaying");
                section.classList.add("playing");
                for (let i = 1; i <= 7; i++) {
                    errstep = document.getElementById("i" + i)
                    errstep.classList.add("noerror");
                }
            });
  
            theWord = gameState.wordLength;
            dumbCars = gameState.nbErrors;

            const incorrectLetters = gameState.incorrectLetters;
            incorrectLetters.forEach(letter => {
                letters[letter.charCodeAt(0) - "A".charCodeAt(0)].classList.add("ko");
            });

            const correctLetters = gameState.correctLetters;
            displayedString.innerText = correctLetters.join(" ");
            console.log(correctLetters);

            correctLetters.forEach(letter => {
                let letterIndex = letter.charCodeAt(0) - "A".charCodeAt(0);
                if (letterIndex >= 0 && letterIndex < letters.length) {
                    letters[letterIndex].classList.add("ok");
                }
            });

            for (let i = 1; i <= dumbCars; i++) {
                console.log(i);
                document.getElementById("i" + i).classList.remove("noerror");
            }

            playing = true;

            document.getElementById("menu").style.display = "block";
            document.getElementById("gimage").style.display = "block";
            document.getElementById("gcontrols").style.display = "block";
            document.getElementById("newgame").style.display = "none";
            document.getElementById("deco").style.display = "none";
            document.getElementById("continue").style.display = "none";
            console.log("Partie en cours reprise !");

        } else {
            console.log("Aucune partie en cours.");
        }

    } catch (error) {
        console.error('Error:', error);
    }
}


function addGameEvents() {
      let newGameButton = document.getElementById("newgame");
      let restartButton = document.getElementById("restartb");

      newGameButton.addEventListener("click", newGame);
      restartButton.addEventListener("click", newGame);
    document.getElementById("continue").addEventListener("click", continueGame);
      letters.forEach((letter) => {
            letter.addEventListener("click",(event) => {
                  tryCar(event.currentTarget.innerText)});
      });
}

async function tryGameState() {
    try {
        const response = await fetch("http://quoridorarena.ps8.academy/gameState", {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        });
        if (!response.ok) {
            console.error("Bad response from the server");
            return false; 
        }
        let gameState = await response.json();

        if (gameState && gameState.hasOwnProperty('wordLength')) {
            return true; 
        } else {
            console.log("Pas de partie en cours.");
            return false; 
        }
    } catch (error) {
        console.error('Error:', error);
        return false; 
    }
}

function resetGameState() {
    token = null;
    myHeaders.delete('token');
    foundCars = 0; 
    dumbCars = 0; 
    playing = false; 
    theWord = null; 
    displayedString.innerText = ""; 
    letters.forEach(letter => { 
        letter.classList.remove("ok", "ko");
    });
    for (let i = 1; i <= 7; i++) { 
        document.getElementById("i" + i).classList.add("noerror");
    }
}

async function tryCar(car) {
    let lettre;
    let fini;
    let correct;
    let Word;
    let erreurs;
    let w2gempty = displayedString.innerText.split(" ");
    if (!playing) return; // Si le jeu n'est pas en cours, ne fait rien
    if (!letters[car.charCodeAt(0) - "A".charCodeAt(0)].classList.contains("ok") && !letters[car.charCodeAt(0) - "A".charCodeAt(0)].classList.contains("ko")) {
        try {
            audiotouche.play()
            const response = await fetch(`http://quoridorarena.ps8.academy/letter/${car}`, {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            });
            if (!response.ok) {
                console.error("Bad response from the server");
                return;
            }
            let jsondata = await response.json();
            lettre = jsondata["letter"];
            correct = jsondata["isCorrect"];
            fini = jsondata["isGameOver"];
            Word = jsondata["word"];

            // mettre à jour l'état du jeu 
            if (correct) {

                console.log("Correct");
                const positions = jsondata["positions"];;
                console.log(positions);
                for (let i = 0; i < positions.length; i++) { w2gempty[positions[i]] = car; }
                displayedString.innerText = w2gempty.join(" "); // met à jour le mot affiché
                if (fini) {
                    playing = false; // la partie est finie
                    audiowin.play()
                    displayedString.innerText = `Tu as gagné! The mystery word was "${displayedString.innerText.replace(/\s/g, '')}"`;
                }

                letters[car.charCodeAt(0) - "A".charCodeAt(0)].classList.add("ok");
            } else {

                erreurs++;
                dumbCars++; // increment nbr erreurs
                document.getElementById("i" + dumbCars).classList.remove("noerror");
                if (jsondata["errors"] == 7) {
                    playing = false;
                    document.getElementById("loose").style.display = "block";
                    setTimeout(() => {document.getElementById("loose").style.display = "none";}, delayTime+200);
                    audioloose.play()
                    displayedString.innerText = `You lost! The mystery word was "${Word}"`;
                }

                letters[car.charCodeAt(0) - "A".charCodeAt(0)].classList.add("ko");
            }
        } catch (error) {
            console.error('Error:', error);

        }
    }
}


function validMDP(password) {
    if (password.length < 8) {
        messageContainer.textContent = "Le mot de passe doit contenir au moins 8 caractères.";
        setTimeout(() => {messageContainer.textContent = "Vous êtes déconnecté";}, delayTime);
        return false;
    }

    const containsLetter = /[a-zA-Z]/.test(password);
    const containsNumber = /\d/.test(password);

    if (!containsLetter || !containsNumber) {
        messageContainer.textContent = "Le mot de passe doit contenir au moins une lettre et un chiffre.";
        setTimeout(() => {messageContainer.textContent = "Vous êtes déconnecté";}, delayTime);
        return false;
    }
    else {
        return true;
    }
}


document.addEventListener("DOMContentLoaded", async function() {

    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {        
        token = storedToken;
        myHeaders.append('token', token);

        document.getElementById("authBlock").style.display = "none";

        document.getElementById("newgame").style.display = "none";

        continueGameQuitter();

    }

    document.getElementById("connexionButton").addEventListener("click", async function() {
        localStorage.setItem('token', token);

        const username = document.getElementById("connexionUsername").value;
        
        localStorage.setItem('dernierUser', username);
        console.log(localStorage.getItem('dernierUser'));
        const password = document.getElementById("connexionPassword").value;
    
        const infocon = { username: username, password: password };
    
        console.log("Infos d'identification pour connexion :", infocon);
        document.getElementById("chargement").style.display = "block";
        fetch('http://quoridorarena.ps8.academy/login', {
            method: 'POST',
            body: JSON.stringify(infocon)
        })
    
        .then(async response => {
            if (!response.ok) {

                const errorMessage = await response.text();
                if (response.status === 401) {

                    messageContainer.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
                    setTimeout(() => {messageContainer.textContent = "Vous êtes déconnecté";}, delayTime+500);

                } else {

                    messageContainer.textContent = `Erreur lors de la connexion: ${errorMessage}`;
                    setTimeout(() => {messageContainer.textContent = "Vous êtes déconnecté";}, delayTime+500);
                }
            }
            document.getElementById("chargement").style.display = "none";
            token = await response.text();
            myHeaders.append('token', token);
            console.log(token);

            localStorage.setItem('token', token);
            localStorage.setItem('dernierUser', username); // username est le nom de utilisa

            messageContainer.textContent = "Vous êtes connecté à " + username;

            document.getElementById("newgame").style.display = "block";
            document.getElementById("deco").style.display = "block";
            if (await tryGameState()) {
                document.getElementById("continue").style.display = "block";
            } else {
                document.getElementById("continue").style.display = "none";
            }
        })

        .catch(error => {
            console.error('Erreur lors de la connexion :', error.message);

        });

        document.getElementById("connexionUsername").value = "";
        document.getElementById("connexionPassword").value = "";

    });

    document.getElementById("inscriptionButton").addEventListener("click", async function() {
        const username = document.getElementById("inscriptionUsername").value;
        const password = document.getElementById("inscriptionPassword").value;
    
        const passwordError = validMDP(password);
    
        const infoins = { username: username, password: password };
    
        console.log("Informations d'inscription :", infoins);
        const options = {
            method: 'POST',
            body: JSON.stringify(infoins)
        };
        
        if (passwordError == true) {
            try {
                const response = await fetch('http://quoridorarena.ps8.academy/signin', options);
                if (!response.ok) {
                    const errorMessage = await response.text();
                    if (response.status === 409 || response.status === 418) {
                        messageContainer.textContent = `Le nom d'utilisateur "${username}" est déjà pris.`;
                        setTimeout(() => {messageContainer.textContent = "Vous êtes déconnecté";}, delayTime+500);

                    } else {
                        messageContainer.textContent =`Erreur lors de l'inscription: ${errorMessage}`;
                        setTimeout(() => {messageContainer.textContent = "Vous êtes déconnecté";}, delayTime+500);
                        throw new Error 
                    }
                }
    
                if (response.ok) {
                    messageContainer.textContent = "Inscription réussie !";
                    setTimeout(() => {messageContainer.textContent = "Vous êtes déconnecté";}, delayTime+500);
                }

            } catch (error) {
                console.error('Erreur lors de l\'inscription :', error.message);

                messageContainer.textContent = error.message;

                setTimeout(() => {messageContainer.textContent = "Vous êtes déconnecté";}, delayTime+500);
            }
        }
        else {
            validMDP(MDP);
        }

        document.getElementById("inscriptionUsername").value = "";
        document.getElementById("inscriptionPassword").value = "";
        
    });

    document.getElementById("newgame").addEventListener("click", async function () {
        newGame();
    });

    document.getElementById("continue").addEventListener("click", async function () {
        continueGame();
        messageContainer.textContent = "Vous êtes connecté à "+ localStorage.getItem('dernierUser');
    });

    document.getElementById("menu").addEventListener("click", async function () {
        document.getElementById("authBlock").style.display = "block";
        document.getElementById("gimage").style.display = "none";
        document.getElementById("gcontrols").style.display = "none";
        document.getElementById("menu").style.display = "none";
        document.getElementById("continue").style.display = "block";
        document.getElementById("newgame").style.display = "block";
        document.getElementById("deco").style.display = "block";
        if (playing == false) {
            document.getElementById("continue").style.display = "none";
        }
    });

    document.getElementById("deco").addEventListener("click", function() {
        resetGameState()
        localStorage.removeItem('token');
        localStorage.removeItem('dernierUser');
        document.getElementById("continue").style.display = "none";
        document.getElementById("newgame").style.display = "none";
        document.getElementById("deco").style.display = "none";
        messageContainer.textContent = "Vous êtes déconnecté";
    });

});


window.addEventListener("load", (event) => {
      initialView();
      addGameEvents();
});