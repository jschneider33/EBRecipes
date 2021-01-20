import React, { Component } from "react";
import { withRouter } from "react-router-dom"

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

import { compose } from 'recompose';

import { Container, Row, Col } from 'react-bootstrap';

import './index.css';

// import unirest from 'unirest';
import axios from 'axios';
import { API } from "aws-amplify"

// const NewRecipePage = () => (
//     // <AuthUserContext.Consumer>
//     //   {authUser => (
//         <div>
//           {/* <h1>Account: {authUser.email}</h1> */}
//           <NewRecipeForm />
//         </div>
//     //   )}
//     // </AuthUserContext.Consumer>
//   );


class NewRecipeForm extends Component {
    constructor(props) {
        super(props);
  
        this.state = {
            currentUrl: '',
            loading: false,
            recipe: [],
            body: [],
        };
      }
    
    onChange = event => {
      const newUrl = event.target.value;

      this.setState({
        currentUrl: newUrl,
      })
    }

    onSubmit = e => {
        this.setState({ loading: true })

        const { currentUrl } = this.state
 
        // var req = unirest("POST", "https://mycookbook-io1.p.rapidapi.com/recipes/rapidapi");

        // req.headers({
        //     "content-type": "application/xml",
        //     "x-rapidapi-key": process.env.RAPIDAPI_API_KEY,
        //     "x-rapidapi-host": process.env.RAPIDAPI_API_HOST,
        //     "useQueryString": true
        // });
    
        // req.send(currentUrl);

          const myUrl = {
            body:{
              currentUrl
            }
          }

// Axios            
        var options = {
          method: 'POST',
          url: 'https://mycookbook-io1.p.rapidapi.com/recipes/rapidapi',
          headers: {
            'content-type': 'application/xml',
            'x-rapidapi-key': process.env.RAPIDAPI_API_KEY,
            'x-rapidapi-host': 'mycookbook-io1.p.rapidapi.com'
          },
          data: currentUrl
        };
        
        axios.request(options)
          .then(res => {
            
            const r = res.data.body[0];

            const createdDate = Date.now();
            const lastUpdated = Date.now();
            const createdBy = this.props.firebase.auth.currentUser.uid;
            var newRec = this.props.firebase.addRecipe().push();
            newRec.set({
              name: r.name,
              image: r.images[0],
              description: r.description,
              ingredients: r.ingredients,
              instructions: r.instructions[0].steps,
              yield: r.yield,
              prepTime: r["prep-time"],
              cookTime: r["cook-time"],
              totalTime: r["total-time"],
              url: r.url,
              dateAdded: createdDate,
              lastUpdated: lastUpdated,
              uploadedBy: createdBy,
            });

            this.props.firebase
              .addToUserRecList(newRec.key)
              .set(r.name)
              .then(console.log("Added to User Recipe List"))
              .catch(err => {
                console.log(err);
              });

            this.props.firebase
              .addRecipeUserPair(newRec.key)
              .set(this.props.firebase.auth.currentUser.uid)
              .then(() => {
                console.log("Added Recipe User Pair")
                this.setState({
                  body: r
                })
                this.props.history.push({
                  pathname: '/'
                });
              })
              .catch(err => {
                console.log(err);
              })
            })
            .catch(err => {
              console.error(err);
              // return res.status(500).send("Error")
            });

        
        e.preventDefault();

    }

    onSubmitt = event => {
      console.log("SUBMITTTTTTTTTED!")
      event.preventDefault();
    }

  render() {
      const { recipe, users, loading, currentUrl } = this.state

      const rec = recipe[0];
      
      return (
      <div className="divMain">
        <h3>Add a new Recipe</h3>
        {loading && <div>Loading ...</div>}

        <form onSubmit={this.onSubmit} className="newUrlForm">
          <label>
            {/* Enter Recipe URL */}
            <input 
              type="text"
              value={currentUrl}
              name="currentUrl"
              onChange={this.onChange}
              className="newUrlInput"
              placeholder="Enter recipe URL..."
            />
          </label>
          <br/>
          <button type="submit" className="submitUrlButton">Submit</button>
        </form>

      </div>
    );
  }
  }

  const UserList = ({ users }) => (
    <ul>
      {users.map(user => (
        <li key={user.uid}>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
        </li>
      ))}
    </ul>
  );

//   const condition = authUser => !!authUser;

//   const NewRecipe = compose(
//     // withAuthorization(condition),
//     withFirebase,
//   )(NewRecipePage);
 
//   export default NewRecipe;

const NewRecipe = compose(
  withRouter,
  withFirebase,
  )(NewRecipeForm)

  export default NewRecipe;