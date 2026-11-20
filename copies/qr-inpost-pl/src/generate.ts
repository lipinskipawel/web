import './generate.css';

import { type userAction } from './helper.ts';

export function generate(action: userAction, container: HTMLElement): void {
    container.innerHTML = getHtml(action);

    const generateQR = document.querySelector<HTMLButtonElement>('#generate-qr');
    if (!generateQR) {
        console.error('no button created');
        throw new Error('no button created');
    }

    // optimization, attach event to the existing element (like '#app')
    // so this is not constantly executed on each render
    generateQR.addEventListener('click', e => {
        console.log(e);
        switch (action) {
            case 'receive':
                console.log('receive');
                let what = new QRCode();
                return;
            case 'return':
                console.log('return');
                return;
        }
    });

    const digitInputs = document.querySelectorAll<HTMLInputElement>('.digits');
    if (!digitInputs) {
        throw new Error('no inputs with .digits');
    }

    digitInputs.forEach(element => {
        element.addEventListener('beforeinput', e => {
            let character = e.data;
            // let r = /\D/;
            // r = new RegExp('\\D');
            if (character && /\D/.test(character)) {
                e.preventDefault();
            }
        });
    });
}

function getHtml(action: userAction): string {
    return baseHtml(dataDiv(action));
}

function baseHtml(data: string): string {
    return `
        <div class='generate-content-wrap'>
          <div class='container'>
            <div id='left'>
              <div class='sign'>Generate QR for</div>
              <div class='inline'>
                <button id="receive" switchable class='right-margin-small'>receive</button>
                <div class='right-bar-small'></div>
                <button id="return" switchable class='left-margin-small'>return</button>
              </div>
              <p>
                Lorem .psum dolor sit amet, consectetur adipiscing elit.
                Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor,
              </p>
              <div id='data'>${data}</div>
              <label>
                <input type='checkbox'>
                  * Some very important information.<br>
                    Second line of it.
              </label>
              <p>
                Even more detailed information
              </p>
              <button id='generate-qr'>Generate qr</button>
            </div>
            <div id='right'>
              <p>
                Some nice text
                and <span class="green">green</span>!
              </p>
              <img src="app.png"/>
              <p>
                Lorem .psum dolor sit amet, consectetur adipiscing elit.
                Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor,
                consectetur nec dignissim iaculis, fringilla vel arcu.
                Aenean mattis erat vitae magna suscipit fringilla.
              </p>
            </div>
          </div>
        </div>
    `;
}

function dataDiv(action: userAction): string {
    switch (action) {
        case 'receive':
            return receive();
        case 'return':
            return returns();
    }
}

function receive(): string {
    return `
        <div class='column'>
          <div class='spread-line'>
            <span>Phone number</span>
            <span class='tooltip'>
              <img src='info.png'/>
              <span class='tooltiptext'>Some information</span>
            </span>
          </div>
          <div class='line'>
            <select>
              <option value='PL'>(PL) +48</option>
              <option value='NL'>(NL) +31</option>
              <option value='BE'>(BE) +32</option>
              <option value='FR'>(FR) +33</option>
            </select>
            <input type='text focus-border' class='digits' inputmode="numeric" pattern="[0-9]*" maxlength="13"/>
          </div>
          <div class='spread-line'>
            <span>Passcode for receive</span>
            <span class='tooltip'>
              <img src='info.png'/>
              <span class='tooltiptext'>Some information</span>
            </span>
          </div>
          <div class='line'>
            <input type='text' class='digits' maxlength="6" placeholder="___ ___"/>
          </div>
        </div>
    `;
}

function returns(): string {
    return `
        <div class='column'>
          <div class='spread-line'>
            <span>Your passcode of return</span>
            <span class='tooltip'>
              <img src='info.png'/>
              <span class='tooltiptext'>Some information</span>
            </span>
          </div>
          <div class='line'>
            <input type='text' class='digits' maxlength="9" placeholder="___ ___ ___"/>
          </div>
        </div>
    `;
}
