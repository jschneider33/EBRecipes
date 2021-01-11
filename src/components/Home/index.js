import React, { Component } from 'react';

import Navigation from '../Navigation';

import recipe from '../../constants/recipes.js';
import Recipes from '../Recipes';

class Home extends Component{
    render(){

        return(
            <div>
                <Recipes recipes={recipe} />
            </div>
        );
    };
};

export default Home;