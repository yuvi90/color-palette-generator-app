// Selectors
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');

// Funtions
function randomColor() {
    return chroma.random();
}

function generateColors () {
    colorDivs.forEach((div) => {
        // Generate Random Color
        const color = randomColor();
        // Fill background color with random color
        div.style.backgroundColor = color;
        // Update hex in the title
        const divTitle = div.children[0];
        divTitle.innerText = color;
        // Update color of text according to luminance of color
        if (chroma(color).luminance() > 0.5) {
            divTitle.style.color = '#000'
        } 
        else {
            divTitle.style.color = '#fff'
        };

        // Colorize Sliders
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const lum = sliders[1];
        const sat = sliders[2];
        colorizeSliders(color, hue, lum, sat);
    });
}

function colorizeSliders(color, hue, lum, sat) {

    // Hue Scale
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`

    // Brightness Scale
    const midBright = chroma(color).set('hsl.l', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);
    
    lum.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`

    // Saturation Scale
    const noSat = chroma(color).set('hsl.s', 0);
    const fullSat = chroma(color).set('hsl.s', 1);
    const scaleSet = chroma.scale([noSat, color, fullSat]);

    sat.style.backgroundImage = `linear-gradient(to right, ${scaleSet(0)}, ${scaleSet(1)})`

};

// Event Listeners
generateBtn.addEventListener('click', generateColors);

generateColors();