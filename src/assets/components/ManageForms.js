import React from 'react';
import ListForms from '../components/ListForms';
import CreateForms from './CreateForms';
import '../style/css/ManageForms.css';

class ManageForms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            section: <ListForms name={this.props.name} />
        }
    }

    changeTab = (e, component) => {
        document.querySelector('.is-active').classList.remove('is-active');
        e.currentTarget.classList.add('is-active');

        switch (component) {
            case 'List Forms':
                this.setState({ section: <ListForms name={this.props.name} /> });
                break;
            default:
                this.setState({ section: <CreateForms name={this.props.name} /> })
        }
    }

    render() {
        return (
            <div className="manage-forms">
                <h2>
                    Bem-vindo(a), {this.props.name ? this.props.name : 'Não'}
                </h2>

                <p>
                    Gerencie abaixo suas lives:
                </p>

                <div className="tabs">
                    <button onClick={(e) => this.changeTab(e, 'List Forms')} className="is-active">Listar</button>

                    <button onClick={(e) => this.changeTab(e, 'Create Form')}>Criar</button>
                </div>

                {this.state.section}

                <script src="https://www.gstatic.com/firebasejs/7.14.4/firebase.js"></script>
                <script src="https://www.gstatic.com/firebasejs/7.14.4/firebase-functions.js"></script>
            </div>
        );
    }
}

export default ManageForms;