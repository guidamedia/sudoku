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
        /*
        The process for setting the answers is as follows:
        1. we set up a multi-dimensional array where numbers 1 through the value for this.cells are the keys,
            and the values are the different td_id's, which is already captured in this.cell_ids;
        2. Next we want to loop through each number, so we always start with the number one (1)
        3. For each number we need to find the number of positions in the Sudoku table to place the current number.
            Since positions in the table are identified by the td_id of the table cell, we use them to correspond
            to the placement in the table.
        4. Using a random number based on 0 to the total amount of options for the number. That randomly chosen
             position is used to select the td_id.
        5. Once the td_id is selected, we set that key in this.cell_values to the current number
        6. After that we have to seek and find all the td_ids that are no longer available for that number, as well
            remove that td_id from other numbers since it has been used. We use regular expressions to search each
            number and each value to remove those positions from the cell_id_options array.
        7. Although this would not scale well, this works fine for games where there are 36 numbers, which is
            probably enough unless there are people with a lot of time on their hands or a super genius. As well,
            as we use td_id's the amount of options decrease as we traverse the data.
         */
        //console.log('this.cell_id_options');
        //console.log(this.cell_id_options);
        //console.log('Length of cell ids = ' + this.cell_ids.length);
        /* we need an array of td_ids for each number.  */
        for (var i = 1; i <= this.cells; i++) {
            /* Using slice is a way to clone the array. Otherwise all instance point to a single object */
            this.cell_id_options[i] = this.cell_ids.slice(0);
        }
        //console.log('this.cell_id_options');
        //console.log(this.cell_id_options);
        /* Loop through each number and find positions for them in the Sudoku puzzle */
        for (var r = 1; r <= this.cells; r++) {
            /* Find places for the number of cells being played... so for a 9 cell puzzle, find 9 places */
            for (var c = 0; c < this.cells; c++) {
                console.log('The current position being filled: c = ' + c);
                console.log('>>>>>>>>>>>>>>>>>>>>>> LENGTH FOR NUMBER: ' + r + ' IS ' + this.cell_id_options[r].length);
                //console.log(this.cell_id_options[r]);

                /* Select a value and set it to the id in cell_values */
                // pick a random number out of the length for cell_id_options[r]
                var random_position = Math.floor(Math.random() * this.cell_id_options[r].length);
                console.log('New Random Position = ' + random_position);
                // get the value for that position
                var td_id = this.cell_id_options[r][random_position];
                console.log('td_id = ' + td_id);
                // add the value of r to the corresponding cell_values[td_id] = r
                this.cell_values[td_id] = r;

                /* Remove this td_id from all numbers now that it has been used */
                for (var r2 = 1; r2 <= this.cells; r2++) {
                    /* find the position in the other arrays and removed them. */
                    var position_found = this.cell_id_options[r2].indexOf(td_id);
                    //console.log('td_id_found = ' + this.cell_id_options[r2][position_found]);
                    this.cell_id_options[r2].splice(position_found, 1);
                }
                //console.log(this.cell_id_options);

                /* If not the last number, remove all additional options for the number
                    This is because all the other rows will be used and unset and there is only
                    a single row left. */
                //console.log(r + " < " + this.cells + (r < this.cells))
                if (r < this.cells && 1 <= this.cell_id_options[r].length) {
                    // get the values from the td_id
                    var td_id_ar = td_id.toString().split('_');
                    td_id_ar.forEach(function (value, index) {
                        /* there are 3 patters used to find and remove keys of the current number (r) */
                        var pattern = '';
                        switch (index) {
                            case 0:
                                pattern = '^' + value + '_';
                                break;
                            case 1:
                                pattern = '_' + value + '_';
                                break;
                            case 2:
                                pattern = '_' + value + '$';
                                break;
                        }
                        /* Loop through each position for the current number, and remove matching elements
                            We need to use a do/while loop so we can control the cur_pos value, only incrementing it
                            when we do not find a match. When we find a match, we remove it, so we cannot advance
                            the cur_pos. */
                        var cur_pos = 0;
                        var matching = false;
                        do {
                            var td_id_to_examine = setUp.cell_id_options[r][cur_pos];
                            //console.log('********* td_id = ' + td_id);
                            //console.log('pattern = ' + pattern);
                            //console.log('td_id_to_examine = ' + td_id_to_examine);
                            if (td_id_to_examine.match(pattern)) {
                                matching = true;
                                //console.log('MATCH cur_pos ' + cur_pos);
                                setUp.cell_id_options[r].splice(cur_pos, 1);
                                //console.log('MATCH cell_id_option');
                                //console.log(setUp.cell_id_options[r]);
                            } else {
                                cur_pos++;
                                //console.log('cur_pos ' + cur_pos);
                                /* For first pattern - when matching ends, skip to the next pattern
                                 to decrease iterations */
                                if (matching && 0 == index) {
                                    matching = false;
                                    break;
                                }
                            }
                            //console.log('LENGTH FOR NUMBER: ' + r + ' IS ' + setUp.cell_id_options[r].length);
                        } while (cur_pos < setUp.cell_id_options[r].length);
                    });
                }
            }
            console.log(this.cell_values);
        }
    },
    reset: function() {
        this.cell_id_options = [];
        this.cell_ids = [];
        this.cell_values = [];

    },
    build: function() {
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
                /* add the names to the array of cell ids - acts as a template */
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
