class Road{
	constructor(x, width, laneCount=3){
		this.x = x;
		this.width = width;
		this.laneCount = laneCount;

		this.left = x-width/2;
		this.right = x+width/2;

		const infinity = 0b1111111111111111;
		/* The `top` is taken negative since the y co-ordinate system of browser is opposite of mathematical convention. */  
		this.top = -infinity;
		this.bottom = infinity;

		/*
		We are making an array for borders because we can have many situations of borders which are not only end borders, but in the middlw too or some other situation.
		*/
		const topLeft = {x:this.left, y:this.top};
		const topRight = {x:this.right, y:this.top};
		const bottomLeft = {x:this.left, y:this.bottom};
		const bottomRight = {x:this.right, y:this.bottom};
		this.borders = [
			[topLeft, bottomLeft],
			[topRight, bottomRight]
		];
	}

	getLaneCenter(laneIndex){
		const laneWidth = this.width/this.laneCount;
		return this.left+laneWidth/2+
		Math.min(laneIndex, this.laneCount-1)*laneWidth; //laneIndex start from 0 to laneCount-1.
	}

	draw(ctx){
		ctx.lineWidth = 5;
		ctx.strokeStyle = "white";
	/* 
		Only for two corner lanes...
			ctx.beginPath();
			ctx.moveTo(this.left, this.top);
			ctx.lineTo(this.left, this.bottom);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(this.right, this.top);
			ctx.lineTo(this.right, this.bottom);
			ctx.stroke();
	*/

	// For total lanes in laneCount...
	/*
		After implementing borders...
			for(let i=0;i<=this.laneCount;i++){
				ctx.beginPath();
				const x = lerp(
					this.left, 
					this.right, 
					i/this.laneCount
					);
				if(i>0 && i<this.laneCount){
					ctx.setLineDash([20,20]);
				}
				else{
					ctx.setLineDash([]);
				}

				ctx.moveTo(x, this.top);
				ctx.lineTo(x, this.bottom);
				ctx.stroke();
			}
	*/	
		for(let i=1;i<=this.laneCount-1;i++){
			const x = lerp(
				this.left, 
				this.right, 
				i/this.laneCount
				);
			ctx.setLineDash([20,20]);
			ctx.beginPath();
			ctx.moveTo(x, this.top);
			ctx.lineTo(x, this.bottom);
			ctx.stroke();
		}
		ctx.setLineDash([]);
		this.borders.forEach( (border) =>{
			ctx.beginPath();
			ctx.moveTo(border[0].x, border[0].y);
			ctx.lineTo(border[1].x, border[1].y);
			ctx.stroke();
		});
	}
}