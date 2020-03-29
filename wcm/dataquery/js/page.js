function buildPage(page){
	page.reportType="tornado_reports";
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
			jQuery("#view-type").show();
			jQuery("#date-pickers").show();
			jQuery("#filter-opt-list").show();
		}
		if(v === 'report'){
			jQuery("#all-watch-filters").hide();
			jQuery("#all-report-filters").show();
			jQuery("#report-type").show();
			jQuery("#data-type-5").prop('checked', true);
			jQuery("#data-type-5").addClass("ui-state-active")
			jQuery("#data-type-5").button('refresh');
			jQuery("#view-type").hide();
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
	filterFIPSandZIP(page);

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
				urlStr ="/wcm/data/raw/watches_all_2019.json";
			}else if(typeof(page.data['watch'])){
				urlStr ="/wcm/data/raw/watches_all_2019.json";
			}else{
				urlStr = "";
			}
		}else if(page.dataType ==="report"){
			if(typeof(page.data) === 'undefined'){
				urlStr ="/wcm/data/raw/tornado_reports.json";
			}else if(typeof(page.data['watch'])){
				urlStr ="/wcm/data/raw/tornado_reports.json";
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
					page.data['report'] = data;
				}
				console.log(data);
				createFilteredData(page);
				getFilteredData(page);
			});
		}
		console.log(page.viewType)
		if (page.viewType === "table") {
			jQuery(".download").show();
		}
	});
}
