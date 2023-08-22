//select elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

//set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            console.log(questionsObject);
            let qCount = questionsObject.length;

            //create bullets + set questions count
            createBullets(qCount)

            //add question data
            addQuestionData(questionsObject[currentIndex],qCount)

            //start countdown
            countdown(60,qCount)

            //click on submit
            submitButton.onclick = () => {
                if(currentIndex < qCount) {
                    let theRightAnswer = questionsObject[currentIndex].right_answer
                    currentIndex++
                    //check the answer
                    checkAnswer(theRightAnswer,qCount)

                    //remove previous question
                    quizArea.innerHTML = "";
                    answersArea.innerHTML = "";

                    //add question data
                    addQuestionData(questionsObject[currentIndex],qCount)

                    //handle bullets class
                    handleBullets();

                    //start countdown
                    clearInterval(countdownInterval);
                    countdown(60,qCount)

                    //show results
                    showResults(qCount);
                }
            }
        }
    }

    myRequest.open("GET","html_questions.json",true);
    myRequest.send()
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    //create spans
    for(let i=0;i<num; i++){
        //create bullet
        let theBullet = document.createElement("span");

        //check if it's the first span
        if(i === 0){
            theBullet.className = "on";
        }

        //append bullet to main container
        bulletsSpanContainer.appendChild(theBullet);

    }
}

function addQuestionData(obj,count) {
    if(currentIndex < count) {
        //create H2 question title
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj.title);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);

        //create the answers
        for(let i=1;i<=4;i++){
            //create main answer div
            let mainDiv = document.createElement("div")
            mainDiv.className = "answer";

            //create radio input
            let radioInput = document.createElement("input");
            //add type  + Name + Id + data-attribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            //make first option selected
            if(i===1){
                radioInput.checked = true
            }

            //create label
            let theLabel = document.createElement("label");
            theLabel.htmlFor = `answer_${i}`;
            theLabelText = document.createTextNode(obj[`answer_${i}`])
            theLabel.appendChild(theLabelText);

            //add input + label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            //add all divs to answers area
            answersArea.appendChild(mainDiv)
        }
    }

}

function checkAnswer(rAnswer,count) {
    let answers = document.getElementsByName('question');
    let theChoosenAnswer;

    for(let i=0;i<answers.length;i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    console.log(`Right Answer: ${rAnswer}`);
    console.log(`Choosen Answer: ${theChoosenAnswer}`);

    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
        console.log("Good Answer");
    }
}


function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) => {
        if(currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResults(count){
    let theResults;
    if(currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers > count / 2 && rightAnswers < count){
            theResults = `<span class="good">Good</span>, ${rightAnswers} of ${count}`;
        }else if(rightAnswers === count){
            theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} of ${count}`;
        }else{
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} of ${count}`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "20px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "20px";
    }
}

function countdown(duration,count) {
    if(currentIndex < count) {
        let minutes,seconds;
        countdownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            
            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if(--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }

        },1000);
    }
}