function makeChart(page) {
	var months;
	var years;
	var month_abbrev = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
	var start_month = Number(page.filters['date'][0].slice(4,6));
	var end_month = Number(page.filters['date'][1].slice(4,6));
	var start_year = Number(page.filters['date'][0].slice(0,4));
	var end_year = Number(page.filters['date'][1].slice(0,4));
	var categories = Array();

	var column_data_month = Array();
	column_data_month[0] = "# of Watches";
	if (page.filters['date'][1].slice(0,4) === page.filters['date'][0].slice(0,4)) {
		months = end_month - start_month + 1
		years = 1;
		for (i=start_month; i<(end_month +1); i++) {
			if (i === end_month) {
			categories[i-start_month] = month_abbrev[i-1];
			column_data_month[i-start_month+1] = month_count[i];
		} else{
			categories[i-start_month] = month_abbrev[i-1];		
			column_data_month[i-start_month+1] = month_count[i];	
		}
	}
	} else {
		years = end_year - start_year + 1
		months = 12;
		categories = month_abbrev;
		column_data_month = ["# of Watches",month_count[1],month_count[2],month_count[3],month_count[4],month_count[5],month_count[6],month_count[7],month_count[8],month_count[9],month_count[10],month_count[11],month_count[12]];
		}

	console.log(categories)
	console.log(column_data_month)



//	var year_watch = Array();
//	for (i=2000 i++ i<(d.getFullYear() + 1) {
//	year_watch[i] = 3;
//	year_x[i] = i;
//}

	var chart = c3.generate({
		bindto: '#chart',
		data: {
			columns: [
				column_data_month
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
					text: '# of Watches',
					position: 'outer-middle'
				}
			}
		}
	});
}