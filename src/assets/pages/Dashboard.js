import React from 'react';
import { signOut } from '../helpers/auth';
import ManageForms from '../components/ManageForms';
import '../style/css/Dashboard.css';
import { retrieveUser } from '../helpers/database';
import { auth } from '../services/firebase';

class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            user: {
                name: '',
                email: '',
                avatar: ''
            },
            app: null
        }
    }

    changeApp = component => {
        switch (component) {
            case 'Manage Forms':
                this.setState({ app: <ManageForms name={this.state.user.name} /> })
                break;
            default:
                break;
        }
    }

    componentDidMount = () => {
        retrieveUser(auth().currentUser.email).then(result => {
            this.setState({ user: { name: result.name, email: auth().currentUser.email, avatar: 'https://randomuser.me/api/portraits/' + (Math.floor(Math.random() * (3 - 1)) + 1 === 1 ? 'women' : 'men') + '/' + (Math.floor(Math.random() * 99)) + '.jpg' }, app: <ManageForms name={result.name} /> });
        });
    }

    render() {
        return (
            <main className="dashboard">
                <div className="lx-container-85">
                    <div className="lx-row align-start">
                        <nav>
                            <div className="lx-row">
                                <div className="user">
                                    <div className="user-pic">
                                        {this.state.user.avatar ? <img src={this.state.user.avatar} alt={this.state.user.name} /> : null}
                                    </div>

                                    <div className="user-info">
                                        {this.state.user.name ? <h1>{this.state.user.name}</h1> : null}

                                        {this.state.user.email ? <p>{this.state.user.email}</p> : null}
                                    </div>
                                </div>

                                <div className="sub-info settings">
                                    <button onClick={() => this.changeApp('Manage Forms')}>Gerenciar formulários</button>
                                    <button onClick={signOut}>Sair</button>
                                </div>
                            </div>
                        </nav>

                        <article>
                            {this.state.app}
                        </article>
                    </div>
                </div>
            </main>
        );
    }
}

export default Dashboard;