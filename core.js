//This script calculates the score table and the traceback table 
//using the Needleman-Wunsch and Smith-Waterman algorithms.
//Starts with a call to initialize(method)

function createtable(type, size1, size2) {
        var body = document.getElementById('body');
        var table = document.getElementById(type);
        var tbody = document.createElement('tbody');
        var thead = document.createElement('thead');
        for (var i = 0; i <= size2+1; i++) { //Create each row
            
            var row = document.createElement('tr');
            for (var j = 0; j <= size1+1; j++) { //Create each cell
                
                
                if ((i == 0) || (j == 0)) { 
                        var cell = document.createElement('th'); //th for headers
                } else {
                        var cell = document.createElement('td'); //td for data
                        
                }
                
                cell.appendChild(document.createTextNode("0")); //Fill the table with 0
                cell.id = type + parseInt(i) +"_" + parseInt(j); //Give each cell an unique id
                row.appendChild(cell);
            }
            
            if (i ==0) { 
                thead.appendChild(row);
            } else {
                tbody.appendChild(row);  
            }
        }


	while (table.hasChildNodes()) { //Delete previous tables if they existed.
            table.removeChild(table.lastChild);
	}


        table.appendChild(thead);
        table.appendChild(tbody);
}

function setCell(row, col, table, text) {  //Function that changes the content of any cell on any table.
    var cell = document.getElementById(table + parseInt(row) + "_" + parseInt(col));
    cell.replaceChild(document.createTextNode(text), cell.childNodes[0]);   
    
}

function setSequences(sequence1, sequence2) { //Puts the sequences on the headers. Also writes "Seq1/2"
    setCell(0,1,'score','Seq1');
    setCell(0,1,'trace','Seq1');
    setCell(1,0,'score','Seq2');
    setCell(1,0,'trace','Seq2');
    setCell(0,0,'score',' ');
    setCell(0,0,'trace',' ');
    for (var i = 0; i <= sequence1.length-1; i++) {
        setCell(0,i+2,'score',sequence1[i]);
        setCell(0,i+2,'trace',sequence1[i]);
    }
    for (var i = 0; i <= sequence2.length-1; i++) {
        setCell(i+2,0,'score',sequence2[i]);
        
        setCell(i+2,0,'trace',sequence2[i]);
    }
    
}

function getCell(row,col, table) { //Returns the value on any cell.
    return document.getElementById(table + parseInt(row) + "_" + parseInt(col)).innerHTML;
}


function calCell(row, col, method) { //Does the actual calculation.
    //Calculates the score coming from each of the neighbour cells.
    var fromTop = parseInt(getCell(row-1,col,'score')) + Gap; 
    var fromLeft = parseInt(getCell(row,col-1,'score')) + Gap;
    if (getCell(0,col,'score') == getCell(row,0,'score')) { //If both residues are similar...
        var fromTopLeft = parseInt(getCell(row-1,col-1,'score')) + Match;
    } 
    else { //If they are different...
        var fromTopLeft = parseInt(getCell(row-1,col-1,'score')) + Mismatch;
    }
    
    
    if (method == 'water') { //Negative scores aren't valid in water algo
        fromTop = Math.max(fromTop,0);
        fromLeft = Math.max(fromLeft,0);
        fromTopLeft = Math.max(fromTopLeft,0);
    }
    
    //This block computes the highest score and gets the source cell.
    var THighest = false;
    var LHighest = false;
    var TLHiguest = false;
    if ((fromTop >= fromLeft) && (fromTop >= fromTopLeft)) { 
        THighest = true;
        setCell(row,col,'score',fromTop)
    }
    if ((fromLeft >= fromTop) && (fromLeft >= fromTopLeft)) { 
        LHighest = true;
        setCell(row,col,'score',fromLeft);
    }
    if ((fromTopLeft >= fromLeft) && (fromTopLeft >= fromTop)) { 
        TLHighest = true;
        setCell(row,col,'score',fromTopLeft);
    }
    
    //populate the trace cell.
    var trace = '';
    if (THighest) { trace = trace + String.fromCharCode(8593)}
    if (LHighest) { trace = trace + String.fromCharCode(8592)}
    if (TLHighest) { trace = trace + String.fromCharCode(8598)}
    setCell(row,col,'trace',trace);
}
    
function setGaps(Size1,Size2, method = 'needle') {
    //Fill row 1.
    for (var i = 0; i <= Size1-1; i++) {
        var left = parseInt(getCell(1,i+1,'score')) //Gets left's cell value
        if (method == 'needle') { setCell(1,i+2,'score', left + Gap); } //In water algo this values stay as 0.
        setCell(1,i+2,'trace',String.fromCharCode(8592)); //Left arrow
    }
    //Column 1
    for (var i = 0; i <= Size2-1; i++) {
        var top = parseInt(getCell(i+1,1,'score'))
        if (method == 'needle') {setCell(i+2,1,'score', top + Gap);}
        setCell(i+2,1,'trace', String.fromCharCode(8593)); //Up arrow
    }
    
    
}
    
function calCells(Size1,Size2, method) {
    //Goes through each cell in order, calculating the values.
    for (var row = 2; row <= Size2+1; row++) {
        for (var col = 2; col <= Size1+1; col++) {
            calCell(row,col, method);
            
            
        }
    }
}


function insertTitles() {
    document.getElementById("scoretitle").innerHTML = "Score Table";
    document.getElementById("tracetitle").innerHTML = "Traceback Table";
}





function initialize(method) {
    //method is either 'needle' or 'water', given by the button onclick action.
    insertTitles(); //To show Table titles.
    
    //Gather input.
    Gap = parseInt(document.getElementById("Gap").value);
    Match = parseInt(document.getElementById("Match").value);
    Mismatch = parseInt(document.getElementById("Mismatch").value);
    
    var Seq1 = document.getElementById("seq1").value;
    var Seq2 = document.getElementById("seq2").value;
    var Size1 = Seq1.length;
    var Size2 = Seq2.length;
    
    //Create both tables, filled with '0' in each cell.
    createtable('score', Size1, Size2);
    createtable('trace', Size1, Size2);
    
    //Places the sequences in the table headers. 
    setSequences(Seq1,Seq2);
    
    //Fills Gap row and column on both tables.
    setGaps(Size1,Size2, method);
    
    //Calculates and fills each cell.
    calCells(Size1,Size2, method);
    
}
