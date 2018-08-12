import { Component } from '../component';

import style from './layout.css';
import template from './layout.html';

export class Layout extends Component {
    constructor() {
        super();
        this.attachTemplate(template, style);
    }
}