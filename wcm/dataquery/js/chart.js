function makeChart(page) {
	var months;
	var years;
	var month_abbrev = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var year = [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020];
	var start_month = Number(page.filters['date'][0].slice(4,6));
	var end_month = Number(page.filters['date'][1].slice(4,6));
	var start_year = Number(page.filters['date'][0].slice(0,4));
	var end_year = Number(page.filters['date'][1].slice(0,4));
	var categories = Array();

	var column_data = Array();
	if (page.dataType === "watch") {
	column_data[0] = "# of Watches";		
	} else if (page.dataType === "report") {
	column_data[0] = "# of Reports";
	}

if (page.chartType === "month") {
	if (page.filters['date'][1].slice(0,4) === page.filters['date'][0].slice(0,4) ) {
		months = end_month - start_month + 1
		for (i=start_month; i<(end_month +1); i++) {
			categories[i-start_month] = month_abbrev[i-1];
			column_data[i-start_month+1] = month_count[i];
	}
	} else {
		months = 12;
		categories = month_abbrev;
		column_data = [column_data[0],month_count[1],month_count[2],month_count[3],month_count[4],month_count[5],month_count[6],month_count[7],month_count[8],month_count[9],month_count[10],month_count[11],month_count[12]];
		}
} else if (page.chartType === "year") {
		years = end_year - start_year + 1;
		for (i=start_year; i<(end_year +1); i++) {
			categories[i-start_year] = year[i-2000];
			column_data[i-start_year+1] = year_count[i];
	}
	}

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
				tick: {
					rotate: -45
				},
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