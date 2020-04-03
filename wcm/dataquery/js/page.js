function buildPage(page){
	//Load default chart Type
	page.chartType = "month";

	//Data type buttonset on change function
	jQuery("#data-type-buttonset").buttonset().change(function(){
			//Clear out previous rearch data
			jQuery("#data-table").empty();
			jQuery("#total-table").empty();
			//Hide download button
			jQuery(".download").hide();
			//set value of checked radio button to v
		jQuery(this).find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
			}
		});

		//set page.dataType equal to the value of the checked radio button
		page.dataType = v;

		//hide or show several divs based on the value of the checked radio button
		if(v === 'watch'){
			jQuery("#all-report-filters").hide();
			jQuery("#report-source").hide();
			jQuery("#report-type").hide();
			jQuery("#all-watch-filters").show();
			jQuery("#watch-type").show();
			jQuery("#date-pickers").show();
		}
		if(v === 'report'){
			jQuery("#all-watch-filters").hide();
			jQuery("#watch-type").hide();
			jQuery("#all-report-filters").show();
			jQuery("#report-source").show();
			jQuery("#report-type").show();
			jQuery("#date-pickers").show();
		}

	}); //End of data-type-buttonset on change function

	//Function when report-type-buttonset is changed
	jQuery("#report-type-buttonset").buttonset().change(function(){
		//set value of checked radio button to v
		jQuery(this).find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
			}
		});

		//set page.reportType equal to the value of the checked radio button
		page.reportType = v;

	});//end of report-type-buttonset on change function

	//Function when watch-type-buttonset is changed
	jQuery("#watch-type-buttonset").buttonset().change(function(){
		jQuery(this).find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
			}
		});
		page.watchType = v;
	});

	jQuery("#report-source-buttonset").buttonset().change(function(){
		jQuery("#report-type").show();
		jQuery(this).find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
			}
		});
		page.reportSource = v;
	});

	jQuery("#chart-type-buttonset").buttonset().change(function(){
		jQuery(this).find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
			}
		});
		page.chartType = v;
		makeChart(page);
	});

	//Create dialog box
	jQuery("#error-dialog").dialog({
		autoOpen: false,
		resizable: false,
		height:300,
		width: 400,
		modal: true,
		buttons:{
			//"Go to classic reports page": function(){
			//	window.location.href("/climo/online");
			//}
			"Close": function(){
				jQuery(this).dialog("close");
			}
		}
	});

	createCalendars(page);

	filterStates(page);
	filterCWAs(page);
	//filterFIPSandZIP(page);

	jQuery("#go-btn").button().on('click', function(){
	jQuery("#view-type").show();
	jQuery("#filter-opt-list").show();
	jQuery("#data-type-buttonset input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
				page.dataType = v;
			}
		});

	jQuery("#report-source-buttonset input:radio").each(function(){
		if(jQuery(this).prop("checked")){
			v = jQuery(this).attr("value");
			page.reportSource = v;
		}
	});

	jQuery("#report-type-buttonset input:radio").each(function(){
		if(jQuery(this).prop("checked")){
			v = jQuery(this).attr("value");
			page.reportType = v;
		}
	});

	jQuery("#view-type-buttonset").buttonset().change(function(){
		jQuery(this).find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
			}
		});
		page.viewType = v;

	if (page.viewType === "table") {
		jQuery(".download").show();
		jQuery("#data-table").show();
		jQuery("#total-table").show();
		jQuery("#chart-type").hide();
		jQuery("#chart").hide();
	} else if (page.viewType ==="chart") {
		jQuery("#data-table").hide();
		jQuery("#total-table").hide();
		jQuery(".download").hide();
		jQuery("#chart-type").show();
		jQuery("#chart").show();
	}
	});

		var urlStr = 'test';
		if (page.dataType ==="watch"){
			if(typeof(page.data) === 'undefined'){
				urlStr ="/wcm/data/collections/combined_watch_collections_2017-2020.json";
			}else if(typeof(page.data['watch'])){
				urlStr ="/wcm/data/collections/combined_watch_collections_2017-2020.json";
			}else{
				urlStr = "";
			}
		}else if(page.dataType ==="report"){
			console.log(page.reportSource)
			if (page.reportSource ==="LSR") {
				if(typeof(page.data) === 'undefined'){
					urlStr ="/wcm/data/collections/combined_report_collections_2017-2019-packed.json";
				}else if(typeof(page.data['report'])){
					urlStr ="/wcm/data/collections/combined_report_collections_2017-2019-packed.json";
				}else{
					urlStr = "";
				}
			} else if (page.reportSource ==="stormData") {
				if(typeof(page.data) === 'undefined'){
					urlStr ="/wcm/data/collections/combined_stormdata_collections_2017-2019-packed.json";
				}else if(typeof(page.data['stormData'])){
					urlStr ="/wcm/data/collections/combined_stormdata_collections_2017-2019-packed.json";
				}else{
					urlStr = "";
				}
			}
		}

		console.log(page.reportSource)
		console.log("Data Source: "+ urlStr + "");
		if(urlStr !== ''){
			//Get watch data
			jQuery.ajax({
				dataType: "json",
				url: urlStr
			}).done(function(data){
				page.data = new Object();
				if(page.dataType === 'watch'){
					page.data['watch'] = data;
				}else if(page.dataType === 'report'){
					page.data['report'] = jsonh.unpack(data[0]);
				}
				console.log(page.data['watch'])
				createFilteredData(page);
				getFilteredData(page);
			});
		}
		if (page.viewType === "table") {
			jQuery(".download").show();
		}
	});

  jQuery( function() {
      dialog = jQuery( "#dialog" ).dialog({
        autoOpen: false,
        closeOnEscape: false,
        resizable: false,
      }),
      downloadButton = jQuery( "#go-btn" )
        .button()
        .on( "click", function() {
          dialog.dialog( "open" );
        });
  } );

}
