/**
 * Lets us generate hamming code and check bit sequences for SEC and DED
 * param    string  parityMode              'even' or 'odd'
 * param    boolean doubleErrorDetection    perform DED?
 *  
 * return   object                          Hamming code object
 */
function hamming(parityMode, doubleErrorDetection) {
	function ParityBit(position, dataSize) {
		// this.parityMode = parityMode;
		this.responsibleFor = {};
		this.position = position;
		this.value = undefined;
		
		this.assign = function(responsibleFor) {
			this.responsibleFor = responsibleFor;
		};
		
		this.reCalc = function() {
			for (var key in this.responsibleFor) {
				if (this.responsibleFor.hasOwnProperty(key)) {
					// if it's in the set of 2^n, then we're looking at the value of a parity bit
					if (Math.log(key) / Math.log(2) % 1 === 0) {
						this.responsibleFor[key] = (this.responsibleFor[key] === null && this.isEven()) ? "0" : "1";

						// and finally assign the value of this ParityBit object
						if (key === this.position.toString()) {
							this.value = this.responsibleFor[key];
						}
					}
				}
			}
		};
		
		// iterate through each bit in responsibleFor and calculate whether the
		// bit holds an even or odd value
		this.isEven = function() {
			var count = 0;
			for (var key in this.responsibleFor) {
				if (this.responsibleFor.hasOwnProperty(key)) {
					count += (this.responsibleFor[key] !== null) ? parseInt(this.responsibleFor[key]) : 0;
				}
			}   
			return count % 2 === 0;
		};
		
		this.toString = function() {
			return this.value;
		};
	}
	
	return {
		parityMode: parityMode,
		doubleErrorDetection: doubleErrorDetection,
		check: function(sequence) {
			// ...
		},
		
		// generate Hamming code from some original string of data bits
		generate: function(input) {
			var r = 0;
			
			// calculate how many parity bits we need: m+r+1 <= 2^r
			while (!(input.length + r + 1 <= Math.pow(2, r))) {
				r++;
			}
			
			var dataSequence = {};
			var binaryArray = []; // used to create the 000, 001, 010, 011, ... table
			var arrayLength = input.length + r;
			var inputIndexPointer = 0;
			
			for (var i = 1; i <= arrayLength; i++) {
				// if it's a power of 2, push an empty location that will be filled later
				if ((Math.log(i) / Math.log(2)) % 1 === 0) {
					dataSequence[i] = new ParityBit(i);
				} else {
					dataSequence[i] = input.charAt(inputIndexPointer);
					inputIndexPointer++;
				}
				
				var binary = i.toString(2); // now generate the value for our binary table
				binary = "0000000000000000" + binary; // add leading zeros ...
				binary = binary.slice(-1 * (r)); // ... and cut the string back down to size
				binaryArray.push(binary);
			}
			
			// assign "responsibleFor" bits to all the parity bits, and then assign each
			// parity bit a value to match the even or odd mode. this is only the first pass
			for (var j = 0; j < r; j++) {
				// get position of parity bit
				var position = Math.pow(2, j);
				
				var responsibleFor = {};
				
				for (var k = 1; k <= arrayLength; k++) {
					if (binaryArray[k-1].charAt(r-1-j) === "1") {
						// assign key and value
						responsibleFor[k] = (dataSequence[k] instanceof ParityBit) ? null : dataSequence[k];
					}
				}
				
				dataSequence[position].assign(responsibleFor);
			}
			
			// do second pass to add in values for all the nulls
			for (var j = 0; j < r; j++) {
				// get parity bit
				var current = dataSequence[Math.pow(2, j)];
				current.reCalc();
			}
			
			var dataString = '';
			for (var key in dataSequence) {
				dataString += dataSequence[key].toString();
			}
			console.log(dataString);
		}
	}
}