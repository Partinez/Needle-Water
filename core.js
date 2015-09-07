var tableCreated = 0;

var Seq1 = 'ATACT';
var Seq2 = 'TACTG';
var Gap = -1;
var Mismatch = -1;
var Match = 1;


function createtable(type, size1, size2) {
        var body = document.getElementById('body');
        var table = document.getElementById(type);
        table.setAttribute('border','1');
        var tbody = document.createElement('tbody');
        for (var i = 0; i <= size2+1; i++) {
            
            
            
            var row = document.createElement('tr');
            for (var j = 0; j <= size1+1; j++) {
                
                var cell = document.createElement('td');
                cell.appendChild(document.createTextNode("0"));
                cell.id = type + parseInt(i) +"_" + parseInt(j);
                row.appendChild(cell);
            }
            
            tbody.appendChild(row);
        }
        
        
        table.appendChild(tbody);
}

function setCell(row, col, table, text) {
    var cell = document.getElementById(table + parseInt(row) + "_" + parseInt(col));
    cell.replaceChild(document.createTextNode(text), cell.childNodes[0]);   
    
}

function setSequences(sequence1, sequence2) {
    for (var i = 0; i <= sequence1.length-1; i++) {
        setCell(0,i+2,'score',sequence1[i]);
        setCell(0,i+2,'trace',sequence1[i]);
    }
    for (var i = 0; i <= sequence2.length-1; i++) {
        setCell(i+2,0,'score',sequence2[i]);
        
        setCell(i+2,0,'trace',sequence2[i]);
    }
    
}

function getCell(row,col, table) {
    console.log(table + parseInt(row) + "_" + parseInt(col));
    return document.getElementById(table + parseInt(row) + "_" + parseInt(col)).innerHTML;
}


function calCell(row, col) {
    var fromTop = parseInt(getCell(row-1,col,'score')) + Gap;
    var fromLeft = parseInt(getCell(row,col-1,'score')) + Gap;
    if (getCell(0,col,'score') == getCell(row,0,'score')) {
        var fromTopLeft = parseInt(getCell(row-1,col-1,'score')) + Match;
               
    } 
    else {
        var fromTopLeft = parseInt(getCell(row-1,col-1,'score')) + Mismatch;
    }
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
    var trace = '';
    if (THighest) { trace = trace + 'T'}
    if (LHighest) { trace = trace + 'L'}
    if (TLHighest) { trace = trace + 'D'}
    setCell(row,col,'trace',trace);
}
    
function setGaps(Size1,Size2) {
    for (var i = 0; i <= Size1-1; i++) {
        var left = parseInt(getCell(1,i+1,'score'))
        setCell(1,i+2,'score', left + Gap);
        setCell(1,i+2,'trace','L');
    }
    for (var i = 0; i <= Size2-1; i++) {
        var top = parseInt(getCell(i+1,1,'score'))
        setCell(i+2,1,'score', top + Gap);
        setCell(i+2,1,'trace', 'T');
    }
    
    
}
    
function calCells(Size1,Size2) {
    for (var row = 2; row <= Size2+1; row++) {
        for (var col = 2; col <= Size1+1; col++) {
            calCell(row,col);
            
            
        }
    }
}


function initialize() {
 
    var Seq1 = document.getElementById("seq1").value;
    var Seq2 = document.getElementById("seq2").value;
    var Size1 = Seq1.length;
    var Size2 = Seq2.length;
    createtable('score', Size1, Size2);
    createtable('trace', Size1, Size2);

    setSequences(Seq1,Seq2);
    setGaps(Size1,Size2);
    console.log('Gapsset');
    calCells(Size1,Size2);
    
}