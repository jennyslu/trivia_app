import React, { Component } from 'react';
import $ from 'jquery';

import '../stylesheets/QuizView.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

const questionsPerPlay = 5;

class QuizView extends Component {
  constructor (props) {
    super();
    this.state = {
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      categories: {},
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false
    }
  }

  componentDidMount () {
    $.ajax({
      url: `/categories`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ categories: result.categories })
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again')
        return;
      }
    })
  }

  selectCategory = ({ type, id = 0 }) => {
    this.setState({ quizCategory: { type, id } }, this.getNextQuestion)
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  getNextQuestion = () => {
    const previousQuestions = [...this.state.previousQuestions]
    if (this.state.currentQuestion.id) { previousQuestions.push(this.state.currentQuestion.id) }

    $.ajax({
      url: '/quizzes', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        previous_questions: previousQuestions,
        quiz_category: this.state.quizCategory
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        this.setState({
          showAnswer: false,
          previousQuestions: previousQuestions,
          currentQuestion: result.question,
          guess: '',
          forceEnd: !!result.question  // result.question ? false : true
        })
        return;
      },
      error: (error) => {
        alert('Unable to load question. Please try your request again')
        return;
      }
    })
  }

  submitGuess = (event) => {
    event.preventDefault();
    let evaluate = this.evaluateAnswer()
    this.setState({
      numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
      showAnswer: true,
    })
  }

  restartGame = () => {
    this.setState({
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false
    })
  }

  renderPrePlay () {
    return (
      <Container>
        <Row className="justify-content-md-center" style={{ height: 100 }}>
          <Col md={4}>
            <h2>Choose category</h2>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item
                className="play-category"
                onClick={this.selectCategory}>ALL</ListGroup.Item>
              {Object.keys(this.state.categories).map((id, ) => (
                // Object.keys() method returns an array, e.g. Array ["k1", "k2"]
                <ListGroup.Item
                  className="play-category" key={id}
                  onClick={() => this.selectCategory({ type: this.state.categories[id], id })}>
                  <Row className="justify-content-md-space-between">
                    <Col>
                      {this.state.categories[id]}
                    </Col>
                    <Col md={2}>
                      <Image src={`${this.state.categories[id]}.svg`} fluid style={{ height: 30, width: 30 }}></Image>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }

  renderFinalScore () {
    return (
      <div className="quiz-play-holder">
        <div className="final-header"> Your Final Score is {this.state.numCorrect}</div>
        <br />
        <Button variant="primary" type="submit" onClick={this.restartGame}>Play again?</Button>
      </div>
    )
  }

  evaluateAnswer = () => {
    const formatGuess = this.state.guess.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase()
    const answerArray = this.state.currentQuestion.answer.toLowerCase().split(' ');
    return answerArray.includes(formatGuess)
  }

  renderCorrectAnswer () {
    let evaluate = this.evaluateAnswer()
    return (
      <div className="quiz-play-holder">
        <div className="quiz-question">{this.state.currentQuestion.question}</div>
        <div className={`${evaluate ? 'correct' : 'wrong'}`}>{evaluate ? "You were correct!" : "You were incorrect"}</div>
        <div className="quiz-answer">{this.state.currentQuestion.answer}</div>
        <Button variant="primary" type="submit" onClick={this.getNextQuestion}>Next question</Button>
      </div>
    )
  }

  renderPlay () {
    return this.state.previousQuestions.length === questionsPerPlay || this.state.forceEnd
      ? this.renderFinalScore()
      : this.state.showAnswer
        ? this.renderCorrectAnswer()
        : (
          <div className="quiz-play-holder">
            <div className="quiz-question">{this.state.currentQuestion.question}</div>
            <Form onSubmit={this.submitGuess}>
              <Form.Group>
                <Form.Control type="text" name="guess" onChange={this.handleChange} />
              </Form.Group>
              <Button type="submit">Guess</Button>
            </Form>
          </div>
        )
  }


  render () {
    // if quizCategory is null (initial state) then render PrePlay, else Play
    return this.state.quizCategory
      ? this.renderPlay()
      : this.renderPrePlay()
  }
}

export default QuizView;
