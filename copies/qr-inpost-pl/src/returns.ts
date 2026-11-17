import './returns.css';

import { type userAction } from './helper.ts';

export function returns(action: userAction): string {
    switch (action) {
        case 'receive':
            return `
        <div class="receive-content-wrap">
          <div class="top-sign">Explain how to receive</div>
          <div class="steps">
            <div class="pic-text">
              <img src="1.png"/>
              <span>Some 3 words</span>
            </div>
            <div class="pic-text">
              <img src="2.png"/>
              <span>Even more words, like 5</span>
            </div>
            <div class="pic-text">
              <img src="3.png"/>
              <span>Medium amount of words</span>
            </div>
            <div class="text">
Lorem .psum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla.
            </div>
            <div class="text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla.
            </div>
            <div class="text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla.
            </div>
          </div>
        </div>
        `;
        case 'return':
            return `
        <div class="receive-content-wrap">
          <div class="top-sign">Explain how to return</div>
          <div class="steps">
            <div class="pic-text">
              <img src="1.png"/>
              <span>Some 3 words</span>
            </div>
            <div class="pic-text">
              <img src="2.png"/>
              <span>Even more words, like 5</span>
            </div>
            <div class="pic-text">
              <img src="3.png"/>
              <span>Medium amount of words</span>
            </div>
            <div class="text">
Lorem .psum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla.
            </div>
            <div class="text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla.
            </div>
            <div class="text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla.
            </div>
          </div>
        </div>
        `;
    }
}
