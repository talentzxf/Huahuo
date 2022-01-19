import _ from 'lodash';
import './style.css';
import Icon from './fireworks.png'
import printMe from './print'

function component() {
    const element = document.createElement('div');
    const btn = document.createElement('button');

    element.innerHTML = _.join(['Hell     o', 'webp    ack    '], ' ');

    btn.innerHTML = 'V22ffjjjjjjjj gggf   x      cvzxcvee2  1!'
    btn.onclick = printMe

    element.appendChild(btn)

    element.classList.add('hello')

    const myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon)
    return element;
}

document.body.appendChild(component());