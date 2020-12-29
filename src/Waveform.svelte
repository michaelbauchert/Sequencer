<script>
    export let buffer;
    let path;
    let width = 1000;
    let height = 100;

    $: if(buffer) {
        const array = buffer.toArray();
        let newPath = ``;
        
        let i;
        for(i = 0; i < width; i++) {
            const sampleIndex = Math.floor(array.length / width) * i;
            newPath = `${newPath} ${i},${(array[sampleIndex] * 50) + 50}`;
        }

        console.log(array)

        path = newPath;
    }
</script>

<button>
    <svg width={width} 
         height={height}
         viewBox="0 0 {width} {height}"
         preserveAspectRatio="none" >
        <polyline points={path}/>
    </svg>
</button>


<style>
    button {
        grid-area: sample;
        position: relative;
        border: 1px solid var(--main);
        background: transparent;
        border-radius: 0;
    }

    svg {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    polyline {
        stroke: var(--main);
    }
</style>

