<?php 
session_start();
$dbh = new PDO('mysql:host=localhost;dbname=snake', 'root', 'root');

switch ($_POST['action']){

	case "login":
		login($dbh , $_POST);
	break;
	case "signin":
		signin($dbh, $_POST);
	break;
	case "logout":
		logout();
	break;
	case "score":
		score($dbh, $_POST);
	break;
	case "buyGame":
		buyGame($dbh, $_POST);
	break;
	case "ranking":
		ranking($dbh);
	break;
}


function login($cnx, $user){
	$sql = $cnx->prepare("SELECT * FROM user WHERE login='".$user['login']."' AND password='".md5($user['password'])."'");
	$sql->execute();
	$res = $sql->rowCount();
	if ( $res > 0 ){
		$user = $sql->fetchAll();

		$_SESSION['user']['id']=$user[0]['id'];
		$_SESSION['user']['coins']=$user[0]['coins'];
		$_SESSION['user']['score']=$user[0]['score'];
		$_SESSION['user']['login']=$user[0]['login'];
		echo json_encode("success");
		// var_dump($user);

	}else{
		echo json_encode("Mauvais identifiants");
		return;
	}

}

function signin($cnx, $user){
	// var_dump($dbh);
	if ( empty($user['login']) === false && empty($user['password']) === false ){
		$sql = $cnx->prepare("SELECT * FROM user WHERE login='".$user['login']."'");
		$sql->execute();
		$res = $sql->rowCount();

		if ( $res == 0 ){

			$sql = $cnx->prepare("INSERT INTO user (login, password, coins, score) VALUE ('".$user['login']."', '".md5($user['password'])."', 1000, 0)");
			$sql->execute();
			$id = $cnx->lastInsertId();
			$_SESSION['user']['id']=$id;
			$_SESSION['user']['score']=0;
			$_SESSION['user']['coins']=1000;
			echo json_encode("success");
			return json_encode("success");

		}else{
			echo json_encode('Ce login est deja utilise.');
			return json_encode('Ce login est deja utilise.');
		}

	}else{
		echo json_encode('Veillez remplir les champs.');
		return json_encode('Veillez remplir les champs.');
	}
}

function logout(){
	unset($_SESSION['user']);
	echo json_encode(true);
}

function score($cnx, $user){

	if ( isset($_SESSION['user']) === true ){
		
		if ( $user['score'] == 0 )
			$user['score']=0;
		else	
			$user['coins']=( $user['score'] < 1000 )? 100 : ($user['score']/1000)*10;

		$user['coins']=ceil($_SESSION['user']['coins']+$user['coins']);

		if ( $user['score'] < $_SESSION['user']['score'] )
			$user['score'] = $_SESSION['user']['score'];

		$sql = $cnx->prepare("UPDATE user SET coins=".$user['coins'].", score=".$user['score']." WHERE id=".$_SESSION['user']['id']);
		$sql->execute();

		$_SESSION['user']['coins'] = $user['coins'];
		$_SESSION['user']['score'] = $user['score'];

		echo json_encode( $_SESSION );
	}else{
		echo json_encode(false);
	}
	
}

function buyGame($cnx, $user){

	if ( isset($_SESSION['user']) === true ){
		$user['coins']= intval($_SESSION['user']['coins'])-intval($user['coins']);

		$sql = $cnx->prepare("UPDATE user SET coins=".$user['coins']." WHERE id=".$_SESSION['user']['id']);
		$sql->execute();

		$_SESSION['user']['coins'] = $user['coins'];

		echo json_encode($_SESSION);
	}
	else{
		echo json_encode(false);
	}
	
}

function ranking($cnx){

	// echo json_encode("value");

	if ( isset($_SESSION['user']) === true ){

		$min = intval($_SESSION["user"]['score'])-5;
		$max = intval($_SESSION["user"]['score'])+5;

		$sql = $cnx->prepare("SELECT * FROM user WHERE score BETWEEN ".$min." AND ".$max);
		$sql->execute();
		$user = $sql->fetchAll();
		
		echo json_encode($user);
	}
	else{
		echo json_encode(false);
	}
	
}

?>