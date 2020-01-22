"""
Contains application factory and tells Python that flaskr dir is a package.
"""
from flask import Flask


def create_app(test_config=None):
    """
    Flask application is instance of Flask class.
    Everything about app: config, URLS, etc. are registered with this class.
    Instead of creating Flask instance globally, create it inside function.
    This function is known as ~application factory~.
    Configuration, registration, and other setup will happen inside
    and application will be returned.
    """
    # instance_relative_config = configuration files are relative to instance/
    # instance/ is outside flaskr package
    # and holds local data that shouldn't be committed
    app = Flask(__name__, instance_relative_config=True)
    # default config
    app.config.from_object('config.default')
    if test_config is None:
        # secret stuff that shouldn't be committed goes into instance/config.py
        app.config.from_pyfile('config.py')
        # env var to absolute path of env specific config
        app.config.from_envvar('APP_CONFIG_FILE')
    else:
        app.config.from_mapping(test_config)

    # register the blueprint - all the routes defined in flaskr/views/api.py
    # are registered with app just as if it had been done with @app.route()
    from .api import api
    app.register_blueprint(api)

    from . import models
    models.setup_db(app)

    return app
