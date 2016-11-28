/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
import 'css/generated.css';
import greeting from './greeting';

console.log(greeting);

if (window) {
  const document = window.document;
  const body = document.querySelector('body');
  const header = document.createElement('h1');
  header.className = 'greeting';
  header.textContent = greeting;
  body.appendChild(header);
}
