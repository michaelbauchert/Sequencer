/*var activeIndex = 0;

onmessage = function(e) {
    const data = e.data;
    let newIndex = 0;
    const sequencerProgress = Math.floor(data.progress * data.currentLength);
    if(data.loopDirection ===  0){ //Loop Forward
        newIndex = sequencerProgress;						
    } else if(data.loopDirection ===  1){//Loop Backward
        newIndex = Math.abs(sequencerProgress - data.sequenceLength + 1);
    } else if(data.loopDirection === 2){//Loop Ping Pong
        newIndex = (sequencerProgress < data.sequenceLength) ? sequencerProgress : data.sequenceLength - 1 - (sequencerProgress % (data.sequenceLength - 1));        	
    }

    postMessage([activeIndex, newIndex]);
    activeIndex = newIndex
}*/

import insideWorker from 'offscreen-canvas/inside-worker'

const worker = insideWorker(e => {
  if (e.data.canvas) {
    // Draw on the canvas
  } else if (e.data.message === 'move') {
    // Messages from main thread
  }
})