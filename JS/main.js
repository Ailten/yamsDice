
window.addEventListener('load',() => {
    start();
});

var userHand, botHand;

function start(){

    userHand = makeANewHand('user-board');
    botHand = makeANewHand('bot-board');

    addEventButtonUserHand(userHand);

    reDrawRollDiceCount(userHand);

    overideButtonKeepIntoSpanKeep(botHand);

    showButtonRetry('user-board', false);

}

// --->

function makeANewHand(strClassSection){

    let hand = {
        domButtonKeepDice: [],
        domImgDice: [],
        domButtonRollTheDice: null,
        domScore: null,

        dicesValue: [],
        isDicesKeep: [],
        rollCount: 0,
        score: 0,
    };

    let section = document.getElementById(strClassSection);
    let pDice = section.getElementsByClassName('p-dice');

    for(let i=0; i<pDice.length; i++){
        hand.domButtonKeepDice.push(
            pDice[i].getElementsByTagName('input')[0]
        );
        hand.domImgDice.push(
            pDice[i].getElementsByTagName('img')[0]
        );
        hand.dicesValue.push(0);
        hand.isDicesKeep.push(false);

        if(hand.domButtonKeepDice[i].hasAttribute('disabled')) //remove disabled if the button has one.
            hand.domButtonKeepDice[i].removeAttribute('disabled');
        
        hand.domImgDice[i].setAttribute('src', 'IMG/0.png'); //reset img dice.
    }
    hand.domButtonRollTheDice = section.getElementsByClassName('p-action')[0].getElementsByTagName('input')[0];
    hand.rollCount = 5;
    hand.domScore = section.getElementsByClassName('score')[0];

    if(hand.domButtonRollTheDice.hasAttribute('disabled')) //remove disabled if the button has one.
        hand.domButtonRollTheDice.removeAttribute('disabled');

    hand.domScore.innerText = '0';
    hand.domScore.style.color = 'black';

    return hand;

}

function overideButtonKeepIntoSpanKeep(hand){

    for(let i=0; i<hand.domButtonKeepDice.length; i++){ //overide buttons into span.
        hand.domButtonKeepDice[i] = hand.domButtonKeepDice[i].parentElement.getElementsByClassName('span-bot-keep')[0];
        hand.domButtonKeepDice[i].innerText = '';
    }

}

function showButtonRetry(strClassSection, isShow){

    let section = document.getElementById(strClassSection);
    let pRetry = section.getElementsByClassName('p-retry')[0];
    let hasHidden = pRetry.classList.contains('hidden');

    if(isShow && hasHidden){
        pRetry.classList.remove('hidden');
    }else if(!isShow && !hasHidden){
        pRetry.classList.add('hidden');
    }

}

function addEventButtonUserHand(hand){

    hand.domButtonRollTheDice.addEventListener('click', () => {
        clickRollTheDice(hand);
    });

    for(let i=0; i<hand.domButtonKeepDice.length; i++){
        hand.domButtonKeepDice[i].addEventListener('click', () => {
            clickKeepDice(hand, i);
        });
    }

}

function reDrawRollDiceCount(hand){

    hand.domButtonRollTheDice.value = 'roll the dice ('+hand.rollCount+')';

}

function clickRollTheDice(hand){
    
    if(hand.rollCount <= 0){ //block the button action.
        return;
    }

    hand.rollCount--; //decrease count roll.
    reDrawRollDiceCount(hand); //redraw count.

    if(hand.rollCount <= 0){ //end of game.
        hand.domButtonRollTheDice.setAttribute('disabled', '');
        showButtonRetry('user-board', true);
    }

    //roll the dices.
    for(let i=0; i<hand.dicesValue.length; i++){

        if(hand.isDicesKeep[i]) //skip dice if marked has keep.
            continue;

        let rngDice = Math.ceil(Math.random() * 6);
        hand.dicesValue[i] = rngDice;
        hand.domImgDice[i].setAttribute('src', 'IMG/'+rngDice+'.png');

    }

    //re draw score.
    hand.score = hand.dicesValue.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    },0);
    hand.domScore.innerText = hand.score;

    //roll the dice for bot.
    for(let i=0; i<botHand.dicesValue.length; i++){

        if(botHand.isDicesKeep[i]) //skip dice if marked has keep.
            continue;

        let rngDice = Math.ceil(Math.random() * 6);
        botHand.dicesValue[i] = rngDice;
        botHand.domImgDice[i].setAttribute('src', 'IMG/'+rngDice+'.png');

        //keep or not.
        if(rngDice >= 5){
            botHand.isDicesKeep[i] = true;
            botHand.domButtonKeepDice[i].innerText = 'keep';
        }

    }

    //re draw score for bot.
    botHand.score = botHand.dicesValue.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    },0);
    botHand.domScore.innerText = botHand.score;

    //evalue who is winning.
    hand.domScore.style.color = ((hand.score >= botHand.score)? '#0a590a': '#710e0e');
    botHand.domScore.style.color = ((hand.score < botHand.score)? '#0a590a': '#710e0e');

}

function clickKeepDice(hand, index){
    
    hand.isDicesKeep[index] = true;

    hand.domButtonKeepDice[index].setAttribute('disabled', '');

}