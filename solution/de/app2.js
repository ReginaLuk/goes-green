const headElem = document.getElementById("head");
const buttonsElem = document.getElementById("buttons");
const pagesElem = document.getElementById("pages");

//The class that represents the test itself
class Quiz
{
	constructor(type, questions, results)
	{
		//Test type: 1 - classic test with correct answers, 2 - test without correct answers
		this.type = type;

		//Array with questions
		this.questions = questions;

		//Array with possible results
		this.results = results;

		//Number of points scored
		this.score = 0;

		//Array result number
		this.result = 0;

		//Current issue number
		this.current = 0;
	}

	Click(index)
	{
		//Adding points
		let value = this.questions[this.current].Click(index);
		this.score += value;

		let correct = -1;

		//If at least one point was added, then we consider that the answer is correct
		if(value >= 1)
		{
			correct = index;
		}
		else
		{
			//Otherwise, we are looking for which answer may be correct
			for(let i = 0; i < this.questions[this.current].answers.length; i++)
			{
				if(this.questions[this.current].answers[i].value >= 1)
				{
					correct = i;
					break;
				}
			}
		}

		this.Next();

		return correct;
	}

	//Move to next question
	Next()
	{
		this.current++;
		
		if(this.current >= this.questions.length) 
		{
			this.End();
		}
	}

	//If there are no more questions, this method will check what result the user got
	End()
	{
		for(let i = 0; i < this.results.length; i++)
		{
			if(this.results[i].Check(this.score))
			{
				this.result = i;
			}
		}
	}
} 

//Class representing the question
class Question 
{
	constructor(text, answers)
	{
		this.text = text; 
		this.answers = answers; 
	}

	Click(index) 
	{
		return this.answers[index].value; 
	}
}

//Class representing the response
class Answer 
{
	constructor(text, value) 
	{
		this.text = text; 
		this.value = value; 
	}
}

//Class representing the result
class Result 
{
	constructor(text, value)
	{
		this.text = text;
		this.value = value;
	}

	//This method checks if the user has collected enough points
	Check(value)
	{
		if(this.value <= value)
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
}

//Array with results
const results = 
[
	new Result("You need to watch the video a little more closely", 0),
	new Result("Not a bad result", 2),
	new Result("Your level is above average", 4),
	new Result("You know the topic perfectly", 6)
];

//Array with questions
const questions = 
[
	new Question("When was developed first electric vehicle? ", 
	[
		new Answer("In 1894", 0),
		new Answer("I don't now", 0),
		new Answer("Of the 19th end", 0),
		new Answer("Of the 19th century", 1)
	]),

	new Question("How do electric vehicles work?", 
	[
		new Answer("I don't now", 0),
		new Answer("When you start the electric engine starts running", 0),
		new Answer("Instead of an internal combustion engine electric vehicles are quipped whith an electric motor", 1),
		new Answer("I'll watch the video better", 0)
	]),

	new Question("How many cars are there on the road?", 
	[
		new Answer("1 billion cars", 0),
		new Answer("4 billion cars", 0),
		new Answer("1 billion cars", 1),
		new Answer("1 million cars", 0)
	]),

	new Question("How many of them are electric cars?", 
	[
		new Answer("8 million", 1),
		new Answer("16 million", 0),
		new Answer("Very little", 0),
		new Answer("4 million", 0)
	]),

	new Question("What is the advantage of electric cars? ", 
	[
		new Answer("Lower noises", 1),
		new Answer("Low CO2 emission", 1),
		new Answer("I'll watch the video better", 0),
		new Answer("Cool car", 0)
	]),

	new Question("What other types of cars are there? ", 
	[
		new Answer("Electric vehicles", 0),
		new Answer("Hibrid vehicles", 0),
		new Answer("Hybrid vehicles", 1),
		new Answer("I don't now", 0)
	])
];

//The test itself
const quiz = new Quiz(1, questions, results);

Update();

//Test update
function Update()
{
	//Let's check if there are any other questions
	if(quiz.current < quiz.questions.length) 
	{
		//If yes, change the question in the title
		headElem.innerHTML = quiz.questions[quiz.current].text;

		//Removing old answer options
		buttonsElem.innerHTML = "";

		//Creating buttons for new answer options
		for(let i = 0; i < quiz.questions[quiz.current].answers.length; i++)
		{
			let btn = document.createElement("button");
			btn.className = "button";

			btn.innerHTML = quiz.questions[quiz.current].answers[i].text;

			btn.setAttribute("index", i);

			buttonsElem.appendChild(btn);
		}
		
		//Displays the number of the current question
		pagesElem.innerHTML = (quiz.current + 1) + " / " + quiz.questions.length;

		//Call a function that will attach events to new buttons
		Init();
	}
	else
	{
		//If this is the end, then print the result
		buttonsElem.innerHTML = "";
		headElem.innerHTML = quiz.results[quiz.result].text;
		pagesElem.innerHTML = "Points: " + quiz.score;
	}
}

function Init()
{
	//Finding all the buttons
	let btns = document.getElementsByClassName("button");

	for(let i = 0; i < btns.length; i++)
	{
		//Attaching an event for each individual button
		//When the button is clicked, the function will be called Click()
		btns[i].addEventListener("click", function (e) { Click(e.target.getAttribute("index")); });
	}
}

function Click(index) 
{
	//We get the number of the correct answer
	let correct = quiz.Click(index);

	//Finding all the buttons
	let btns = document.getElementsByClassName("button");

	//Making the buttons gray
	for(let i = 0; i < btns.length; i++)
	{
		btns[i].className = "button button_passive";
	}

	//If this is a test with correct answers, then we highlight the correct answer in green and the wrong answer in red.
	if(quiz.type == 1)
	{
		if(correct >= 0)
		{
			btns[correct].className = "button button_correct";
		}

		if(index != correct) 
		{
			btns[index].className = "button button_wrong";
		} 
	}
	else
	{
		//Otherwise, we simply highlight the user’s response in green
		btns[index].className = "button button_correct";
	}

	//Wait a second and update the test
	setTimeout(Update, 1000);
}