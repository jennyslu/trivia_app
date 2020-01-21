import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
      query: '',
    }
  }

  getInfo = (event) => {
    event.preventDefault();
    this.props.submitSearch(this.state.query)
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value
    })
  }

  render () {
    return (
      <Form onSubmit={this.getInfo}>
        <FormControl
          as="input" type="text"
          placeholder="Search questions..."
          // React also supports another way to set refs called “callback refs”
          // Instead of passing a ref attribute created by createRef(), you pass a function.
          // The function receives the React component instance or HTML DOM element
          // as its argument, which can be stored and accessed elsewhere. 
          // use the ref callback to store a reference to a DOM node in an instance property.
          ref={input => this.search = input}
          onChange={this.handleInputChange} />
        <Button type="submit" variant="primary">Search</Button>
      </Form>
    )
  }
}

export default Search
