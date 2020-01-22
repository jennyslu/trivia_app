import os

import pytest

from flaskr import create_app
from flaskr.models import db

with open(os.path.join(os.path.dirname(__file__), 'data.sql'), 'rb') as f:
    _data_sql = f.read().decode('utf8')


@pytest.fixture(scope='session')
def app():
    app = create_app(
        test_config={
            'TESTING': True,
            'SQLALCHEMY_DATABASE_URI': 'postgresql://jlu@localhost:5432/trivia_test',
            'SQLALCHEMY_TRACK_MODIFICATIONS': False
        })
    # populate test database with test data
    db.engine.execute(_data_sql)
    yield app

    print('app teardown')
    db.drop_all()
    # db.engine.execute('DROP TABLE questions; DROP TABLE categories;')
    db.session.close()


@pytest.fixture(scope='session')
def client(app):
    return app.test_client()


@pytest.fixture(scope='session')
def runner(app):
    return app.test_cli_runner()
