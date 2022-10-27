// Selectors
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');

// Funtions
function randomColor() {
    return chroma.random();
}

function checkContrast(color, text) {
    if (chroma(color).luminance() > 0.5) {
        text.style.color = '#000'
    }
    else {
        text.style.color = '#fff'
    };
}

function generateColors() {
    colorDivs.forEach((div) => {
        // Generate Random Color
        const color = randomColor();
        // Fill background color with random color
        div.style.backgroundColor = color;
        // Update hex in the title
        const divTitle = div.children[0];
        divTitle.innerText = color;
        // Update color of text according to luminance of color
        checkContrast(color, divTitle);
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

function hslControls(e) {
    const index =
        e.target.getAttribute('data-hue') ||
        e.target.getAttribute('data-bright') ||
        e.target.getAttribute('data-sat');

    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    let hue = sliders[0];
    let lum = sliders[1];
    let sat = sliders[2];

    let currentDivColorText = colorDivs[index].children[0];
    let color = chroma(currentDivColorText.innerText)
        .set('hsl.h', hue.value)
        .set('hsl.l', lum.value)
        .set('hsl.s', sat.value);
    colorDivs[index].style.backgroundColor = color;
    currentDivColorText.innerText = chroma(color).hex();
    checkContrast(currentDivColorText.innerText, currentDivColorText);
}

function handleColorEvents(e) {
    if (e.target.classList.contains('adjust')) {
        const currentSlider = e.target.parentElement.nextElementSibling;
        currentSlider.classList.add('active');
    }

    if (e.target.classList.contains('close-adjustments')) {
        e.target.parentElement.classList.remove('active');
    }
    // console.log(e.target);
}

// Event Listeners
generateBtn.addEventListener('click', generateColors);

sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);
});

colorDivs.forEach(div => {
    div.addEventListener('click', handleColorEvents)
});

generateColors();