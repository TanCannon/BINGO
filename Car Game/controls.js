class Controls{
	constructor(type){
		this.forward = false;
		this.left = false;
		this.right = false;
		this.backward = false;

		switch(type){
			case "KEYS": this.#addKeyboardListeners(); break;
			case "DUMMY": this.forward=true; break;
		}
	}
	#addKeyboardListeners(){
		/*
			Why are we using arrow function instead of normal functions for event listener here?
			In arrow function, `this.{left/right/forward/backward}`, the `this` refers to the class's constructor on which it is defined,
			whereas in normal function, `this.{left/right/forward/backward}`, the `this` refers to the function itself.
		*/

		document.onkeydown = (event) => {
			switch(event.key){
				case "ArrowLeft": this.left = true; break;
				case "ArrowRight": this.right = true; break;
				case "ArrowUp": this.forward = true; break;
				case "ArrowDown": this.backward = true; break;
			}
			//console.table(this);
		}
		document.onkeyup = (event) => {
			switch(event.key){
				case "ArrowLeft": this.left = false; break;
				case "ArrowRight": this.right = false; break;
				case "ArrowUp": this.forward = false; break;
				case "ArrowDown": this.backward = false; break;
			}
			console.table(this);
		}
	}
}