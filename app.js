var CellularAutomata = /** @class */ (function () {
    function CellularAutomata() {
        this.rows = [];
    }
    /**
     * Calculates the next row
     * @param {boolean[]} row If present, adds this row to the sequence before the next is calculated
     * @returns {boolean[]} Returns the next row
     */
    CellularAutomata.prototype.UpdateCells = function (row) {
        var _this = this;
        if (row)
            this.rows.push(row);
        var oldRow = this.rows[this.rows.length - 1];
        var newRow = [];
        oldRow.forEach(function (value, index) {
            newRow.push(_this.Rule(oldRow[index === 0 ? oldRow.length - 1 : index - 1], // left
            oldRow[index + 1 === oldRow.length ? 0 : index + 1], // right
            value));
        });
        this.rows.push(newRow);
        return newRow;
    };
    /**
     * Calculates the state of a cell
     * @param {boolean} left Left cell
     * @param {boolean} right Right cell
     * @param {boolean} center Center cell (value)
     * @returns {boolean} New state
     */
    CellularAutomata.prototype.Rule = function (left, right, center) {
        return (left !== (center || right)); // rule 30
        //return (left !== right); // rule 90
        //return ((left || right) !== (left && right && center));
    };
    return CellularAutomata;
}());
document.addEventListener('DOMContentLoaded', function () {
    var area = document.querySelector('#demoArea');
    var table = document.createElement('table');
    area.appendChild(table);
    var SIZE = 12;
    var PAUSE_LABEL = "Pause";
    var RESUME_LABEL = "Resume";
    var speed = 1000;
    var intervalSize = 200;
    var intervalId;
    var ParseRow = function (data) {
        var row = document.createElement('tr');
        data.forEach(function (elem) {
            var cell = document.createElement('td');
            cell.classList.add(elem ? 'on' : 'off');
            row.appendChild(cell);
        });
        table.appendChild(row);
        area.scrollTop = area.scrollHeight;
    };
    var IncreaseSpeed = function () {
        if (speed > intervalSize) {
            speed -= intervalSize;
            ResetInterval();
        }
        return false;
    };
    var DecreaseSpeed = function () {
        speed += intervalSize;
        return ResetInterval();
    };
    var ResetInterval = function () {
        window.clearInterval(intervalId);
        intervalId = window.setInterval(function () { return ParseRow(app.UpdateCells()); }, speed);
        return false;
    };
    var ToggleSim = function (event) {
        if (isRunning)
            window.clearInterval(intervalId);
        else
            intervalId = window.setInterval(function () { return ParseRow(app.UpdateCells()); }, speed);
        isRunning = !isRunning;
        event.currentTarget.innerHTML = isRunning ? PAUSE_LABEL : RESUME_LABEL;
        return false;
    };
    document.getElementById('increaseSpeed').addEventListener('click', IncreaseSpeed);
    document.getElementById('decreaseSpeed').addEventListener('click', DecreaseSpeed);
    document.getElementById('toggleSim').addEventListener('click', ToggleSim);
    var app = new CellularAutomata();
    var initial = [];
    for (var i = 0; i < SIZE; i++) {
        initial.push(Math.random() >= 0.5);
    }
    ParseRow(app.UpdateCells(initial));
    var isRunning = true;
    intervalId = window.setInterval(function () { return ParseRow(app.UpdateCells()); }, speed);
});
