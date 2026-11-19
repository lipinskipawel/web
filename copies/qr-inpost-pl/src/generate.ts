import './generate.css';

import { type userAction } from './helper.ts';

export function generate(action: userAction): string {
    switch (action) {
        case 'receive':
            return `
        <div class='generate-content-wrap'>
          <div class='top-sign'>Generate QR for</div>
          <div class='container'>
            <div id='left'>
              <div>
                <button id="receive" switchable>receive</button>
                <button id="return" switchable>return</button>
              </div
              <p>
                Lorem .psum dolor sit amet, consectetur adipiscing elit.
                Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor,
              </p>
              <div id='data'>
              </div>
              <input type='checkbox'>
                * Some very important information.
                  Second line of it.
              </input>
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
        case 'return':
            return `
        <div class='generate-content-wrap'>
          <div class='top-sign'>Generate QR for</div>
          <div class='container'>
            <div id='left'>
              <div>
                <button id="receive" switchable>receive</button>
                <button id="return" switchable>return</button>
              </div
              <p>
                Lorem .psum dolor sit amet, consectetur adipiscing elit.
                Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor,
              </p>
              <div id='data'>
              </div>
              <input type='checkbox'>
                * Some very important information.
                  Second line of it.
              </input>
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
}
