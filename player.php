<?php
//Access-Control-Allow-Origin header with wildcard.

// if (isset($_SERVER['HTTP_ORIGIN'])) {
//   // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
//   // you want to allow, and if so:
//   header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
//   header('Access-Control-Allow-Credentials: true');
//   header('Access-Control-Max-Age: 86400');    // cache for 1 day
// }

// // Access-Control headers are received during OPTIONS requests
// if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  
//   if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
//       // may also be using PUT, PATCH, HEAD etc
//       header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  
//   if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
//       header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

//   exit(0);
// }


 
$files = glob("audios/*.mp3");
//print_r($files);

if (get_request('pos')!==null) {

  //echo("zou");
  //$json = json_decode(file_get_contents($file), true);
  $array = [];

	$pos =( (int)get_request('pos')) % count($files);
  $title = basename($files[$pos], ".mp3");
  @$description = file_get_contents("audios/".$title.".txt");
  if ($description === false) $description = "";
  $array = [
    "title" => $title,
    "description" => $description,
    "url" => $files[$pos]
  ];

 
  // if (count($json)>=$maxMovie) {
  //   $json = [];
  // }

  // $r = rand(1,$maxMovie);

  // while(in_array($r, $json)){
  //   $r = rand(1,$maxMovie);
  // }
  // array_push($json,$r);
  // //$json[$id] = $r;
  // file_put_contents($file, json_encode($json));

	echo(json_encode($array));
 
	die();
}

function get_request($request){
  $post_get = array_merge($_POST, $_GET); // like $_REQUEST without $_COOKIE
  if (array_key_exists($request,$post_get)) {
    if ($post_get[$request] == "") return true;
    if (is_array($post_get[$request])) {
      array_walk(
        $post_get[$request], 
        function(&$a) {
          $a = (((($a))));
        }
      );
      return $post_get[$request];
    }
    return ((($post_get[$request])));
  } else {
    return null;
  }
}


?>