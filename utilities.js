export * from './utilities.js';

export function showErrorModal(message = 'An unexpected error occured, sorry') {
    const backdrop = document.createElement('article');
    const messageBlock = document.createElement('div');
    const messageText = document.createElement('p');
    const button = document.createElement('button');
    
    backdrop.style.cssText = `width: 100%; height: 100vh; position: absolute; top: 0; 
                              left: 0; background: rgba(100, 100, 100, 0.5); z-index: 5;`;
    messageBlock.style.cssText = `width: 15%;  min-width: 350px; height: 140px; border: 1px solid black; background: white;
                                  margin: 35vh auto 0 auto; display:flex; flex-direction: column; justify-content: space-around`;
    messageText.style.cssText = 'padding: 1em';
    button.style.cssText = `width: 40%; background: inherit; border: 1.5px solid palevioletred; padding: 0.25em 0.75em;
                            min-width: 100px; cursor: pointer; align-self: center; outline: 0px;`;

    messageText.innerText = message;
    button.innerText = "Ok";

    backdrop.addEventListener('click', (event) => {
        if (event.target.nodeName === 'BUTTON' || event.target.nodeName === 'ARTICLE') {
            document.body.removeChild(backdrop);
        }
    });

    messageBlock.appendChild(messageText);
    messageBlock.appendChild(button);
    backdrop.appendChild(messageBlock);
    document.body.appendChild(backdrop);
}