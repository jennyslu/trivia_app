import React, { Component } from 'react';
import '../stylesheets/Question.css';
import Media from 'react-bootstrap/Media'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

class Question extends Component {
  constructor () {
    super();
    this.state = {
      visibleAnswer: false
    }
  }

  flipVisibility () {
    this.setState({ visibleAnswer: !this.state.visibleAnswer });
  }

  render () {
    const { question, answer, category, difficulty } = this.props;
    return (
      <div class="Question-holder">
      <Media>
        <img width={40} height={40} className='mr-3' src={`${category}.svg`} />
        <Media.Body>
          <h5>{question}</h5>
          <Accordion>
            <Card>
              <Card.Header>
                <Accordion.Toggle
                  onClick={() => this.flipVisibility()}
                  as={Button} variant="link" eventKey="0">
                  {this.state.visibleAnswer ? 'Hide answer' : 'Show answer'}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>{answer}</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Row className="justify-content-space-between align-items-center">
            <Col>
            Difficulty: {difficulty}
            </Col>
            <Col md={2}>
            <img
              src="delete.png"
              className="delete"
              onClick={() => this.props.questionAction('DELETE')} />
            </Col>
          </Row>
        </Media.Body>
      </Media>
      </div>
    );
  }
}

export default Question;
