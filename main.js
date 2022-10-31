//------------------------------------------------------------------Selectors

const colorDivs = document.querySelectorAll('.color');
const sliders = document.querySelectorAll('input[type="range"]');
const generateBtn = document.querySelector('.generate');
const popup = document.querySelector('.copy-container');
let initialColors = [];
let savedPalettes = []; // for local storage

//------------------------------------------------------------------Event Listeners

generateBtn.addEventListener('click', () => {
    initialColors = [];
    generateColors();
});

sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);
});

colorDivs.forEach(div => {
    div.addEventListener('click', handleColorDivEvents);
    div.children[0].addEventListener('click', copyText);
});

popup.addEventListener('transitionend', removeClipboardmsg);

//------------------------------------------------------------------Funtions

//--Generate Random Color
function randomColor() {
    return chroma.random();
}

//--Generate Colors and Colorize Divs
function generateColors() {
    colorDivs.forEach((div) => {
        const HexText = div.children[0];

        // Generate Random Color
        const color = chroma(randomColor()).hex();
        // Push colors to intial array
        if (div.classList.contains('locked')) {
            initialColors.push(HexText.innerText);
            return;
        } else {
            initialColors.push(color);
        }
        // Fill background color with random color
        div.style.backgroundColor = color;
        // Update hex in the text
        HexText.innerText = color;
        // Update color of text, icons according to luminance of color
        const icons = div.querySelectorAll('.controls button');
        checkContrast(color, HexText, icons);
        // Colorize Sliders
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const lum = sliders[1];
        const sat = sliders[2];
        colorizeSliders(color, hue, lum, sat);
        // Set values to sliders
        const hueValue = Math.floor(chroma(color).get('hsl.h'));
        const satValue = Math.floor(chroma(color).get('hsl.s') * 100) / 100;
        const lumValue = Math.floor(chroma(color).get('hsl.l') * 100) / 100;
        hue.value = hueValue;
        sat.value = satValue;
        lum.value = lumValue;
    });
}

//--Check Contrast and updates Text & Icons color
function checkContrast(color, text, icons) {
    if (chroma(color).luminance() > 0.5) {
        text.style.color = '#000';
        icons[0].style.color = '#000';
        icons[1].style.color = '#000';
    }
    else {
        text.style.color = '#fff';
        icons[0].style.color = '#fff';
        icons[1].style.color = '#fff';
    };
}

//--Colorize sliders with current color on div
function colorizeSliders(color, hue, lum, sat) {

    //-- Hue Scale
    hue.style.backgroundImage =
        `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), 
        rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`

    //-- Brightness Scale
    const midBright = chroma(color).set('hsl.l', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);

    lum.style.backgroundImage =
        `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`

    //-- Saturation Scale
    const noSat = chroma(color).set('hsl.s', 0);
    const fullSat = chroma(color).set('hsl.s', 1);
    const scaleSet = chroma.scale([noSat, color, fullSat]);

    sat.style.backgroundImage =
        `linear-gradient(to right, ${scaleSet(0)}, ${scaleSet(1)})`

};

//--Slider Events Handler
function hslControls(e) {
    const index =
        e.target.getAttribute('data-hue') ||
        e.target.getAttribute('data-bright') ||
        e.target.getAttribute('data-sat');

    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    let hue = sliders[0];
    let lum = sliders[1];
    let sat = sliders[2];

    let currentDivHexText = colorDivs[index].children[0];
    let currentDivicons = colorDivs[index].querySelectorAll('.controls button');
    let color = chroma(initialColors[index])
        .set('hsl.h', hue.value)
        .set('hsl.l', lum.value)
        .set('hsl.s', sat.value);
    // Updating color to div
    colorDivs[index].style.backgroundColor = color;
    // Updating hex text and color UI
    currentDivHexText.innerText = chroma(color).hex();
    checkContrast(currentDivHexText.innerText, currentDivHexText, currentDivicons);

    // Reset sliders colors scale
    colorizeSliders(color, hue, lum, sat);
}

//--Events handler inside color div 
function handleColorDivEvents(e) {

    //-- Toggle Sliders
    if (e.target.classList.contains('adjust')) {
        const currentSlider = e.target.parentElement.nextElementSibling;
        currentSlider.classList.add('active');
    }

    if (e.target.classList.contains('close-adjustments')) {
        e.target.parentElement.classList.remove('active');
    }

    if (e.target.classList.contains('lock')) {

        if (e.target.classList.contains('open')) {
            e.target.innerHTML = `<i class="fas fa-lock"></i>`;
            e.target.classList.add('locked')
            e.target.classList.remove('open')
            e.target.parentElement.parentElement.classList.add('locked')
        } else {
            e.target.innerHTML = `<i class="fas fa-lock-open"></i>`;
            e.target.classList.add('open')
            e.target.classList.remove('locked')
            e.target.parentElement.parentElement.classList.remove('locked')
        }

    }

}

//-- Copy hex code
function copyText(e) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = e.target.innerText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    // popup animation
    popup.classList.add('active');
    popup.children[0].classList.add('active');
}

//-- Remove ClipBoard msg
function removeClipboardmsg() {
    popup.classList.remove('active');
    popup.children[0].classList.remove('active');
}

// Implement save to palette and local storage stuff
const saveBtn = document.querySelector('.save');
const saveContainer = document.querySelector('.save-container');
const closeSave = document.querySelector('.close-save');
const saveInput = document.querySelector('.save-container input');
const submitSave = document.querySelector('.submit-save');

saveBtn.addEventListener('click', openPalette);
closeSave.addEventListener('click', closePalette);
submitSave.addEventListener('click', savePalette);

function openPalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.add('active');
    popup.classList.add('active');
}
function closePalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.remove('active');
    popup.classList.remove('active');
}
function savePalette(e) {
    saveContainer.classList.remove('active');
    const popup = saveContainer.children[0];
    popup.classList.remove('active');
    const name = saveInput.value;
    const colors = [];
    colorDivs.forEach(div => {
        colors.push(div.children[0].innerText);
    });
    //Generate palette object
    let paletteNr = (savedPalettes.length + 1);
    const paletteObj = { id: paletteNr, name: name, colors: colors }
    savedPalettes.push(paletteObj);
    savetoLocal(paletteObj);
    saveInput.value = '';
}

function savetoLocal(palette) {
    let localPalettes;
    if (localStorage.getItem('palettes') === null) {
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem('palettes'))
    }
    localPalettes.push(palette);
    localStorage.setItem('palettes', JSON.stringify(localPalettes));
};

// Implement library functionality
const libraryBtn = document.querySelector('.library');
const libraryContainer = document.querySelector('.library-container');
const closeLibrary = document.querySelector('.close-library');

libraryBtn.addEventListener('click', openlibrary);
closeLibrary.addEventListener('click', closelibrary);

function openlibrary(e) {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.add('active');
    popup.classList.add('active');
}
function closelibrary(e) {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove('active');
    popup.classList.remove('active');
}

// Initial Call
generateColors();