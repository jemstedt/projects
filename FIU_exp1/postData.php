<?php
$append = $_POST['addToFile'];


if ($append == "no")
{
	$f = fopen('data/' . $_POST['filename'], 'w');
	fwrite($f, $_POST['data']);
	fclose($f);	
}

elseif ($append == "yes")
{
	$f = fopen('data/' . $_POST['filename'], 'a');
	fwrite($f, "\n");
	fwrite($f, $_POST['data']);
	fclose($f);	
} //Slut på append if


?>