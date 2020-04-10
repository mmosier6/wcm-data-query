function makeChart(page) {
	//assign variables
	var start_month = Number(page.filters['date'][0].slice(4,6));
	var end_month = Number(page.filters['date'][1].slice(4,6));
	var start_year = Number(page.filters['date'][0].slice(0,4));
	var end_year = Number(page.filters['date'][1].slice(0,4));
	var categories = Array();
	var pieData = Array();

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
			column_data[i-start_month+1] = total['month'][i];
		}
	} else {
		categories = month_abbrev;
		column_data = [column_data[0],total['month'][1],total['month'][2],total['month'][3],total['month'][4],total['month'][5],total['month'][6],total['month'][7],total['month'][8],total['month'][9],total['month'][10],total['month'][11],total['month'][12]];
		}
} else if (page.chartType === "year") {
		for (i=start_year; i<(end_year +1); i++) {
			categories[i-start_year] = year_list[i-2000];
			column_data[i-start_year+1] = total['year'][i];
			console.log(total['year'][2000])
			console.log(total['year'][2002])
			console.log(total['year'][2004])
			console.log(total['year'][2006])
			console.log(total['year'][2008])
			console.log(total['year'][2010])
			console.log(total['year'][2012])
			console.log(total['year'][2014])
			console.log(total['year'][2016])
			console.log(total['year'][2018])
			console.log(total['year'][2020])
		}
} else if (page.chartType === "type" || page.chartType === "pie") {
		if (page.dataType ==="watch") {
		column_data[1] = total['type'][1];
		column_data[2] = total['type'][2];
		column_data[3] = total['type'][3];
		column_data[4] = total['type'][4];
		pieData[0] = [totalTitle[1],total['type'][1]];
		pieData[1] = [totalTitle[2],total['type'][2]];
		pieData[2] = [totalTitle[3],total['type'][3]];
		pieData[3] = [totalTitle[4],total['type'][4]];
		} else {	
			if (page.reportType === "ALL") {
				for (i=1; i<(total['type'].length); i++) {
					column_data[i] = total['type'][i];
					pieData[i-1] = [totalTitle[i],total['type'][i]];
				}
			} else {
				for (i=1; i<(total['mag'].length); i++) {
					column_data[i] = total['mag'][i];
					pieData[i-1] = [totalTitle[i],total['mag'][i]];
				}
			}
		}
		for (i=0; i<(totalTitle.length-1); i++) {
		categories[i] = totalTitle[i+1];
		}
}

if (page.chartType === "pie") {

	var chart = c3.generate({
		bindto: '#chart',
		data: {
        	columns: pieData,
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