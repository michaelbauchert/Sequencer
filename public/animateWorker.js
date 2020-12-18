var currentLength, sequenceLength, loopDirection;

onmessage = function(e) { 
    if (e.data instanceof Object) {        
        if(e.data.hasOwnProperty('progress')) {         
            let newIndex = 0;
            const sequencerProgress = Math.floor(e.data.progress * currentLength);
            if(loopDirection ===  0){ //Loop Forward
                newIndex = sequencerProgress;						
            } else if(loopDirection ===  1){//Loop Backward
                newIndex = Math.abs(sequencerProgress - sequenceLength + 1);
            } else if(loopDirection === 2){//Loop Ping Pong
                newIndex = (sequencerProgress < sequenceLength) ? sequencerProgress : sequenceLength - 1 - (sequencerProgress % (sequenceLength - 1));        	
            }//endif
            postMessage(newIndex); 
         } else {     
            currentLength = e.data.currentLength;
            sequenceLength = e.data.sequenceLength;
            loopDirection = e.data.loopDirection;
         }//endif  
    }//endif     
}