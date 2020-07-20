import React from 'react';
import { Link } from 'react-router-dom';
import { recordData } from '../helpers/database';
import { signUp } from '../helpers/auth';

class RegisterUser extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            repeatPassword: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();

        if (this.state.name === "" || this.state.email === "" || this.state.password === "" || this.state.repeatPassword === "") {
            this.toast('Por favor, preencha todos os campos.');
        } else if (this.state.password !== this.state.repeatPassword) {
            this.toast('Senhas não coincidem.')
            document.getElementsByName('password')[0].focus();
        } else {
            try {
                signUp(this.state.email, this.state.password).then(() => {
                    try {
                        recordData('users', {
                            name: this.state.name,
                            email: this.state.email
                        });
                    } catch (e) {
                        this.toast('Ocorreu um erro. Por favor, tente novamente mais tarde.<br/><br/>' + e);
                    }
                }).catch(error => {
                    switch (error.code) {
                        case 'auth/email-already-in-use': {
                            this.toast('O e-mail já está em uso.');
                            document.getElementsByName('email')[0].focus();
                            break;
                        }
                        case 'auth/invalid-email': {
                            this.toast('Endereço de e-mail inválido.');
                            document.getElementsByName('email')[0].focus();
                            break;
                        }
                        case 'auth/weak-password': {
                            this.toast('A senha deve ter 6 ou mais caracteres.');
                            document.querySelectorAll('input[name="password"],input[name="repeatPassword"]').forEach(elem => elem.value = "");
                            document.getElementsByName('password')[0].focus();
                            break;
                        }
                        default: {
                            this.toast('Ocorreu um erro. Por favor, tente novamente mais tarde.<br/><br/>' + error.code);
                        }
                    }
                });
            } catch (e) {
                this.toast('Ocorreu um erro. Por favor, tente novamente mais tarde.<br/><br/>' + e);
            }
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
            <main className="register-user">
                <section>
                    <div className="lx-container-80">
                        <div className="lx-row">
                            <div className="lx-card">
                                <form action="#" onSubmit={this.handleSubmit}>
                                    <h1>Criar Conta</h1>

                                    <label htmlFor="name">Nome</label>
                                    <input type="text" name="name" placeholder="João da Silva" onChange={this.handleChange} />

                                    <label htmlFor="email">E-mail</label>
                                    <input type="email" name="email" placeholder="conta@unoeste.br" onChange={this.handleChange} />

                                    <label htmlFor="password">Senha</label>
                                    <input type="password" name="password" placeholder="Ex: 2Xbn0@asD" onChange={this.handleChange} />
                                    <p>Use oito ou mais caracteres com uma combinação de letras, números e símbolos.</p>

                                    <label htmlFor="repeatPassword">Confirme sua senha</label>
                                    <input type="password" name="repeatPassword" onChange={this.handleChange} />

                                    <div className="lx-row is-between">
                                        <Link to="/"><div className="lx-btn">Voltar</div></Link>

                                        <div><input type="submit" value="Cadastrar" className="lx-btn" /></div>
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

export default RegisterUser;