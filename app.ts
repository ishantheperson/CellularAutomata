class CellularAutomata {
  private rows: boolean[][];

  constructor() {
    this.rows = [];
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
    this.rows.push(newRow); return newRow;
  }

    /**
     * Calculates the state of a cell
     * @param {boolean} left Left cell
     * @param {boolean} right Right cell
     * @param {boolean} center Center cell (value)
     * @returns {boolean} New state
     */
  private Rule(left: boolean, right: boolean, center: boolean): boolean {
    return (left !== (center || right)); // rule 30
    //return (left !== right); // rule 90
    //return ((left || right) !== (left && right && center));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let area = document.querySelector('#demoArea');
  let table = document.createElement('table');
  area.appendChild(table);

  const SIZE = 12;
  const PAUSE_LABEL = "Pause";
  const RESUME_LABEL = "Resume";
  let speed = 1000;
  const intervalSize = 200;
  let intervalId;

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

  document.getElementById('increaseSpeed').addEventListener('click', IncreaseSpeed);
  document.getElementById('decreaseSpeed').addEventListener('click', DecreaseSpeed);
  document.getElementById('toggleSim').addEventListener('click', ToggleSim);

  let app = new CellularAutomata();

  let initial = [];
  for (let i = 0; i < SIZE; i++) {
    initial.push(Math.random() >= 0.5);
  }
  ParseRow(app.UpdateCells(initial));

  let isRunning = true;
  intervalId = window.setInterval(() => ParseRow(app.UpdateCells()), speed);
});