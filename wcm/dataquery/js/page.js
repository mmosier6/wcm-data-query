function buildPage(page){
	page.reportType="tornado_reports";
	page.viewType ="table";
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
			jQuery("#all-watch-filters").show();
			jQuery("#all-report-filters").hide();
			jQuery("#report-type").hide();
			jQuery("#watch-type").show();
			jQuery("#data-type-8").prop('checked', true);
			jQuery("#data-type-8").addClass("ui-state-active")
			jQuery("#data-type-8").button('refresh');
			jQuery("#view-type").show();
			jQuery("#date-pickers").show();
			jQuery("#filter-opt-list").show();
		}
		if(v === 'report'){
			jQuery("#all-watch-filters").hide();
			jQuery("#all-report-filters").show();
			jQuery("#report-type").show();
			jQuery("#watch-type").hide();
			jQuery("#data-type-4").prop('checked', true);
			jQuery("#data-type-4").addClass("ui-state-active")
			jQuery("#data-type-4").button('refresh');
			jQuery("#view-type").show();
			jQuery("#date-pickers").show();
			jQuery("#filter-opt-list").show();
		}

	});

	jQuery("#data-type-buttonset1").buttonset().change(function(){
		var ele = jQuery(this);
		var w = '';
		ele.find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				w = jQuery(this).attr("value");
			}
		});
		page.reportType = w;
	});

	jQuery("#data-type-buttonset2").buttonset().change(function(){
		var ele = jQuery(this);
		var y = '';
		ele.find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				y = jQuery(this).attr("value");
			}
		});
		page.watchType = y;
	});

	jQuery("#data-type-buttonset3").buttonset().change(function(){
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
		jQuery("#data-type-buttonset input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
				page.dataType = v;
			}
		});
		var urlStr = '';
		if (page.dataType ==="watch"){
			if(typeof(page.data) === 'undefined'){
				urlStr ="/wcm/data/collections/combined_watch_collections_2017-2020.json";
			}else if(typeof(page.data['watch'])){
				urlStr ="/wcm/data/collections/combined_watch_collections_2017-2020.json";
			}else{
				urlStr = "";
			}
		}else if(page.dataType ==="report"){
			if(typeof(page.data) === 'undefined'){
				urlStr ="/wcm/data/collections/report_collection_2019-packed.json";
			}else if(typeof(page.data['report'])){
				urlStr ="/wcm/data/collections/report_collection_2019-packed.json";
			}else{
				urlStr = "";
			}

		}
		console.log(urlStr);
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
				createFilteredData(page);
				getFilteredData(page);
			});
		}
		if (page.viewType === "table") {
			jQuery(".download").show();
		}
	});
}
