import './kontakt.css';

document.querySelector<HTMLDivElement>('#content')!.innerHTML = `
    <div class="row">
      <div class="tile">
        <h1>h1</h1>
        <h2>h2</h2>
        <div class="together">
          <p>Some</p>
          <p>Some</p>
          <p>Some</p>
          <p>Some</p>
        </div>
        <h2>h2</h2>
        <h3>h3</h3>
        <div class="together">
          <p>Some</p>
          <p>Some</p>
          <p>Some</p>
        </div>
        <img src="hands.png" />
      </div>
      <div class="tile full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10807.89087720469!2d2.2858159056008107!3d48.85720111290505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sWie%C5%BCa%20Eiffla!5e0!3m2!1spl!2spl!4v1793709204193!5m2!1spl!2spl"
          width="600"
          height="680"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer">
        </iframe>
      </div>
    </div>
`;

//         <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d83998.77816243688!2d2.2646345599281923!3d48.85893848425134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spl!2spl!4v1793709024546!5m2!1spl!2spl" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin">
//        </iframe>

// <iframe src="https://www.google.com/maps/embed?pb=YourMapURL" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy">
// </iframe>

