/*
	Both are equivalent statements below:
	1.
	const carCanvas = document.getElementById("carCanvas");
	2.
	const carCanvas = document.getElementsByTagName("CANVAS")[0];
*/
const carCanvas = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");
/*
	Both are equivalent statements below:
	1.
	carCanvas.height = window.innerHeight;
	carCanvas.width = 200;
	2.
	carCanvas.style.height = window.innerHeight + 'px';
	carCanvas.style.width = "200px";

	Also note that instead of putting carCanvas' height declaration here, if its inside the animate() function, the height would be reset every frame.
*/
//carCanvas.height = window.innerHeight;
carCanvas.width = 200;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2, carCanvas.width*.9);
/*
When player controls car with keys
const car = new Car(road.getLaneCenter(1),100,30,50,"KEYS");
*/
const N = 10;
const cars = generateCars(N);
/*
Never declare(or keep it in mind) that if a same variable is declared as let or const in global scope and you declare the same within some funciton and attempt it to save, only the global one will save(or something like that), but anyways the code won't work... Been debugging from 30 minutes with `bestCar`, declared in global as `let` and inside `animate()` as `const` and localStorage only retrieved or saved only one value of `bestBrain`.
*/
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
	for(i=0; i<cars.length; i++){
		/*
		OBJECTIVE: To pass the best brain from previous simulations of the cars stored in localStorage to all the instances in new simulation with a little variation.

		Solution 1:
		if(i!=0){
			cars[i].brain = cars[0].brain;
			NeuralNetwork.mutate(cars[i].brain, .2);
		}else{
			cars[i].brain = JSON.parse(
			localStorage.getItem("bestBrain")
			);
		}
			This does not work since when you are asigning `cars[i].brain = cars[0].brain`, it only takes a shallow copy of `cars[0].brain` and when you mutate that in the next step, it mutates the elements of `cars[0].brain`... this leads to all the cars being referenced to `cars[0].brain` and it being mutated `N-1` times.
			Hence, this approach should be avoided.

		Solution 2:
		ars[i].brain = JSON.parse(
			localStorage.getItem("bestBrain")
			);
		if(i!=0){
			NeuralNetwork.mutate(cars[i].brain, .05);
		}
		This works since this is copying the value of `bestCar.brain` of previous simulation to all the instances of the new simulation, and then we are mutating the individual instances of the new simulations' cars'.
		*/
		cars[i].brain = JSON.parse(
			localStorage.getItem("bestBrain")
			);
		/*
		Best brain till now for traffic,
		`const traffic = [
			new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",Math.random()#3),
			new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",Math.random()#3),
			new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",Math.random()#3),
			new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",Math.random()#3),
			new Car(road.getLaneCenter(1),-600,30,50,"DUMMY",Math.random()#3),
			new Car(road.getLaneCenter(0),-750,30,50,"DUMMY",Math.random()#3),
			new Car(road.getLaneCenter(1),-750,30,50,"DUMMY",Math.random()#3)
		];
		`sensor.rayCount=5` and `car.maxSpeed=3` is
		{
	    "bestBrain": "{\"levels\":[{\"inputs\":[0,0,0.4889140104879639,0.7784260156782027,0.8433246273657686],\"outputs\":[0,0,0,1,0,0],\"biases\":[-0.06292543482139996,0.3653943395864934,0.09607704997893511,-0.09752611669078064,0.04193972967640163,0.30031057365808156],\"weights\":[[-0.14888105652938827,-0.031852529254525114,-0.1715635448179587,0.2913794461029601,0.01192202318789567,-0.17948083131395554],[-0.1930925816472085,-0.0026807373101729723,0.16382861907962495,-0.1475876882040521,0.16763474957026742,0.07335779957742565],[-0.21725089151569488,0.06138992402088301,-0.02231583322288599,-0.11694803723914313,0.359148427421438,0.14249062395100243],[-0.07153310643364463,0.09778348873620865,-0.18155414926190352,0.19005789058451678,-0.021592204026403664,0.1362232289572662],[-0.04907139805770292,0.2349765922663618,-0.06234849727102319,0.15377997467581828,-0.20677457535479948,0.11881890693263576]]},{\"inputs\":[0,0,0,1,0,0],\"outputs\":[1,1,1,0],\"biases\":[-0.3039705864992925,-0.18689105716556717,0.010180330575512285,0.1242428732050023],\"weights\":[[0.005873934440355812,-0.13659623766995088,-0.10720779624799504,0.05870771392516417],[-0.350069749488623,0.0193781714471863,0.22409815699145083,-0.20262225358834798],[0.020299516988212325,-0.16241543499691458,0.09511435927220745,-0.09214250447852369],[-0.20227839671747422,0.01590945101323377,0.11023443637641883,-0.19404011216428904],[0.15137644195608815,-0.22163367340294368,0.05441872374999157,0.027589241723698227],[0.15331258533944048,0.13440217161476048,0.18980748725419713,-0.015966696006417595]]}]}"
		}
	*/
		if(i!=0){
			NeuralNetwork.mutate(cars[i].brain, .01);
		}
	}
}

const traffic = [
	new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",Math.random()*3),
	new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",Math.random()*3),
	new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",Math.random()*3),
	new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",Math.random()*3),
	new Car(road.getLaneCenter(1),-600,30,50,"DUMMY",Math.random()*3),
	new Car(road.getLaneCenter(0),-750,30,50,"DUMMY",Math.random()*3),
	new Car(road.getLaneCenter(1),-750,30,50,"DUMMY",Math.random()*3)
];

animate();

function generateCars(N){
	const cars = [];
	for(let i=0; i<N; i++){
		cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
	}

	return cars;
}

function save(){
	localStorage.setItem("bestBrain",
		JSON.stringify(bestCar.brain)
		);
}
function discard(){
	localStorage.removeItem("bestBrain");
}

function animate(time){
	for(let i=0; i<traffic.length; i++){
		traffic[i].update(road.borders, []);
	}

	for(let i=0; i<cars.length; i++){
		cars[i].update(road.borders, traffic);
	}
	/*
	THe bestCar here is determined by something called as "fitness function".
	Here, it takes into account the y value of the cars to determine a good brain, but for curved roads and other cases, this won't work.
	Try to brainstrom to get a nice fitness function.
	*/
	bestCar = cars.find(
		c => c.y==Math.min(
			...cars.map(c => c.y)
			));

	carCanvas.height = window.innerHeight;
	networkCanvas.height = window.innerHeight;
	/*
		If we change the height here, the previous drawing of the car is resetted and then we can again draw the car in its updated accurate position.
	*/

	carCtx.save();
	carCtx.translate(0, -bestCar.y+carCanvas.height*.8);

	road.draw(carCtx);

	for(let i=0; i<traffic.length; i++){
		traffic[i].draw(carCtx, "red");
	}

	carCtx.globalAlpha = .2;
	for(let i=0; i<cars.length; i++){
		cars[i].draw(carCtx, "blue");
	}
	carCtx.globalAlpha = 1;
	bestCar.draw(carCtx,"blue", true);

	carCtx.restore();

	networkCtx.lineDashOffset = -time/250;
	Visualiser.drawNetwork(networkCtx, bestCar.brain);
	/*
	The `requestAnimationFrame(animate)` automatically sends `time` parameter to the animate funciton to change animation frames.

	We use this same parameter before `Visualiser.drawNetwork(networkCtx, car.brain)` in 'networkCtx.lineDashOffset = time' to show feedForward visually.
	*/
	requestAnimationFrame(animate);
}