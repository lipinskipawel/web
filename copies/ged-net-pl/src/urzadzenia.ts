import './urzadzenia.css';

document.querySelector<HTMLDivElement>('#content')!.innerHTML = `
    <div class="column">
      <div class="tile">
        <span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut diam dui, viverra nec ex id, blandit tristique sem.
        </span>
      </div>
      <div class="tile">
        <span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <b>Ut diam dui, viverra nec ex id, blandit tristique sem.</b>
        </span>
        <ul>
          <li>test1</li>
          <li>test2</li>
          <li>test3</li>
          <li>test4</li>
        </ul>
        <img src="urzadzenia.png" alt="urzadzenia"/>
      </div>
    </div>
`;

