var midiLearn = function(elem, onclickCallback) {
	var count = document.getElementsByClassName('js-midi-learn').length;
	elem.setAttribute('class', 'js-midi-learn');
	elem.setAttribute('midi-learn-id', 'midiLearn' + count);

	var input = document.createElement("input");
	input.type = "number";
	input.style.visibility='hidden';
	input.onclick = function(e) {
		var midiVal = e.currentTarget.val;
		if (onclickCallback) onclickCallback(midiVal);
	}

	elem.appendChild(input);
};

(function() {

	var MIDI_LEARN_ELEM = 0;

	var parseMIDIMessage = function(e) {
		var cmd = e.data[0] >> 4;
		var channel = e.data[0] & 0xf;
		var note = e.data[1];
		var velocity = 0;
		if (e.data.length > 2) {
			velocity = e.data[2];
		}
		return {
			note: note,
			velocity: velocity
		}
	}

	var learnControlSignal = function(note, deviceName) {
		if (MIDI_LEARN_ELEM) {
			
			var id = MIDI_LEARN_ELEM.getAttribute('midi-learn-id');
			var midiLearnData = {
				deviceName: deviceName,
				note: note
			}
			localStorage.setItem(id, JSON.stringify(midiLearnData));
		}
	};

	var sendControlSignal = function(note, velocity, deviceName) {

		var isMidiLearnt = function(note, deviceName, localStorageData) {
			return localStorageData.deviceName==deviceName && localStorageData.note==note
		}

		for (var key in localStorage) {
			
			var localStorageData = JSON.parse(localStorage[key]);
			
			// If the signal matches something we already learnt
			if ( isMidiLearnt(note, deviceName, localStorageData) ) {
				
				// update value of relevant input and trigger click and resulting callback
				var elem = document.querySelectorAll('[midi-learn-id=' + key + ']')[0];
				var children = elem.children;
				for (var i=0; i<children.length; i++) {
					var child = children[i];
					if (child.type=='number') {
						child.val = velocity;
						child.click();
					}
				}
			}
		}
	};

	var midiLearnInit = function(midi) {

		for (var input of midi.inputs.values()) {
			input.onmidimessage = function(e) {

				var midiData = parseMIDIMessage(e);
				var deviceName = e.currentTarget.name;
				var note = midiData.note;
				var velocity = midiData.velocity;

				learnControlSignal(note, deviceName);

				sendControlSignal(note, velocity, deviceName);
			};
		}
			
		var midiLearnElems = document.getElementsByClassName('js-midi-learn');

		for (var i=0; i<midiLearnElems.length; i++) {
			var elem = midiLearnElems[i];

			elem.onmousedown = function() {
				MIDI_LEARN_ELEM = this;
			}

			elem.onmouseup = function() {
				MIDI_LEARN_ELEM = 0;
			}
		}
	};

	if (navigator.requestMIDIAccess) {
		navigator.requestMIDIAccess().then(function(access) {
			midiLearnInit(access);
		}, function(err) {
			console.log("MIDI access has failed to load.");
		});	
	}
	else {
		console.error = console.error || function(){};
		console.error("MIDI ERROR: Please use a browser with Web MIDI API enabled, for example Chrome 47+");
	}
	
})();