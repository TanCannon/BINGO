class NeuralNetwork{
	constructor(neuronCounts){
		this.levels = [];
		for(let i=0; i<neuronCounts.length-1;i++){
			this.levels.push(new Level(
				neuronCounts[i], neuronCounts[i+1]
				));
		}
	}

	static feedForward(givenInputs, network){
		let outputs = Level.feedForward(
			givenInputs, network.levels[0]
			);
		for(let i=1; i<network.levels.length; i++){
			outputs = Level.feedForward(
			outputs, network.levels[i]
			);
		}

	return outputs;
	}

	static mutate(network, amount=1){
		network.levels.forEach(level => {
			for(let i=0; i<level.biases.length; i++){
				level.biases[i] = lerp(
					level.biases[i],
					Math.random()*2-1,
					amount
					);
			}
			for(let i=0; i<level.weights.length; i++){
				for(let j=0; j<level.weights[i].length; j++){
					level.weights[i][j] = lerp(
						level.weights[i][j],
						Math.random()*2-1,
						amount
						);
				}
			}
		});
	}
}	

class Level{
	constructor(inputCount, outputCount){
		this.inputs = new Array(inputCount);
		this.outputs = new Array(outputCount);
		this.biases = new Array(outputCount);

		this.weights = [];
		for(let i=0; i<inputCount; i++){
			this.weights[i] = new Array(outputCount);
		}

		Level.#randomise(this);
	}

	/*
	Methods do not serialise, so we use static methods...
	*/
	static #randomise(level){
		/*
		We use `Math.random()` for defining weights(these connect with each node in one layer to all the nodes in other node) and biases(these help us decide which action to take based on some algorithm in output neuron/node related to previous layer nodes and weights relating that previous nodes to nodes in current layer or alternatively which neurom will fire in layman terms :p)...
	
		Further Reading:
		Note that the weights and biases are taking negative vaules too...
		Find out why negative values are required at all
		*/
		for(let i=0; i<level.inputs.length; i++){
			for(let j=0; j<level.outputs.length; j++){
				level.weights[i][j] = Math.random()*2-1;

			}
		}
		/*
		Never forget `array.length` in any for loop to loop for each elements with respect to array... Took 11 hours to debug.
		*/
		for(let i=0; i<level.biases.length; i++){
			level.biases[i] = Math.random()*2-1;
		}
	}

	static feedForward(givenInputs,level){
		/*
		Input NODE layer values
		*/
		for(let i=0; i<level.inputs.length; i++){
			level.inputs[i] = givenInputs[i];
		}
		/*
		Output NODE layer values algorithm

		1. First, we use our weights(generated using `Math.random()`), declare a sum with value concerning weights and input value(alternatively, previous layer's node value).
		2. If found out that the bias is less than this sum, the neuron is fired.
		3. Returns output, that on multiple layers form input value for other layers.

		Note: 
		1. Actual Machine learning does not output an integer ranging from -1 to 1 but is a fractional number between those. Only the last layer(or the output node of whole neural network) is not an integer for clear indication of result as simulated by a artificial intelligence.
		2. Also note that our algorithm is a basic one and only checks if sum is more than the bias of the node, while in reality, scientists use `sum+level.biases[i] > 0` to determine the same thing.

		Further reading:
		1. Hyperplane equation
			for single input, it forms a line that relates input(s:sensor) and output(y) values using weights(w) and biases(b) are related by line equation
				ws + b = 0
			for two inputs, by considering conventions, results in a 2D relationship of planes
				w0s0 + w1s1 + b = 0; 0 and 1 are subscript in the equation

			Visulizations(of nodes connection in different layer with weights) are less and less possible for higher number of input noodes but the math works out :)

			Note that bias is only one in case of one input in both cases, this is because biases define whether an output neuron will fire or not(with non-integer values as well), and since one output neuron can be connected with multiple input neurons using weights, only one bias suffice.

		2. Layers such that linerly separable and non-linearly separable; what are the differences and how they work?
		*/
		for(let i=0; i<level.outputs.length; i++){
			let sum = 0;
			for(let j=0; j<level.inputs.length; j++){
				sum+=level.inputs[j]*level.weights[j][i];
			}
			if(sum>level.biases[i]){
				level.outputs[i] = 1;
			}else{
				level.outputs[i] = 0;
			}
		}
		return level.outputs;
	}
}