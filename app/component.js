module.exports = function () {
    var styles = require('./main.css');
    var element = document.createElement('h1');
    element.className = styles.redButton;
    element.innerHTML = 'Hello World Bobbbbb';

    return element;
};
