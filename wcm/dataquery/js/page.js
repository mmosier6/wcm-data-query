function buildPage(page){
	page.reportType="tornado_reports";
	//Data type buttonset
	jQuery("#data-type-buttonset").buttonset().change(function(){
		var el = jQuery(this);
		var v = '';
		el.find("input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
			}
		});
		page.dataType = v;
		if(v === 'watch'){
			jQuery("#all-watch-filters").removeClass("hidden");
			jQuery("#all-report-filters").addClass("hidden");
			jQuery("#report-type").addClass("hidden");

			if(jQuery("#date-pickers").hasClass("hidden")){
				jQuery("#date-pickers").removeClass("hidden");
			}

			if(jQuery("#filter-opt-list").hasClass("hidden")){
				jQuery("#filter-opt-list").removeClass("hidden");
			}
		}
		if(v === 'report'){
			jQuery("#all-watch-filters").addClass("hidden");
			jQuery("#all-report-filters").removeClass("hidden");
			jQuery("#report-type").removeClass("hidden");
			jQuery("#data-type-5").prop('checked', true);
			jQuery("#data-type-5").addClass("ui-state-active")
			jQuery("#data-type-5").button('refresh');
			if(jQuery("#date-pickers").hasClass("hidden")){
				jQuery("#date-pickers").removeClass("hidden");
			}
			if(jQuery("#filter-opt-list").hasClass("hidden")){
				jQuery("#filter-opt-list").removeClass("hidden");
			}
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
					urlStr ="/wcm/data/raw/watches_all_2019.json";
				}else if(typeof(page.data['watch'])){
					urlStr ="/wcm/data/raw/watches_all_2019.json";
				}else{
					urlStr = "";
				}
		}else if(page.dataType ==="report"){
				urlStr ="/wcm/data/raw/reports_all_2019.json";
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
	});
}
