import logging

from flask import Blueprint, abort, jsonify, request
from flask_cors import CORS
from sqlalchemy import or_

from .models import Category, Question

logger = logging.getLogger(__name__)
api = Blueprint('API', __name__)
# enable CORS on this blueprint, default origins='*'
CORS(api)

QUESTIONS_PER_PAGE = 10


# CORS Headers
@api.after_request
def after_request(response):
    # True to allow content-type authorization
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
    # all methods we are intending to use
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@api.route('/hello')
def get_greeting():
    return jsonify({'message': 'Hello world!'})


@api.route('/categories', methods=['GET'])
def get_categories():
    """
    Endpoint to handle GET requests for all available categories.
    """
    categories = Category.query.order_by(Category.id).all()
    formatted_categories = {c.id: c.name for c in categories}
    return jsonify(
        {'success': True, 'categories': formatted_categories, 'total_categories': len(categories)})


@api.route('/questions', methods=['GET'])
def get_questions():
    """
    Get all questions in all categories.
    """
    # get page value from url params
    page = request.args.get('page', 1, type=int)
    start = (page - 1) * QUESTIONS_PER_PAGE
    end = start + QUESTIONS_PER_PAGE
    questions = Question.query.order_by(Question.id).all()
    # even if the index is out of range this list comp doesn't fail
    formatted_qs = [q.format() for q in questions[start:end]]
    # valid endpoint but resource doesn't exist
    if len(formatted_qs) == 0:
        abort(404)
    else:
        categories = {c.id: c.name for c in Category.query.order_by(Category.id).all()}
        return jsonify({
            'success': True, 'questions': formatted_qs, 'categories': categories,
            'current_category': None, 'total_questions': len(questions)
        })


@api.route('/categories/<int:category_id>/questions', methods=['GET'])
def get_category_questions(category_id):
    """
    Get all questions in one category.
    """
    category = Category.query.get(category_id)
    questions = category.questions
    if len(questions) == 0:
        abort(404)
    else:
        formatted_qs = [q.format() for q in questions]
        return jsonify({
            'success': True, 'questions': formatted_qs, 'total_questions': len(questions),
            'current_category': category_id
        })


@api.route('/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    """
    Delete question of given id.
    """
    question = Question.query.get(question_id)
    if question is None:
        abort(404)
    else:
        question.delete()
        return jsonify({'success': True, 'deleted': question_id})


@api.route('/questions', methods=['POST'])
def add_or_search_questions():
    """
    Add new question OR search for question.
    Search and new question both use same endpoint and method (POST).
    Use request data to determine which one client wants.
    """
    request_data = request.get_json()
    # searchTerm in POST request for search
    if 'searchTerm' in request_data:
        sql_search = "%{}%".format(request_data["searchTerm"])
        questions = Question.query.filter(
            or_(Question.question.ilike(sql_search),
                Question.answer.ilike(sql_search))).order_by(Question.id).all()
        formatted_qs = [q.format() for q in questions]
        return jsonify({
            'success': True, 'questions': formatted_qs, 'total_questions': len(questions),
            'current_category': None
        })
        pass
    else:
        # category is string in form because JS object key but needs to be int for DB
        request_data['category'] = int(request_data['category'])
        try:
            new_question = Question(**request_data)
            new_question.insert()
            return jsonify({'success': True, 'new_question_id': new_question.id})
        except Exception as e:
            logger.critical('POST to /questions failed: %s', e, exc_info=True)
            abort(400)


@api.route('/quizzes', methods=['POST'])
def quiz():
    """
    Play trivia game.
    Request gets posted with
     {'previous_questions': [],
      'quiz_category': {'type': 'Science', 'id': '1'}}
    Should return a question that was not previously seen already from the chosen category.
    """
    request_data = request.get_json()
    category = Category.query.get(int(request_data['quiz_category']['id']))
    # no category chosen
    if category is None:
        questions = Question.query.all()
    else:
        questions = category.questions
    remaining_qs = [q for q in questions if q.id not in request_data["previous_questions"]]
    # if there are still remaining questions
    if remaining_qs:
        next_q = remaining_qs[0].format()
        new_prev_qs = request_data["previous_questions"].extend([next_q["id"]])
        return jsonify({'success': True, 'question': next_q, 'previous_questions': new_prev_qs})
    # no more remaining questions
    else:
        return jsonify({'success': True, 'question': None, 'previous_questions': request_data["previous_questions"]})


@api.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 404, 'message': 'Resource not found'}), 404


@api.errorhandler(400)
def bad_request(error):
    return jsonify({'success': False, 'error': 400, 'message': 'Bad request'}), 400


'''
@TODO: 
Create a POST endpoint to get questions to play the quiz. 
This endpoint should take category and previous question parameters 
and return a random questions within the given category, 
if provided, and that is not one of the previous questions. 

TEST: In the "Play" tab, after a user selects "All" or a category,
one question at a time is displayed, the user is allowed to answer
and shown whether they were correct or not. 
'''
'''
@TODO: 
Create error handlers for all expected errors 
including 404 and 422. 
'''
