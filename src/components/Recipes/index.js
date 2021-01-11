import React, { Component } from 'react';
import './index.css';

import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Container, Row, Col } from "react-bootstrap";

class Recipes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            allRecipes: [],
        }
    };

    componentDidMount() {
        this.setState({ loading: true })
        const recipesList = [];

        this.props.firebase.recipes().on('value', snapshot => {
            const recipesObject = snapshot.val();

            Object.keys(recipesObject).map(key => {
                recipesList.push({ [key]: recipesObject[key] });
            })

            this.setState({
                allRecipes: recipesList
            })
        })
    }

    componentWillUnmount() {
        this.props.firebase.recipes().off();
    }

    render(){
        const { loading, allRecipes } = this.state;

        return(
            <div className="recipesMain">
                <h1>All Recipes</h1>
                    {allRecipes.length > 0
                        ? <ShowAllRecipes allRecipes={allRecipes} />
                        : <p>Loading recipes</p>
                    }
            </div>
        );
    };
};

const ShowAllRecipes = ({ allRecipes }) => (
    <div>
        {allRecipes.map(recipe => {
            return( 
                <Row className="recipeRow">
                    <Col sm={2} className="imgCol px-0">
                        <div className="thumbnailDiv">
                            <img className="thumbnailImg" src={Object.values(recipe)[0].image} />
                        </div>
                    </Col>
                    <Col sm={5} className="leftCol">
                        <Link to={`/recipe/${Object.keys(recipe)[0]}`}><h3 className="recTitle">{Object.values(recipe)[0].name}</h3></Link>
                        <p>{Object.values(recipe)[0].yield} servings</p>
                        <p>Total time: {Object.values(recipe)[0].totalTime.substring(2)}</p>
                    </Col>
                    <Col sm={5} className="rightCol">
                        <h6>{Object.values(recipe)[0].description}</h6>
                    </Col>
                </Row>
            )
        })}
    </div>
)

export default withFirebase(Recipes);