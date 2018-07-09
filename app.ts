class CellularAutomata {
  private rows: boolean[][];
  
  constructor(row?: boolean[]) {
    this.rows = [row];
  }
  
  /**
   * Calculates the next row
   * @param {boolean[]} row If present, adds this row to the sequence before the next is calculated
   * @returns {boolean[]} Returns the next row
   */
  public UpdateCells(row?: boolean[]): boolean[] {
    if (row) this.rows.push(row);
    
    let oldRow = this.rows[this.rows.length - 1];
    let newRow = [];
    oldRow.forEach((value, index) => {
      newRow.push(this.Rule(
        oldRow[index === 0 ? oldRow.length - 1 : index - 1], // left
        oldRow[index + 1 === oldRow.length ? 0 : index + 1], // right
        value));
    });
    this.rows.push(newRow);
    return newRow;
  }
  
  public UpdateOldRow(row: boolean[]) {
    this.rows[this.rows.length - 1] = row;
  }
  
  /**
   * Calculates the state of a cell
   * @param {boolean} left Left cell
   * @param {boolean} right Right cell
   * @param {boolean} center Center cell (value)
   * @returns {boolean} New state
   */
  private Rule(left: boolean, right: boolean, center: boolean): boolean {
    return left !== right;
    //return (left !== (center || right)); // rule 30
    //return (left !== right); // rule 90
    //return ((left || right) !== (left && right && center));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let area = document.querySelector('#demoArea');
  let table = document.createElement('table');
  // allow the elements to be modified
  table.addEventListener('click', event => {
    let elem = event.target as HTMLElement;
    if (!isRunning && elem.tagName === 'TD' && elem.parentNode === table.lastChild) {
      if (elem.className === 'on') elem.className = 'off';
      else elem.className = 'on';
      
      let data = [];
      elem.parentNode.childNodes.forEach(cell => {
        data.push(cell.className === 'on');
      })
      app.UpdateOldRow(data);
    }
  });
  area.appendChild(table);
  
  const PAUSE_LABEL = "Pause";
  const RESUME_LABEL = "Resume";
  let size = 36;
  let speed = 1000;
  const intervalSize = 200;
  let intervalId;

  let ChangeSize = event => {
    size = event.target.value;
    Reset();
  };
  
  let IncreaseSpeed = () => {
    if (speed > intervalSize) {
      speed -= intervalSize;
      ResetInterval();
    }
    return false;
  };
  
  let DecreaseSpeed = () => {
    speed += intervalSize;
    return ResetInterval();
  };
  
  let ResetInterval = () => {
    window.clearInterval(intervalId);
    
    intervalId = window.setInterval(() => ParseRow(app.UpdateCells()), speed);
    return false;
  };
  
  let ToggleSim = event => {
    if (isRunning) window.clearInterval(intervalId);
    else intervalId = window.setInterval(() => ParseRow(app.UpdateCells()), speed);
    
    isRunning = !isRunning;
    (<HTMLElement>event.currentTarget).innerHTML = isRunning ? PAUSE_LABEL : RESUME_LABEL;
    
    return false;
  };
  
  document.getElementById('size').addEventListener('change', ChangeSize)
  document.getElementById('increaseSpeed').addEventListener('click', IncreaseSpeed);
  document.getElementById('decreaseSpeed').addEventListener('click', DecreaseSpeed);
  document.getElementById('toggleSim').addEventListener('click', ToggleSim);
  
  let ParseRow = (data: boolean[]) => {
    let row = document.createElement('tr');
    data.forEach(elem => {
      let cell = document.createElement('td');
      cell.classList.add(elem ? 'on' : 'off');
      row.appendChild(cell);
    });
    
    table.appendChild(row);
    
    area.scrollTop = area.scrollHeight;
  };
  
  let isRunning;
  let app;
  
  function Reset() {
    if (isRunning) window.clearInterval(intervalId);
    isRunning = false;
  
    while (table.hasChildNodes()) {
      table.removeChild(table.lastChild);
    }
    
    let initial = [];
    for (let i = 0; i < size; i++) {
      //initial.push(Math.random() >= 0.5);
      initial.push(false);
    }
    
    ParseRow(initial); // displays but does not initialize
    app = new CellularAutomata(initial);
  }
  
  Reset();
});