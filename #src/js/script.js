'use strict';

require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';
import setPumpkins from './/modules/setPumpkins';


window.addEventListener("DOMContentLoaded", () => {
    setPumpkins('.wrapper', 'pumpkin', 'pumpkin__item');
});