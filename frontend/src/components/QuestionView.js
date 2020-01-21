import React, { Component } from 'react';

import Question from './Question';
import Search from './Search';
import $ from 'jquery';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Image from 'react-bootstrap/Image'
import Pagination from 'react-bootstrap/Pagination'
import 'bootstrap/dist/css/bootstrap.min.css';


class QuestionView extends Component {
  constructor () {
    super();
    this.state = {
      questions: [],
      page: 1,
      totalQuestions: 0,
      // expected to be keyed by ID with names of categories as values
      categories: {},
      currentCategory: null,
    }
  }

  componentDidMount () {
    this.getQuestions();
  }

  getQuestions = () => {
    $.ajax({
      url: `/questions?page=${this.state.page}`,
      type: "GET",
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          categories: result.categories,
          currentCategory: result.current_category
        })
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again')
        return;
      }
    })
  }

  selectPage (num) {
    this.setState({ page: num }, () => this.getQuestions());
  }

  createPagination () {
    let pageNumbers = [];
    let maxPage = Math.ceil(this.state.totalQuestions / 10)
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === this.state.page}
          onClick={() => { this.selectPage(i) }}>{i}
        </Pagination.Item>
      )
    }
    return pageNumbers;
  }

  getByCategory = (id) => {
    $.ajax({
      url: `/categories/${id}/questions`,
      type: "GET",
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category
        })
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again')
        return;
      }
    })
  }

  submitSearch = (searchTerm) => {
    $.ajax({
      url: `/questions`,
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ searchTerm: searchTerm }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category
        })
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again')
        return;
      }
    })
  }

  questionAction = (id) => (action) => {
    if (action === 'DELETE') {
      if (window.confirm('are you sure you want to delete the question?')) {
        $.ajax({
          url: `/questions/${id}`,
          type: "DELETE",
          success: (result) => {
            this.getQuestions();
          },
          error: (error) => {
            alert('Unable to load questions. Please try your request again')
            return;
          }
        })
      }
    }
  }

  render () {
    return (
      <Container>
        <Row className="justify-content-md-center" style={{ height: 100 }}>
          <Col md={4}>
            <h2 onClick={() => { this.getQuestions() }}>Categories</h2>
          </Col>
          <Col md={8}>
            <h2>Questions</h2>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <ListGroup variant="flush">
              {Object.keys(this.state.categories).map((id, ) => (
                // Object.keys() method returns an array, e.g. Array ["k1", "k2"]
                <ListGroup.Item key={id} onClick={() => { this.getByCategory(id) }}>
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
            <br />
            <Search submitSearch={this.submitSearch} />
          </Col>
          <Col md={8}>
            {this.state.questions.map((q, ind) => (
              <Question
                key={q.id}
                question={q.question}
                answer={q.answer}
                category={this.state.categories[q.category]}
                difficulty={q.difficulty}
                questionAction={this.questionAction(q.id)}
              />
            ))}
            <Pagination>
              {this.createPagination()}
            </Pagination>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default QuestionView;
