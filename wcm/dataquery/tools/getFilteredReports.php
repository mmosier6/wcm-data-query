<?php
	date_default_timezone_set("Etc/UTC");

	$longopts = array(
		"dtype:",
		"source:",
		"rtype:",
		"wtype:",
		"v",
		"date:",
		"range",
		"start:",
		"end:",
		"cache"
	);

	$srcDir = "../src";

	$dtype 	= false;
	$source	= false;
	$rtype 	= false;
	$wtype 	= false;
	$v 			= false;
	$date 	= false;
	$range 	= false;
	$start 	= false;
	$end 		= false;
	$cache 	= false;
	$which 	= false;
	$types = array();
	$options = getoptreq("", $longopts);
	if(isset($options["v"])){
		$v = true;
	}

	//Make sure all the options are good and clean
	//Date/Time Options
	if(isset($options["range"])){
		$which = 'range';
		$date = false;
		$range = true;
		if(isset($options["start"])){
			$s = $options["start"];
			$start_date = create_date($s);
		}else{
			handleError(1);
		}
		if(isset($options["end"])){
			$e = $options["end"];
			$end_date = create_date($e);
		}else{
			handleError(1);
		}
	}else if(isset($options["date"])){
		$which = 'date';
		$d = $options["date"];
		$date = create_date($d);
	}else{
		handleError(2);
	}
	//Data Type options
	if(isset($options["dtype"])){
		$dtype = $options["dtype"];
		if($dtype == 'reports'){
			//Report source options
			if(isset($options["source"])){
				$source = $options["source"];
				print $source."<br>";
				if(($source != 'lsr') && ($source != 'stormdata')){
					handleError(4);
				}
			}else{
				handleError(4);
			}
			//Report type options

			if(isset($options["rtype"])){
				$rtype = $options["rtype"];
				##Get valid report types from file
				$a = file_get_contents($srcDir."/reportTypes.csv");
				$lines = explode("\n", $a);
				$num = count($lines);
				$keys = array();
				$valid_report_types = array();
				for($i = 0; $i < $num; $i++){
					$l = trim($lines[$i]);
					if($i == 0){
						$keys = explode(",", $l);
					}else{
						$tmp = explode(",", $l);
						for($ii = 0; $ii < count($tmp)-1; $ii++){
							if($keys[$ii] == 'SHORT'){
								array_push($valid_report_types, $tmp[$ii]);
							}
						}
					}
				}
				$ts = explode(",", $rtype);
				foreach($ts as $t){
					print "$t<br>";
					print_r($valid_report_types);
					if(in_array($t, $valid_report_types)){
						if(! in_array($t, $types)){
							array_push($types, $t);
						}
					}else{
						print ("Here!");
						handleError(6);
					}
				}
			}else{
				handleError(5);
			}
		}elseif($dtype == 'watches'){
			//Watch type options
			if(isset($options["wtype"])){
				$wtype = $options["wtype"];
				$valid_watch_types = array("TOR", "SVR", "PDSTOR", "PDSSVR", "All");
				$ts = explode(",", $wtype);
				foreach($ts as $t){
					if(in_array($t, $valid_watch_types)){
						if(! in_array($t, $types)){
							array_push($types, $t);
						}
					}else{
						handleError(8);
					}
				}
			}else{
				handleError(7);
			}
		}elseif($dtype == 'outlooks'){
			print "Not set up for outlooks yet<br>";
			exit(1);
		}else{
			handleError(3);
		}
	}else{
		handleError(3);
	}

	if($v){
		if($which == 'date'){
			print "<br>";
			print "Date/Time: $date<br>";
		}elseif($which == 'range'){
			print "<br>";
			print "Start Date/Time: $start_date<br>";
			print "End Date/Time: $end_date<br>";
		}
		if($rtype){
			print "Report Type(s): ".join(", ", $types);
		}
		if($wtype){
			print "Watch Type(s): ".join(", ", $types);
		}
	}

	$datadir = "../data";

	function handleError($errorNum){
		$valid_report_types = array("A", "T", "W", "G", "All", "AllWind");
		$valid_watch_types = array("TOR", "SVR", "PDSTOR", "PDSSVR", "All");
		print "<br>";
		if($errorNum == 1){print "<br>ERROR: A start and end date must be set if the range option is set<br>";}
		if($errorNum == 2){print "<br>ERROR: 'date' or 'range' (with start and end dates) must be set <br>";}
		if($errorNum == 3){	print "<br>ERROR: 'dtype' (data type) option must be set with either 'reports', 'watches', or 'outlooks'<br>";}
		if($errorNum == 4){	print "<br>ERROR: 'source' (report source) option must be set with either 'lsr' or 'stormdata'<br>";}
		if($errorNum == 5){	print "<br>ERROR: 'rtype' (report type) option must be set.'<br>";}
		if($errorNum == 6){
			print "<br>ERROR: 'rtype' (report type) set to an invalid report type. '<br>";
			print "Valid report types are ".join(", ", $valid_report_types)."<br>";
		}
		if($errorNum == 7){print "<br>ERROR: 'wtype' (watch type) option must be set.'<br>";}
		if($errorNum == 8){
			print "<br>ERROR: 'wtype' (watch type) set to an invalid report type. '<br>";
			print "Valid report types are ".join(", ", $valid_watch_types)."<br>";
		}
		print "<br><br>";
		exit(1);
	}



	function create_date($d){
		if((strlen($d) == 8) || (strlen($d) == 10) || (strlen($d) == 12)){
			if(strlen($d) == 8){

				$d = $d.'1200';

			}else if(strlen($d) == 10){

				$d = $d.'00';

			}else if(strlen($d) == 12){
				$d = $d;
			}

			return $d;
		}else{
			print "Date format is YYYYMMDD or YYYYMMDDHH or YYYYMMDDHHmm <br>";
			exit();
		}
	}



  function getoptreq ($options, $longopts){
	   if (PHP_SAPI === 'cli' || empty($_SERVER['REMOTE_ADDR']))  // command line
	   {
	      return getopt($options, $longopts);
	   }
	   else if (isset($_REQUEST))  // web script
	   {
	      $found = array();

	      $shortopts = preg_split('@([a-z0-9][:]{0,2})@i', $options, 0, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
	      $opts = array_merge($shortopts, $longopts);

	      foreach ($opts as $opt)
	      {
		 if (substr($opt, -2) === '::')  // optional
		 {
		    $key = substr($opt, 0, -2);

		    if (isset($_REQUEST[$key]) && !empty($_REQUEST[$key]))
		       $found[$key] = $_REQUEST[$key];
		    else if (isset($_REQUEST[$key]))
		       $found[$key] = false;
		 }
		 else if (substr($opt, -1) === ':')  // required value
		 {
		    $key = substr($opt, 0, -1);

		    if (isset($_REQUEST[$key]) && !empty($_REQUEST[$key]))
		       $found[$key] = $_REQUEST[$key];
		 }
		 else if (ctype_alnum($opt))  // no value
		 {
		    if (isset($_REQUEST[$opt]))
		       $found[$opt] = false;
		 }
	      }

	      return $found;
	   }

	   return false;
	}
?>
