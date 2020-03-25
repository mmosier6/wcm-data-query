var finalJSON="";
function displayFilteredData(page){
	console.log("displayFilteredData");
	console.log(page.data['filtered'])
	
	function compare(a,b){
		const watchA = a.wnum;
		const watchB = b.wnum;
		
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
	var dataKeys = new Array("wnum", "issue_dt", "type");
	var st = "";
	st = st + "<table id='results_table' width = '100%'>";
	st = st + "<tr>";
	st = st + "<th id='results_cell'> Issue Date/Time </th>";
	st = st + "<th id='results_cell'> Watch Type </th>";
	st = st + "<th id='results_cell'> Watch Number </th>";
	st = st + "<th id='results_cell'> States in Watch </th>";
	st = st + "<th id='results_cell'> CWAs in Watch </th>";
	st = st + "</tr>";
	page.data['filtered-sorted'].forEach(function(d,n){
		var fulldt = d['issue_dt'];
		st = st + "<tr>";
		st = st + "<td id='results_cell'> " + fulldt.slice(4,6) +"/"+ fulldt.slice(6,8) +"/"+ fulldt.slice(0,4) +" "+ fulldt.slice(8,12) +  "Z</td>";
		st = st + "<td id='results_cell'> " + d['type'] + "</td>";
		st = st + "<td id='results_cell'> " + d['wnum'] +  "</td>";
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
		finalJSON = finalJSON + ',{"wnum":"'+d["wnum"]+'","ST":["'+d["ST"]+'"],"FIPS":["'+d["FIPS"]+'"],"issue_dt":"'+d["issue_dt"]+'","CWA":["'+d["CWA"]+'"],"type":"'+d["type"]+'"}';
	});	

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

	
	jQuery("#data-table").empty();
	
	jQuery("#data-table").html(st);

	jQuery("#total-table").html(tot);

	jQuery(".download").show();
	
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
