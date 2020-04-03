function buildPage(page){
	//Data type buttonset
	jQuery("#data-type-buttonset").buttonset().change(function(){
		var el = jQuery(this);
		var v = '';
			jQuery("#data-table").empty();
			jQuery("#total-table").empty();
			jQuery(".download").hide();
		el.find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
			}
		});
		page.dataType = v;
		if(v === 'watch'){
			jQuery("#all-report-filters").hide();
			jQuery("#report-source").hide();
			jQuery("#report-type").hide();
			jQuery("#all-watch-filters").show();
			jQuery("#watch-type").show();
			jQuery("#view-type").show();
			jQuery("#date-pickers").show();
			jQuery("#filter-opt-list").show();
		}
		if(v === 'report'){
			jQuery("#all-watch-filters").hide();
			jQuery("#watch-type").hide();
			jQuery("#all-report-filters").show();
			jQuery("#report-source").show();
			jQuery("#report-type").show();
			jQuery("#view-type").show();
			jQuery("#date-pickers").show();
			jQuery("#filter-opt-list").show();
		}

	});

	jQuery("#report-type-buttonset").buttonset().change(function(){
		var ele = jQuery(this);
		var w = '';
		ele.find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				w = jQuery(this).attr("value");
			}
		});
		page.reportType = w;
	});

	jQuery("#watch-type-buttonset").buttonset().change(function(){
		var ele = jQuery(this);
		var y = '';
		ele.find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				y = jQuery(this).attr("value");
			}
		});
		page.watchType = y;
	});

	jQuery("#report-source-buttonset").buttonset().change(function(){
		jQuery("#report-type").show();
		var ele = jQuery(this);
		var y = '';
		ele.find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				y = jQuery(this).attr("value");
			}
		});
		page.reportSource = y;
	});

	jQuery("#view-type-buttonset").buttonset().change(function(){
		var elem = jQuery(this);
		var x = '';
		elem.find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				x = jQuery(this).attr("value");
			}
		});
		page.viewType = x;

	if (page.viewType === "table") {
		jQuery(".download").show();
		jQuery("#data-table").show();
		jQuery("#total-table").show();
		jQuery("#chart").hide();
	} else if (page.viewType ==="chart") {
		jQuery("#data-table").hide();
		jQuery("#total-table").hide();
		jQuery(".download").hide();
		jQuery("#chart").show();
	}
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
	jQuery('#progressbar').show();
		jQuery("#data-type-buttonset input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				y = jQuery(this).attr("value");
				page.dataType = y;
			}
		});

	jQuery("#report-source-buttonset input:radio").each(function(){
		if(jQuery(this).prop("checked")){
			z = jQuery(this).attr("value");
			page.reportSource = z;
		}
	});

	jQuery("#report-type-buttonset input:radio").each(function(){
		if(jQuery(this).prop("checked")){
			a = jQuery(this).attr("value");
			page.reportType = a;
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
