class CellularAutomata {
    constructor(row, rule = "left !== right") {
        this.rule = rule;
        this.rows = [row];
    }
    /**
     * Calculates the next row
     * @returns {boolean[]} Returns the next row
     */
    UpdateCells() {
        let oldRow = this.rows[this.rows.length - 1];
        let newRow = [];
        oldRow.forEach((value, index) => {
            newRow.push(this.Rule(oldRow[index === 0 ? oldRow.length - 1 : index - 1], // left
            oldRow[index + 1 === oldRow.length ? 0 : index + 1], // right
            value));
        });
        this.rows.push(newRow);
        return newRow;
    }
    UpdateOldRow(row) {
        this.rows[this.rows.length - 1] = row;
    }
    /**
     * Calculates the state of a cell
     * @param {boolean} left Left cell
     * @param {boolean} right Right cell
     * @param {boolean} center Center cell (value)
     * @returns {boolean} New state
     */
    Rule(left, right, center) {
        return eval(this.rule);
        //return left !== right;
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
        let elem = event.target;
        if (!isRunning && elem.tagName === 'TD' && elem.parentNode === table.lastChild) {
            if (elem.className === 'on')
                elem.className = 'off';
            else
                elem.className = 'on';
            let data = [];
            elem.parentNode.childNodes.forEach(cell => {
                data.push(cell.className === 'on');
            });
            app.UpdateOldRow(data);
        }
    });
    area.appendChild(table);
    const PAUSE_LABEL = "Pause";
    const RESUME_LABEL = "Resume";
    let size = 36;
    let speed = 1000;
    let intervalId;
    let rule = "left !== right";
    let ChangeRule = event => {
        rule = event.target.value;
        Reset();
    };
    let ChangeSize = event => {
        size = event.target.value;
        Reset();
    };
    let ChangeSpeed = event => {
        speed = event.target.value;
        if (isRunning)
            ResetInterval();
    };
    let ChangeBorderSize = event => {
        table.style.borderSpacing = event.target.value + 'px';
    };
    let ResetInterval = () => {
        window.clearInterval(intervalId);
        intervalId = window.setInterval(() => ParseRow(app.UpdateCells()), speed);
        return false;
    };
    let ToggleSim = () => {
        if (isRunning)
            window.clearInterval(intervalId);
        else
            intervalId = window.setInterval(() => ParseRow(app.UpdateCells()), speed);
        setIsRunning(!isRunning);
        return false;
    };
    document.getElementById('rule').addEventListener('change', ChangeRule);
    document.getElementById('size').addEventListener('change', ChangeSize);
    document.getElementById('speed').addEventListener('change', ChangeSpeed);
    document.getElementById('borderSize').addEventListener('change', ChangeBorderSize);
    document.getElementById('toggleSim').addEventListener('click', ToggleSim);
    let ParseRow = (data) => {
        let row = document.createElement('tr');
        data.forEach(elem => {
            let cell = document.createElement('td');
            cell.className = elem ? 'on' : 'off';
            row.appendChild(cell);
        });
        table.appendChild(row);
        area.scrollTop = area.scrollHeight;
    };
    let isRunning;
    let setIsRunning = val => {
        isRunning = val;
        document.getElementById('toggleSim').innerText = isRunning ? PAUSE_LABEL : RESUME_LABEL;
    };
    let app;
    function Reset() {
        if (isRunning)
            ToggleSim();
        while (table.hasChildNodes()) {
            table.removeChild(table.lastChild);
        }
        let initial = [];
        for (let i = 0; i < size; i++) {
            //initial.push(Math.random() >= 0.5);
            initial.push(false);
        }
        ParseRow(initial); // displays but does not initialize
        app = new CellularAutomata(initial, rule);
    }
    Reset();
});
