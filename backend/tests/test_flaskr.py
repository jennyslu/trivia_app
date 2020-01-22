from flaskr import create_app
from flaskr.api import QUESTIONS_PER_PAGE


def test_config():
    # make sure passing in test config works as expected
    assert not create_app().testing
    assert create_app({'TESTING': True}).testing


def test_hello(client):
    response = client.get('/hello').get_json()
    assert response == {'message': 'Hello world!'}


def test_get_categories(client):
    response = client.get('/categories').get_json()
    categories = {
        "1": 'Science', "2": 'Art', "3": 'Geography', "4": 'History', "5": 'Entertainment',
        "6": 'Sports'
    }
    assert response['success']
    assert response['categories'] == categories
    assert response['total_categories'] == len(categories)


class TestGetQuestions(object):
    def test_get_questions_success(self, client):
        response = client.get('/questions?page=1').get_json()
        assert response['success']
        assert len(response["questions"]) == QUESTIONS_PER_PAGE
        # 20 questions inserted in sample test data
        assert response["total_questions"] == 20

    def test_get_questions_failure(self, client):
        response = client.get('/questions?page=10').get_json()
        assert not response['success']
        assert response['error'] == 404


class TestGetCategoryQuestions(object):
    def test_get_category_questions_success(self, client):
        category_id = 2
        response = client.get('/categories/{}/questions'.format(category_id)).get_json()
        assert response["success"]
        assert response["current_category"] == category_id
        assert response["total_questions"] == 4
        for question in response["questions"]:
            assert question["category"] == 2
            assert question["category_name"] == "Art"

    def test_get_category_questions_failure(self, client):
        category_id = 10
        response = client.get('/categories/{}/questions'.format(category_id)).get_json()
        assert not response["success"]
        assert response["error"] == 404


class TestAddSearchQuestions(object):
    def test_search_question_success(self, client):
        search_term = "title"
        response = client.post('/questions', json={'searchTerm': search_term}).get_json()
        assert response["success"]
        for question in response["questions"]:
            assert search_term in question["question"]

    def test_add_question_success(self, client):
        response = client.post(
            '/questions',
            json={'question': 'A question', 'answer': 'An answer', 'category': 1,
                  'difficulty': 5}).get_json()
        assert response["success"]
        assert response["new_question_id"]

    def test_add_question_failure(self, client):
        response = client.post('/questions', json={'random': 'json'}).get_json()
        assert not response["success"]
        assert response["error"] == 400


class TestDeleteQuestions(object):
    def test_delete_question_success(self, client):
        question_id = 5
        response = client.delete('/questions/{}'.format(question_id)).get_json()
        assert response["success"]
        assert response["deleted"] == question_id

    def test_delete_question_failure(self, client):
        question_id = 100
        response = client.delete('/questions/{}'.format(question_id)).get_json()
        assert not response["success"]
        assert response["error"] == 404


class TestQuiz(object):
    def test_quiz_no_category_chosen_success(self, client):
        response = client.post('/quizzes', json={'previous_questions': [],
                                                 'quiz_category': None}).get_json()
        assert response["success"]
        assert response["previous_questions"][-1] == response["question"]['id']

    def test_quiz_category_chosen_success(self, client):
        response = client.post('/quizzes', json={'previous_questions': [2],
                                                 'quiz_category': {'type': 'Entertainment',
                                                                   'id': '5'}}).get_json()
        assert response["success"]
        assert 2 in response["previous_questions"]
        assert response["question"]["id"] != 2
        assert response["previous_questions"][-1] == response["question"]['id']

    def test_quiz_category_no_more_questions(self, client):
        response = client.post('/quizzes', json={'previous_questions': [2, 4, 6],
                                                 'quiz_category': {'type': 'Entertainment',
                                                                   'id': '5'}}).get_json()
        assert response["success"]
        assert 2 in response["previous_questions"]
        assert 4 in response["previous_questions"]
        assert response["question"] is None
