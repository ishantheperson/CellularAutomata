class CellularAutomata {
    constructor() {
        this.rows = [];
    }
    UpdateCells(row) {
        if (row)
            this.rows.push(row);
        let oldRow = this.rows[this.rows.length - 1];
        let newRow = [];
        oldRow.forEach((value, index) => {
            newRow.push(this.Rule(oldRow[index === 0 ? oldRow.length - 1 : index - 1], oldRow[index + 1 === oldRow.length ? 0 : index + 1], value));
        });
        this.rows.push(newRow);
        return newRow;
    }
    Rule(left, right, center) {
        //return ((left && !right) || (!left && right)); // xor rule
        return (left !== (center || right)); // rule 30
    }
}
var app; // global for test only
document.addEventListener('DOMContentLoaded', () => {
    let area = document.querySelector('div');
    let table = document.createElement('table');
    area.appendChild(table);
    let ParseRow = (data) => {
        let row = document.createElement('tr');
        data.forEach(elem => {
            let cell = document.createElement('td');
            cell.classList.add(elem ? 'on' : 'off');
            row.appendChild(cell);
        });
        table.appendChild(row);
    };
    app = new CellularAutomata();
    let initial = [false, false, true, true, false, true, false, false];
    ParseRow(app.UpdateCells(initial));
    window.setInterval(() => {
        ParseRow(app.UpdateCells());
    }, 1000);
    /*
    for (var y = 0; y < size; y++) {
      let row = document.createElement('tr');
      cells.push([]);
      for (var x = 0; x < size; x++) {
        let element = document.createElement('td');
        element.innerHTML = "(" + x + ", " + y + ")";
  
        cells[y][x] = element;
        row.appendChild(element);
      }
      table.appendChild(row);
    }
  
    area.appendChild(table);
  
    app = new ECA(cells);
    */
});
//# sourceMappingURL=app.js.map