function displayFilteredData(page){
	console.log("displayFilteredData");
	console.log(page.data['filtered'])
	/*
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

	var dataKeys = new Array("wnum", "issue_dt", "type");
	var st = "";
	st = st + "<table width = '100%'>";
	st = st + "<tr>";
	st = st + "<th> Watch Number </th>";
	st = st + "<th> Issue Date/Time </th>";
	st = st + "<th> Watch Type </th>";
	st = st + "</tr>";
	page.data['filtered-sorted'].forEach(function(d,n){
		st = st + "<tr>";
		st = st + "<td> " + d['wnum'] +  "</td>";
		st = st + "<td> " + d['issue_dt'] +  "</td>";
		st = st + "<td> " + d['type'] + "</td>";
		st = st + "</tr>";
	});	
	st = st + "</table>";
	*/
	jQuery("#data-table").empty();
	
	jQuery("#data-table").html(st);
	
}

