<?php
$pNumber = $_POST['number'];

$prevUsed = "no";

$filename = 'data/usedPnumber/usedPnumber.csv';	

$f = fopen($filename, "r");
while (!feof ($f)) {
    $row = fgetcsv($f); //fgetcsv returns an array
    if ($row[0] == $pNumber) {
    	$prevUsed = "yes";
        break;
    } 
}
fclose($f);


if ($prevUsed == "no"){
	$f = fopen($filename, "a");
	fwrite($f, "\n");
	fwrite($f, $pNumber);	
	fclose($f);
}


// send back response
echo $prevUsed;
?>