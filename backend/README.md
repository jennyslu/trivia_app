# Full Stack Trivia API Backend

## Getting Started

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.

##### Key Dependencies

- [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py. 

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server. 

## Database Setup
With Postgres running, restore a database using the trivia.psql file provided. From the backend folder in terminal run:

```bash
psql trivia < trivia.psql
```

## Running the server

From within the `backend` directory first ensure you are working using your created virtual environment.

Create an instance directory to hold secret values
```
mkdir instance
touch instance/config.py
```
Edit `instance/config.py` to contain any secret values you want.
Also edit `config/development.py` to point to your local databsek.

To run the server, execute:

```bash
export FLASK_APP=flaskr
export FLASK_ENV=development
export APP_CONFIG_FILE=/absolute_path_to_this_dir/trivia-api/backend/config/development.py
flask run
```

Setting the `FLASK_ENV` variable to `development` will detect file changes and restart the server automatically.

Setting the `FLASK_APP` variable to `flaskr` directs flask to use the `flaskr` directory and the `__init__.py` file to find the application. 

Setting the `APP_CONFIG_FILE` variable to environment contains the local database configuration.


## API Reference

### Getting Started
- Base URL: At present this app can only be run locally and is not hosted as a base URL. The backend app is hosted at the default, `http://127.0.0.1:5000/`, which is set as a proxy in the frontend configuration. 
- Authentication: This version of the application does not require authentication or API keys. 

### Error handling

Errors are returned as JSON objects in the following format:
```
{
    "success": False,
    "error": 400,
    "message": "Bad request"
}
```
API will return three error types:
* 400: Bad Request
* 404: Resource Not Found
* 422: Not Processable

### Endpoints

#### GET /categories

* General
   * Request arguments: None
   * Returns success value, json of category ids and names, and total number of books
* Sample `curl -X GET http://127.0.0.1:5000/categories`
```
{
  "categories": {
    "1": "Science",
    "2": "Art",
    "3": "Geography",
    "4": "History",
    "5": "Entertainment",
    "6": "Sports"
  },
  "success": true,
  "total_categories": 6
}
```

#### GET /categories/<category_id>/questions

* General
   * Request arguments: category_id (int)
   * Returns success value, questions within a given category, total number of questions and selected category id
* Sample `curl -X GET http://127.0.0.1:5000/categories/1/questions`
```
{
  "current_category": 1,
  "questions": [
    {
      "answer": "The Liver",
      "category": 1,
      "category_name": "Science",
      "difficulty": 4,
      "id": 20,
      "question": "What is the heaviest organ in the human body?"
    },
    {
      "answer": "Alexander Fleming",
      "category": 1,
      "category_name": "Science",
      "difficulty": 3,
      "id": 21,
      "question": "Who discovered penicillin?"
    },
    {
      "answer": "Blood",
      "category": 1,
      "category_name": "Science",
      "difficulty": 4,
      "id": 22,
      "question": "Hematology is a branch of medicine involving the study of what?"
    }
  ],
  "success": true,
  "total_questions": 3
}
```

#### GET /questions

* General
   * Request arguments: page (int)
   * Returns success value, list of questions, categories, current cateogry, and total questions
   * Results are paginated - limited to 10 questions per page
   * Will return 404 if page is out of index
* Sample `curl -X GET http://127.0.0.1:5000/questions?page=1`
```
{
  "categories": {
    "1": "Science",
    "2": "Art",
    "3": "Geography",
    "4": "History",
    "5": "Entertainment",
    "6": "Sports"
  },
  "current_category": null,
  "questions": [
    {
      "answer": "Apollo 13",
      "category": 5,
      "category_name": "Entertainment",
      "difficulty": 4,
      "id": 2,
      "question": "What movie earned Tom Hanks his third straight Oscar nomination, in 1996?"
    },
    {
      "answer": "Tom Cruise",
      "category": 5,
      "category_name": "Entertainment",
      "difficulty": 4,
      "id": 4,
      "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
    },
    {
      "answer": "Maya Angelou",
      "category": 4,
      "category_name": "History",
      "difficulty": 2,
      "id": 5,
      "question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
    },
    {
      "answer": "Edward Scissorhands",
      "category": 5,
      "category_name": "Entertainment",
      "difficulty": 3,
      "id": 6,
      "question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
    },
    {
      "answer": "Muhammad Ali",
      "category": 4,
      "category_name": "History",
      "difficulty": 1,
      "id": 9,
      "question": "What boxer's original name is Cassius Clay?"
    },
    {
      "answer": "Brazil",
      "category": 6,
      "category_name": "Sports",
      "difficulty": 3,
      "id": 10,
      "question": "Which is the only team to play in every soccer World Cup tournament?"
    },
    {
      "answer": "Uruguay",
      "category": 6,
      "category_name": "Sports",
      "difficulty": 4,
      "id": 11,
      "question": "Which country won the first ever soccer World Cup in 1930?"
    },
    {
      "answer": "Lake Victoria",
      "category": 3,
      "category_name": "Geography",
      "difficulty": 2,
      "id": 13,
      "question": "What is the largest lake in Africa?"
    },
    {
      "answer": "The Palace of Versailles",
      "category": 3,
      "category_name": "Geography",
      "difficulty": 3,
      "id": 14,
      "question": "In which royal palace would you find the Hall of Mirrors?"
    },
    {
      "answer": "Agra",
      "category": 3,
      "category_name": "Geography",
      "difficulty": 2,
      "id": 15,
      "question": "The Taj Mahal is located in which Indian city?"
    }
  ],
  "success": true,
  "total_questions": 20
}
```

#### DELETE /questions/<question_id>

* General
   * Request arguments: question_id (int)
   * Returns success value, and deleted question_id
   * Will return 404 if question doesn't exist
* Sample `curl -X DELETE http://127.0.0.1:5000/questions/4`
```
{
  "deleted": 4,
  "success": true
}
```

#### POST /questions

* General
    * Posting can either search or add question
    * SEARCH request arguments: searchTerm (str)
    * SEARCH returns success value, list of questions, total_questions, and current category
    * ADD request arguments: question (str), answer (str), category (int), difficulty (int)
    * ADD returns success value, new_question_id
    * Will return 400 if request is not valid
* Sample `curl -X POST http://127.0.0.1:5000/questions -H "Content-Type: application/json" -d '{"question": "question", "answer": "answer", "category": 5, "difficulty": 5}'`
```
{
  "new_question_id": 32,
  "success": true
}
```
* Sample `curl -X POST http://127.0.0.1:5000/questions -H "Content-Type: application/json" -d '{"searchTerm": "title"}'`
```
{
  "current_category": null,
  "questions": [
    {
      "answer": "Maya Angelou",
      "category": 4,
      "category_name": "History",
      "difficulty": 2,
      "id": 5,
      "question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
    },
    {
      "answer": "Edward Scissorhands",
      "category": 5,
      "category_name": "Entertainment",
      "difficulty": 3,
      "id": 6,
      "question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
    }
  ],
  "success": true,
  "total_questions": 2
}
```

#### POST /quizzes

* General
   * Request arguments: previous_questions (list), quiz_category (dict)
   * Returns success value, question, and previous questions list
* Sample `curl -X POST http://127.0.0.1:5000/quizzes -H "Content-Type: application/json" -d '{"previous_questions": [], "quiz_category": {"type": "ALL", "id": "0"}}'`
```
{
  "previous_questions": [
    5
  ],
  "question": {
    "answer": "Maya Angelou",
    "category": 4,
    "category_name": "History",
    "difficulty": 2,
    "id": 5,
    "question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
  },
  "success": true
}
```

## Testing
To run the tests, run
```
dropdb trivia_test
createdb trivia_test
# run this from within backend/ dir - shows test coverage and any intermediate stdout statements
pytest -s --cov=flaskr tests/
```

## Deployment
N/A

## Authors
Me

## Acknowledgements 
The awesome team at Udacity and all of the students, soon to be full stack extraordinaires! 
