<svelte:head>
    <link rel="stylesheet" type="text/css" href="./dialog-polyfill.css" />
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import dialogPolyfill from 'dialog-polyfill';
    export let open = false;
    let dialog;
    onMount(() => dialogPolyfill.registerDialog(dialog));
</script>

<dialog open={open} bind:this={dialog}>
    <button on:click={() => open = false}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path xmlns="http://www.w3.org/2000/svg" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    </button>	
    <div>
        <slot></slot>
    </div>    
</dialog>

<style>
    dialog {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(20px);
        color: var(--main);
        border: none;
        overflow-y: auto;
    }

    button {
        position: fixed;
        top: 0;
        right: 0;
        height: 50px;
        width: 50px;
        background: transparent;
        fill: var(--main);
        border: none;
        margin: 0;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 0;
        margin: 16px;
    }

    svg {
        height: 100%;
        width: 100%;
    }

    button:focus{
		border: 1px solid var(--main);
	}

	button:active{
		background: var(--main);
	}

	button:active svg {
		fill: var(--dark);
	}

    div {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }    
</style>