function makeChart(page) {
	//assign variables
	var start_month = Number(page.filters['date'][0].slice(4,6));
	var end_month = Number(page.filters['date'][1].slice(4,6));
	var start_year = Number(page.filters['date'][0].slice(0,4));
	var end_year = Number(page.filters['date'][1].slice(0,4));
	var categories = Array();

	//assign y axis label based on page.dataType
	var column_data = Array();
	if (page.dataType === "watch") {
	column_data[0] = "# of Watches";		
	} else if (page.dataType === "report") {
	column_data[0] = "# of Reports";
	}

//assign column_data and categories based on whether the chart type is month or year
if (page.chartType === "month") {
	if (page.filters['date'][1].slice(0,4) === page.filters['date'][0].slice(0,4) ) {
		for (i=start_month; i<(end_month +1); i++) {
			categories[i-start_month] = month_abbrev[i-1];
			column_data[i-start_month+1] = month_count[i];
		}
	} else {
		categories = month_abbrev;
		column_data = [column_data[0],month_count[1],month_count[2],month_count[3],month_count[4],month_count[5],month_count[6],month_count[7],month_count[8],month_count[9],month_count[10],month_count[11],month_count[12]];
		}
} else if (page.chartType === "year") {
		for (i=start_year; i<(end_year +1); i++) {
			categories[i-start_year] = year_list[i-2000];
			column_data[i-start_year+1] = year_count[i];
		}
} else if (page.chartType === "type") {
		if (page.dataType ==="watch") {
		column_data[1] = total.TOR;
		column_data[2] = total.SVR;
		column_data[3] = total['PDS TOR'];
		column_data[4] = total['PDS SVR'];
		} else {	
		column_data = total;
		}
		for (i=0; i<(totalTitle.length-1); i++) {
		categories[i] = totalTitle[i+1];
		}
}

		console.log(column_data)
		console.log(categories)

if (page.chartType === "pie") {
	var pieData = Array();
	pieData[0] = ["Tornado",200];
	pieData[1] = ["Hail",2000];
	pieData[2] = ["Wind",1350];
	console.log(pieData)

	column_data = pieData;
	var chart = c3.generate({
		bindto: '#chart',
		data: {
        	columns: column_data,
        	type : 'pie'
   		}
	});

} else {
	var chart = c3.generate({
		bindto: '#chart',
		data: {
			columns: [
				column_data
			],
			type: 'bar'
		},
		bar: {
			width: {
				ratio: 0.8
			}
		},
		axis: {
			x: {
				type: 'category',
				categories: categories
			},
			y: {
				label: {
					text: column_data[0],
					position: 'outer-middle'
				}
			}
		}
	});
}

}//end of makeChart function