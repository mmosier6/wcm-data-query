//global variables
var finalJSON="";
var month_count=Array();
var year_count=Array();
var month_abbrev = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var year_list = [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020];
var today = new Date();
var current_year = today.getFullYear();
var total = [];
var totalTitle = Array();

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

	totalTitle = ["Watch Type","Tornado","Severe","PDS Tornado","PDS Severe"];
	
	//after filter is run, use compare funtion to sort the data
	page.data['filtered-sorted'] = page.data['filtered'].slice().sort(compare);	

	//set total array equal to zero to start
	total['type'] = [0,0,0,0,0];
	total['month'] = [0,0,0,0,0,0,0,0,0,0,0,0,0];
	total['year'] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

	//create variables used to store data 
	var results;
	var results_final = {};
	results_final['data'] = [];
	//build the entire javascript for input into the table here
	page.data['filtered-sorted'].forEach(function(d,n){
		var fulldt = d["sel_issue_dt"];
		results = {};
		results['dt'] = d['sel_issue_dt'];
		results['dt_dis'] =  "" + fulldt.slice(4,6) +"/"+ fulldt.slice(6,8) +"/"+ fulldt.slice(0,4) +" "+ fulldt.slice(8,12) + " CST";
		results['type'] = d['type'];
		results['num'] = d['watch_num'];
		results['st'] = d['ST'].toString();
		results['cwa'] = d['CWA'].toString();
		results['threats'] = d['threats'].toString();
		results['areas'] = d['areas'].toString();
		results['summary'] = d['summary'].toString();
		results_final["data"].push(results);

		//this is how totals are calculated. Add one each time you iterate through.
		total['type'][0]=total['type'][0]+1;
		if (d['type'] === "TOR") {
			total['type'][1]=total['type'][1]+1;
		} else if (d['type'] === "SVR") {
			total['type'][2]=total['type'][2]+1;
		} else if (d['type'] === "PDS TOR") {
			total['type'][3]=total['type'][3]+1;
		} else if (d['type'] === "PDS SVR") {
			total['type'][4]=total['type'][4]+1;
		}

		//this function counts the total number for each month
		month = Number(fulldt.slice(4,6));
		for (i=1; i<13; i++) {
			if (typeof total['month'][i] === 'undefined') {
				total['month'][i] = 0;
			}
			if (i=== month) {
				total['month'][i] = total['month'][i] + 1;
			}
		}
		//this function counts the total number for each year
		year = Number(fulldt.slice(0,4));
		for (i=2000; i<2021; i++) {
			if (typeof total['year'][i] === 'undefined') {
				total['year'][i] = 0;
			}
			if (i=== year) {
				total['year'][i] = total['year'][i] + 1;
			}
	}

		//create the finalJSON variable in the correct format
		finalJSON = finalJSON + ',{"watch_num":"'+d["watch_num"]+'","ST":["'+d["ST"]+'"],"FIPS":["'+d["FIPS"]+'"],"issue_dt":"'+d["sel_issue_dt"]+'","CWA":["'+d["CWA"]+'"],"type":["'+d["type"]+'"],"pds":["'+d["pds"]+'"],"expire_dt":["'+d["sel_expire_dt"]+'"],"threats":["'+d["threats"]+'"],"summary":["'+d["summary"]+'"],"areas":["'+d["areas"]+'"]}';
	
	}); //closing brackets for page.data['filtered-sorted'].forEach function

console.log(results_final)
	//add totals to the JSON file
	finalJSON = finalJSON + ',{"Totals":{';
	//iterate through months to add months
	for (i=0; i<12; i++) {
		finalJSON = finalJSON + '"'+month_abbrev[i]+'":'+total['month'][i]+',';
	}
	//iterate through the years to add years
	for (i=2000; i<(current_year+1); i++) {
		if (i===current_year) {
		finalJSON = finalJSON + '"'+year_list[i-2000]+'":'+total['year'][i]+'}}';
		} else {
		finalJSON = finalJSON + '"'+year_list[i-2000]+'":'+total['year'][i]+',';		
		}
	}

	//make total table here
	tot = "";
	tot = tot + "<table id='total_table'>";
	tot = tot + "<tr>";
	tot = tot + "<th id='results_cell'>Type</th>";
	tot = tot + "<th id='results_cell'> Total </th>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Watches</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][0]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Tornado</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][1]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Severe</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][2]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>PDS Tornado</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][3]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>PDS Severe</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][4]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "</table>";

//return the html of the details section when you expand a row
function format ( c ) {
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Threats:</td>'+
            '<td>'+c['threats']+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Areas:</td>'+
            '<td>'+c['areas']+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Summary:</td>'+
            '<td>'+c['summary']+'</td>'+
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
	total['type'] = [0,0,0,0];
	total['month'] = [0,0,0,0,0,0,0,0,0,0,0,0,0];
	total['year'] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	total['mag'] = [0,0,0,0,0,0,0];

	//ranges that will be displayed in totals table
	var torRange = ["Rating","EF0","EF1","EF2","EF3","EF4","EF5"];
	var hailRange = ['Hail Size','<1"','1"-1.99"','2"-2.99"','3"-3.99"','4"-4.99"','5+"'];
	var windRange = ["Wind Speed","58-65 mph","66-74 mph","75-85 mph","85-95 mph","95-105 mph","105+ mph"];
	var allRange = ["Type","Tornado","Wind Gust","Hail"];

	//populate the totalTitle Array for display in totals table based on what the report type is
	if (page.reportType === "T") {
	totalTitle = torRange;		
	} else if (page.reportType === "A") {
	totalTitle = hailRange;
	} else if (page.reportType === "G") {
	totalTitle = windRange;
	} else if (page.reportType === "ALL") {
	totalTitle = allRange;
	}
	console.log(page.reportType)
	console.log(totalTitle)

	var results = {};
	var results_final = {};
	results_final['data'] = [];
	page.data['filtered-sorted'].forEach(function(d,n){

		var fulldt = d["DT"];
		results['DT'] = d['DT'];
		results['DT_dis'] =  "" + fulldt.slice(4,6) +"/"+ fulldt.slice(6,8) +"/"+ fulldt.slice(0,4) +" "+ fulldt.slice(8,12) + " CST";
		results['MAGNITUDE'] = d['MAGNITUDE'];
		results['LOCATION'] = d['LOCATION'];
		results['COUNTY'] = d['COUNTY'].toString();
		results['ST'] = d['ST'].toString();
		results['CWA'] = d['CWA'].toString();
		results['INJURY'] = d['INJURY'].toString();
		results['FATALITIES'] = d['FATALITIES'].toString();
		results_final["data"].push(results);

		//this is how totals are calculated. Add one each time you iterate through.
			total['type'][0] = total['type'][0] +1;

		//add up the total number at each threshold by iterating through.
		//start with tornado
	if (page.reportType === "T") {
		if (d['MAGNITUDE']==="EF0" || d['MAGNITUDE']==="F0") {
			total['mag'][1]=total['mag'][1]+1;
		}	else if (d['MAGNITUDE']==="EF1" || d['MAGNITUDE']==="F1") {
			total['mag'][2]=total['mag'][2]+1;
		}	else if (d['MAGNITUDE']==="EF2" || d['MAGNITUDE']==="F2") {
			total['mag'][3]=total['mag'][3]+1;
		}	else if (d['MAGNITUDE']==="EF3" || d['MAGNITUDE']==="F3") {
			total['mag'][4]=total['mag'][4]+1;
		}	else if (d['MAGNITUDE']==="EF4" || d['MAGNITUDE']==="F4") {
			total['mag'][5]=total['mag'][5]+1;
		}	else if (d['MAGNITUDE']==="EF5" || d['MAGNITUDE']==="F5") {
			total['mag'][6]=total['mag'][6]+1;
		}
		//now add up wind gusts at each threshold
	} else if (page.reportType === "G") {
		if (d['MAGNITUDE']>57 & d['MAGNITUDE']<65) {
			total['mag'][1]=total['mag'][1]+1;
		}	else if (d['MAGNITUDE']>64 & d['MAGNITUDE']<75) {
			total['mag'][2]=total['mag'][2]+1;
		}	else if (d['MAGNITUDE']>74 & d['MAGNITUDE']<85) {
			total['mag'][3]=total['mag'][3]+1;
		}	else if (d['MAGNITUDE']>84 & d['MAGNITUDE']<95) {
			total['mag'][4]=total['mag'][4]+1;
		}	else if (d['MAGNITUDE']>94 & d['MAGNITUDE']<105) {
			total['mag'][5]=total['mag'][5]+1;
		}	else if (d['MAGNITUDE']>104 & d['MAGNITUDE']<200) {
			total['mag'][6]=total['mag'][6]+1;
		}
		//now add up hail reports at each threshold
	} else if (page.reportType === "A") {
		if (d['MAGNITUDE']>0 & d['MAGNITUDE']<100) {
			total['mag'][1]=total['mag'][1]+1;
		}	else if (d['MAGNITUDE']>99 & d['MAGNITUDE']<200) {
			total['mag'][2]=total['mag'][2]+1;
		}	else if (d['MAGNITUDE']>199 & d['MAGNITUDE']<300) {
			total['mag'][3]=total['mag'][3]+1;
		}	else if (d['MAGNITUDE']>299 & d['MAGNITUDE']<400) {
			total['mag'][4]=total['mag'][4]+1;
		}	else if (d['MAGNITUDE']>399 & d['MAGNITUDE']<500) {
			total['mag'][5]=total['mag'][5]+1;
		}	else if (d['MAGNITUDE']>499 & d['MAGNITUDE']<1000) {
			total['mag'][6]=total['mag'][6]+1;
		}
	}

	if (d['TYPE'] === "T") {	
			total['type'][1]=total['type'][1]+1;		
	} 	else if (d['TYPE'] === "A") {
			total['type'][2]=total['type'][2]+1
	} 	else if (d['TYPE'] === "G") {
			total['type'][3]=total['type'][3]+1
	} 

		//this function counts the total number for each month
		var month = Number(fulldt.slice(4,6));
		for (i=1; i<13; i++) {
			if (typeof total['month'][i] === 'undefined') {
				total['month'][i] = 0;
			}
			if (i=== month) {
				total['month'][i] = total['month'][i] + 1;
			}
		}	

		//this function counts the total number for each year
		year = Number(fulldt.slice(0,4));
		for (i=2000; i<2021; i++) {
			if (typeof total['year'][i] === 'undefined') {
				total['year'][i] = 0;
			}
			if (i=== year) {
				total['year'][i] = total['year'][i] + 1;
			}
		}

		//create the finalJSON variable in the correct format
		finalJSON = finalJSON + ',{"TYPE":"'+d["TYPE"]+'","ST":["'+d["ST"]+'"],"FIPS":["'+d["FIPS"]+'"],"DATE":"'+d["DT"]+'","CWA":["'+d["CWA"]+'"],"LOCATION":"'+d["LOCATION"]+'","MAGNITUDE":"'+d["MAGNITUDE"]+'","INJURIES":"'+d["INJURIES"]+'","FATALITIES":"'+d["FATALITIES"]+'","COUNTY":"'+d["COUNTY"]+'"}';
	
	});	//closing brackets for page.data['filtered-sorted'].forEach function

	//add totals to the JSON file
	finalJSON = finalJSON + ',{"Totals":{';
	//iterate through months to add months
	for (i=0; i<12; i++) {
		finalJSON = finalJSON + '"'+month_abbrev[i]+'":'+total['month'][i]+',';
	}
	//iterate through the years to add years
	for (i=2000; i<(current_year+1); i++) {
		if (i===current_year) {
		finalJSON = finalJSON + '"'+year_list[i-2000]+'":'+total['year'][i]+'}}';
		} else {
		finalJSON = finalJSON + '"'+year_list[i-2000]+'":'+total['year'][i]+',';		
		}
	}

	//make total table here
	tot = "";
	if (page.reportType === "ALL") {
	tot = tot + "<table id='total_table'>";
	tot = tot + "<tr>";
	tot = tot + "<th id='results_cell'>Type</th>";
	tot = tot + "<th id='results_cell'> Total </th>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[1]+"</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][1]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[2]+"</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][2]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[3]+"</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][3]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Total</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][0]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "</table>";
} else {
	tot = tot + "<table id='total_table'>";
	tot = tot + "<tr>";
	tot = tot + "<th id='results_cell'>"+totalTitle[0]+"</th>";
	tot = tot + "<th id='results_cell'> Total </th>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[1]+"</td>";
	tot = tot + "<td id='results_cell'>"+total['mag'][1]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[2]+"</td>";
	tot = tot + "<td id='results_cell'>"+total['mag'][2]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[3]+"</td>";
	tot = tot + "<td id='results_cell'>"+total['mag'][3]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[4]+"</td>";
	tot = tot + "<td id='results_cell'>"+total['mag'][4]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[5]+"</td>";
	tot = tot + "<td id='results_cell'>"+total['mag'][5]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+totalTitle[6]+"</td>";
	tot = tot + "<td id='results_cell'>"+total['mag'][6]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Total</td>";
	tot = tot + "<td id='results_cell'>"+total['type'][0]+"</td>";
	tot = tot + "</tr>";
	tot = tot + "</table>";
}
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
	jQuery("#data-table").html('<table id="results_table" class="display" width="100%"></table>');
	//clear out total-table
	jQuery("#total-table").empty();
	//put variable tot into tot-table
	jQuery("#total-table").html(tot);

if (page.dataType === "watch") {
	//turn results table into DataTable
var table = jQuery('#results_table').DataTable({
		data: results_final['data'],
		columns: [
			{	data: ""
			},
			{	data: {
					_: "dt_dis",
					sort: "dt"
				},
				title: "Date/Time"
			},
			{	data: "type",
				title: totalTitle[0]
			},
			{	data: "num",
				title: "Watch Number"
			},
			{	data: "st",
				title: "States in Watch"
			},
			{	data: "cwa",
				title: "CWAs in Watch"
			}
		],
		"lengthMenu": [[10,25, 50, 100, -1], [10, 25, 50, 100, "All"]], //different types of lengths available (-1 equals all)
		"pageLength": -1, //default page length
		"columnDefs": [		
			{	"width" : "140px", "targets":1},
			{	"targets": 0,
				"orderable": false,
				"data": null,
      			"defaultContent": '<i class = "fa fa-plus-square details-control" orderable = "false" title = "Click to see additional'+page.dataType+' text"></i>' 
      		},
			{	"targets": [4, 5],
				"orderable": false
      		}
		]		
	}); //end of variable table
} else if (page.dataType === "report") {
	//turn results table into DataTable
var table = jQuery('#results_table').DataTable({
		data: results_final['data'],
		columns: [
			{	data: ""
			},
			{	data: {
					_: "DT_dis",
					sort: "DT"
				},
				title: "Date/Time"
			},
			{	data: "MAGNITUDE",
				title: totalTitle[0]
			},
			{	data: "LOCATION",
				title: "Location"
			},
			{	data: "COUNTY",
				title: "County"
			},
			{	data: "ST",
				title: "State"
			},
			{	data: "CWA",
				title: "CWA"
			},
			{	data: "INJURY",
				title: "Injuries"
			},
			{	data: "FATALITIES",
				title: "Fatalities"
			}
		],
		"lengthMenu": [[10,25, 50, 100, -1], [10, 25, 50, 100, "All"]], //different types of lengths available (-1 equals all)
		"pageLength": -1, //default page length
		"columnDefs": [		
			{	"width" : "140px", "targets":1},	
			{	"targets": 0,
				"orderable": false,
				"data": null,
      			"defaultContent": '<i class = "fa fa-plus-square details-control" orderable = "false" title = "Click to see additional'+page.dataType+' text"></i>' 
      		},			
      		{	"targets": [3, 4, 5, 6],
				"orderable": false
      		}
		]		
	}); //end of variable table
}

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
        } else {
            jQuery(this).removeClass("fa-plus-square");
			jQuery(this).addClass("fa-minus-square");
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );

}
//this function makes the JSON file which can be downloaded by the user
function makeJSON(page) {
			finalJSON = finalJSON.slice(1);
			finalJSON = "["+finalJSON+"]";
			var JSONfile = document.createElement('a');
			JSONfile.href = 'data:attachment/JSON,' + encodeURI(finalJSON);
			JSONfile.target = '_blank';
			if (page.dataType === "watch") {
			JSONfile.download = ''+page.watchType+ '_' +page.dataType+ '_' +page.filters['date'][0]+ '_'+page.filters['date'][1]+ '.json';
			} else if (page.dataType === "report") {
			JSONfile.download = ''+page.reportType+ '_' +page.dataType+ '_' +page.filters['date'][0]+ '_'+page.filters['date'][1]+ '.json';				
			}
			JSONfile.click();
		}
