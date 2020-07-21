import React from 'react';
import { recordImage } from '../helpers/storage';
import { removeData, recordData } from '../helpers/database';
import '../style/css/CreateForms.css';

class CreateForms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lecturer: '',
            credential: '',
            title: '',
            course: '',
            link: '',
            expiration: '',
            beginning: '',
            duration: '',
            partners: '',
            promotion: '',
            level: 0,
            banner: '',
            creation: '',
            user: '',
            key: '',
            loading: false,
            done: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    // The date needs special treatment
    handleDateChange = e => {
        this.setState({ [e.target.name]: new Date(e.target.value).toISOString() });
    }

    // Converts the image to a dataURL
    handleImageChange = () => {
        let fr = new FileReader();
        try {
            fr.onload = base64 => {
                this.setState({ banner: base64.target.result });
            }
            fr.readAsDataURL(document.querySelector('input[type="file"]').files[0]);
        } catch (e) {
            removeData('lives', this.state.key);
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        if (this.state.title === '' || this.state.link === '' || this.state.expiration === '' || this.state.partners === '' || this.state.course === '' || this.state.lecturer === '' || this.state.credential === '') {
            this.toast('Por favor, preencha todos os campos do formulário');
        } else {
            this.setState({ creation: new Date(Date.now()).toISOString() });

            // Calls the function to record lives data and sets the key on the component's state
            recordData('lives', { title: this.state.title, lecturer: this.state.lecturer, credential: this.state.credential, course: this.state.course, level: this.state.level, expiration: this.state.expiration, beginning: this.state.beginning, duration: this.state.duration, link: this.state.link, promotion: this.state.promotion, partnership: this.state.partners, user: this.state.user, creation: new Date(Date.now()).toISOString() }).then(result => {
                this.setState({ key: result });
            }).then(() => {
                if (this.state.banner === '') {
                    this.toast('Por favor, informe uma imagem.');
                } else {
                    this.setState({ loading: true });

                    try {
                        // Calls the function to record the image
                        recordImage('lives/' + this.state.key + '.jpg', this.state.banner).on('state_changed', snap => { }, error => {
                            this.setState({ loading: false });
                            switch (error.code) {
                                case 'storage/canceled':
                                    this.toast('Operação cancelada.');
                                    break;
                                case 'storage/retry-limit-exceeded':
                                    this.toast('Tempo limite atingido. Por favor, tente novamente mais tarde.');
                                    break;
                                case 'storage/quota-exceeded':
                                    this.toast('Limite do Firebase excedido. Nenhum upload de imagem será permitido.');
                                    break;
                                default:
                                    this.toast('Ocorreu um erro. Por favor, tente novamente mais tarde.');
                            }

                            removeData('lives', this.state.key);
                        }, () => {
                            // On success, resets the form
                            this.setState({ loading: false, done: true });
                            document.querySelector('form').reset();
                        });
                    } catch (error) {
                        this.toast('Ocorreu um erro. Por favor, tente novamente mais tarde.<br/><br/>' + error);
                        this.setState({ loading: false });

                        removeData('lives', this.state.key);
                    }
                }
            }).catch(error => {
                this.toast('Ocorreu um erro ao processar seu pedido. Por favor, tente novamente mais tarde.<br/><br/>' + error);
            });
        }
    }

    componentDidMount = () => {
        this.setState({ user: this.props.name });
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
            <div className="tab-content create-forms">
                <h3>
                    Criar nova live
                </h3>

                <form action="#" onSubmit={this.handleSubmit}>
                    <div className="grid">
                        <div>
                            <label htmlFor="lecturer">Nome do palestrante</label>
                            <input type="text" name="lecturer" onChange={this.handleChange} required />

                            <label htmlFor="credential">Grau/Título do palestrante</label>
                            <input type="text" name="credential" placeholder="Prof. Me. em Ciência da Computação" onChange={this.handleChange} required />

                            <label htmlFor="title">Título da plaestra</label>
                            <input type="text" name="title" onChange={this.handleChange} required />

                            <label htmlFor="course">Promoção/Curso</label>
                            <input type="text" name="course" onChange={this.handleChange} required />

                            <label htmlFor="link">Link da palestra</label>
                            <input type="text" name="link" placeholder="Ex: https://www.youtube.com/watch?v=videoV1D305" onChange={this.handleChange} required />

                            <label htmlFor="expiration">Data de expiração</label>
                            <input type="date" name="expiration" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" onChange={this.handleDateChange} required />

                            <label htmlFor="beginning">Hora de início</label>
                            <input type="time" name="beginning" onChange={this.handleChange} required />

                            <label htmlFor="duration">Duração (em horas)</label>
                            <input type="time" name="duration" onChange={this.handleChange} required />

                            <label htmlFor="partners">Parceria</label>
                            <input type="text" name="partners" onChange={this.handleChange} required />

                            <label htmlFor="promotion">Realização</label>
                            <input type="text" name="promotion" onChange={this.handleChange} required />

                            <label htmlFor="level">Nível</label>
                            <select name="level" onChange={this.handleChange}>
                                <option value="0">Sem requisitos</option>
                                <option value="1">Básico</option>
                                <option value="2">Intermediário</option>
                                <option value="3">Avançado</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="banner">Banner</label>
                            <input type="file" name="banner" accept="image/jpg,image/jpeg" onChange={this.handleImageChange} required />
                        </div>
                    </div>

                    <input type="submit" value="Enviar" />

                    {this.state.done ? <p className="success">Alterado</p> : null}
                </form>

                {this.state.loading ? <div className="wrapper-loader"><div className="loader"></div></div> : null}

                <div className="toast">
                    <div className="icon">
                        <span className="material-icons-sharp">warning</span>
                    </div>

                    <p></p>
                </div>
            </div>
        );
    }
}

export default CreateForms;