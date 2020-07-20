import React from 'react';

class FormProfessor extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            cpf: '',
            register: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleCPFChange = this.handleCPFChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleCPFChange = e => {
        this.setState({ [e.target.name]: e.target.value.replace(/([0-9]{3})(\.?)([0-9]{3})(\.?)([0-9]{3})(-?)([0-9]{2})/, '$1.$3.$5-$7') });
        e.target.value = e.target.value.replace(/([0-9]{3})(\.?)([0-9]{3})(\.?)([0-9]{3})(-?)([0-9]{2})/, '$1.$3.$5-$7')
    }

    handleSubmit = e => {
        e.preventDefault();

        document.querySelector('.wrapper-modal').style.display = 'flex';

        const data = {
            email: this.state.email,
            name: this.state.name,
            lecture: this.props.lecture,
            lecturer: this.props.lecturer,
            date: this.props.date,
            beginning: this.props.beginning,
            link: this.props.link
        }

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        fetch('https://unoesteforms.herokuapp.com/sendMail', config).then(result => {
            console.log(result);
        })
    }

    closeModal = e => {
        document.querySelector('.wrapper-modal').style.display = 'none';
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="name">Nome completo</label>
                    <input type="text" name="name" onChange={this.handleChange} required />

                    <label htmlFor="email">E-mail</label>
                    <input type="email" name="email" onChange={this.handleChange} required />

                    <label htmlFor="cpf">CPF</label>
                    <input type="text" name="cpf" onChange={this.handleCPFChange} required />

                    <label htmlFor="register">Matrícula</label>
                    <input type="text" name="register" onChange={this.handleChange} required />

                    <input type="submit" value="Enviar" className="lx-btn" />
                </form>

                <div className="wrapper-modal">
                    <div className="background-modal" onClick={this.closeModal}></div>

                    <div className="modal">
                        <h1>Cadastrado</h1>

                        <p>
                            A live pode ser acessada clicando <a href={this.props.link} target="_blank" rel="noopener noreferrer"><b><u>aqui</u></b></a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormProfessor;