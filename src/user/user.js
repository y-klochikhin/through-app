import { Component } from '../component';

import style from './user.css';
import template from './user.html';

export class User extends Component {
    get registerDate() {
        return this._registerDate;
    }

    set registerDate(date) {
        this._registerDate = date;
        this.shadowRoot.getElementById('register-date').innerText = this._registerDate.toLocaleString();
    }

    constructor() {
        super();
        this.attachTemplate(template, style);
        this.bindPropertiesToElements([
            'name',
            'custom',
            'balance',
            'email',
            'walletAmount',
            'walletCurrency'
        ]);
        this.bindPropertiesToAttributes([
            'enabled'
        ]);
    }
}