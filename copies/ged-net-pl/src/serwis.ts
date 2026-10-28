import './serwis.css';

document.querySelector<HTMLDivElement>('#content')!.innerHTML = `
    <div class="grid">
      <div class="text border padding-medium">
        <img src="/printer-head.png"></img>
        <div>
        <p class="padding-small">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla. Fusce eget dapibus nisi. Quisque ligula augue, bibendum et mattis ut, volutpat nec nisl.
        </p>

        <p class="padding-small">
Phasellus hendrerit, arcu et ullamcorper laoreet, nunc nisl egestas ante, sed maximus erat nisi vel ligula. Nullam vitae tellus nunc. Phasellus ac interdum lacus. Vestibulum et nisl tempor ante tristique consectetur a vitae dui. Pellentesque sollicitudin sit amet justo et pharetra.
        </p>
        </div>
      </div>
      <div class="zap border padding-medium">
        <div>Zapewniamy:</div>
        <ul class="check-list">
          <li>test1</li>
          <li>test2</li>
          <li>test3</li>
          <li>test4</li>
          <li>test5</li>
        </ul>
      </div>
      <div class="only-img border padding-medium">
        <img src="/only-img.png" alt="Image"/>
      </div>
      <div class="more-text border padding-medium">
        <p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla. Fusce eget dapibus nisi. Quisque ligula augue, bibendum et mattis ut, volutpat nec nisl.
        </p>
      </div>
    </div>
`;

