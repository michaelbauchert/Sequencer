<script>
	export let shortname = 'Parameter';
	export let longname = '';	

	export let min = 0;
	$: if((typeof min) == "string") {
		min = parseFloat(min);
		mid = getMid();
	}

	export let max = 100;
	$: if((typeof max) == "string") {
		max = parseFloat(max);
		mid = getMid();
	}

	export let step = 1;
	$: if((typeof step) == "string") {
		step = parseFloat(step);
		mid = getMid();
	}

	export let unit = "%";

	export let mid = getMid(); 
	$: if((typeof mid) == "string") {
		mid = parseFloat(mid);
		value = mid;		
	}
	$: if(mid > max || mid < min) {
		mid = setInRangeAndRoundToStep(mid);
	}
	$:exponent = Math.log10((mid - min) / (max - min))/Math.log10(0.5);	

	export let defaultvalue;
	$: if((typeof defaultvalue) == "string") {
		defaultvalue = parseFloat(defaultvalue);
		value = defaultvalue;
	}
	$: if(defaultvalue > max || defaultvalue < min) {
		defaultvalue = setInRangeAndRoundToStep(defaultvalue);
	}

	export let value = mid;
	$: if((typeof value) == "string") {
		value = parseFloat(defaultvalue);
		defaultvalue = value;
	}	
	$: if(value > max || value < min) {
		value = setInRangeAndRoundToStep(value);
	}
	$:normalvalue = valueToNormal(value);

	let decimalPlaces;
	$: if(Math.floor(step) === step) {
		decimalPlaces = 0;
	} else {
		decimalPlaces = step.toString().split(".")[1].length || 0;
	}

	//variables to reference knob and numberInput elements
	let knob;

	function getMid() {
		return Math.round((max - min) / 2 / step) * step + min;	
	}

	function setInRangeAndRoundToStep(value) {
		return Math.round(Math.max(Math.min(max, value), min) / step) * step;
	}

	function valueToNormal(value) {
		return Math.pow((value - min) / (max - min), 1/exponent);
	}//end convert value to normal range

	function normalToValue(normal) {
		const newValue = Math.pow(normal, exponent) * (max - min) + min;
		return Math.round(newValue / step) * step;
	}//end convert normal range to value

	export function setNormal(newNormal) {
		const newValue = normalToValue(newNormal);
		if (value !== newValue)
			value = parseFloat(normalToValue(newValue).toFixed(decimalPlaces));
	}//end set normal

	function beginKnobTurn(e) {
		knob.onpointermove = handleDrag;
		knob.setPointerCapture(e.pointerId);
	}//end begin knob turn

	function endKnobTurn(e) {
		knobDelta = 0;
		knob.onpointermove = null;
  	knob.releasePointerCapture(e.pointerId);
	}//end knob turn

	const height = screen.height;
	let knobDelta = 0;
	function handleDrag(e) {
		const dragAmount = e.movementY;
		if(e.shiftKey) {
			knobDelta -= dragAmount/(height * 2);
		} else {
			knobDelta -= dragAmount/height;
		}//end check shift key

		const newNormal = normalvalue + knobDelta;
		const newValue = normalToValue(newNormal);
		if (newValue !== value) {			
			if(newNormal >= 1) {
				value = max;
			} else if (newNormal <= 0) {
				value = min;
			} else {
				value = parseFloat(newValue.toFixed(decimalPlaces));
			}//end setting normalValue
			knobDelta = 0;
		}
	}//end handleDrag

	function setToDefault() {
		value = defaultvalue;
	}//end set to default

	function handleKeyDown(e) {
		if (e.key === "Delete") {
			setToDefault();
		} else if (value != max && e.key === "ArrowUp" || e.key === "ArrowRight") {
			value += step;
		} else if (value != min && e.key === "ArrowDown" || e.key === "ArrowLeft") {
			value -= step;
		} else {
			numericInput(e);
		}
	}//end handle key down

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	$:dispatchInputEvent(normalvalue);
	function dispatchInputEvent(normalvalue) {
		dispatch('input', {
				shortname: shortname,
				longname: longname,
				value: value,
				normalvalue: normalvalue,
				min: min,
				max: max,
				mid: mid,
				unit: unit,
				exponent: exponent,
			});
	}//end dispatch input event

	//Number Input JS
	let numInput;
	let unfocused = true;

	export function numericInput(e) {
		if (isFinite(e.key) || e.key === '-') {
			numInput.focus();
			unfocused = false;
		}//end check if key press is number
	}//end numeric input

	function handleClick() {
		unfocused = false;
		numInput.value = value;
		numInput.select();
	}//end handleClick

	function submitInput (e) {
		if (e.keyCode === 13) { //check if enter key is pressed
			value = setInRangeAndRoundToStep(numInput.value);
			knob.focus();
		}
	}//end submitInput

	function handleBlur() {
		numInput.value = null;
		unfocused = true;
	}//end handle blur
</script>


<div class="knob">
	<div class="knob-label">{shortname}</div>

	<div class="knob-wrapper"
				style="--knob-rotation:{normalvalue * 300 - 150}deg;
							--normal:{normalvalue};
							--normal-rotation:{Math.abs(normalvalue * 2 - 1)};"
				
				bind:this={knob}
				tabindex="0"
				draggable="false"

				role="slider"
				aria-label={longname ?? shortname}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-valuetext={value + " " + unit}

				on:pointerdown={beginKnobTurn}
				on:pointerup={endKnobTurn}
				on:dblclick={setToDefault}
				on:keydown={handleKeyDown}>
		<slot>
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<g>
					<circle cx="50" cy="50" r="50"/>
					<rect style="width: var(--indicator-width); 
						height:var(--indicator-height); 
						x: calc(50% - var(--indicator-width) / 2);"/>
				</g>					
			</svg>
		</slot>
	</div>

	<div class="knob-number-input">
		<span on:click={handleClick}
				role="presentation"
				class:unfocused>{value.toFixed(decimalPlaces) + " " + unit}</span>

		<input type="number"
						bind:this={numInput}
						min={min}
						max={max}
						tabindex="-1"
						on:keyup={submitInput}
						class:unfocused
						on:blur={handleBlur}>
	</div>
</div>


<style>
	.knob {
		--grid-gap: 0.3rem;

		--knob-diameter: calc(100% - var(--grid-gap) * 2);
		--knob-fill: var(--main);
		--knob-fill-focus: var(--main);
		--knob-border: none;

		--indicator-width: 8%;
		--indicator-height: 40%;
		--indicator-fill: var(--dark);
		--indicator-border: none;
		--indicator-border-radius: 0;
		--indicator-margin-top: -1px;

		--label-font-size: 0px;
		--value-font-size: 30px;
		--font-color: var(--main);
		
		width: 40vmin;
		height: 40vmin;
		display: inline-grid;
		grid-gap: var(--grid-gap);
		grid-template-rows: min-content minmax(0, 1fr) var(--value-font-size);
		grid-template-areas: 
		'label'
		'knob'
		'number';
	}

	.knob-number-input,
	.knob-wrapper,
	.knob-label {
		justify-self:center;
	}

	.knob.text-right {
		grid-template-areas: 
		'knob label'
		'knob number';
	}

	input {
		text-align: center;
	}

	.knob.text-right .knob-number-input,
	.knob.text-right .knob-label,
	.knob.text-left .knob-number-input,
	.knob.text-left .knob-label{
		justify-self: start;
	}

	.knob.text-right .knob-number-input,
	.knob.text-left .knob-number-input{
		align-self: start;
	}

	.knob.text-right input,
	.knob .text-left input{
		text-align: left;
	}

	.knob.text-right .knob-label,
	.knob.text-left .knob-label{
		align-self: end;
	}

	.knob.text-left {
		grid-template-areas: 
		'label knob'
		'number knob';
	}

	.knob.text-top {
		justify-content: center;
		grid-template-areas: 
		'label'
		'number'
		'knob';
	}

	.knob.text-bottom {
		grid-template-areas: 
		'knob'
		'label'
		'number';
	}

	.knob-number-input {
		grid-area: number;
	}

	.knob-wrapper {
		overflow: hidden;
		display: flex;
		justify-content: center;
		width: 100%;
		grid-area: knob;
		background: transparent;
		touch-action: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-o-user-select: none;
		user-select: none;
	}

	.knob-wrapper:focus {
		outline: none;
		--knob-background: var(--knob-background-focus);
	}

	.knob-label {
		font-size: var(--label-font-size);
		grid-area: label;
		-webkit-user-select: none;  /* Safari all */
  		user-select: none;
	}

	/*Default Knob Styles */
	g {
		transform-origin: 50% 50%;
		transform: rotate(var(--knob-rotation));
	}
	svg {
		height: 100%;
		
		display: block;
	}

	circle {
		fill: var(--knob-fill);
	}

	rect {
		fill: var(--indicator-fill);
	}

	/*Number Input Styles*/
	span {
		-webkit-user-select: none;  /* Safari all */
		user-select: none;
		margin: 0;
	}

	input.unfocused {
		position: absolute;
		overflow: hidden;
		clip: rect(0 0 0 0);
		height: 1px;
		width: 1px;
		margin: -1px;
		border: 0;
	}

	input {
		font-size: var(--value-font-size);
		background: transparent;
		outline: 0;
		border: 0;
		padding: 0;
		width: 100%;
	}

	input:focus {
		margin: 0;
	}

	span.unfocused {
		display: inline-block;
	}

	span {
		text-align: center;
		font-size: var(--value-font-size);
		cursor: text;
		display: none;
		margin: 0;
		width: 100%;
	}

	input, span {
		color: var(--font-color);
	}
</style>
