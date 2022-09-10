class Sensor{
	constructor(car){
		this.car = car;
		this.rayCount = 5;
		this.rayRange = 150;
		this.raySpread = Math.PI/2;

		this.rays = [];
		this.readings = [];
	}

	update(roadBorders, traffic){
		this.#castRays();
		this.readings = [];
		for(let i=0;i<this.rays.length;i++){
			this.readings.push(
				this.#getReading(
					this.rays[i],
					roadBorders,
					traffic
					)
			);
		}
	}

	#getReading(rays, roadBorders, traffic){
		let touches = [];

		for(let i=0; i<roadBorders.length; i++){
			const touch = getIntersection(
				rays[0],
				rays[1],
				roadBorders[i][0],
				roadBorders[i][1]
			);
			if(touch){
				touches.push(touch);
			}	
		}
		for(let i=0; i<traffic.length; i++){
			const poly = traffic[i].polygon;
			for(let j=0; j<poly.length; j++){
				const value = getIntersection(
					rays[0],
					rays[1],
					poly[j],
					poly[(j+1)%poly.length]
				);
				if(value){
					touches.push(value);
				}
			}
		}

		if(touches.length == 0){
			return null;
		}else{
			const offsets =  touches.map(e => e.offset);
			const minOffset = Math.min(...offsets);
			return touches.find( e => e.offset == minOffset);
		}
	}

	#castRays(){
		this.rays = [];
		//Why `i` is less than `rayCount`? Because `rayCount`` will divide the region between them by rayCount-1 regions.
		for(let i=0;i<this.rayCount;i++){
			/*
			If you want gyroscopic sensor...
			const rayAngle = lerp(
				this.raySpread/2,
				-this.raySpread/2,
				i/(this.rayCount-1)
			);
			
			For a sensors' angle to move with car, use this
			const rayAngle = lerp(
				this.raySpread/2,
				-this.raySpread/2,
				i/(this.rayCount-1)
			)-this.car.angle;
			*/
			const rayAngle = lerp(
				this.raySpread/2,
				-this.raySpread/2,
				/*
				If rayCount=1, then rayCount-1=0 and i/(this.rayCount-1) evaluates to i/0; where i can be easily determined as 0 sunce for loop only allows this value only.
				*/
				this.rayCount==1?.5:i/(this.rayCount-1)
			)-this.car.angle;

			const start = {x:this.car.x, y:this.car.y};
			const end = {
				x:this.car.x-Math.sin(rayAngle)*this.rayRange,
				y:this.car.y-Math.cos(rayAngle)*this.rayRange
			};
			this.rays.push([start,end]);
		}
	}

	draw(ctx){
		for(let i=0;i<this.rayCount;i++){
			let end = this.rays[i][1];
			if(this.readings[i]){
				end = this.readings[i];
			}
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "yellow";
			ctx.moveTo(
				this.rays[i][0].x,
				this.rays[i][0].y
				);
			ctx.lineTo(
				this.rays[i][1].x,
				this.rays[i][1].y
				);
			ctx.stroke();

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "black";
			ctx.moveTo(
				this.rays[i][1].x,
				this.rays[i][1].y
				);
			ctx.lineTo(
				end.x,
				end.y
				);
			ctx.stroke();
		}
	}
}