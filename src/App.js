import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { auth } from './assets/services/firebase';
import Header from './assets/components/Header';
import Login from './assets/pages/Login';
import RegisterUser from './assets/pages/RegisterUser';
import Dashboard from './assets/pages/Dashboard';
import Forms from './assets/pages/Form';
import ChangePassword from './assets/pages/ChangePassword';
import "./assets/style/css/Reset.css";

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route {...rest} render={props => authenticated !== null ? <Component {...props} /> : <Redirect to={{ pathname: "/", state: { from: props.location } }} />} />
  );
}

const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route {...rest} render={props => authenticated === null ? <Component {...props} /> : <Redirect to={"/dashboard"} />} />
  );
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true
    }
  };

  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ authenticated: true, loading: false })
      } else {
        this.setState({ authenticated: false, loading: false })
      }
    });
  }

  render() {
    return this.state.loading === true ? <div className="wrapper-loader"><div className="loader"></div></div> : (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={auth().currentUser ? Dashboard : Login} />
          <Route path="/forms" component={Forms} />
          <PrivateRoute path="/dashboard" authenticated={auth().currentUser} component={Dashboard}></PrivateRoute>
          <PublicRoute path="/cadastrarUsuario" authenticated={auth().currentUser} component={RegisterUser}></PublicRoute>
          <PublicRoute path="/esqueciMinhaSenha" authenticated={auth().currentUser} component={ChangePassword}></PublicRoute>
        </Switch>
      </Router>
    );
  }
}

export default App;