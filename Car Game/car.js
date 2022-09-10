class Car{
	constructor(x, y, width, height,controlType,maxSpeed=3){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.speed = 0;
		this.acceleration = 0.2;
		this.maxSpeed = maxSpeed;
		this.friction = .05;
		this.angle = 0;
		this.damaged = false;

		this.useBrain = controlType == "AI";

		if(controlType!="DUMMY"){
			this.sensor = new Sensor(this);
			this.brain = new NeuralNetwork(
				[this.sensor.rayCount, 6, 4]
				);
		}
		this.controls = new Controls(controlType);
	}

	draw(ctx, color, drawSensor = false){
		/*
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);

		ctx.beginPath();
		ctx.rect(
			/ *
				Since we are translating already ctx with this.x and this.y, we remove the subtraction part from the below expression.
				this.x-this.width/2,
				this.y-this.height/2,
				this.width,
				this.height
			* /
			-this.width/2,
			-this.height/2,
			this.width,
			this.height
		);
		ctx.fill();

		ctx.restore();
		*/
		//After making #createPolygon function;
		if(this.damaged){
			ctx.fillStyle = "gray";
		}else{
			ctx.fillStyle = color;
		}

		ctx.beginPath();
		ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
		for(let i=1; i<this.polygon.length; i++){
			ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
		}
		ctx.fill();
		if(this.sensor && drawSensor){
			this.sensor.draw(ctx);
		}
	}

	update(roadBorders, traffic){
		if(!this.damaged){
			this.#move();
			//Never forget the ctx attribute of draw, took 45 minutes to debug :(
			this.polygon = this.#createPolygon();
			this.damaged = this.#assessDamaged(roadBorders, traffic);
		
			if(this.sensor){
				this.sensor.update(roadBorders, traffic);
				const offsets = this.sensor.readings.map(
					/*
					The below code is same as function(s){
					if(s==null){
					return 0;
					}else{
					return 1-s.offset;
					}});
					s => s==null?0:1-s.offset
					);
					*/
					s => s==null?0:1-s.offset
					);
				const outputs = NeuralNetwork.feedForward(offsets, this.brain);
				//console.log(outputs);

				if(this.useBrain){
					this.controls.forward = outputs[0];
					this.controls.left = outputs[1];
					this.controls.right = outputs[2];
					this.controls.backward = outputs[3];
				}
			}
		}
	}

	#assessDamaged(roadBorders, traffic){
		for(let i=0; i<roadBorders.length; i++){
			if(polysIntersect(this.polygon, roadBorders[i])){
				return true;
			}
		}
		for(let i=0; i<traffic.length; i++){
			if(polysIntersect(this.polygon, traffic[i].polygon)){
				return true;
			}
		}
		return false;
	}

	#createPolygon(){
		const points = [];
		const rad = Math.hypot(this.width, this.height)/2;
		const alpha = Math.atan2(this.width, this.height);
		points.push({
			x:this.x-Math.sin(-this.angle-alpha)*rad,
			y:this.y-Math.cos(-this.angle-alpha)*rad
		});
		points.push({
			x:this.x-Math.sin(-this.angle+alpha)*rad,
			y:this.y-Math.cos(-this.angle+alpha)*rad
		});
		points.push({
			x:this.x-Math.sin(-this.angle-alpha-Math.PI)*rad,
			y:this.y-Math.cos(-this.angle-alpha-Math.PI)*rad
		});
		points.push({
			x:this.x-Math.sin(-this.angle+alpha+Math.PI)*rad,
			y:this.y-Math.cos(-this.angle+alpha+Math.PI)*rad
		});
		return points;
	}

	#move(){
		if(this.controls.forward){
			//this.y-=2;
			this.speed+=this.acceleration;
		}
		if(this.controls.backward){
			//this.y+=2;
			this.speed-=this.acceleration;
		}
		if(this.speed>this.maxSpeed){
			this.speed = this.maxSpeed;
		}
		if(this.speed<-this.maxSpeed/2){
			this.speed = -this.maxSpeed/2;
		}
		if(this.speed>0){
			this.speed-=this.friction;
		}
		if(this.speed<0){
			this.speed+=this.friction;
		}
		if(Math.abs(this.speed)<this.friction){
			this.speed = 0;
		}
		if(this.speed != 0){
			/* For backward movement, flip constant changes the sign of angle to simluate real life cars. */
			const flip = this.speed>0?1:-1;
			if(this.controls.left){
				this.angle-=.03*flip;
			}
			if(this.controls.right){
				this.angle+=.03*flip;
			}
		}

		this.y-=Math.cos(this.angle)*this.speed;
		this.x-=Math.sin(-this.angle)*this.speed;
	}
}