import React from 'react';
import { retrieveData, updateData, removeData } from '../helpers/database';
import { retrieveDownloadURL, recordImage } from '../helpers/storage';

class EditForm extends React.Component {
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
            key: props.live,
            loading: false
        }
    }

    componentDidMount = () => {
        retrieveData(this.state.key).then(live => {
            retrieveDownloadURL('lives/' + this.state.key + '.jpg').then(url => {
                document.getElementsByName('lecturer')[0].value = live.lecturer;
                document.getElementsByName('credential')[0].value = live.credential;
                document.getElementsByName('title')[0].value = live.title;
                document.getElementsByName('link')[0].value = live.link;
                document.getElementsByName('expiration')[0].value = live.expiration.replace(live.expiration.substring(live.expiration.indexOf('T'), live.expiration.length), '');
                document.getElementsByName('beginning')[0].value = live.beginning;
                document.getElementsByName('duration')[0].value = live.duration;
                document.getElementsByName('partners')[0].value = live.partnership;
                document.getElementsByName('course')[0].value = live.course;
                document.getElementsByName('promotion')[0].value = live.promotion;
                document.getElementsByName('level')[0].value = live.level;

                this.setState({
                    lecturer: live.lecturer,
                    credential: live.credential,
                    title: live.title,
                    link: live.link,
                    expiration: live.expiration,
                    duration: live.duration,
                    beginning: live.beginning,
                    partners: live.partnership,
                    course: live.course,
                    promotion: live.promotion,
                    level: live.level,
                    banner: url,
                    creation: live.creation,
                    user: live.user
                });
            }).catch(error => console.log(error));
        }).catch(error => console.log(error));
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.live !== this.props.live) {
            this.setState({ key: this.props.live });

            retrieveData(this.props.live).then(live => {
                retrieveDownloadURL('lives/' + this.props.live + '.jpg').then(url => {
                    document.getElementsByName('lecturer')[0].value = live.lecturer;
                    document.getElementsByName('credential')[0].value = live.credential;
                    document.getElementsByName('title')[0].value = live.title;
                    document.getElementsByName('link')[0].value = live.link;
                    document.getElementsByName('expiration')[0].value = live.expiration.replace(live.expiration.substring(live.expiration.indexOf('T'), live.expiration.length), '');
                    document.getElementsByName('beginning')[0].value = live.beginning;
                    document.getElementsByName('duration')[0].value = live.duration;
                    document.getElementsByName('partners')[0].value = live.partnership;
                    document.getElementsByName('course')[0].value = live.course;
                    document.getElementsByName('promotion')[0].value = live.promotion;
                    document.getElementsByName('level')[0].value = live.level;

                    this.setState({
                        lecturer: live.lecturer,
                        credential: live.credential,
                        title: live.title,
                        link: live.link,
                        expiration: live.expiration,
                        duration: live.duration,
                        beginning: live.beginning,
                        partners: live.partnership,
                        course: live.course,
                        promotion: live.promotion,
                        level: live.level,
                        banner: url,
                        creation: live.creation,
                        user: live.user
                    });
                }).catch(error => console.log(error));
            }).catch(error => console.log(error));
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleDateChange = e => {
        this.setState({ [e.target.name]: new Date(e.target.value).toISOString() });
    }

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

    handleSubmitData = e => {
        e.preventDefault();

        if (this.state.title === '' || this.state.link === '' || this.state.expiration === '' || this.state.partners === '' || this.state.course === '' || this.state.lecturer === '' || this.state.credential === '') {
            this.toast('Por favor, preencha todos os campos do formulário');
        } else {
            updateData('lives/' + this.state.key, { title: this.state.title, lecturer: this.state.lecturer, credential: this.state.credential, course: this.state.course, level: this.state.level, expiration: this.state.expiration, beginning: this.state.beginning, duration: this.state.duration, link: this.state.link, promotion: this.state.promotion, partnership: this.state.partners, user: this.state.user, creation: this.state.creation }).catch(() => {
                this.toast('Ocorreu um erro ao processar seu pedido. Por favor, tente novamente mais tarde.<br/><br/>');
            });
        }
    }

    handleSubmitImage = e => {
        e.preventDefault();

        if (this.state.banner === '') {
            this.toast('Por favor, informe uma imagem.');
        } else {
            this.setState({ loading: true });

            try {
                recordImage('lives/' + this.state.key + '.jpg', this.state.banner).on('state_changed', snap => {
                    console.log(snap.bytesTransferred / snap.totalBytes * 100 + '%');
                }, error => {
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
                    this.setState({ loading: false });
                });
            } catch (error) {
                this.toast('Ocorreu um erro. Por favor, tente novamente mais tarde.<br/><br/>' + error);
                this.setState({ loading: false });

                removeData('lives', this.state.key);
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
            <div className="tab-content create-forms">
                <h3>
                    Editar live
                </h3>

                <form action="#" onSubmit={this.handleSubmitData}>
                    <div className="grid">
                        <div>
                            <label htmlFor="lecturer">Nome do palestrante</label>
                            <input type="text" name="lecturer" onChange={this.handleChange} />

                            <label htmlFor="credential">Grau/Título do palestrante</label>
                            <input type="text" name="credential" placeholder="Prof. Me. em Ciência da Computação" onChange={this.handleChange} />

                            <label htmlFor="title">Título da plaestra</label>
                            <input type="text" name="title" onChange={this.handleChange} />

                            <label htmlFor="course">Promoção/Curso</label>
                            <input type="text" name="course" onChange={this.handleChange} />

                            <label htmlFor="link">Link da palestra</label>
                            <input type="text" name="link" placeholder="Ex: https://www.youtube.com/watch?v=videoV1D305" onChange={this.handleChange} />

                            <label htmlFor="expiration">Data de expiração</label>
                            <input type="date" name="expiration" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" onChange={this.handleDateChange} />

                            <label htmlFor="beginning">Hora de início</label>
                            <input type="time" name="beginning" onChange={this.handleChange} />

                            <label htmlFor="duration">Duração (em horas)</label>
                            <input type="time" name="duration" onChange={this.handleChange} />

                            <label htmlFor="partners">Parceria</label>
                            <input type="text" name="partners" onChange={this.handleChange} />

                            <label htmlFor="promotion">Realização</label>
                            <input type="text" name="promotion" onChange={this.handleChange} />

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
                            <input type="file" name="banner" accept="image/jpg,image/jpeg" onChange={this.handleImageChange} />
                        </div>
                    </div>

                    <input type="submit" value="Enviar" />
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

export default EditForm;