# midilearn
Module for implementing MIDI Learn feature in the browser. Requires a browser that has the Web MIDI API enabled, chrome 47+ for example.


## How it works

Each slider or dial in the DOM can be controlled by an external MIDI device.

Each element that can be controlled from a MIDI device should be passed as the first argument to the ```midiLearn``` function. The second argument is a callback which is called everytime the MIDI controller is active for that element. This callback can be used to update the DOM, for example moving a slider and doing useful things with the MIDI data.

To trigger MIDI learn, click on the dial or slider that will be controlled by MIDI and simultaneously operate your MIDI device. The device name and the note will be saved in localStorage. The control pot or fader you just moved can now be used to control the selected dial or slider.

## Usage

```javascript
var highPassFilter = $('#hpf')[0];

midiLearn(highPassFilter, function( midiValue ) {
	
	// This callback is called everytime the learnt midi signal for this dom node is recieved

	// midiValue is the value send from the midi controller between 0 and 127
});
```