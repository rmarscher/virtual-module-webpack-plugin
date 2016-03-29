import greeting from './greeting';
import 'css/generated.css';

console.log(greeting);

if (window) {
  const document = window.document;
  const body = document.querySelector('body');
  const header = document.createElement('h1');
  header.className = 'greeting';
  header.textContent = greeting;
  body.appendChild(header);
}
