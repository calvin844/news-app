import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/Login/Login'
import News from '../views/News/News'
import Detail from '../views/News/Detail'
import NewsSandBox from '../views/SandBox/NewsSandBox'

export default function IndexRouter() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/login' component={Login} />
                <Route path='/news' component={News} />
                <Route path='/detail/:id' component={Detail} />
                <Route path="/" render={() =>
                    localStorage.getItem("token") ?
                        <NewsSandBox ></NewsSandBox> :
                        <Redirect to="/login" />
                } />
            </Switch>
        </BrowserRouter>
    )
}
