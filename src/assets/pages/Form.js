import React from 'react';
import FormStudent from '../components/FormStudent';
import FormProfessor from '../components/FormProfessor';
import FormPartner from '../components/FormPartner';
import FormOther from '../components/FormOther';
import { retrieveData } from '../helpers/database';
import { retrieveDownloadURL } from '../helpers/storage';
import '../style/css/Form.css';

class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            form: null,
            live: {
                beginning: '',
                course: '',
                credential: '',
                duration: '',
                expiration: '',
                lecturer: '',
                level: '',
                link: '',
                partnership: '',
                promotion: '',
                title: '',
                banner: '',
                key: ''
            }
        }

        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    componentDidMount = () => {
        let key = window.location.pathname.replace('/forms/', '');
        retrieveData(key).then(live => {
            let date = live.expiration;
            date = date.replace(date.substring(date.indexOf('T'), date.length), '').replace(/([0-9]{4})(-?)([0-9]{2})(-?)([0-9]{2})/, '$5/$3/$1');
            let banner = '';
            retrieveDownloadURL('lives/' + key + '.jpg').then(url => {
                banner = url;
                this.setState({
                    live: {
                        beginning: live.beginning,
                        course: live.course,
                        credential: live.credential,
                        duration: live.duration,
                        expiration: date,
                        lecturer: live.lecturer,
                        level: live.level,
                        link: live.link,
                        partnership: live.partnership,
                        promotion: live.promotion,
                        title: live.title,
                        banner,
                        key
                    }
                });
            });
        }).catch(error => console.log(error));
    }

    handleSelectChange = e => {
        switch (e.target.value) {
            case '1':
                this.setState({ form: <FormStudent lecture={this.state.live.title} lecturer={this.state.live.lecturer} date={this.state.live.expiration} beginning={this.state.live.beginning} link={this.state.live.link} /> });
                break;
            case '2':
                this.setState({ form: <FormProfessor lecture={this.state.live.title} lecturer={this.state.live.lecturer} date={this.state.live.expiration} beginning={this.state.live.beginning} link={this.state.live.link} /> });
                break;
            case '3':
                this.setState({ form: <FormPartner lecture={this.state.live.title} lecturer={this.state.live.lecturer} date={this.state.live.expiration} beginning={this.state.live.beginning} link={this.state.live.link} /> });
                break;
            case '4':
                this.setState({ form: <FormOther lecture={this.state.live.title} lecturer={this.state.live.lecturer} date={this.state.live.expiration} beginning={this.state.live.beginning} link={this.state.live.link} /> });
                break;
            default:
                this.setState({ form: null });
        }
    }

    render() {
        return (
            <main className="form">
                <div className="lx-container-85">
                    <div className="display-grid">
                        <section>
                            <div className="banner">
                                <img src={this.state.live.banner} alt="" />
                            </div>
                        </section>

                        <section className="info">
                            <div className="lx-row align-start">
                                <div className="lx-column lecturer">
                                    <h1>{this.state.live.lecturer}</h1>

                                    <p>{this.state.live.credential}</p>
                                </div>

                                <div className="lx-column theme">
                                    <div className="date">
                                        <span>{this.state.live.expiration} às {this.state.live.beginning}</span>
                                    </div>

                                    <h2>{this.state.live.title}</h2>
                                </div>

                                <div className="lx-column partner">
                                    <h1>Realização</h1>

                                    <p>NEAD - Unoeste</p>

                                    <h1>Parceria</h1>

                                    <p>{this.state.live.partnership}</p>

                                    <h1>Promoção</h1>

                                    <p>{this.state.live.course}</p>
                                </div>
                            </div>
                        </section>

                        <section className="instructions">
                            <h1>Dados para Declaração de Participação</h1>

                            <p>Esses dados são necessários para que seja gerada a declaração de participação. O link estará disponível para acesso após envio do formulário.</p>
                        </section>

                        <section className="forms">
                            <div className="display-grid">
                                <form>
                                    <label htmlFor="type">Você é:</label>
                                    <select name="type" onChange={this.handleSelectChange}>
                                        <option value="0">Selecione uma opção...</option>
                                        <option value="1">Aluno Unoeste</option>
                                        <option value="2">Professor/Funcionário Unoeste</option>
                                        <option value="3">Parceiro/Polo Unoeste</option>
                                        <option value="4">Comunidade Externa</option>
                                    </select>
                                </form>

                                {this.state.form}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        );
    }
}

export default Form;