var setUp = {
    box_rows: 0, // the number of boxes the end-user selects
    box_cols: 0, // the number of boxes the end-user selects
    box_end_y_css: 'box_end_y',
    box_end_x_css: 'box_end_x',
    cell_id_options: [], // for each number list all options and remove them until none are left.
    cell_ids: [], // the id for every cell based on boxes & cells - acts as a template
    cell_values: [], // using this.cell_ids as keys, stores the answer for each cell
    cells: 9, // the number of cells per box the end-user selects
    thePuzzle: null, // the table element, stored for reuse
    setCells: function(c) {
        this.cells = c;
        /* reset the box dimensions */
        this.box_cols = 0;
        this.box_rows = 0;
        /* get the square root root, and work from there on the size of the boxes */
        var sqrt = Math.sqrt(c);
        var floored = Math.floor(sqrt);
        console.log('sqrt = ' + sqrt);
        console.log('floored = ' + floored);
        if (floored == sqrt) {
            this.box_rows = sqrt;
            this.box_cols = sqrt;
        } else if (c % floored == 0) {
            this.box_rows = floored;
            this.box_cols = c/floored;
        } else {
            console.log('>>> Getting divisible for ' + c);
            floored++;
            console.log('>>> floored ' + floored);
            for (var i = floored; i < c; i++) {
                if (c % i == 0) {
                    console.log('>>> i ' + i + ' = ' + (c % i));
                    this.box_rows = i;
                    this.box_cols = c/i;
                    break;
                }
            }
            if (0 == this.box_cols || 0 == this.box_rows) {
                console.log('Setting to 9 cell default');
                this.box_cols = 3;
                this.box_rows = 3;
                this.cells = 9;
            }
        }
        console.log('box_rows ' + this.box_rows);
        console.log('boxes_cols ' + this.box_cols);
    },
    setAnswers: function() {
        if (0 == this.cell_ids.length) {
            this.buildGrid();
        }

        /* use this to find a position. */
        var positions = this.cell_ids.length;

        /* we need an array of id options for each number and remove them as we use them */
        for (var i = 1; i <= this.cells; i++) {
            this.cell_id_options[i] = this.cell_ids;
        }

        /* loop through each number and for each number find 10 cell_id_options for the number */
        for (var i = 1; i <= this.cells; i++) {
            // figure out what to do here.
        }
    },
    buildGrid: function() {
        /* make sure the box sizes are set */
        if (0 == this.box_cols || 0 == this.box_rows) {
            this.setCells(this.cells);
        }
        /* start to build the table */
        this.thePuzzle =  document.createElement('table');

        var box_name_for_row = 1;
        /* loop through each row */
        for (var r = 1; r <= this.cells; r++) {
            var at_bottom_of_box = (r % this.box_rows == 0);
            var box_name_for_col = box_name_for_row;
            var tr = document.createElement('tr');
            /* loop through each cell */
            for (var c = 1; c <= this.cells; c++) {
                /* build the unique cell name */
                var td_id = r + '_' + c + '_' + box_name_for_col;
                /* add the names to the array of cell ids */
                this.cell_ids.push(td_id);
                this.cell_values[td_id] = 0;
                var td = document.createElement('td');
                td.setAttribute('id', td_id);
                td.innerHTML = td_id;
                if (c % this.box_cols == 0 && c < this.cells) {
                    box_name_for_col++;
                    td.className = this.box_end_y_css;
                }
                if (at_bottom_of_box && r < this.cells) {
                    var td_class = this.box_end_x_css;
                    if (td.className) {
                        td_class += ' ' + td.className;
                    }
                    td.className = td_class;
                }
                tr.appendChild(td);
            }
            /* when at the bottom of the box, increment the name by the number of rows per box */
            if (at_bottom_of_box) {
                box_name_for_row += this.box_rows;
            }
            this.thePuzzle.appendChild(tr);
        }
        return this.thePuzzle;
    },
}
