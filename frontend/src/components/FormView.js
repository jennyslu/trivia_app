import React, { Component } from 'react';
import $ from 'jquery';

import '../stylesheets/FormView.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

class FormView extends Component {
  constructor (props) {
    super();
    this.state = {
      question: "",
      answer: "",
      difficulty: 1,
      category: 1,
      // expected to be keyed by category ID with name as values
      categories: {}
    }
  }

  componentDidMount () {
    $.ajax({
      url: `/categories`,
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


  submitQuestion = (event) => {
    event.preventDefault();
    $.ajax({
      url: '/questions', //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        question: this.state.question,
        answer: this.state.answer,
        difficulty: this.state.difficulty,
        category: this.state.category
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-question-form").reset();
        return;
      },
      error: (error) => {
        alert('Unable to add question. Please try your request again')
        return;
      }
    })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render () {
    return (
      <Container>
        <Row className="justify-content-md-center" style={{ height: 100 }}>
          <Col md={3}>
            <h2>Add question</h2>
          </Col>
        </Row>
        <Row>
          <Form onSubmit={this.submitQuestion} id="add-question-form">
            <Form.Group>
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea" rows="2"
                type="text" name="question"
                onChange={this.handleChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Answer</Form.Label>
              <Form.Control
                as="textarea" rows="2"
                type="text" name="answer"
                onChange={this.handleChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Difficulty</Form.Label>
              <Form.Control
                as="select"
                name="difficulty"
                onChange={this.handleChange}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                onChange={this.handleChange}>
                {Object.keys(this.state.categories).map(id => {
                  // Object.keys() method returns an array, e.g. Array ["k1", "k2"]
                  return (
                    <option key={id} value={id}>{this.state.categories[id]}</option>
                  )
                })}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Row>
      </Container>
    );
  }
}

export default FormView;
