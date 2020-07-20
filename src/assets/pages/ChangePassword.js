import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import '../style/css/ChangePassword.css';

class ChangePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            email: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit = e => {
        e.preventDefault();

        auth().sendPasswordResetEmail(this.state.email);
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <main className="change-password">
                <section>
                    <div className="lx-container-85">
                        <div className="lx-row">
                            <div className="lx-card">
                                <p>Entre abaixo seu e-mail e enviaremos um e-mail de recuperação.<br /><br /></p>

                                <form autoComplete="off" onSubmit={this.handleSubmit}>
                                    <label htmlFor="email">E-mail</label>
                                    <input type="email" name="email" onChange={this.handleChange} required />

                                    <div className="lx-row is-between">
                                        <Link to="/"><button className="lx-btn">Voltar</button></Link>

                                        <input type="submit" value="Enviar" className="lx-btn" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }
}

export default ChangePassword;