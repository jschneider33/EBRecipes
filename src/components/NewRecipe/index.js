import React, { Component } from "react";
import { withRouter } from "react-router-dom"

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

import { compose } from 'recompose';

import { Container, Row, Col } from 'react-bootstrap';

import './index.css';

import unirest from 'unirest';

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

    //   componentDidMount() {
    //     this.setState({ loading: true });
     
    //     this.props.firebase.users().on('value', snapshot => {
    //       const usersObject = snapshot.val();
     
    //       const usersList = Object.keys(usersObject).map(key => ({
    //         ...usersObject[key],
    //         uid: key,
    //       }));
     
    //       this.setState({
    //         users: usersList,
    //         loading: false,
    //       });
    //     });
    //   }

    // componentWillUnmount() {
    //     this.props.firebase.users().off();
    //   }
    
    onChange = event => {
      const newUrl = event.target.value;

      this.setState({
        currentUrl: newUrl,
      })
    }

    onSubmit = e => {
        this.setState({ loading: true })

        const { currentUrl, body } = this.state
        
        var req = unirest("POST", "https://mycookbook-io1.p.rapidapi.com/recipes/rapidapi");

        req.headers({
            "content-type": "application/xml",
            "x-rapidapi-key": "5da2a2da31msh2eba020568db14bp1001c3jsnd69bb15bffa5",
            "x-rapidapi-host": "mycookbook-io1.p.rapidapi.com",
            "useQueryString": true
        });
    
        req.send(currentUrl);
    
    
        req.end(res => {
            if (res.error) throw new Error(res.error);
        
            const r = res.body[0]; 
            const createdDate = Date.now();
            const lastUpdated = Date.now();
            const createdBy = this.props.firebase.auth.currentUser.uid;
            

            const recToAdd = {
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
            }

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

              

            
              // .then(() => {
              //   console.log("Entered Then");
              // });

            // this.props.firebase
            //   .addRecipe()
            //   .push()
            //   .set({
            //     name: r.name,
            //     image: r.images[0],
            //     description: r.description,
            //     ingredients: r.ingredients,
            //     instructions: r.instructions[0].steps,
            //     yield: r.yield,
            //     prepTime: r["prep-time"],
            //     cookTime: r["cook-time"],
            //     totalTime: r["total-time"],
            //     url: r.url,
            //   })
            //   .then(() => {
                
                

            //     this.setState({
            //       body: r
            //     })
            //     this.props.history.push({
            //       pathname: '/'
            //     });
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   })

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

        {/* <h3>Recipe info</h3>
        {rec
          ? <div>
              <Container className="mainContainer">
                <Row className="topRow">
                    <Col sm={4}>
                        <div className="mainImgDiv">
                            <img className="mainImgImg" src={rec.recImage}/>
                        </div>
                    </Col>
                    <Col sm={8}>
                        <h1 className="recName">
                            {rec.recName}
                        </h1>
                        <Row>
                            <Col>
                                <h4 className="recTime">
                                    Total time: {rec.recTTime}
                                </h4>
                            </Col>
                            <Col>
                                <h4 className="recTime">
                                    Cook time: {rec.recCTime}
                                </h4>
                            </Col>
                            <Col>
                                <h4 className="recTime">
                                    Prep time: {rec.recPTime}
                                </h4>
                            </Col>
                        </Row>
                        <h4 className="recYield">
                            Serves: {rec.recYield}
                        </h4>
                        <h6>
                            {rec.recDescription}
                        </h6>
                    </Col>
                </Row>
                <Row className="secondRow">
                    <Col>
                        <h5 className="ingredientsTitle">Ingredients: </h5>
                        <div className="ingredDiv">
                            {rec.recIngreds.map(ingr => (
                                <p>{ingr}</p>
                            ))}
                        </div>
                    </Col>
                    <Col>
                      <h5 className="ingredientsTitle">Instructions: </h5>
                        <ol>
                            {rec.recInstr.map(inst => (
                                <li>
                                    {inst}
                                </li>
                            ))}
                        </ol>
                    </Col>
                </Row>
              </Container>
            </div>
          : <div>Loading...</div>
          } */}

            {/* {newRec 
            ? Object.keys(newRec).map(key => {
                return(
                    <div>
                        <hr/>
                        <hr/>
                        <h2>{key}</h2>
                        <p>{newRec[key].toString()}</p>
                    </div>
                    )
                })
            : null } */}
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