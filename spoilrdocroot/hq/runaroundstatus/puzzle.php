<?php
	require_once "config.php";
	require_once "db-func.php";
	require_once "utils.php";
	require_once "html.php";
        ini_set('sendmail_from','wind-up-birds-systems@lists.wind-up-birds.org');

	$username=($_SERVER['REMOTE_USER']);
 	head();	

	
	$sql = sprintf("SELECT id,name,clubs_at,spades_at,diamonds_at from team WHERE username='%s'",mysql_real_escape_string($username));
	$result = query_db($sql);
	if (mysql_num_rows($result) != 1) 
	{
		//no record for username
		printf("<head><title>ERROR</title></head><body>\n");
		printf("<br>you have been eaten by a grue.<br>\n");
		printf("ERROR: problem fetching data for username from runarounddb: %s -- contact HQ\n", $username);
		foot();
		exit();
	}
	$r = mysql_fetch_assoc($result);
	$teamname = $r['name'];
	printf("<h2>Hello team: <b>%s</b></h2><br><hr>\n", $teamname); 
	$tid = $r['id'];

	$spoilrsqlgetteamid = sprintf("SELECT id,name from spoilr_team WHERE username='%s'",mysql_real_escape_string($username));
	$spoilrteamresult = spoilr_query_db($spoilrsqlgetteamid);
	if (mysql_num_rows($spoilrteamresult) != 1) {
                //no record for username
                printf("<head><title>ERROR</title></head><body>\n");
                printf("<br>you have been eaten by a grue.<br>\n");
                printf("ERROR: problem fetching data for username from spoilrdb: %s -- contact HQ\n", $username);
                foot();
		exit();
        }
	$spoilr_team_array = mysql_fetch_assoc($spoilrteamresult);
	$spoilr_tid = $spoilr_team_array['id'];

	$spoilrsqlgetaccomplished = sprintf("SELECT interaction_id,accomplished from spoilr_interactionaccess WHERE team_id=%s AND accomplished=1 AND interaction_id=4", $spoilr_tid);
	$spoilraccomplishedresult = spoilr_query_db($spoilrsqlgetaccomplished);
	if (mysql_num_rows($spoilraccomplishedresult) != 1) {
		//you don't have access to mitrunaround yet
		printf("<head><title>ERROR</title></head><body>\n");
		printf("<br>you have been eaten by a grue.</br>\n");
		printf("ERROR: you do not have access to this.",$spoilr_tid);
		foot();
		exit();
	}
	
	if (!isset($_POST['checkAns'])){
		//we are in puzzle display mode
		if (!isset($_GET['suit'])) {
			//trying to get here without a suit is dumb
                        printf("<head><title>ERROR</title></head><body>\n");
			printf("<br>you have been eaten by a grue.</br>");
			printf("ERROR: no suit specified");
			foot();
			exit();
		}

		$suit = $_GET['suit'];
	

		if (!isset($_GET['code'])) {
			//trying to get here without a code is dumb
                        printf("<head><title>ERROR</title></head><body>\n");
			printf("<br>You have been eaten by a grue.<br>");
			printf("ERROR: no code specified");
 			foot();
			exit();	
		}	
		$code = $_GET['code'];
	} else {
		//we are in answer submission mode
		$suit = $_POST['suit'];
		$code = $_POST['code'];
		$submission = strtoupper($_POST['attempt']);
		$submission = preg_replace('/\s+/', '', $submission);
		if (DEBUG == true) {
			printf("<br>DEBUG: attempt=%s",$submission);
		}
	}
	if (($suit!="clubs")&&($suit!="diamonds")&&($suit!="spades")) {
                printf("<head><title>ERROR</title></head><body>\n");
		printf("<br>You have been eaten by a grue.</br>");
		printf("ERROR: incorrect suit specified: %s", $suit);
		foot();
		exit();
	}

	$sql = sprintf("SELECT id,answer,reward FROM %s WHERE urlkey='%s'",mysql_real_escape_string($suit),mysql_real_escape_string($code));

	if (DEBUG == true) {
		printf("<br>DEBUG: sql=%s", $sql);
		printf("<br>DEBUG: code=%s", $code);
		printf("<br>DEBUG: suit=%s", $suit);
		printf("<br>DEBUG: tid=%s", $tid);
	}

	$result = query_db($sql);
	if (mysql_num_rows($result) != 1) {
                printf("<head><title>ERROR</title></head><body>\n");
		printf("<br>You have been eaten by a grue.</br>");
		printf("<br>Invalid URL: suit=%s code=%s<br>\n",$suit,$code);
		foot();
		exit();
	}
	$r = mysql_fetch_assoc($result);
	$pid = $r['id'];
	$answer = $r['answer'];
	$reward = $r['reward'];
	if (DEBUG == true) {
		printf("<br>DEBUG: answer=%s<br>",$answer);
	}
	
	$asql = sprintf("SELECT %s_at FROM team WHERE id='%s'",mysql_real_escape_string($suit),mysql_real_escape_string($tid));
	if (DEBUG == true) {
		printf("DEBUG: asql=%s<br>\n",$asql);
	}
	$teamposition = get_element($asql);

	if (DEBUG == true) {
		printf("DEBUG: %s teamposition: %s<br>",$suit,$teamposition);
	}

	if ($teamposition < $pid) {
                printf("<head><title>ERROR</title></head><body>\n");
		printf("<br>You have been eaten by a grue.<br>");
		printf("<br>You are not supposed to be here yet!</br>");
		foot();
		exit();
	}

	if (isset($_POST['checkAns'])){
	//we're checking an answer
		printf("<head><title>SUBMIT ANSWER</title></head><body>\n");
		printf("<br>You are submitting %s for a %s puzzle",$submission, $suit);
		if ($submission == $answer){
			printf("<br>That is CORRECT!<br>");
			printf("NEXT: %s<br>",$reward);
			$ssql = sprintf("UPDATE team SET %s_at='%s' WHERE id='%s'", $suit, $pid+1, $tid);
			if (DEBUG == true) {
				printf("<br>DEBUG: ssql=%s",$ssql);
			}
			$updateresult = query_db($ssql);
			if ($pid == 6) {
				emailTeamAtSeven("runaroundnotice@lists.wind-up-birds.org",$teamname,$suit);
  			}
			
		} else {
			printf("<br>That is INCORRECT!<br>");
			printf("<a href=/mitrunaround/puzzle.php?suit=%s&code=%s>Try Again</a>",$suit,$code);
			$zsql = sprintf("INSERT INTO %s_attempts (teamid, attempt, pid) VALUES (%s, '%s', %s)", $suit, $tid, mysql_real_escape_string($submission), $pid);
			if (DEBUG == true) {
				printf("<br>DEBUG: zsql=%s",$zsql);
			}
			$updateresult = query_db($zsql);
		}
		
		foot();
		exit();
	}

	//we're displaying the puzzle
	$puzzlefile = CONTENT_ROOT . "/" . $suit . "/" . $pid . ".readfile";

	if (DEBUG == true) {
		printf("<br>DEBUG: puzzle data = %s<br><br>\n", $puzzlefile);	
	}

	if (!file_exists($puzzlefile)) {
                printf("<head><title>ERROR</title></head><body>\n");
		printf("<br>You have been eaten by a grue.</br>");
		printf("<br>Puzzle file does not exist: %s", $puzzlefile);
		foot();
		exit();
	}

	//now we actually spew the puzzle content

	readfile($puzzlefile);
	if ($teamposition == $pid){
?>
	<hr>
	<form method="post" action="puzzle.php">
	ANSWER: <input type="text" size="24" name="attempt" />
	<input type="hidden" name="suit" value="<?php echo $suit; ?>" >
	<input type="hidden" name="pid" value="<?php echo $pid; ?>" >
	<input type="hidden" name="code" value="<?php echo $code; ?>">
	<input type="submit" name="checkAns" value="Submit Answer" />
	</form>

<?php	
	}
        if ($teamposition > $pid){
                printf("<br><br>You already solved this puzzle.<br>");
                printf("<br>ANSWER: %s", $answer);
                printf("<br>NEXT: %s<br><hr>", $reward);
        }
	
	$gsql = sprintf("SELECT time, attempt FROM %s_attempts WHERE teamid=%s AND pid=%s", $suit, $tid, $pid);
	$badanswers = mysql_query($gsql);
	if (mysql_num_rows($badanswers) > 0) {
		printf("<h2>Previous Incorrect Answers Submitted:</h2><br>");
	}
	while ($badanswer = mysql_fetch_array($badanswers)) {
		printf("time: %s submission: %s\n<br>", $badanswer['time'], $badanswer['attempt']);
	}
	foot();
	exit();

function emailTeamAtSeven($address, $nameofteam, $whatsuit)
{
	$headers = 'From: mitrunaround@aliceshrugged.com';
	$message = sprintf("Hello,\nTEAM %s is at stage 7 of MIT Runaround Suit %s\nMeet them at 26-100\nEOM", $nameofteam, $whatsuit);
	$subject = sprintf("MITRUNAROUND ALERT! TEAM %s is at stage 7 suit %s", $nameofteam, $whatsuit);
        mail($address, $subject, $message, $headers);
}
?>
	
