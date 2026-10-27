import './main.css';

document.querySelector<HTMLDivElement>('#content')!.innerHTML = `
    <div class="grid">
      <div class="text border">
        <img src="/printer-head.png"></img>
        <div>
        <p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla. Fusce eget dapibus nisi. Quisque ligula augue, bibendum et mattis ut, volutpat nec nisl.
        </p>

        <p>
Phasellus hendrerit, arcu et ullamcorper laoreet, nunc nisl egestas ante, sed maximus erat nisi vel ligula. Nullam vitae tellus nunc. Phasellus ac interdum lacus. Vestibulum et nisl tempor ante tristique consectetur a vitae dui. Pellentesque sollicitudin sit amet justo et pharetra.
        </p>

        <p>
Sed sed nisl id lorem tempor fermentum. Class aptent taciti sociosqu ad litora torquent.
        </p>
      </div>
      </div>
      <div class="cert border title-padding">
        <div>Certyfikaty:</div>
        <div class="left">
          <img src="/pdf.png">
          <a href="/cert/blank.pdf" target="blank">
            <span>First</span>
          </a>
        </div>
        <div class="left">
          <img src="/pdf.png">
          <a href="/cert/blank.pdf" target="blank">
            <span>Second</span>
          </a>
        </div>
        <div class="left">
          <img src="/pdf.png">
          <a href="/cert/blank.pdf" target="blank">
            <span>Third</span>
          </a>
        </div>
        <div class="left">
          <img src="/pdf.png">
          <div class="block">
            <a href="/cert/blank.pdf" target="blank">
              <span>Fourth</span>
            </a>
            <a href="/cert/blank.pdf" target="blank">
              <span>Fourth</span>
            </a>
          </div>
        </div>
        <div class="left">
          <img src="/pdf.png">
          <a href="/cert/blank.pdf" target="blank">
            <span>Fifth</span>
          </a>
        </div>
        <div class="left">
          <img src="/pdf.png">
          <a href="/cert/blank.pdf" target="blank">
            <span>Sixth</span>
          </a>
        </div>
      </div>
      <div class="partners border title-padding">
        <div>Partnerzy:</div>
        <div class="center">
          <a href="http://google.com" target="blank" title="1"><img src="/1.png"></a>
        </div>
        <div class="center">
          <a href="http://google.com" target="blank" title="2"><img src="/2.png"></a>
        </div>
        <div class="center">
          <a href="http://google.com" target="blank" title="3"><img src="/3.png"></a>
        </div>
        <div class="center">
            <a href="http://google.com" target="blank" title="4"><img src="/4.png"></a>
        </div>
        <div class="center">
              <a href="http://google.com" target="blank" title="5"><img src="/5.png"></a>
        </div>
      </div>
      <div class="printers border">
        <img src="/printer.png"/>
      </div>
    </div>
`;

