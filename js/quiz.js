//Global Variables
let correctAnswer, correctNumber, incorrectNumber;


//Event Listener
document.addEventListener('DOMContentLoaded',loadsQuestions);

//Function Definition
async function loadsQuestions() {
    loadfromLS();
    console.log("Loading Queations");
    const url = 'http://opentdb.com/api.php?amount=1';
    const response = await new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET',url, true);
        xhr.onreadystatechange = () => {
            if(xhr.status== 200 && xhr.readyState == 4){
                resolve(xhr.responseText);
            }
            else if (xhr.onerror){
                return reject('Error!!');
            }
        }
        xhr.send();
        
    });

    const responseJSON = JSON.parse(response);
    displayQuestions(responseJSON.results);
}
//Displayes the Questions from API
function displayQuestions(questions){
    console.log("Downloaded question: ",questions);
    const questionHTML = document.createElement('div');
    questionHTML.classList.add('mt-4','col-12');
    questions.forEach((question) => {
    correctAnswer = question.correct_answer;
    //Extract the array of of incorrect answers
    const wrongAnswers = question.incorrect_answers;
    //Inject correct answer into the correct answer array
    const randomSpot = (Math.floor(Math.random()*3));
    wrongAnswers.splice(randomSpot,0,correctAnswer);
    questionHTML.innerHTML = `
    <div  class='row justify-content-between heading'>
    <p class='category'>Category: ${question.category}</p>
    <div>
    <span class='badge badge-success'>${correctNumber}</span>
    <span class='badge badge-danger'>${incorrectNumber}</span>
    </div>
    </div>
    <h2 class='text-center'>${question.question}</h2>
    `;
    //Generate HTML for possible answers
    const answerDiv = document.createElement('div');
    answerDiv.className += 'questions row justify-content-around mt-4';
    wrongAnswers.forEach(answer => {
        const answerHTML  = document.createElement('li');
        answerHTML.className += 'col-12 col-md-15';
        answerHTML.textContent=answer;
        //Add Event Listener to the answer
        answerHTML.onclick = selectAnswer;
        answerDiv.appendChild(answerHTML);
    });
    questionHTML.appendChild(answerDiv);
    //Render HTML on the document
    document.querySelector('#app').appendChild(questionHTML);
    });
}
function selectAnswer(e){
    e.preventDefault();
    //Remove the previouse active target
    if(document.querySelector('.active')){
        document.querySelector('.active').classList.remove('active');
    }
    e.target.classList.add('active')
   //console.log('Target', e.target)
}
//Check if the answer is correct
document.querySelector('#check-answer').onclick = (e)=>{
    e.preventDefault();
    if(document.querySelector('.active')){
        //Everything is fine the user has selected at least one answer
        //Check if answer is correct
        checkAmswer();
    }
    else{
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('alert','alert-danger','col-md-4');
        errorDiv.textContent = 'Please Select One Answer';
        //Select the question div to insert the alert;
        document.querySelector('.questions').appendChild(errorDiv);
        setTimeout(()=>{
            errorDiv.remove();
        },3000)
        //console.log('PLease select one answer');
    }
    //console.log('Target', e.target);
}
//Check if the answer is correct
function checkAmswer(){
    const userAnswer = document.querySelector('.active').textContent;
    if(userAnswer === correctAnswer){
    // console.log('userAnswer: %s \ncorrectAnser: %s', userAnswer,correctAnswer);
    correctNumber++;
    console.log('correctNumber: ', correctNumber);
    }
    else{
        incorrectNumber++;
        console.log('incorrectNumber: ', incorrectNumber);
    }
    //Safe values into local storage
    safeIntoLS();
    //Clear Screen and add new question to scree. Render new value to screen
    const app = document.querySelector('#app');
    while(app.firstChild){
        app.removeChild(app.firstChild);
    }
    loadsQuestions();
}
safeIntoLS = () =>{
    localStorage.setItem('correct_count',correctNumber);
    localStorage.setItem('incorrect_count',incorrectNumber)
}
loadfromLS = () => {
    correctNumber = localStorage.getItem('correct_count');
    if(correctNumber===null){
        correctNumber = 0;
    }
    incorrectNumber = localStorage.getItem('incorrect_count');
    if(incorrectNumber===null){
        incorrectNumber = 0;
    }
}
document.querySelector('#clear-storage').onclick =()=>{
    localStorage.setItem('correct_count',0);
    localStorage.setItem('incorrect_count',0);
    // const app = document.querySelector('#app');
    // while(app.firstChild){
    //     app.removeChild(app.firstChild);
    // }
    // loadsQuestions();
    //OR
    setTimeout(() => {
        window.location.reload();
    }, 500);
}