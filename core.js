var tableCreated = 0;

var Seq1 = 'ATACT';
var Seq2 = 'TACTG';


function createtable(type) {
        var body = document.getElementById('body');
        var table = document.getElementById(type);
        table.setAttribute('border','1');
        var tbody = document.createElement('tbody');
        for (var i = 0; i <= 5; i++) {
            
            
            
            var row = document.createElement('tr');
            for (var j = 0; j <= 5; j++) {
                
                var cell = document.createElement('td');
                cell.appendChild(document.createTextNode("test"));
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
    for (var i = 1; i <= 5; i++) {
        setCell(0,i,'score',sequence1[i-1]);
        setCell(0,i,'trace',sequence1[i-1]);
    }
    for (var i = 1; i <= 5; i++) {
        setCell(i,0,'score',sequence2[i-1]);
        
        setCell(i,0,'trace',sequence2[i-1]);
    }
    
}


function initialize() {
    createtable('score');
    createtable('trace');
    var Seq1 = document.getElementById("seq1").value;
    var Seq2 = document.getElementById("seq2").value;
    setSequences(Seq1,Seq2);
    
}