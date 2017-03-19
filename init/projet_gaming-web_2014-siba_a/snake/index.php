<?php session_start();
// var_dump($_SESSION);
// unset($_SESSION);
// var_dump($_SESSION);

 ?>

<html>
    <head>
        <title>SNAKE</title>
        <script type="text/javascript" src="js/Three.js"></script>
        <script type="text/javascript" src="js/jquery1.10.js"></script>
        <script type="text/javascript" src="js/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/snake.js"></script>

        <link href='http://fonts.googleapis.com/css?family=Russo+One' rel='stylesheet' type='text/css'>
        <link href='css/styles.css' rel='stylesheet' type='text/css'>
    </head>
<body>

    <div class="navbar navbar-default">
        <div class="navbar-header">
            <button data-target=".navbar-responsive-collapse" data-toggle="collapse" class="navbar-toggle" type="button">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="#" class="navbar-brand">Snake3D</a>
        </div>
        <div class="navbar-collapse collapse navbar-responsive-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">Home</a></li>
                <?php if( isset($_SESSION['user'] ) === true ) { ?>
                    <li><a id="ranking" data-toggle="modal" data-target="#rank"> Ranking</a></li>
                <?php } ?>
            </ul>

            <ul class="nav navbar-nav navbar-right account">
                <li class="dropdown">
                    <a data-toggle="dropdown" class="dropdown-toggle" href="#">Account <b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <?php if( isset($_SESSION['user'] ) === false ) { ?>
                            <li><a data-toggle="modal" data-target="#login">Log in</a></li>
                            <li><a data-toggle="modal" data-target="#signin">Sign in</a></li>
                        <?php } else { ?>
                            <li><a class="logout">Log out</a></li>
                        <?php } ?>
                    </ul>
                </li>
            </ul>
        </div><!-- /.nav-collapse -->
    </div>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-2 start">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title">Game</h3>
            </div>
            <div class="panel-body">
                <fieldset>
                    <legend>Options</legend>
                    <div class="form-group">
                        <label class="col-lg-6 control-label" for="select">Length map</label>
                        <div class="col-lg-6">
                            <select id="select" class="form-control" name="snake">
                                <option value="3" data-coins="0">3 -  0 coins</option>
                                <option value="5" data-coins="0">5 - 0 coins</option>
                                <option value="7" data-coins="300">7 - 300 coins</option>
                                <option value="9" data-coins="700">9 - 700 coins</option>
                                <option value="13" data-coins="1200">13 - 1200 coins</option>
                            </select>
                            <br>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-6 control-label" for="select">Speed snake</label>
                        <div class="col-lg-6">
                            <select id="select" class="form-control" name="speed">
                                <option value="30" data-coins="0" >30 - 0 coins</option>
                                <option value="20" data-coins="50" >20 - 50 coins</option>
                                <!-- <option value="70">70 - 70 coins</option>
                                <option value="90">90 - 90 coins</option>
                                <option value="100">100 - 100 coins</option> -->
                            </select>
                            <br>
                        </div>
                    </div>
                    <div class="form-group" style="float:right;">
                        <ul class="nav nav-pills">
                            <li class="active col-lg-12" style="float:none; margin-bottom:12px;">Coins <span class="badge coins">0</span></li>
                            <li class="col-lg-12"  style="float:right;"><span class="label label-danger mycoins" style="float:right;"><?php echo ( isset($_SESSION["user"]['coins']) === true )? $_SESSION["user"]['coins'] : 0; ?></span></li>

                        </ul>
                    </div>
                    <div class="form-group">
                        <div class="col-lg-10 col-lg-offset-2">
                            <button class="btn btn-primary play" type="submit" >Submit</button>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-2 game">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title">Game</h3>
            </div>
            <div class="panel-body">
                <div class="col-lg-12">
                    <div class="bs-example">
                        <ul class="list-group">
                            <li class="list-group-item">
                                <span class="badge score">0</span>
                                Score :
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-12 infoBonus">
                    <div class="alert alert-dismissable alert-danger">
                        <strong>Bonus :<span class="showBonus"></span></strong>.
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="bs-example col-lg-9 col-md-9 col-sm-9 col-xs-9 screenEndGame">
        <div class="jumbotron">
            <h1>GAME OVER</h1>
            <p>Score : </p>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="rank" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Ranking</h4>
                </div>
                <div class="bs-example table-responsive">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Scoring</th>
                  </tr>
                </thead>
                <tbody>
                 <tr>
                    <td>Anais</td>
                    <td>23456</td>
                 </tr>
                </tbody>
              </table>
            </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="signin" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Sign in</h4>
                </div>
                <form class="bs-example form-horizontal signin">
                    <input type="hidden" name="action" value="signin" >
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="col-lg-2 control-label" for="inputLogin">Login</label>
                            <div class="col-lg-10">
                                <input type="text" placeholder="Login" name="login" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-2 control-label" for="inputPassword">Password</label>
                            <div class="col-lg-10">
                                <input type="password" placeholder="Password" name="password" class="form-control">
                            </div>
                        </div>
                        <p class="text-danger"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button class="btn btn-primary" type="submit" >Sign in</button>
                    </div>
                </form>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <!-- Modal -->
    <div class="modal fade" id="login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Log in</h4>
                </div>
                <form class="bs-example form-horizontal login">
                    <input type="hidden" name="action" value="login" >
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="col-lg-2 control-label" for="inputLogin">Login</label>
                            <div class="col-lg-10">
                                <input type="text" placeholder="Login" name="login" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-2 control-label" for="inputPassword">Password</label>
                            <div class="col-lg-10">
                                <input type="password" placeholder="Password" name="password" class="form-control">
                            </div>
                        </div>
                        <p class="text-danger"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button class="btn btn-primary" type="submit" >Log in</button>
                    </div>
                </form>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <script type="text/javascript">
    $(document).ready(function(){

        $('#ranking').click(function(){

            $.ajax({
                url: "php/user.php",
                type: "POST",
                data:{ action:"ranking" },
                dataType:'json',
                success:function(res){

                    html="";
                    login = '<?php echo ( isset($_SESSION["user"]["login"]) === true ) ? $_SESSION["user"]["login"] : "" ; ?>';
                    for ( i in res ){
                        if ( login == res[i].login )
                            html+="<tr class='danger'><td>"+res[i].login+"</td><td>"+res[i].score+"</td>";
                        else
                            html+="<tr><td>"+res[i].login+"</td><td>"+res[i].score+"</td>";
                    }
                    console.log(html);
                    $("#rank table tbody").html(html);
                    // window.location.reload();
                }
            });
        });

        $("form.signin").submit(function(e){
            e.preventDefault();

            $.ajax({
                url: "php/user.php",
                type: "POST",
                data:$(this).serialize(),
                dataType:'json',
                success:function(res){
                    if ( res == "success" ){
                        $('#signin').modal('hide');
                        window.location.reload();
                    }
                    else
                        $('#login p.text-danger').html(res);
                }

            });
        });

        $("form.login").submit(function(e){
            e.preventDefault();

            $.ajax({
                url: "php/user.php",
                type: "POST",
                data:$(this).serialize(),
                dataType:'json',
                success:function(res){
                    if ( res == "success" ){
                        $('#login').modal('hide');
                        window.location.reload();
                    }
                    else
                        $('#login p.text-danger').html(res);
                }

            });
        });

        $('a.logout').click(function(){

            $.ajax({
                url: "php/user.php",
                type: "POST",
                data:{ action:"logout" },
                dataType:'json',
                success:function(res){
                    window.location.reload();
                }
            });
        });

        $("select[name='speed'], select[name='snake']").change(function(){

            if ( $(this).attr("name") == "snake" ){
                snake = $(this).children("option[value="+$(this).val()+"]").attr("data-coins");
                speed = $("select[name=speed]").children(":selected").attr("data-coins");
            }else{
                snake = $(this).children("option[value="+$(this).val()+"]").attr("data-coins");
                speed = $("select[name=snake]").children(":selected").attr("data-coins");
            }
            coins = <?php echo (isset($_SESSION['user']['coins']) === true )? $_SESSION['user']['coins']:0; ?>;
            val = parseInt(snake)+parseInt(speed);
            res = parseInt(coins)-parseInt(snake)-parseInt(speed);

            $("span.coins").html( val );
            $("span.mycoins").html( res );
        });
    });
    </script>
</body>
</html>
