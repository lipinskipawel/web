import './main.css'

const main = document.getElementById('main');

if (main) {
    main.innerHTML = `
      <div id='content'>
        <div class="first">Some first</div>
        <div class="second">Some second</div>
      </div>
    `;
}
