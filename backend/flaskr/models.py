from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String

db = SQLAlchemy()


def setup_db(app):
    """
    Bind flask application and SQLAlchemy service together.
    """
    db.app = app
    db.init_app(app)
    db.create_all()


class Question(db.Model):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True)
    question = Column(String)
    answer = Column(String)
    difficulty = Column(Integer)
    # actually category ID
    category = Column(db.Integer,
                      db.ForeignKey('categories.id'),
                      nullable=False)
    question_category = db.relationship('Category', backref='question_category')

    def __init__(self, question, answer, category, difficulty):
        self.question = question
        self.answer = answer
        self.category = category
        self.difficulty = difficulty

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id, 'question': self.question, 'answer': self.answer,
            'difficulty': self.difficulty, 'category': self.category,
            'category_name': self.question_category.name
        }


class Category(db.Model):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    questions = db.relationship('Question', backref='category_questions')

    def __init__(self, name):
        self.name = name

    def format(self):
        return {'id': self.id, 'name': self.name}
