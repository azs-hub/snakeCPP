$(document).ready(function(){

		$(".play").click(function(){

            $(".screenEndGame").css("display", "none");
            init($("select[name=snake]").val(), 50, $("select[name=speed]").val() );
		});

		$("input[name=speed],input[name=snake]").change(function(){

			alert();
            $(".coins").html($("select[name=snake]").val()+$("select[name=speed]").val());
            // init($("select[name=snake]").val(), 50, $("select[name=speed]").val() );
		});

		var renderer, scene, currentFace, currentKey;
		var sizeCube = sizeSnake = 0;
		var eatingFood = 0;
		var timingSnake = 30;
		var tmpTimingSnake = 30;
		var point = 0;
		var move = true;
		var cube, cube2, camera, directionalLightRed, directionalLightBlue, directionalLightYellow, directionalLightGreen, food, montimer;

		// details des mouvements et des actions possible du snake
		var MoveInstructions={};
		var array_snakes = new Array();
		var queue = new Array();

		MoveInstructions["Front"]=[];
	    MoveInstructions["Front"][37] = { x:-1 ,y:0, z:0, cameraRotation: "Left",  dimensionToCheck:"x", directionToCheck:-1};
	    MoveInstructions["Front"][38] = { x:0, y:1, z:0, cameraRotation: "Died", dimensionToCheck:"y", directionToCheck:1};
	    MoveInstructions["Front"][39] = { x:1, y:0, z:0, cameraRotation: "Right", dimensionToCheck:"x", directionToCheck:1};
	    MoveInstructions["Front"][40] = { x:0, y:-1, z:0, cameraRotation: "Died", dimensionToCheck:"y", directionToCheck:-1};

	    MoveInstructions["Left"]=[];
	    MoveInstructions["Left"][37] = { x:0, y:0, z:-1, cameraRotation: "Left", dimensionToCheck:"z", directionToCheck:-1};
	    MoveInstructions["Left"][38] = { x:0, y:1, z:0, cameraRotation: "Died", dimensionToCheck:"y", directionToCheck:1};
	    MoveInstructions["Left"][39] = { x:0, y:0, z:1, cameraRotation: "Right", dimensionToCheck:"z", directionToCheck:1};
	    MoveInstructions["Left"][40] = { x:0, y:-1, z:0, cameraRotation: "Died", dimensionToCheck:"y", directionToCheck:-1};

	    MoveInstructions["Back"]=[];
	    MoveInstructions["Back"][37] = { x:1 ,y:0, z:0, cameraRotation: "Left", dimensionToCheck:"x", directionToCheck:1};
	    MoveInstructions["Back"][38] = { x:0, y:1, z:0, cameraRotation: "Died", dimensionToCheck:"y", directionToCheck:1};
	    MoveInstructions["Back"][39] = { x:-1, y:0, z:0, cameraRotation: "Right", dimensionToCheck:"x", directionToCheck:-1};
	    MoveInstructions["Back"][40] = { x:0, y:-1, z:0, cameraRotation: "Died", dimensionToCheck:"y", directionToCheck:-1};

	    MoveInstructions["Right"]=[];
	    MoveInstructions["Right"][37] = { x:0, y:0, z:1, cameraRotation: "Left", dimensionToCheck:"z", directionToCheck:1};
	    MoveInstructions["Right"][38] = { x:0, y:1, z:0, cameraRotation: "Died", dimensionToCheck:"y", directionToCheck:1};
	    MoveInstructions["Right"][39] = { x:0, y:0, z:-1, cameraRotation: "Right", dimensionToCheck:"z", directionToCheck:-1};
	    MoveInstructions["Right"][40] = { x:0, y:-1, z:0, cameraRotation: "Died", dimensionToCheck:"y", directionToCheck:-1};

		function initScene(size_cube, size_snake){

			// le cube sera n fois plus grand que le snake.
			// init des tailles snae et cube
			sizeCube=( size_cube < size_snake ) ? size_cube*size_snake : size_cube/size_snake;
		    sizeSnake=size_snake;

		    if ( scene == undefined && renderer == undefined ){
		    	renderer = new THREE.WebGLRenderer();
			    renderer.setSize(window.innerWidth-50, window.innerHeight-50);
			    document.body.appendChild(renderer.domElement);
		      	scene = new THREE.Scene();
		    }

			camera = new THREE.PerspectiveCamera(75, (window.innerWidth-50) / (window.innerHeight-50), 1, 1000);

			camera.position.x = 0;
		    camera.position.y = 0;
		    camera.position.z = sizeCube*1.5;

			directionalLightYellow = new THREE.DirectionalLight(0xffff00);
		 	directionalLightYellow.position.set(500, 0, 0).normalize();

		 	directionalLightBlue = new THREE.DirectionalLight(0x0000ff);
		 	directionalLightBlue.position.set(-500, 0, 0).normalize();

		 	directionalLightRed = new THREE.DirectionalLight(0xff0000);
		 	directionalLightRed.position.set(0, 0, 500).normalize();

		 	directionalLightGreen = new THREE.DirectionalLight(0x00ff00);
		 	directionalLightGreen.position.set(0, 0, -500).normalize();

		    scene.add(directionalLightYellow);
		    scene.add(directionalLightRed);
		    scene.add(directionalLightBlue);
		    scene.add(directionalLightGreen);
		}

		function generateFoodGrid(){

			var gridFace={};
			gridFace["Front"]={};
			gridFace["Back"]={};
			gridFace["Right"]={};
			gridFace["Left"]={};

			for ( var i=-(sizeCube/2)+sizeSnake/2; i<= (sizeCube/2)-sizeSnake/2; i+=sizeSnake ){

				gridFace["Front"][i]={};
				gridFace["Back"][i]={};
				gridFace["Right"][i]={};
				gridFace["Left"][i]={};
				for ( var j=-(sizeCube/2)+sizeSnake/2; j<= (sizeCube/2)-sizeSnake/2; j+=sizeSnake ){

					gridFace["Front"][i][j]	= { food:false, x:i, y:j, z:sizeCube/2+sizeSnake/2, foodObject:null, bonus:false };
					gridFace["Back"][i][j]	= { food:false, x:i, y:j, z:-(sizeCube/2+sizeSnake/2), foodObject:null, bonus:false };
					gridFace["Right"][i][j]	= { food:false, x:sizeCube/2+sizeSnake/2, y:i, z:j, foodObject:null, bonus:false };
					gridFace["Left"][i][j] 	= { food:false, x:-(sizeCube/2+sizeSnake/2), y:i, z:j, foodObject:null, bonus:false };
				}			
			}
			return gridFace;
		}

		function createSpecialFood(){

			bonus=new Array("plus vite", "rien", "moins vite", "rien", "plus petit", "rien", "plus grand", "rien");

			test = Math.floor((Math.random()*10)+1)-1;

			return bonus[test];
		}

		function createFood(){

			var face=new Array("Front", "Back", "Right", "Left");

			var result, result2;
		    var randFace = face[Math.floor(Math.random() * face.length)];

		    var i=Math.floor(Math.random()*sizeCube/sizeSnake);
		    var j=0;
		    for (var prop in gridFace[randFace]){
		    	if ( i == j ){
		    		result = prop;
		    		break;
		    	}
		    	j++;
		    }

		    i=Math.floor(Math.random()*sizeCube/sizeSnake);
		    j=0;
		    for (var prop in gridFace[randFace][result]){
		    	if ( i == j ){
		    		result2 = prop;
		    		break;
		    	}
		    	j++;
		    }

		    bonus = createSpecialFood();
		    material = {specular: 'white', shininess:50, vertexColors: THREE.VertexColors};
		    if ( bonus != "rien" ){

		    	gridFace[randFace][result][result2].bonus = bonus;
		    	material = {wireframe:true, wireframeLinewidth:5, specular: 'white', shininess:100, vertexColors: THREE.VertexColors};
		    }
		    		
		    gridFace[randFace][result][result2].food = true;
		    gridFace[randFace][result][result2].foodObject = new THREE.Mesh( new THREE.CubeGeometry(sizeSnake, sizeSnake, sizeSnake), new THREE.MeshLambertMaterial(material) ) ;
		    
		    gridFace[randFace][result][result2].foodObject.position.x=gridFace[randFace][result][result2].x;
		    gridFace[randFace][result][result2].foodObject.position.y=gridFace[randFace][result][result2].y;
		    gridFace[randFace][result][result2].foodObject.position.z=gridFace[randFace][result][result2].z;

		    scene.add( gridFace[randFace][result][result2].foodObject );
		}

		function initCubeAndSnake(size_cube, size_snake){

			// le cube sera n fois plus grand que le snake.
			// init des tailles snae et cube
			sizeCube=( size_cube < size_snake ) ? size_cube*size_snake : size_cube/size_snake;
		    sizeSnake=size_snake;
		    
		    objectCube = new THREE.CubeGeometry(sizeCube, sizeCube, sizeCube);
			cube = new THREE.Mesh( objectCube, new THREE.MeshPhongMaterial({
		        specular:'white',
		        shininess:100,
		        transparent:true,
		        opacity:0.5,
		        vertexColors: THREE.VertexColors
		      }) );
			cube2 = new THREE.Mesh( new THREE.CubeGeometry(sizeCube, sizeCube, sizeCube), new THREE.MeshPhongMaterial({
		        color:'white',
		        wireframe:true,
		        wireframeLinewidth:2,
		        emissive:'white'
		      }) );
		    
		    // création d'un tableau pour le corp du snake
			for ( i=0; i<=1; i++ ){
				array_snakes.push(new THREE.Mesh( new THREE.CubeGeometry(size_snake, size_snake, size_snake), new THREE.MeshPhongMaterial({ specular: 'white', shininess:100, vertexColors: THREE.VertexColors  }) )	);
			}
			
		 	var val_x = 0;
		 	for ( i in array_snakes ){

		 		scene.add(array_snakes[i]);

		 		array_snakes[i].position.z = sizeCube/2+size_snake/2;
			    array_snakes[i].position.y = 0;
			    array_snakes[i].position.x = val_x;
			    val_x +=size_snake;
		 	}
		 	
		 	scene.add(cube2);
		 	scene.add(cube);
		}

		function destroyGame(){

			$(".screenEndGame h2").html("SCORE : "+point);
			$(".screenEndGame").css("display", "block");
			game = false;
		    sec = 0;
		    point = 0;
		    timingSnake = 30;
		    eatingFood = 0;

			scene.remove( cube );
			scene.remove( cube2 );
  			scene.remove( camera );
  			scene.remove( directionalLightRed );
  			scene.remove( directionalLightYellow );
  			scene.remove( directionalLightBlue );
  			scene.remove( directionalLightGreen )
  			window.clearInterval(montimer);

  			for ( i in array_snakes )
  				scene.remove( array_snakes[i] );

  			array_snakes=[];

  			for ( face in gridFace )
  				for ( zoneA in gridFace[face] )
  					for ( zoneB in gridFace[face][zoneA] )
  						if( gridFace[face][zoneA][zoneB] != 'null' ){
  							scene.remove( gridFace[face][zoneA][zoneB].foodObject );
  							gridFace[face][zoneA][zoneB].food = false;
							gridFace[face][zoneA][zoneB].foodObject = null;
  						}

  			$(".start").css("display", "block");
		    $(".game").css("display", "none");

		}

		function checkBonusType( food ){

			$(".showBonus").html("Bonus : "+food);
			setTimeout(function(){ $(".showBonus").html(""); }, 5000);

			switch (food){

				case "plus vite":
					timingSnake+=15;
					setTimeout(function(){ timingSnake=tmpTimingSnake; },10000);
					point+=4;
				break;
				case "moins vite":
					timingSnake-=10;
					setTimeout(function(){ timingSnake=tmpTimingSnake; },10000);
					point+=2;
				break;
				case "plus petit":

						if ( array_snakes.length > 4 ){
  							scene.remove( array_snakes[ array_snakes.length-1 ] );
  							array_snakes.splice( array_snakes.length-1, 1 );

  							scene.remove( array_snakes[ array_snakes.length-1 ] );
  							array_snakes.splice( array_snakes.length-1, 1 );

  							scene.remove( array_snakes[ array_snakes.length-1 ] );
  							array_snakes.splice( array_snakes.length-1, 1 );

  							scene.remove( array_snakes[ array_snakes.length-1 ] );
  							array_snakes.splice( array_snakes.length-1, 1 );

  							point+=2;
						}
				break;
				case "plus grand":

						array_snakes.push(new THREE.Mesh( new THREE.CubeGeometry(sizeSnake, sizeSnake, sizeSnake), new THREE.MeshLambertMaterial({ specular: 'white', shininess:100, vertexColors: THREE.VertexColors  }) )	);
						array_snakes.push(new THREE.Mesh( new THREE.CubeGeometry(sizeSnake, sizeSnake, sizeSnake), new THREE.MeshLambertMaterial({ specular: 'white', shininess:100, vertexColors: THREE.VertexColors  }) )	);
						array_snakes.push(new THREE.Mesh( new THREE.CubeGeometry(sizeSnake, sizeSnake, sizeSnake), new THREE.MeshLambertMaterial({ specular: 'white', shininess:100, vertexColors: THREE.VertexColors  }) )	);

						scene.add(array_snakes[array_snakes.length-1]);
						scene.add(array_snakes[array_snakes.length-2]);
						scene.add(array_snakes[array_snakes.length-3]);

						point+=6;
				break;

			}
		}

		function eat(food){

			point+=1;
			if ( food.bonus != false && food.bonus != undefined )
				checkBonusType( food.bonus );

			if ( point <= 0 )
				$("p span").html(0);
			else
				$("p span").html(point);
			
			food.food = false;
			scene.remove(food.foodObject);
			food.foodObject = null;
			eatingFood+=1;

			var i = array_snakes.length-1;
			var x = array_snakes[i].position.x;
			var y = array_snakes[i].position.y;
			var z = array_snakes[i].position.z;

			array_snakes.push(new THREE.Mesh( new THREE.CubeGeometry(sizeSnake, sizeSnake, sizeSnake), new THREE.MeshLambertMaterial({ specular: 'white', shininess:100, vertexColors: THREE.VertexColors  }) ) );

			scene.add(array_snakes[i+1]);
			array_snakes[i+1].position.z = z;
		    array_snakes[i+1].position.y = y;
		    array_snakes[i+1].position.x = x;

		    if ( eatingFood < 5 ){
		    	createFood(sizeSnake);

		    }else if ( eatingFood == 5 ){
		    	
		    	createFood(sizeSnake);
		    	montimer=window.setInterval(createFood,8000);
		    	tmpTimingSnake=timingSnake+20;
		    	timingSnake+=20;
		    
		    }else if ( eatingFood == 10 ){

		    	window.clearInterval(montimer);
		    	montimer=setInterval(createFood,6000);
		    	tmpTimingSnake=timingSnake+10;
		    	timingSnake+=10;
		    }
		}

		var gridFace;
		function init(size_cube, size_snake, timing){

			initScene( size_cube, size_snake );
			initCubeAndSnake( size_cube, size_snake );
			gridFace=generateFoodGrid();
			createFood();

			currentFace = "Front";
		    currentKey = 37;

		    $(".start").css("display", "none");
		    $(".game").css("display", "block");
		    // $("p span").html(point);

		    timingSnake = timing;

		    game = true;

		    animate();
		}

		var odd=true;
		var sec = 0;
		var tmpKeyCode=true;
		function animate(){
	      	
	      	if ( game == false )
	      		return true;

	      	// gestion des mouvements de la video
	      	if ( queue.length > 0 && odd == true ){

	      		if ( queue.length-1 == 1 )
	      			move = true;
	      		var ex = queue.shift();
	        	ex();
	      	}

	      	// gestion du mouvement du snake
	      	sec++;
	      	if ( sec == timingSnake && move == true ){

	      		var multiplicateur = MoveInstructions[currentFace][currentKey].directionToCheck;
	      		var dimension = array_snakes[0].position[MoveInstructions[currentFace][currentKey].dimensionToCheck];
				var limit= (Math.floor((sizeCube/sizeSnake)/2)*sizeSnake)+sizeSnake;

	      		if (  ( multiplicateur == -1 && dimension-sizeSnake >= -1*limit ) ||  
	      			(  multiplicateur == 1 && dimension+sizeSnake <= limit ) ){

	      			tmpKeyCode = true;
	      			snk = array_snakes[ array_snakes.length-1 ];

	      			snk.position.x=array_snakes[0].position.x+sizeSnake*MoveInstructions[currentFace][currentKey].x;
	      			snk.position.y=array_snakes[0].position.y+sizeSnake*MoveInstructions[currentFace][currentKey].y;
	      			snk.position.z=array_snakes[0].position.z+sizeSnake*MoveInstructions[currentFace][currentKey].z;

	      			array_snakes.unshift( array_snakes.pop() );

	      			if (  ( multiplicateur == -1 && dimension-sizeSnake > -1*limit ) ||  
	      			(  multiplicateur == 1 && dimension+sizeSnake < limit ) ){
	      				
	      				tmpKeyCode = false;
	      				for ( snake in array_snakes ){

	      					if ( array_snakes[0].position.x == array_snakes[snake].position.x && array_snakes[0].position.y == array_snakes[snake].position.y && array_snakes[0].position.z == array_snakes[snake].position.z && snake != 0 )
	      							destroyGame();
	      				}
		      			if ( ( currentFace == "Front" || currentFace == "Back" ) && ( array_snakes[0].position.x > -(sizeCube/2+sizeSnake/2) && array_snakes[0].position.x < sizeCube/2+sizeSnake/2 ) ){

		      				if ( gridFace[currentFace][array_snakes[0].position.x][array_snakes[0].position.y].foodObject != null ){

		      					eat( gridFace[currentFace][array_snakes[0].position.x][array_snakes[0].position.y] );
		      				}

		      			}else if ( ( currentFace == "Right" || currentFace == "Left" ) && ( array_snakes[0].position.z > -(sizeCube/2+sizeSnake/2) && array_snakes[0].position.z < sizeCube/2+sizeSnake/2 ) ){

		      				if ( gridFace[currentFace][array_snakes[0].position.y][array_snakes[0].position.z].foodObject != null ){

		      					eat( gridFace[currentFace][array_snakes[0].position.y][array_snakes[0].position.z] );
		      				}

		      			}
	      			}

		      	} else {

		      		if ( MoveInstructions[currentFace][currentKey].cameraRotation == "Died" ){

		      			destroyGame();

		      		}else{

		      			GenerateCubeFaceView(camera, MoveInstructions[currentFace][currentKey].cameraRotation, 0.5);
		      			move = false;
		      		}
		      	}
		      	sec = 0;
	      	}else if ( sec > timingSnake ){
	      		sec = 0;
	      	}

	      	odd = ( odd === true ) ? false : true;
	        // render
	        renderer.render(scene, camera);

	        requestAnimationFrame(function(){
	            animate();
	        });
	    }

	    function GenerateCubeFaceView( camera, cameraRotation, animationSpeed ){

	      	var step = animationSpeed*30;
	      	var angle = (90*Math.PI/180)/step;
	      	var angleY = angleX = 0;

	      	var getNextFace={};
	      	getNextFace["Front"] = {Left:"Left", Top:"Top", Right:"Right", Bottom:"Bottom"};
	      	getNextFace["Right"] = {Left:"Front", Top:"Top", Right:"Back", Bottom:"Bottom"};
	      	getNextFace["Back"] = {Left:"Right", Top:"Top", Right:"Left", Bottom:"Bottom"};
	      	getNextFace["Left"] = {Left:"Back", Top:"Top", Right:"Front", Bottom:"Bottom"};
	      	getNextFace["Top"] = {Left:"Left", Top:"Back", Right:"Right", Bottom:"Front"};
	      	getNextFace["Bottom"] = {Left:"Right", Top:"Back", Right:"Left", Bottom:"Front"};

	      	currentFace = getNextFace[currentFace][cameraRotation];

	      	switch (cameraRotation){

				case "Left":
					angleX = -angle;
				break;
				case "Right":
					angleX = angle;
				break;
			}

			for ( i=0; i<step; i++ ){
				queue.push( (generateStep( camera, angleY, angleX, sizeCube*1.5 ) ) );
			}

	    }

	    function generateStep( camera, angleX, angleY, distanceCenter ){

	      	return function(){

		      	camera.position.x = 0;
		      	camera.position.y = 0;
		      	camera.position.z = 0;

		      	if ( (camera.rotation.x+angleX) > Math.PI*2 ){

		      		camera.rotation.x = 0;
		      	}else{

		      		camera.rotateX(angleX);
		      	}
		      		
		      	
		      	if ( (camera.rotation.y+angleY) > Math.PI*2 ){

		      		camera.rotation.y = 0;
		      	}else{

		      		camera.rotateY(angleY);
		      	}
		      	camera.translateZ( distanceCenter );
	      	}
	    }

	    // tableau des directions du snake
	    // et des restrictions de mouvement
	    var claviercode = { 39:37, 40:38, 37:39, 38:40 };

	    $(document).keydown(function(e){
	    	if ( tmpKeyCode == false ){

	    		for ( i in claviercode ){

	    			if ( claviercode[i] == e.keyCode && currentKey != i )
	    				return currentKey = e.keyCode;
	    		}
	    	}
	    });
	});