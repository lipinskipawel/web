import './uslugi.css';

document.querySelector<HTMLDivElement>('#content')!.innerHTML = `
    <div class="column">
      <div class="tile">
        <p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem. Fusce nisl dolor, consectetur nec dignissim iaculis, fringilla vel arcu. Aenean mattis erat vitae magna suscipit fringilla. Fusce eget dapibus nisi. Quisque ligula augue, bibendum et mattis ut, volutpat nec nisl.
        </p>
      </div>
      <div class="tile">
        <h2>Small title</h2>
        <ul>
          <li>test1</li>
          <li>test2</li>
          <li>test3</li>
        </ul>
        <img src="networking.png" />
      </div>
    </div>
`;

