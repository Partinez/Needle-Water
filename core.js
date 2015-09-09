

function createtable(type, size1, size2) {
        var body = document.getElementById('body');
        var table = document.getElementById(type);
        var tbody = document.createElement('tbody');
        var thead = document.createElement('thead');
        for (var i = 0; i <= size2+1; i++) {
            
            
            
            var row = document.createElement('tr');
            for (var j = 0; j <= size1+1; j++) {
                
                
                if ((i == 0) || (j == 0)) { 
                        var cell = document.createElement('th');
                        cell.appendChild(document.createTextNode(" "));
                } else {
                        var cell = document.createElement('td');
                        cell.appendChild(document.createTextNode("0"));
                }
                
                
                cell.id = type + parseInt(i) +"_" + parseInt(j);
                row.appendChild(cell);
            }
            
            if (i ==0) { 
                thead.appendChild(row);
            } else {
                tbody.appendChild(row);  
            }
        }


	while (table.hasChildNodes()) {
            table.removeChild(table.lastChild);
	}


        table.appendChild(thead);
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
    return document.getElementById(table + parseInt(row) + "_" + parseInt(col)).innerHTML;
}


function calCell(row, col, method) {
    var fromTop = parseInt(getCell(row-1,col,'score')) + Gap;
    var fromLeft = parseInt(getCell(row,col-1,'score')) + Gap;
    if (getCell(0,col,'score') == getCell(row,0,'score')) {
        var fromTopLeft = parseInt(getCell(row-1,col-1,'score')) + Match;
               
    } 
    else {
        var fromTopLeft = parseInt(getCell(row-1,col-1,'score')) + Mismatch;
    }
    
    if (method == 'water') {
        fromTop = Math.max(fromTop,0);
        fromLeft = Math.max(fromLeft,0);
        fromTopLeft = Math.max(fromTopLeft,0);
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
    if (THighest) { trace = trace + String.fromCharCode(8593)}
    if (LHighest) { trace = trace + String.fromCharCode(8592)}
    if (TLHighest) { trace = trace + String.fromCharCode(8598)}
    setCell(row,col,'trace',trace);
}
    
function setGaps(Size1,Size2) {
    
    for (var i = 0; i <= Size1-1; i++) {
        var left = parseInt(getCell(1,i+1,'score'))
        setCell(1,i+2,'score', left + Gap);
        setCell(1,i+2,'trace',String.fromCharCode(8592));
    }
    for (var i = 0; i <= Size2-1; i++) {
        var top = parseInt(getCell(i+1,1,'score'))
        setCell(i+2,1,'score', top + Gap);
        setCell(i+2,1,'trace', String.fromCharCode(8593));
    }
    
    
}
    
function calCells(Size1,Size2, method) {
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
    insertTitles();
    Gap = parseInt(document.getElementById("Gap").value);
    Match = parseInt(document.getElementById("Match").value);
    Mismatch = parseInt(document.getElementById("Mismatch").value);
    var Seq1 = document.getElementById("seq1").value;
    var Seq2 = document.getElementById("seq2").value;
    var Size1 = Seq1.length;
    var Size2 = Seq2.length;
    createtable('score', Size1, Size2);
    createtable('trace', Size1, Size2);

    setSequences(Seq1,Seq2);
    setCell(1,1,'score','0');
    if (method == 'needle') { setGaps(Size1,Size2); }
    calCells(Size1,Size2, method);
    
}



//jquery code from tympanus.net
$(function(){
	$('table').each(function() {
		if($(this).find('thead').length > 0 && $(this).find('th').length > 0) {
			// Clone <thead>
			var $w	   = $(window),
				$t	   = $(this),
				$thead = $t.find('thead').clone(),
				$col   = $t.find('thead, tbody').clone();

			// Add class, remove margins, reset width and wrap table
			$t
			.addClass('sticky-enabled')
			.css({
				margin: 0,
				width: '100%'
			}).wrap('<div class="sticky-wrap" />');

			if($t.hasClass('overflow-y')) $t.removeClass('overflow-y').parent().addClass('overflow-y');

			// Create new sticky table head (basic)
			$t.after('<table class="sticky-thead" />');

			// If <tbody> contains <th>, then we create sticky column and intersect (advanced)
			if($t.find('tbody th').length > 0) {
				$t.after('<table class="sticky-col" /><table class="sticky-intersect" />');
			}

			// Create shorthand for things
			var $stickyHead  = $(this).siblings('.sticky-thead'),
				$stickyCol   = $(this).siblings('.sticky-col'),
				$stickyInsct = $(this).siblings('.sticky-intersect'),
				$stickyWrap  = $(this).parent('.sticky-wrap');

			$stickyHead.append($thead);

			$stickyCol
			.append($col)
				.find('thead th:gt(0)').remove()
				.end()
				.find('tbody td').remove();

			$stickyInsct.html('<thead><tr><th>'+$t.find('thead th:first-child').html()+'</th></tr></thead>');
			
			// Set widths
			var setWidths = function () {
					$t
					.find('thead th').each(function (i) {
						$stickyHead.find('th').eq(i).width($(this).width());
					})
					.end()
					.find('tr').each(function (i) {
						$stickyCol.find('tr').eq(i).height($(this).height());
					});

					// Set width of sticky table head
					$stickyHead.width($t.width());

					// Set width of sticky table col
					$stickyCol.find('th').add($stickyInsct.find('th')).width($t.find('thead th').width())
				},
				repositionStickyHead = function () {
					// Return value of calculated allowance
					var allowance = calcAllowance();
				
					// Check if wrapper parent is overflowing along the y-axis
					if($t.height() > $stickyWrap.height()) {
						// If it is overflowing (advanced layout)
						// Position sticky header based on wrapper scrollTop()
						if($stickyWrap.scrollTop() > 0) {
							// When top of wrapping parent is out of view
							$stickyHead.add($stickyInsct).css({
								opacity: 1,
								top: $stickyWrap.scrollTop()
							});
						} else {
							// When top of wrapping parent is in view
							$stickyHead.add($stickyInsct).css({
								opacity: 0,
								top: 0
							});
						}
					} else {
						// If it is not overflowing (basic layout)
						// Position sticky header based on viewport scrollTop
						if($w.scrollTop() > $t.offset().top && $w.scrollTop() < $t.offset().top + $t.outerHeight() - allowance) {
							// When top of viewport is in the table itself
							$stickyHead.add($stickyInsct).css({
								opacity: 1,
								top: $w.scrollTop() - $t.offset().top
							});
						} else {
							// When top of viewport is above or below table
							$stickyHead.add($stickyInsct).css({
								opacity: 0,
								top: 0
							});
						}
					}
				},
				repositionStickyCol = function () {
					if($stickyWrap.scrollLeft() > 0) {
						// When left of wrapping parent is out of view
						$stickyCol.add($stickyInsct).css({
							opacity: 1,
							left: $stickyWrap.scrollLeft()
						});
					} else {
						// When left of wrapping parent is in view
						$stickyCol
						.css({ opacity: 0 })
						.add($stickyInsct).css({ left: 0 });
					}
				},
				calcAllowance = function () {
					var a = 0;
					// Calculate allowance
					$t.find('tbody tr:lt(3)').each(function () {
						a += $(this).height();
					});
					
					// Set fail safe limit (last three row might be too tall)
					// Set arbitrary limit at 0.25 of viewport height, or you can use an arbitrary pixel value
					if(a > $w.height()*0.25) {
						a = $w.height()*0.25;
					}
					
					// Add the height of sticky header
					a += $stickyHead.height();
					return a;
				};

			setWidths();

			$t.parent('.sticky-wrap').scroll($.throttle(250, function() {
				repositionStickyHead();
				repositionStickyCol();
			}));

			$w
			.load(setWidths)
			.resize($.debounce(250, function () {
				setWidths();
				repositionStickyHead();
				repositionStickyCol();
			}))
			.scroll($.throttle(250, repositionStickyHead));
		}
	});
});
