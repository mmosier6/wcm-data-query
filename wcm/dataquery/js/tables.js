//global variables
var finalJSON="";
var month_count=Array();
var year_count=Array();
var month_abbrev = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var year_list = [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020];
var today = new Date();
var current_year = today.getFullYear();

function displayFilteredData(page){
//clear finalJSON every time the script is run
finalJSON = "";

//table formaatting if data type is watch
if (page.dataType === "watch") {
	
	//function used down below to change the order of the data based on the date
	function compare(a,b){
		const watchA = a["sel_issue_dt"];
		const watchB = b["sel_issue_dt"];
		
		var comparison = 0;
		if(watchA > watchB){
			comparison = 1;
		}else if(watchA < watchB){
			comparison = -1;
		}
		
		return comparison;
	}
	
	//after filter is run, use compare funtion to sort the data
	page.data['filtered-sorted'] = page.data['filtered'].slice().sort(compare);	

	//set total object equal to zero to start
	var total = {"watches":0,"SVR":0,"TOR":0,"PDS TOR":0,"PDS SVR":0};

	//build the entire javascript of the table in the variable st
	var st = "";
	st = st + "<table  width = '100%' cellpadding='0' cellspacing='0' border='0' class='display' id='results_table'>";
	//make header which contains table titles
	st = st + "<thead><tr>";
	st = st + "<th></th>";
	st = st + "<th> Issue Date/Time (UTC)</th>";
	st = st + "<th> Watch Type </th>";
	st = st + "<th> Watch Number </th>";
	st = st + "<th> States in Watch </th>";
	st = st + "<th> CWAs in Watch </th>";
	st = st + "<th style='display:none;'></th>";
	st = st + "<th style='display:none;'></th>";
	st = st + "<th style='display:none;'></th>";
	st = st + "</tr></thead><tbody>";
	//start table body here
	page.data['filtered-sorted'].forEach(function(d,n){
		var fulldt = d['sel_issue_dt'];
		st = st + "<tr>";
		st = st + '<td><i class = "fa fa-plus-square details-control" orderable = "false" title = "Click to see watch areas/summary/threats"></i></td>';
		st = st + "<td> " + fulldt.slice(4,6) +"/"+ fulldt.slice(6,8) +"/"+ fulldt.slice(0,4) +" "+ fulldt.slice(8,12) +  "</td>";
		st = st + "<td> " + d['type'] + "</td>";
		st = st + "<td> " + d['watch_num'] +  "</td>";
		st = st + "<td> " + d['ST'] + "</td>";
		st = st + "<td> " + d['CWA'] + "</td>";
		//this next column is the one that is hidden and only displayed as a child when clicking the initial button
		st = st + "<td style='display:none;' class='child'>" + d['threats'] + "</td><td style='display:none;' class='child'>" + d['areas'] + "</td><td style='display:none;' class='child'>" + d['summary'] + "</td>";
		st = st + "</tr>";

		//this is how totals are calculated. Add one each time you iterate through.
		total['watches']=total['watches']+1;
		total[d['type']]=total[d['type']]+1;

		//this function counts the total number for each month
		month = Number(fulldt.slice(4,6));
		for (i=1; i<13; i++) {
			if (typeof month_count[i] === 'undefined') {
				month_count[i] = 0;
			}
			if (i=== month) {
				month_count[i] = month_count[i] + 1;
			}
		}
		//this function counts the total number for each year
		year = Number(fulldt.slice(0,4));
		for (i=2000; i<2021; i++) {
			if (typeof year_count[i] === 'undefined') {
				year_count[i] = 0;
			}
			if (i=== year) {
				year_count[i] = year_count[i] + 1;
			}
	}

		//create the finalJSON variable in the correct format
		finalJSON = finalJSON + ',{"watch_num":"'+d["watch_num"]+'","ST":["'+d["ST"]+'"],"FIPS":["'+d["FIPS"]+'"],"issue_dt":"'+d["sel_issue_dt"]+'","CWA":["'+d["CWA"]+'"],"type":["'+d["type"]+'"],"pds":["'+d["pds"]+'"],"expire_dt":["'+d["sel_expire_dt"]+'"],"threats":["'+d["threats"]+'"],"summary":["'+d["summary"]+'"],"areas":["'+d["areas"]+'"]}';
	
	}); //closing brackets for page.data['filtered-sorted'].forEach function

	//add totals to the JSON file
	finalJSON = finalJSON + ',{"Totals":{';
	//iterate through months to add months
	for (i=1; i<13; i++) {
		finalJSON = finalJSON + '"'+month_abbrev[i]+'":'+month_count[i]+',';
	}
	//iterate through the years to add years
	for (i=2000; i<(current_year+1); i++) {
		if (i===current_year) {
		finalJSON = finalJSON + '"'+year_list[i-2000]+'":'+year_count[i]+'}}';
		} else {
		finalJSON = finalJSON + '"'+year_list[i-2000]+'":'+year_count[i]+',';		
		}
	}

	//Footer section where titles are repeated
	st = st + "</tbody><tfoot><tr>";
	st = st + "<th></th>";
	st = st + "<th> Issue Date/Time </th>";
	st = st + "<th> Watch Type </th>";
	st = st + "<th> Watch Number </th>";
	st = st + "<th> States in Watch </th>";
	st = st + "<th> CWAs in Watch </th>";
	st = st + "</tr></tfoot>";
	st = st + "</table>";

	//make total table here
	tot = "";
	tot = tot + "<table id='total_table'>";
	tot = tot + "<tr>";
	tot = tot + "<th id='results_cell'>Type</th>";
	tot = tot + "<th id='results_cell'> Total </th>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Watches</td>";
	tot = tot + "<td id='results_cell'>"+total['watches']+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Severe</td>";
	tot = tot + "<td id='results_cell'>"+total['SVR']+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Tornado</td>";
	tot = tot + "<td id='results_cell'>"+total['TOR']+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>PDS Severe</td>";
	tot = tot + "<td id='results_cell'>"+total['PDS SVR']+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>PDS Tornado</td>";
	tot = tot + "<td id='results_cell'>"+total['PDS TOR']+"</td>";
	tot = tot + "</tr>";
	tot = tot + "</table>";

//return the html of the details section when you expand a row
function format ( c ) {
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Threats:</td>'+
            '<td>'+c[6]+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Areas:</td>'+
            '<td>'+c[7]+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Summary:</td>'+
            '<td>'+c[8]+'</td>'+
        '</tr>'+
    '</table>';
}

//end of watch section. Start of report section
} else if (page.dataType === "report") {

	//function used down below to change the order of the data based on the date
	function compare(a,b){
		const ReportA = a.DT;
		const ReportB = b.DT;
		
		var comparison = 0;
		if(ReportA > ReportB){
			comparison = 1;
		}else if(ReportA < ReportB){
			comparison = -1;
		}
		
		return comparison;
	}
	//after filter is run, use compare funtion to sort the data
	page.data['filtered-sorted'] = page.data['filtered'].slice().sort(compare);		

	//set total array equal to zero to start
	var total = [0,0,0,0,0,0,0]
	//ranges that will be displayed in totals table
	var torRange = ["Rating","EF0","EF1","EF2","EF3","EF4","EF5"];
	var hailRange = ['Hail Size','<1"','1"-1.99"','2"-2.99"','3"-3.99"','4"-4.99"','5+"'];
	var windRange = ["Wind Speed","58-65 mph","66-74 mph","75-85 mph","85-95 mph","95-105 mph","105+ mph"]
	//make totalTitle Array to populate below
	var totalTitle = Array();

	//populate the totalTitle Array for display in totals table based on what the report type is
	for (i=0; i<torRange.length; i++) {
	if (page.reportType === "T") {
	totalTitle[i] = torRange[i];		
	} else if (page.reportType === "A") {
	totalTitle[i] = hailRange[i];
	} else if (page.reportType === "G") {
	totalTitle[i] = windRange[i];
	}
}

	//build the entire javascript of the table in the variable st
	var st = "";
	st = st + "<table id='results_table' width = '100%' class='display'>";
	//make header which contains table titles
	st = st + "<thead><tr>";
	st = st + "<th></th>";
	st = st + "<th>Date/Time (CST)</th>";
	st = st + "<th>"+totalTitle[0]+"</th>";
	st = st + "<th>Location</th>";
	st = st + "<th>County</th>";
	st = st + "<th>State</th>";
	st = st + "<th>CWA</th>";
	st = st + "<th>Inj</th>";
	st = st + "<th>Fat</th>";
	st = st + "</tr></thead><tbody>";
	//start table body here
	page.data['filtered-sorted'].forEach(function(d,n){
		var fulldt = d["DT"];
		st = st + "<tr>";
		st = st + '<td><i class = "fa fa-plus-square details-control" orderable = "false" title = "Click to see additional report text"></i></td>';
		st = st + "<td> " + fulldt.slice(4,6) +"/"+ fulldt.slice(6,8) +"/"+ fulldt.slice(0,4) +" "+ fulldt.slice(8,12) +  "</td>";
		st = st + "<td> " + d['MAGNITUDE'] + "</td>";
		st = st + "<td> " + d['LOCATION'] + "</td>";
		st = st + "<td> " + d['COUNTY'] + "</td>";
		st = st + "<td> " + d['ST'] + "</td>";
		st = st + "<td> " + d['CWA'] + "</td>";
		st = st + "<td> " + d['INJURY'] + "</td>";
		st = st + "<td> " + d['FATALITIES'] + "</td>";
		st = st + "</tr>";

		//this is how totals are calculated. Add one each time you iterate through.
		total[0]=total[0]+1;

		//add up the total number at each threshold by iterating through.
		//start with tornado
	if (page.reportType === "T") {
		if (d['MAGNITUDE']===0) {
			total[1]=total[1]+1;
		}	else if (d['MAGNITUDE']===1) {
			total[2]=total[2]+1;
		}	else if (d['MAGNITUDE']===2) {
			total[3]=total[3]+1;
		}	else if (d['MAGNITUDE']===3) {
			total[4]=total[4]+1;
		}	else if (d['MAGNITUDE']===4) {
			total[5]=total[5]+1;
		}	else if (d['MAGNITUDE']===5) {
			total[6]=total[6]+1;
		}
		//now add up wind gusts at each threshold
	} else if (page.reportType === "G") {
		if (d['MAGNITUDE']>57 & d['MAGNITUDE']<65) {
			total[1]=total[1]+1;
		}	else if (d['MAGNITUDE']>64 & d['MAGNITUDE']<75) {
			total[2]=total[2]+1;
		}	else if (d['MAGNITUDE']>74 & d['MAGNITUDE']<85) {
			total[3]=total[3]+1;
		}	else if (d['MAGNITUDE']>84 & d['MAGNITUDE']<95) {
			total[4]=total[4]+1;
		}	else if (d['MAGNITUDE']>94 & d['MAGNITUDE']<105) {
			total[5]=total[5]+1;
		}	else if (d['MAGNITUDE']>104 & d['MAGNITUDE']<200) {
			total[6]=total[6]+1;
		}
		//now add up hail reports at each threshold
	} else if (page.reportType === "A") {
		if (d['MAGNITUDE']>0 & d['MAGNITUDE']<100) {
			total[1]=total[1]+1;
		}	else if (d['MAGNITUDE']>99 & d['MAGNITUDE']<200) {
			total[2]=total[2]+1;
		}	else if (d['MAGNITUDE']>199 & d['MAGNITUDE']<300) {
			total[3]=total[3]+1;
		}	else if (d['MAGNITUDE']>299 & d['MAGNITUDE']<400) {
			total[4]=total[4]+1;
		}	else if (d['MAGNITUDE']>399 & d['MAGNITUDE']<500) {
			total[5]=total[5]+1;
		}	else if (d['MAGNITUDE']>499 & d['MAGNITUDE']<1000) {
			total[6]=total[6]+1;
		}
	}

		//this function counts the total number for each month
		var month = Number(fulldt.slice(4,6));
		for (i=1; i<13; i++) {
			if (typeof month_count[i] === 'undefined') {
				month_count[i] = 0;
			}
			if (i=== month) {
				month_count[i] = month_count[i] + 1;
			}
		}	

		//this function counts the total number for each year
		var year = Number(fulldt.slice(0,4));
		for (i=2000; i<2021; i++) {
			if (typeof year_count[i] === 'undefined') {
				year_count[i] = 0;
			}
			if (i=== year) {
				year_count[i] = year_count[i] + 1;
			}
		}
		//create the finalJSON variable in the correct format
		finalJSON = finalJSON + ',{"TYPE":"'+d["TYPE"]+'","ST":["'+d["ST"]+'"],"FIPS":["'+d["FIPS"]+'"],"DATE":"'+d["DT"]+'","CWA":["'+d["CWA"]+'"],"LOCATION":"'+d["LOCATION"]+'","MAGNITUDE":"'+d["MAGNITUDE"]+'","INJURIES":"'+d["INJURIES"]+'","FATALITIES":"'+d["FATALITIES"]+'","COUNTY":"'+d["COUNTY"]+'"}';
	
	});	//closing brackets for page.data['filtered-sorted'].forEach function

		//add the month and year count at the end of the finalJSON
		finalJSON = finalJSON + ',{"Totals":{"Jan":'+month_count[1]+',"Feb":'+month_count[2]+',"Mar":'+month_count[3]+',"Apr":'+month_count[4]+',"May":'+month_count[5]+',"Jun":'+month_count[6]+
		',"Jul":'+month_count[7]+',"Aug":'+month_count[8]+',"Sep":'+month_count[9]+',"Oct":'+month_count[10]+',"Nov":'+month_count[11]+',"Dec":'+month_count[12]+',2000:'+year_count[2000]+',2001:'+year_count[2001]+',2002:'+year_count[2002]+',2003:'+year_count[2003]+',2004:'+year_count[2004]+',2005:'+year_count[2005]+',2006:'+year_count[2006]+',2007:'+year_count[2007]+',2008:'+year_count[2008]+',2009:'+year_count[2009]+',2010:'+year_count[2010]+',2011:'+year_count[2011]+',2012:'+year_count[2012]+',2013:'+year_count[2013]+',2014:'+year_count[2014]+',2015:'+year_count[2015]+',2016:'+year_count[2016]+',2017:'+year_count[2017]+',2018:'+year_count[2018]+',2019:'+year_count[2019]+',2020:'+year_count[2020]+'}}'

	//Footer section where titles are repeated
	st = st + "</tbody><tfoot><tr>";
	st = st + "<th></th>";
	st = st + "<th>Date/Time (CST)</th>";
	st = st + "<th>"+totalTitle[0]+"</th>";
	st = st + "<th>Location</th>";
	st = st + "<th>County</th>";
	st = st + "<th>State</th>";
	st = st + "<th>CWA</th>";
	st = st + "<th>Injuries</th>";
	st = st + "<th>Fatalities</th>";
	st = st + "</tr></tfoot>";
	st = st + "</table>";

	//make total table here
	tot = "";
	tot = tot + "<table id='total_table'>";
	tot = tot + "<tr>";
	tot = tot + "<th id='results_cell'></th>";
	tot = tot + "<th id='results_cell'> Total </th>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[1]+"</td>";
	tot = tot + "<td id='results_cell'>"+total[1]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[2]+"</td>";
	tot = tot + "<td id='results_cell'>"+total[2]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[3]+"</td>";
	tot = tot + "<td id='results_cell'>"+total[3]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[4]+"</td>";
	tot = tot + "<td id='results_cell'>"+total[4]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[5]+"</td>";
	tot = tot + "<td id='results_cell'>"+total[5]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[6]+"</td>";
	tot = tot + "<td id='results_cell'>"+total[6]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Total</td>";
	tot = tot + "<td id='results_cell'>"+total[0]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "</table>";

//return the html of the details section when you expand a row
function format ( c ) {
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>No Additional Data Available at this time</td>'+
        '</tr>'+
    '</table>';
}

} //end of reports else section

	//clear out data-table
	jQuery("#data-table").empty();
	//put variable st data into data-table
	jQuery("#data-table").html(st);
	//clear out total-table
	jQuery("#total-table").empty();
	//put variable tot into tot-table
	jQuery("#total-table").html(tot);

	//turn results table into DataTable
	var table = jQuery('#results_table').DataTable({
		"lengthMenu": [[10,25, 50, 100, -1], [10, 25, 50, 100, "All"]], //different types of lengths available (-1 equals all)
		"pageLength": -1, //default page length
		"columnDefs": [		
			{"width" : "120px", "targets":1},		//Width of time column
		]		
	});

    // Add event listener for opening and closing details
    jQuery('i.details-control').on('click', function () {
        var tr = jQuery(this).closest('tr');
        var row = table.row(tr);
 
        if ( row.child.isShown() ) {
            jQuery(this).addClass("fa-plus-square");
			jQuery(this).removeClass("fa-minus-square");
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            jQuery(this).removeClass("fa-plus-square");
			jQuery(this).addClass("fa-minus-square");
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
}

//this function makes the JSON file which can be downloaded by the user
function makeJSON() {
			finalJSON = finalJSON.slice(1);
			finalJSON = "["+finalJSON+"]";
			var JSONfile = document.createElement('a');
			JSONfile.href = 'data:attachment/JSON,' + encodeURI(finalJSON);
			JSONfile.target = '_blank';
			JSONfile.download = 'JSONfile.json';
			JSONfile.click();
		}
