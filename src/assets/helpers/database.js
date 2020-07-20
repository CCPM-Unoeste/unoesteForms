import { database } from '../services/firebase';

export const recordData = (ref, data) => {
    return new Promise((resolve, reject) => {
        try {
            let key = database.ref(ref).push().key;

            database.ref(ref + '/' + key).set(data);

            key !== '' && key ? resolve(key) : reject(key);
        } catch (e) {
            reject(e);
        }
    });
}

export const retrieveData = key => {
    return new Promise((resolve, reject) => {
        let data = {};

        try {
            database.ref('lives/' + key).on('value', snap => {
                data = snap.val();

                data !== null && data !== undefined ? resolve(data) : reject('Não foi encontrada nenhuma entrada com essa chave.');
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const retrieveUser = email => {
    return new Promise((resolve, reject) => {
        let user = { name: '', key: '', email };

        try {
            let ref = database.ref('users');

            ref.orderByChild('email').equalTo(email).on('child_added', snap => {
                user.name = snap.val().name;
                user.key = snap.key;

                user.key !== '' && user.key ? resolve(user) : reject('Nenhum usuário cadastrado com esse e-mail.');
            });
        } catch (error) {
            reject(error);
        }
    })
}

export const retrieveLives = user => {
    return new Promise((resolve, reject) => {
        let array = [];

        try {
            database.ref('lives').on('value', snapshot => {
                snapshot.forEach(snap => {
                    if (user === snap.val().user)
                        array.push({
                            key: snap.key,
                            value: snap.val()
                        });
                });

                array.length > 0 ? resolve(array) : reject('Não há formulários cadastrados para esse usuário')
            });
        } catch (error) {
            reject(error)
        }
    });
}

export const updateData = (ref, data) => {
    return new Promise((resolve, reject) => {
        try {
            database.ref(ref).set(data).then(() => resolve(true)).catch(() => reject(false));
        } catch (error) {
            reject(error);
        }
    })
}

export const removeData = (ref, key) => {
    return database.ref(ref + '/' + key).remove();
}