<?php

        require_once "config.php";
        require_once "db-func.php";
        require_once "utils.php";
        require_once "html.php";

        $username=($_SERVER['REMOTE_USER']);
        head();

	if ($username!="bigjimmy"){
		printf("You have been eaten by a grue.<br>\n");
		printf("PERMISSION DENIED");
		foot();
		exit();
	}

	printf("MIT Runaround Admin Functionality Interface<br>\n");

	if (isset($_POST['startteam'])) {
		$teamid = $_POST['teamid'];
		$sql = sprintf("UPDATE team SET clubs_at=1,spades_at=1,diamonds_at=1 WHERE id='%s'",$teamid);
		$setresult=mysql_query($sql);
		if (DEBUG==true) {
			printf("DEBUG: sql=%s<br>",$sql);
		}
		printf("You started team %s<br>", $_POST['teamname']);
	}

	$sql = sprintf("SELECT id,name FROM team WHERE clubs_at = 0 AND spades_at = 0 AND diamonds_at = 0"); 
	$result=mysql_query($sql);
	
	printf("<br>Give Team Access to MIT Runaround:</br>");
	while ($team = mysql_fetch_array($result)) {

?>
	
	<form method="post" action="admin.php">
	<?php echo $team['name']; ?>
	<input type="hidden" name="teamname" value="<?php echo $team['name']; ?>">
	<input type="hidden" name="teamid" value="<?php echo $team['id']; ?>">
	<input type="submit" name="startteam" value="START">
	</form>

<?php
	}	
	foot();
	exit();
?>
