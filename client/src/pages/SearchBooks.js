import React, { Component } from "react";
import API from "../Utils/API.js";
import Jumbotron from "../Components/Jumbotron";
import { Container, Row, Col } from "../Components/Grid";
import SearchForm from "../Components/SearchForm";
import SearchResult from "../Components/SearchResult";

class SearchBooks extends Component {
  //create state
  state = {
    search: "",
    books: [],
    error: "",
    message: ""
  };

  //function to take value of what enter in the search bar
  handleInputChange = event => {
    this.setState({ search: event.target.value });
  };

  //function to control the submit button of the search form
  handleFormSubmit = event => {
    event.preventDefault();
    // once it clicks it connects to the google book api with the search value
    API.getGoogleSearchBooks(this.state.search)
      .then(res => {
        if (res.data.items === "error") {
          throw new Error(res.data.items);
        } else {
          // store response in a array
          let results = res.data.items;
          //map through the array
          results = results.map(result => {
            //store each book information in a new object
            result = {
              key: result.id,
              id: result.id,
              title: result.volumeInfo.title,
              author: result.volumeInfo.authors,
              description: result.volumeInfo.description,
              image: result.volumeInfo.imageLinks.thumbnail,
              link: result.volumeInfo.infoLink
            };
            return result;
          });
          // reset the sate of the empty books array to the new arrays of objects with properties geting back from the response
          this.setState({ books: results, error: "" });
        }
      })
      .catch(err => this.setState({ error: err.items }));
  };

  handleSavedButton = event => {
    // console.log(event)
    event.preventDefault();
    console.log(this.state.books);
    let savedBooks = this.state.books.filter(
      book => book.id === event.target.id
    );
    savedBooks = savedBooks[0];
    API.saveBook(savedBooks)
      .then(this.setState({ message: alert("Your book is saved") }))
      .catch(err => console.log(err));
  };
  render() {
    return (
      <Container fluid={true}>
        <Jumbotron>
          <h1>Google Book Search</h1>
        </Jumbotron>
        <Container>
          <Row>
            <Col size="12">
              <SearchForm
                handleFormSubmit={this.handleFormSubmit}
                handleInputChange={this.handleInputChange}
              />
            </Col>
          </Row>
        </Container>
        <br />
        <Container>
          <SearchResult
            books={this.state.books}
            handleSavedButton={this.handleSavedButton}
          />
        </Container>
      </Container>
    );
  }
}

export default SearchBooks;
