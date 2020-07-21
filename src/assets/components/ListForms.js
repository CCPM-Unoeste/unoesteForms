import React from 'react';
import EditForms from './EditForm';
import { retrieveLives, removeData } from '../helpers/database';
import { removeImage } from '../helpers/storage';

class ListForms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editForms: false,
            live: '',
            activeForms: [],
            error: null
        }
    }

    // Retrieve lives' data and puts it on an array
    componentDidMount() {
        retrieveLives(this.props.name).then(result => this.setState({ activeForms: result })).catch(error => this.setState({ error }));
    }

    // Retrieve the live to edit and sets the EditForms component
    handleEdit = e => {
        this.setState({ editForms: <EditForms live={e.target.dataset.key} /> })
    }

    // Retrieve the live to delete
    handleDelete = e => {
        let key = e.target.dataset.key;

        removeImage('lives/' + key + '.jpg').catch(error => {
            if (error.code !== 'storage/object-not-found')
                console.log(error);
        });

        removeData('lives', key).then(() => {
            let array = this.state.activeForms;
            array.splice(array.findIndex(elem => elem.key = key), 1);
            this.setState({ activeForms: array, editForms: false });
        }).catch(error => {
            console.log(error);
        });
    }

    handleClose = () => {
        this.setState({ editForms: null, live: '' });
    }

    // Iterates through the array to mount the table
    loadForms = () => {
        return this.state.activeForms.length > 0 ? this.state.activeForms.map(elem => {
            let level = '';
            switch (elem.value.level) {
                case '1':
                    level = 'Básico';
                    break;
                case '2':
                    level = 'Intermediário';
                    break;
                case '3':
                    level = 'Avançado';
                    break;
                default: level = 'Sem requisitos';
            }
            return (
                <tr id={elem.key} key={elem.key}>
                    <td><a href={window.location.href + 'forms/' + elem.key} target="_blank" rel="noopener noreferrer"><u>{elem.value.title}</u></a></td>
                    <td>{elem.value.creation.replace(elem.value.creation.substring(elem.value.creation.indexOf('T'), elem.value.creation.length), '')}</td>
                    <td>{elem.value.expiration.replace(elem.value.expiration.substring(elem.value.expiration.indexOf('T'), elem.value.expiration.length), '')}</td>
                    <td>{elem.value.duration}</td>
                    <td>{level}</td>
                    <td><button data-key={elem.key} onClick={this.handleEdit}><i data-key={elem.key} className="material-icons">build</i></button><button data-key={elem.key} onClick={this.handleDelete}><i data-key={elem.key} className="material-icons">delete</i></button></td>
                </tr>
            );
        }) : null;
    }

    render() {
        return (
            <div className="tab-content active-forms">
                <h3>
                    Lives
                </h3>

                <div className="table-wrapper">
                    <table className="lx-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Criação</th>
                                <th>Expiração</th>
                                <th>Duração (Horas)</th>
                                <th>Nível</th>
                                <th>--</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.activeForms.length === 0 ?
                                <tr>
                                    <td colSpan="9">
                                        {this.state.error ? this.state.error : 'Não há formulários cadastrados para este usuário'}
                                    </td>
                                </tr>
                                : this.loadForms()
                            }
                        </tbody>
                    </table>
                </div>

                {this.state.editForms ? <div>{this.state.editForms} <button onClick={this.handleClose} className="cancel-button"><i className="material-icons">block</i></button></div> : null}
            </div>
        );
    }
}

export default ListForms;