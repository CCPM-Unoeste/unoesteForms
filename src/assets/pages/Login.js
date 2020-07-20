import React from 'react';
import { Link } from 'react-router-dom';
import { signIn } from '../helpers/auth';
import '../style/css/Login.css';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = async event => {
        event.preventDefault();

        if (this.state.email === "" || this.state.password === "") {
            this.toast('E-mail e/ou senha não informados.');
        } else {
            await signIn(this.state.email, this.state.password).catch(error => {
                switch (error.code) {
                    case 'auth/invalid-email': {
                        this.toast('Endereço de e-mail inválido.');
                        document.getElementsByName('email')[0].focus();
                        break;
                    }
                    case 'auth/user-disabled': {
                        this.toast('Usuário desabilitado.');
                        document.querySelector('form').reset();
                        break;
                    }
                    case 'auth/user-not-found': {
                        this.toast('Não há usuário cadastrados sob este e-mail.')
                        document.getElementsByName('email')[0].focus();
                        break;
                    }
                    case 'auth/wrong-password': {
                        this.toast('Senha incorreta.');
                        document.getElementsByName('password')[0].focus();
                        break;
                    }
                    default: {
                        this.toast('Ocorreu um erro. Por favor, tente novamente mais tarde.<br/><br/>' + error.code);
                    }
                }
            });
        }
    }

    toast = message => {
        document.querySelector('.toast').classList.toggle('is-active');
        document.querySelector('.toast>p').innerHTML = message;

        setTimeout(() => {
            document.querySelector('.toast').classList.toggle('is-active');
        }, 2500);
    }

    render() {
        return (
            <main className="login">
                <section>
                    <div className="lx-container-80">
                        <div className="lx-row">
                            <div className="lx-card">
                                <form onSubmit={this.handleSubmit}>
                                    <h1>Fazer login</h1>

                                    <label htmlFor="email">E-mail</label>
                                    <input type="email" name="email" placeholder="conta@unoeste.br" onChange={this.handleChange} />

                                    <label htmlFor="password">Senha</label>
                                    <input type="password" name="password" placeholder="*********" onChange={this.handleChange} />

                                    <Link to="/esqueciMinhaSenha"><button className="help forgot-password">Esqueceu sua senha?</button></Link>

                                    <div className="lx-row is-between">
                                        <Link to="/cadastrarUsuario"><div className="lx-btn">Criar Conta</div></Link>

                                        <div><input type="submit" value="Entrar" className="lx-btn" /></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="toast">
                        <div className="icon">
                            <span className="material-icons-sharp">warning</span>
                        </div>

                        <p></p>
                    </div>
                </section>
            </main>
        );
    }
}

export default Login;