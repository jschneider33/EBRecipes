import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import functions from 'firebase-functions';

 
const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.database();
    };

// Auth API
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);
    doSignOut = () => this.auth.signOut();
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email)
    doPasswordUpdate = password =>    
        this.auth.currentUser.updatePassword(password);

// Database API
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    addRecipe = () => this.db.ref('recipes');
    recipes = () => this.db.ref('recipes');
    recipe = rid => this.db.ref('recipes/'+rid);
    addToUserRecList = recipeId => this.db.ref('/users/'+this.auth.currentUser.uid+'/recipeList/'+recipeId);
    addRecipeUserPair = recipeId => this.db.ref('pairs/'+recipeId);
    findRecipeUserPair = recipeId => this.db.ref('pairs/'+recipeId);
    findRecipeFromUserList = (uid, recipeId) => this.db.ref('users/'+uid+'/recipeList/'+recipeId);

};

export default Firebase;