import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import './index.css';

class SingleRecipe extends Component {
    constructor(props){
        super(props);

        this.state = {
            loading: false,
            recipeId: this.props.match.params.recipeid,
            recipeToChange: [],
            recipe: [],
            openEditModal: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        const { recipeId } = this.state;
        
        this.props.firebase.recipe(recipeId).once('value', snapshot => {
            const recipeObject = snapshot.val();

            // console.log(recipeObject);

            const recList = [recipeObject]

            this.setState({
                recipe: recList,
                recipeToChange: recList
            })
        })
    }

    openModal = event => {
        this.setState({ 
            openEditModal: true,
        });
    }

    closeModal = () => this.setState({ openEditModal: false });

    // onChange = event => {
    //     const changedRecipe = this.state.recipeToChange;
    //     changedCourse[event.target.name] = event.target.value;
    //     this.setState({ courseToEdit: changedCourse });
    // }

    onChange = event => {
        event.preventDefault();

        const changedRecipe = this.state.recipeToChange[0];
        
        if(event.target.name.substring(0, 6) == "ingred"){
            const ingredient = event.target.name.split("-");
            const currentIngs = changedRecipe.ingredients;
            currentIngs[ingredient[1]] = event.target.value;
            changedRecipe.ingredients = currentIngs;
        } else if(event.target.name.substring(0, 6) == "instru"){
            const instruction = event.target.name.split("-");
            const currentInss = changedRecipe.instructions;
            currentInss[instruction[1]] = event.target.value;
            changedRecipe.instructions = currentInss;
        } else {
            changedRecipe[event.target.name] = event.target.value;
        }
        
        const newList = [changedRecipe]
        this.setState({ recipeToChange: newList });
    };

    onSubmit = event => {
        const { 
            recipeToChange,
            recipeId
            } = this.state;
    
        const r = recipeToChange[0];

        const lastUpdated = Date.now();

        this.props.firebase
            .recipe(recipeId)
            .set({
                name: r.name,
                image: r.image,
                description: r.description,
                ingredients: r.ingredients,
                instructions: r.instructions,
                yield: r.yield,
                prepTime: r.prepTime,
                cookTime: r.cookTime,
                totalTime: r.totalTime,
                url: r.url,
                dateAdded: r.dateAdded,
                lastUpdated: lastUpdated,
                uploadedBy: r.uploadedBy,
            })
            .then(() => {
                console.log("Successfully updated");
            })
            .catch(error => {
                console.log( error );
                this.setState({ error });
            });
    } 

    deleteButtonPress = event => {
        const { recipeId } = this.state;
        const uid = this.props.firebase.auth.currentUser.uid;
        this.props.firebase
            .recipe(recipeId)
            .remove()
            .then(() => {
                console.log("Successfully deleted item");
            })
            .catch(error => {
                console.log(error);
            })
        this.props.firebase
            .findRecipeUserPair(recipeId)
            .remove()
            .then(() => {
                console.log("Successfully deleted pairing");
            })
            .catch(error => {
                console.log(error);
            })
        this.props.firebase
            .findRecipeFromUserList(uid, recipeId)
            .remove()
            .then(() => {
                console.log("Successfully deleted from recipeList");
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                console.log(error);
            })
        
        event.preventDefault();
    }

    render() {

        const { loading, recipe, recipeId, openEditModal, recipeToChange } = this.state

        // console.log(recipe[0])

        const rec = recipe[0];
        const recTC = recipeToChange[0];

        let isInvalid = false;

        if(recipe.length > 0){
            isInvalid =
                recTC.name === '' ||
                recTC.description === '' ||
                // recTC.image === '' ||
                // recTC.yield === '' ||
                // recTC.prepTime === '' ||
                // recTC.cookTime === '' ||
                // recTC.totalTime === '' ||
                recTC.url === '';
        }

        return(
            <div>
                {recipe.length > 0
                    ? <div>
                        <div>
                            <Modal show={openEditModal} onHide={this.closeModal}>
                                <Modal.Header closeButton>
                                <Modal.Title>Edit Recipe</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form onSubmit={this.onSubmit}>
                                        <Container>
                                            <Row className="formCol">
                                                <Col>
                                                    <h3 className="colTitle">Course Info</h3>
                                                    <label className="courseLabel">
                                                        <strong>Recipe Name</strong>
                                                        <br/>
                                                        <input
                                                            name="name"
                                                            value={recTC.name}
                                                            onChange={this.onChange}
                                                            type="text"
                                                            className="courseInput"
                                                        />
                                                    </label>
                                                    <label className="courseLabel">
                                                        <strong>Image Url</strong>
                                                        <input
                                                            name="image"
                                                            value={recTC.image}
                                                            onChange={this.onChange}
                                                            type="text"
                                                            className="courseInput"
                                                        />
                                                    </label>
                                                    <label className="courseLabel">
                                                        <strong>Description</strong>
                                                        <textarea
                                                            name="description"
                                                            value={recTC.description}
                                                            onChange={this.onChange}
                                                            type="text"
                                                            rows="4"
                                                            className="courseInput"
                                                        />
                                                    </label>
                                                    <label className="courseLabel">
                                                        <strong>Ingredients</strong>
                                                        <br/>
                                                        {recTC.ingredients.map((key, ind) => (
                                                            <input
                                                                name={"ingredient-"+ind}
                                                                value={key}
                                                                onChange={this.onChange}
                                                                type="text"
                                                                className="courseInput"
                                                            />
                                                        ))}
                                                    </label>
                                                    <label className="courseLabel">
                                                        <strong>Instructions</strong>
                                                        <br/>
                                                        {recTC.instructions.map((key, ind) => (
                                                            <input
                                                                name={"instruction-"+ind}
                                                                value={key}
                                                                onChange={this.onChange}
                                                                type="text"
                                                                className="courseInput"
                                                            />
                                                        ))}
                                                    </label>
                                                    <label className="courseLabel">
                                                        <strong>Yield</strong>
                                                        <br/>
                                                        <input
                                                            name="yield"
                                                            value={recTC.yield}
                                                            onChange={this.onChange}
                                                            type="text"
                                                            className="courseInput"
                                                        />
                                                    </label>
                                                {/* </Col>
                                                <Col xs={6}> */}
                                                    <label className="courseLabel">
                                                        <strong>Prep Time</strong>
                                                        <br/>
                                                        <input
                                                            name="prepTime"
                                                            value={recTC.prepTime}
                                                            onChange={this.onChange}
                                                            type="text"
                                                            className="courseInput"
                                                        />
                                                    </label>
                                                    <label className="courseLabel">
                                                        <strong>Cook Time</strong>
                                                            <br/>
                                                            <input
                                                                name="cookTime"
                                                                value={recTC.cookTime}
                                                                onChange={this.onChange}
                                                                type="text"
                                                                className="courseInput"
                                                            />
                                                    </label>
                                                    <label className="courseLabel">
                                                        <strong>Total Time</strong>
                                                            <br/>
                                                            <input
                                                                name="totalTime"
                                                                value={recTC.totalTime}
                                                                onChange={this.onChange}
                                                                type="text"
                                                                className="courseInput"
                                                            />
                                                    </label>
                                                    <label className="courseLabel">
                                                        <strong>Link to Original Recipe</strong>
                                                        <br/>
                                                        <input
                                                            name="collegeCounselorLink"
                                                            value={recTC.url}
                                                            onChange={this.onChange}
                                                            type="url"
                                                            className="courseInput"
                                                        />
                                                    </label>
                                                    
                                                </Col>
                                            </Row>
                                        </Container>

                                        <button disabled={isInvalid} type="submit" className="submitNewButton">Save Changes</button>
                                        {/* {error && <p>{error.message}</p>} */}
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    {/* <Button variant="primary" onClick={this.editCourseSave}>Save</Button> */}
                                    <Button variant="primary" onClick={this.closeModal}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                        <Container className="mainContainer">
                            <Row className="topRow">
                                <Col sm={4}>
                                    <div className="mainImgDiv">
                                        <img className="mainImgImg" src={rec.image} />
                                    </div>
                                </Col>
                                <Col sm={8}>
                                    <Row>
                                        <Col>
                                            <h1 className="recName">
                                                {rec.name}
                                            </h1>
                                        </Col>
                                        <Col>
                                            <Button value={recipeId} onClick={this.openModal} className="btn-primary editDeleteButtons">Edit</Button>
                                            <Button value={recipeId} onClick={this.deleteButtonPress} className="btn-danger editDeleteButtons">Delete</Button>
                                        </Col>
                                    </Row>
                                    <h6><a href={rec.url} targer="_blank">Original Recipe</a></h6>
                                    <Row className="recTimeRow">
                                        <Col>
                                            <h4 className="recTime">
                                                Total time: {rec.totalTime}
                                            </h4>
                                        </Col>
                                        <Col>
                                            <h4 className="recTime">
                                                Cook time: {rec.cookTime}
                                            </h4>
                                        </Col>
                                        <Col>
                                            <h4 className="recTime">
                                                Prep time: {rec.prepTime}
                                            </h4>
                                        </Col>
                                    </Row>
                                    <h4 className="recYield">
                                        Serves: {rec.yield}
                                    </h4>
                                    <h6>
                                        {rec.description}
                                    </h6>
                                </Col>
                            </Row>
                            <Row className="secondRow">
                                <Col>
                                    <h5 className="ingredientsTitle">Ingredients: </h5>
                                    <div className="ingredDiv">
                                        {rec.ingredients.map(ingr => (
                                            <p>{ingr}</p>
                                        ))}
                                    </div>
                                </Col>
                                <Col>
                                <h5 className="ingredientsTitle">Instructions: </h5>
                                    <ol>
                                        {rec.instructions.map(inst => (
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
                }
            </div>
        )
    }    
}

const ShowRecipe = ({ recipeId, recipe }) => (
    <div>
        <Container className="mainContainer">
            <Row className="topRow">
                <Col sm={4}>
                    <div className="mainImgDiv">
                        <img className="mainImgImg" src={recipe.image} />
                    </div>
                </Col>
                <Col sm={8}>
                    <Row>
                        <Col>
                            <h1 className="recName">
                                {recipe.name}
                            </h1>
                        </Col>
                        <Col>
                            <Button value={recipeId} onClick={this.openModal} className="btn-primary editDeleteButtons">Edit</Button>
                            <Button value={recipeId} onClick={this.deleteButtonPress} className="btn-danger editDeleteButtons">Delete</Button>
                        </Col>
                    </Row>
                    <h6><a href={recipe.url} targer="_blank">Original Recipe</a></h6>
                    <Row className="recTimeRow">
                        <Col>
                            <h4 className="recTime">
                                Total time: {recipe.totalTime.substring(2)}
                            </h4>
                        </Col>
                        <Col>
                            <h4 className="recTime">
                                Cook time: {recipe.cookTime.substring(2)}
                            </h4>
                        </Col>
                        <Col>
                            <h4 className="recTime">
                                Prep time: {recipe.prepTime.substring(2)}
                            </h4>
                        </Col>
                    </Row>
                    <h4 className="recYield">
                        Serves: {recipe.yield}
                    </h4>
                    <h6>
                        {recipe.description}
                    </h6>
                </Col>
            </Row>
            <Row className="secondRow">
                <Col>
                    <h5 className="ingredientsTitle">Ingredients: </h5>
                    <div className="ingredDiv">
                        {recipe.ingredients.map(ingr => (
                            <p>{ingr}</p>
                        ))}
                    </div>
                </Col>
                <Col>
                <h5 className="ingredientsTitle">Instructions: </h5>
                    <ol>
                        {recipe.instructions.map(inst => (
                            <li>
                                {inst}
                            </li>
                        ))}
                    </ol>
                </Col>
            </Row>
        </Container>
    </div>
)

const SingleRecipeExport = compose(
    withFirebase,
    withRouter
    )(SingleRecipe)

export default withFirebase(SingleRecipeExport);