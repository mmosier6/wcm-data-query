var finalJSON="";
var month_count=Array();
function displayFilteredData(page){
if (page.dataType === "watch") {
	
	function compare(a,b){
		const watchA = a.watch_num;
		const watchB = b.watch_num;
		
		var comparison = 0;
		if(watchA > watchB){
			comparison = 1;
		}else if(watchA < watchB){
			comparison = -1;
		}
		
		return comparison;
	}
	
	page.data['filtered-sorted'] = page.data['filtered'].slice().sort(compare);		
	var totalWatches=0;
	var totalSevere=0;
	var totalTornado=0;
	var totalPDSTornado=0;
	var totalPDSSevere=0;
	month_count=[];
	var dataKeys = new Array("wnum", "sel_issue_dt", "type");
	var st = "";
	st = st + ""
	st = st + "<table id='results_table' width = '100%'>";
	st = st + "<tr>";
	st = st + "<th id='results_cell'> Issue Date/Time </th>";
	st = st + "<th id='results_cell'> Watch Type </th>";
	st = st + "<th id='results_cell'> Watch Number </th>";
	st = st + "<th id='results_cell'> States in Watch </th>";
	st = st + "<th id='results_cell'> CWAs in Watch </th>";
	st = st + "</tr>";
	page.data['filtered-sorted'].forEach(function(d,n){
		var fulldt = d['sel_issue_dt'];
		st = st + "<tr>";
		st = st + "<td id='results_cell'> " + fulldt.slice(4,6) +"/"+ fulldt.slice(6,8) +"/"+ fulldt.slice(0,4) +" "+ fulldt.slice(8,12) +  "Z</td>";
		st = st + "<td id='results_cell'> " + d['type'] + "</td>";
		st = st + "<td id='results_cell'> " + d['watch_num'] +  "</td>";
		st = st + "<td id='results_cell'> " + d['ST'] + "</td>";
		st = st + "<td id='results_cell'> " + d['CWA'] + "</td>";
		st = st + "</tr>";
		totalWatches=totalWatches+1;
		if (d['type']==="SVR") {
			totalSevere=totalSevere+1;
		}	else if (d['type']==="TOR") {
			totalTornado=totalTornado+1;
		}	else if (d['type']==="PDS TOR") {
			totalPDSTornado=totalPDSTornado+1;
		}	else if (d['type']==="PDS SVR") {
			totalPDSSevere=totalPDSSevere+1;
		}
		var month = Number(fulldt.slice(4,6));
		for (i=1; i<13; i++) {
			if (typeof month_count[i] === 'undefined') {
				month_count[i] = 0;
			}
			if (i=== month) {
				month_count[i] = month_count[i] + 1;
			}
		}
		finalJSON = finalJSON + ',{"watch_num":"'+d["watch_num"]+'","ST":["'+d["ST"]+'"],"FIPS":["'+d["FIPS"]+'"],"sel_issue_dt":"'+d["sel_issue_dt"]+'","CWA":["'+d["CWA"]+'"],"type":"'+d["type"]+'"}';
	});

		finalJSON = finalJSON + ',{"Totals":{"Jan":'+month_count[1]+',"Feb":'+month_count[2]+',"Mar":'+month_count[3]+',"Apr":'+month_count[4]+',"May":'+month_count[5]+',"Jun":'+month_count[6]+
		',"Jul":'+month_count[7]+',"Aug":'+month_count[8]+',"Sep":'+month_count[9]+',"Oct":'+month_count[10]+',"Nov":'+month_count[11]+',"Dec":'+month_count[12]+'}}'
	st = st + "</table>";

	tot = "";
	tot = tot + "<table id='total_table'>";
	tot = tot + "<tr>";
	tot = tot + "<th id='results_cell'>Type</th>";
	tot = tot + "<th id='results_cell'> Total </th>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Watches</td>";
	tot = tot + "<td id='results_cell'>"+totalWatches+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Severe</td>";
	tot = tot + "<td id='results_cell'>"+totalSevere+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Tornado</td>";
	tot = tot + "<td id='results_cell'>"+totalTornado+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>PDS Severe</td>";
	tot = tot + "<td id='results_cell'>"+totalPDSSevere+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>PDS Tornado</td>";
	tot = tot + "<td id='results_cell'>"+totalPDSTornado+"</td>";
	tot = tot + "</tr>";
	tot = tot + "</table>";
} 
else if (page.dataType === "report") {

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

	page.data['filtered-sorted'] = page.data['filtered'].slice().sort(compare);		

	var total=0;
	var total0=0;
	var total1=0;
	var total2=0;
	var total3=0;
	var total4=0;
	var total5=0;
	var DataTableTitle1 = "Date/Time";
	var DataTableTitle2 = "";
	var TotalTitle0 = "";
	var TotalTitle1 = "";
	var TotalTitle2 = "";
	var TotalTitle3 = "";
	var TotalTitle4 = "";
	var TotalTitle5 = "";

	if (page.reportType === "T") {
	DataTableTitle2 = "Tornado Rating";
	TotalTitle0 = "EF0";
	TotalTitle1 = "EF1";
	TotalTitle2 = "EF2";
	TotalTitle3 = "EF3";
	TotalTitle4 = "EF4";
	TotalTitle5 = "EF5";		
	} else if (page.reportType === "A") {
	DataTableTitle2 = "Hail Size";
	TotalTitle0 = "<1";
	TotalTitle1 = '1"-1.99"';
	TotalTitle2 = '2"-2.99"';
	TotalTitle3 = '3"-3.99"';
	TotalTitle4 = '4"-4.99"';
	TotalTitle5 = '5+"';
	} else if (page.reportType === "G") {
	DataTableTitle2 = "Wind Speed";
	TotalTitle0 = "58-65 mph";
	TotalTitle1 = "66-74 mph";
	TotalTitle2 = "75-85 mph";
	TotalTitle3 = "85-95 mph";
	TotalTitle4 = "95-105 mph";
	TotalTitle5 = "105+ mph";
	}
	var dataKeys = new Array("MAGNITUDE", "DT");
	var st = "";
	st = st + "<table id='results_table' width = '100%'>";
	st = st + "<tr>";
	st = st + "<th id='results_cell'>"+DataTableTitle1+"</th>";
	st = st + "<th id='results_cell'>"+DataTableTitle2+"</th>";
	st = st + "</tr>";
	page.data['filtered-sorted'].forEach(function(d,n){
		var fulldt = d["DT"];
		st = st + "<tr>";
		st = st + "<td id='results_cell'> " + fulldt.slice(4,6) +"/"+ fulldt.slice(6,8) +"/"+ fulldt.slice(0,4) +" "+ fulldt.slice(8,12) +  " CST</td>";
		st = st + "<td id='results_cell'> " + d['MAGNITUDE'] + "</td>";
		st = st + "</tr>";
		total=total+1;
	if (page.reportType === "T") {
		if (d['MAGNITUDE']===0) {
			total0=total0+1;
		}	else if (d['MAGNITUDE']===1) {
			total1=total1+1;
		}	else if (d['MAGNITUDE']===2) {
			total2=total2+1;
		}	else if (d['MAGNITUDE']===3) {
			total3=total3+1;
		}	else if (d['MAGNITUDE']===4) {
			total4=total4+1;
		}	else if (d['MAGNITUDE']===5) {
			total5=total5+1;
		}
	} else if (page.reportType === "G") {
		if (d['MAGNITUDE']>57 & d['MAGNITUDE']<65) {
			total0=total0+1;
		}	else if (d['MAGNITUDE']>64 & d['MAGNITUDE']<75) {
			total1=total1+1;
		}	else if (d['MAGNITUDE']>74 & d['MAGNITUDE']<85) {
			total2=total2+1;
		}	else if (d['MAGNITUDE']>84 & d['MAGNITUDE']<95) {
			total3=total3+1;
		}	else if (d['MAGNITUDE']>94 & d['MAGNITUDE']<105) {
			total4=total4+1;
		}	else if (d['MAGNITUDE']>104 & d['MAGNITUDE']<200) {
			total5=total5+1;
		}
	} else if (page.reportType === "A") {
		if (d['MAGNITUDE']>0 & d['MAGNITUDE']<100) {
			total0=total0+1;
		}	else if (d['MAGNITUDE']>99 & d['MAGNITUDE']<200) {
			total1=total1+1;
		}	else if (d['MAGNITUDE']>199 & d['MAGNITUDE']<300) {
			total2=total2+1;
		}	else if (d['MAGNITUDE']>299 & d['MAGNITUDE']<400) {
			total3=total3+1;
		}	else if (d['MAGNITUDE']>399 & d['MAGNITUDE']<500) {
			total4=total4+1;
		}	else if (d['MAGNITUDE']>499 & d['MAGNITUDE']<1000) {
			total5=total5+1;
		}
	}	
		var month = Number(fulldt.slice(4,6));
		for (i=1; i<13; i++) {
			if (typeof month_count[i] === 'undefined') {
				month_count[i] = 0;
			}
			if (i=== month) {
				month_count[i] = month_count[i] + 1;
			}
		}	
		finalJSON = finalJSON + ',{"TYPE":"'+d["TYPE"]+'","ST":["'+d["ST"]+'"],"FIPS":["'+d["FIPS"]+'"],"DATE":"'+d["DATE"]+'","CWA":["'+d["CWA"]+'"]"}';
	});	

	st = st + "</table>";

	tot = "";
	tot = tot + "<table id='total_table'>";
	tot = tot + "<tr>";
	tot = tot + "<th id='results_cell'></th>";
	tot = tot + "<th id='results_cell'> Total </th>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+TotalTitle0+"</td>";
	tot = tot + "<td id='results_cell'>"+total0+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+TotalTitle1+"</td>";
	tot = tot + "<td id='results_cell'>"+total1+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+TotalTitle2+"</td>";
	tot = tot + "<td id='results_cell'>"+total2+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+TotalTitle3+"</td>";
	tot = tot + "<td id='results_cell'>"+total3+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+TotalTitle4+"</td>";
	tot = tot + "<td id='results_cell'>"+total4+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>"+TotalTitle5+"</td>";
	tot = tot + "<td id='results_cell'>"+total5+"</td>";
	tot = tot + "</tr>";
	tot = tot + "<tr>";
	tot = tot + "<td id='results_cell'>Total</td>";
	tot = tot + "<td id='results_cell'>"+total+"</td>";
	tot = tot + "</tr>";
	tot = tot + "</table>";
}
	jQuery("#data-table").empty();
	
	jQuery("#data-table").html(st);

	jQuery("#total-table").empty();

	jQuery("#total-table").html(tot);
	
}

function makeJSON() {
			finalJSON = finalJSON.slice(1);
			finalJSON = "["+finalJSON+"]";
			var JSONfile = document.createElement('a');
			JSONfile.href = 'data:attachment/JSON,' + encodeURI(finalJSON);
			JSONfile.target = '_blank';
			JSONfile.download = 'JSONfile.json';
			JSONfile.click();
		}
