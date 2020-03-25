function buildPage(page){
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
			if(jQuery("#date-pickers").hasClass("hidden")){
				jQuery("#date-pickers").removeClass("hidden");
			}
			if(jQuery("#filter-opt-list").hasClass("hidden")){
				jQuery("#filter-opt-list").removeClass("hidden");
			}
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

	//Get watch data
	jQuery.ajax({
		dataType: "json",
		url: "/wcm/data/raw/watches_all_2019.json"
	}).done(function(data){
		page.data = new Object();
		page.data['all'] = data;
		createFilteredData(page);
	});

	jQuery("#go-btn").button().on('click', function(){
		jQuery("#data-type-buttonset input:radio").each(function(){
			if(jQuery(this).prop("checked")){
				v = jQuery(this).attr("value");
				page.dataType = v;
			}
		});

		getFilteredData(page);

	});
}
