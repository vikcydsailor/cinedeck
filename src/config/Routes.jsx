import React from 'react';

import { Route, Switch,BrowserRouter as Router } from 'react-router-dom';

import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Detail from '../pages/detail/Detail';
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile"; // Import the new component
import ChangePassword from "../pages/ChangePassword";
import NewsPage from "../pages/News";
import WatchlistCreate from "../pages/WatchListCreate";
import WatchlistList from "../pages/WatchlistList";
import WatchListSingle from "../pages/WatchListSingle";

const Routes = () => {
    return (
        <Switch>
            <Route
                path='/'
                exact
                component={Home}
            />
            <Route
                path='/register'
                exact
                component={Register}
            />
            <Route
                path='/login'
                exact
                component={Login}
            />
            <Route
                path='/profile'
                exact
                component={Profile}
            />
                <Route
                    path='/edit-profile'
                    exact
                    component={EditProfile}
                />
                <Route
                    path='/change-password'
                    exact
                    component={ChangePassword}
                />
            <Route
                path='/news'
                component={NewsPage}
            />
            <Route
                path='/create-watchlist'
                component={WatchlistCreate}
            />
            <Route
                path='/watchlists'
                component={WatchlistList}
            />
            <Route
                path='/watchlist/:id'
                component={WatchListSingle}
            />
            <Route
                path='/:category/search/:keyword'
                component={Catalog}
            />
            <Route
                path='/:category/:id'
                component={Detail}
            />
            <Route
                path='/:category'
                component={Catalog}
            />
        </Switch>
    );
}

export default Routes;
