var style = document.querySelector('[data="test"]');    //In this section there are elements and colors and sizes that need to be accessed frequently and by more than one function.
var emitWavelength = 640;                               //By placing them here, they are outside of the other functions and their values also become global.
var padding = 10;                                       //The elements still need to be removed from this code so that they can be updated without editing this code but rather another text document.
var diagramMax = 90 + padding;                           //Until then, the wavelengths of the element's spectra have been written out in arrays.
var gradient;
var fixValue = 1;
var red, green, blue;
var hue, saturation, lightness;
var colorMapHue = [0], colorMapSat = [0], colorMapLight = [0];
var colorMapEHue = [0], colorMapESat = [0], colorMapELight = [0];
var selectedColorIndex = [0, 0, 0];                                     //[0] hue [1] sat [2] light
var showSpectrum = false;
var showExtinction = false;
var emitWavelength;
var plotType = 0;
var spectra = [0];
var velocity = 0;
var selectedObject;
var running = false;
var canvasUnknown, ctxUnknown, canvasKnown, ctxKnown;
var totalUnknown = 0;
var elementList = new Array();
var first = true;
var selectTotal = 0;
var selectedOption = {};
var points = 0;

function setGradient() {

    var gradient = ctxUnknown.createLinearGradient(0, 0, canvasUnknown.width - padding, 0);            //The gradient for color selection can probably be done in other ways, but this way was 
    if (showExtinction == true) {                                                           //pretty simple.
        gradient.addColorStop("0", "hsl(270,100%,0%)");         //Black                   The whole canvas, from one edge to the other, is represented by 0 to 1.  Along the way
        gradient.addColorStop("0.15", "hsl(265,100%,50%)");     //Purple                    we set stops to change the color.  Color for the gradient is using hsl color mapping
        gradient.addColorStop("0.16", "hsl(260,100%,50%)");                               //which is a color wheel that rotates 360 degrees through all of the colors of the rainbow
        gradient.addColorStop("0.175", "hsl(240,100%,50%)");     //Blue                     I determined the locations of these stops by comparing the classroom spectroscope to the canvas width scale.
        gradient.addColorStop("0.20", "hsl(230,100%,50%)");
        gradient.addColorStop("0.28", "hsl(190,100%,50%)");     //cyan
        gradient.addColorStop("0.38", "hsl(125,100%,50%)");     //green
        gradient.addColorStop("0.50", "hsl(60,100%,50%)");      //yellow
        gradient.addColorStop("0.58", "hsl(30,100%,50%)");      //orange
        gradient.addColorStop("0.67", "hsl(0,100%,50%)");       //red
        gradient.addColorStop("0.75", "hsl(0,100%,25%)");       //Fade
        gradient.addColorStop("0.9", "hsl(0,100%,5%)");
        gradient.addColorStop("1.0", "hsl(0,100%,0%)");
    }
    else if (showExtinction == false) {                                                         //This section removes the fading.  The percentages are kept at 50% for all stops.
        gradient.addColorStop("0", "hsl(270,100%,50%)");         //Black
        gradient.addColorStop("0.15", "hsl(265,100%,50%)");     //Purple
        gradient.addColorStop("0.16", "hsl(260,100%,50%)");
        gradient.addColorStop("0.175", "hsl(240,100%,50%)");     //Blue
        gradient.addColorStop("0.20", "hsl(230,100%,50%)");
        gradient.addColorStop("0.28", "hsl(190,100%,50%)");     //cyan
        gradient.addColorStop("0.38", "hsl(125,100%,50%)");     //green
        gradient.addColorStop("0.50", "hsl(60,100%,50%)");      //yellow
        gradient.addColorStop("0.58", "hsl(30,100%,50%)");      //orange
        gradient.addColorStop("0.67", "hsl(0,100%,50%)");       //red
        gradient.addColorStop("0.75", "hsl(0,100%,50%)");       //Fade
        gradient.addColorStop("0.9", "hsl(0,100%,50%)");
        gradient.addColorStop("1.0", "hsl(0,100%,50%)");
    }
    return gradient;                                                                         //This is now the gradient object that can be continually used.
}

function init() {                                                                                           //This function sets up the canvas along with the scale and gradients for coloring.
    canvasUnknown = document.getElementById('unknown');
    if (canvasUnknown.getContext) {
        ctxUnknown = canvasUnknown.getContext('2d');
        ctxUnknown.globalCompositeOperation = "source-atop";
    }
    canvasKnown = document.getElementById('known');
    if (canvasKnown.getContext) {
        ctxKnown = canvasKnown.getContext('2d');
        ctxKnown.globalCompositeOperation = "source-atop";
    }
    var mySelect = $('#elementSelect');                               //Code to automatically set the dropdown options to those found in lines.js
    $.each(elementalLines, function (val, text) {
        mySelect.append(
            $('<option></option>').val(val).html(val)
        );
    });
    var mySelect = $('#knownObjects');                               //Code to automatically set the dropdown options to those found in lines.js

    emitWavelength = 400;                                                  //Get the wavelength from the id wav and make this the emission wavelength 

    ctxUnknown.canvas.width = window.innerWidth;                                                                   //Set the width of the canvas to be within the size of the window on refresh.
    ctxKnown.canvas.width = ctxUnknown.canvas.width;
    createColorMaps();                                                                                      //Create the arrays of color so that we can use them for drawing.
    fillCanvas(ctxUnknown);
    fillCanvas(ctxKnown);
    drawScale(ctxUnknown);
    drawScale(ctxKnown);

    plotElement('Hydrogen', ctxKnown, "mix");
    generateUnknownSample();
    makeSelections();   
}

function submitGuess(){
    var score = 0;
    var target = 3;
    var totalClicked = 0;
    var sel = document.querySelectorAll(".guess");
    console.log(sel[1].id);
    console.log(sel[1].classList);
    for (var i = 0; i<sel.length;i++){
        if(sel[i].classList.contains("active")==true){
            if(elementList.includes(sel[i].id)==true){score++;}
            else{
                $('.score').text("You lose");
                break;
            }
        }
    }
    if(selectTotal<=target){
        if(score <= 0){
            $('.score').text("You lose");
        }
        else if(score == target){
            points++;
            $('.score').text("You win. " + points + " points");}
        else if(score>0&&score<target){$('.score').text("Something is right.");}
    }
    else{
        $('.score').text("Too many");
    }
}

function makeSelections(){
    var selectionsContainer = document.getElementById("guess-container");
    var selection;
    for(var i = 0; i<Object.keys(elementalLines).length;i++){
        selection = document.createElement('div');
        selection.className = "guess";
        selection.textContent = Object.keys(elementalLines)[i];
        selection.id = selection.textContent;
        selectionsContainer.appendChild(selection);
        selectedOption[selection.textContent] = false;
    }
}

function fillCanvas(e){
    e.fillStyle = 'black';                                                                                //Draw the black background
    e.fillRect(0, padding, e.canvas.width, diagramMax - padding);
}

function drawScale(e) {
    var counter = 0;
    var counterMinor = 9;
    var long = 8;
    var short = 3;
    var five = 6;
    var scale = 380;                                                                                            //The minimum value of the scale
    var font = 20;
    var textShift = 45;                                                                                         //Offset from the scale that the numbers will display

    e.font = font + 'px Arial';
    var inc = (e.canvas.width - 2 * padding) / 37;
    if (e.canvas.width > 1000) {
        for (var i = 1; i < counter + padding - 7; i++) {
            e.strokeStyle = 'rgb(200,200,200)';                                                                //they will be black at 2 pixels wide
            e.lineWidth = 2;
            e.beginPath();
            e.moveTo(i * (inc / 10) - 2, diagramMax);
            e.lineTo(i * (inc / 10) - 2, diagramMax + short);
            e.stroke();
            e.closePath();
        }
    }
    for (var counter = 0; counter <= (canvasUnknown.width - padding); counter += inc) {                                  //Draw tick marks
        e.strokeStyle = 'rgb(200,200,200)';                                                                     //they will be black at 2 pixels wide
        e.lineWidth = 2;
        e.beginPath();
        e.moveTo(counter + padding, diagramMax);
        e.lineTo(counter + padding, diagramMax + long);
        e.stroke();
        e.closePath();

        e.save();                                                                                               //Rotate the canvas and place the rotated numbers on the scale.
        e.translate(font - font / 2 + 2, diagramMax + textShift);
        e.rotate(-Math.PI / 2);
        e.fillStyle = "white";                                                                                  //Rotate -90 degrees.
        e.fillText(scale, 0, 0 + counter + padding / 2);
        e.restore();

        for (var minor = 1; minor <= counterMinor; minor++) {
            e.strokeStyle = 'rgb(200,200,200)';                                                                 //they will be black at 2 pixels wide
            e.lineWidth = 2;
            e.beginPath();
            e.moveTo(counter + padding + minor * (inc / 10), diagramMax);
            if (minor == 5) { e.lineTo(counter + padding + minor * (inc / 10), diagramMax + five); }
            else if (canvasUnknown.width > 1000) {
                e.lineTo(counter + padding + minor * (inc / 10), diagramMax + short);
            }
            e.stroke();
            e.closePath();
        }
        scale += 10;
    }

}                                                                                                 //Increase by 10 nanometers each time we draw a number.

function setColor(wav) {                                                                                     //We input a variable that points to a specific index in our color maps.
    wav = Math.round(wav);                                                                                  //This variable is an actual pixel.
    if (showExtinction == true) {                                                                               //We pull this pixel's color from the map to use for drawing purposes.
        selectedColorIndex[0] = colorMapHue[wav];                                                           //We store the pixel color data into a global, 4 index array.
        selectedColorIndex[1] = colorMapSat[wav];
        selectedColorIndex[2] = colorMapLight[wav];                                                                        
    }
    else if (showExtinction == false) {
        selectedColorIndex[0] = colorMapEHue[wav];
        selectedColorIndex[1] = colorMapESat[wav];
        selectedColorIndex[2] = colorMapELight[wav];
    }
}

function createColorMaps() {                                                                                 //This function steals a horizontal line of pixels from the canvas after the gradient has been drawn.

    var gradient = setGradient();
    ctxUnknown.fillStyle = gradient;                                                                               //Draw the gradient
    ctxUnknown.fillRect(0, padding, canvasUnknown.width, diagramMax - padding);

    for (var i = padding; i < canvasUnknown.width - padding - 1; i++) {                                                       //Look at every pixel and push the values of RED, GREEN, and BLUE to their own unique arrays.
        var imgData = ctxUnknown.getImageData(i, 50, i + 1, 51);                                                        //Each index of the new arrays corresponds to the color values at each pixel.
        red = imgData.data[0];
        green = imgData.data[1];
        blue = imgData.data[2];

        var hsl = rgb2Hsl(red,green,blue);

        colorMapHue.push(hsl[0]);                                                                  //Since these arrays are now independent of the canvas, the canvas can be redrawn whenever we like.
        colorMapSat.push(hsl[1]);
        colorMapLight.push(hsl[2]);
    }

    showExtinction = !showExtinction;                                                                       //This variable is global so that we can cycle through showing fading or not.  We manipulate it here to activate 
    var gradient = setGradient();                                                                           //the fading.
    ctxUnknown.fillStyle = gradient;
    ctxUnknown.fillRect(0, padding, canvasUnknown.width, diagramMax - padding);

    for (var i = padding; i < canvasUnknown.width - padding - 1; i++) {                                                       //do it again for the gradient without fading.
        var imgData = ctxUnknown.getImageData(i, 50, i + 1, 51);
        red = imgData.data[0];
        green = imgData.data[1];
        blue = imgData.data[2];

        var hsl2 = rgb2Hsl(red,green,blue);
        colorMapEHue.push(hsl2[0]);
        colorMapESat.push(hsl2[1]);
        colorMapELight.push(hsl2[2]);
    }
    showExtinction = !showExtinction;                                                                       // set this back to normal for our initial state.
}

function rgb2Hsl(red, green, blue) {
    red   /= 255;
    green /= 255;
    blue  /= 255;

    var max = Math.max(red, green, blue);
    var min = Math.min(red, green, blue);
    var hue;
    var saturation;
    var lightness = (max + min) / 2;

    if (max == min) {
        hue = saturation = 0; // achromatic
    } else {
        var delta = max - min;
        saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        switch (max) {
            case red:
                hue = (green - blue) / delta + (green < blue ? 6 : 0);
                break;
            case green:
                hue = (blue - red) / delta + 2;
                break;
            case blue:
                hue = (red - green) / delta + 4;
                break;
        }
        hue /= 6;
    }
    return [(hue * 360), (saturation * 100), (lightness * 100)];
}

var currentIntensity, effectiveIntensity;
var boost = 200;
var positionTracker = new Array();
positionTracker = [0];
var positionBuffer = 0;
var lineCount = 0;


function plotElement(e, k, n) {
    positionTracker.splice(0, positionTracker.length)                               //Avoid overlap
    var elementSel = document.getElementById("elementSelect");                      //Take the html element "element" to use in this function.
    var element = e;                                                                //Set a variable equal to the value of the selected index
    spectra = elementalLines[element]['spectra'];
    var intensityDecimal;
    var brightnessAdd;
    var intensity = new Array();
    intensity = elementalLines[element]['intensity'];                               //create an array of the intensities for the element
    var maxIntensity = 0;

    for(var i = 0; i<intensity.length;i++){
        if(intensity[i]>maxIntensity){maxIntensity = intensity[i];}
    }
    var gradient = setGradient();                                                   //set the gradient maps so you can choose the correct color
    if(n=="no-mix"){                                              
        if (showSpectrum == false) {
            k.fillStyle = 'black';                                                    //fill the rectangles with the correct base colors
            k.fillRect(0, padding, k.canvas.width, diagramMax - padding);
        }
        else if (showSpectrum == true) {
            k.fillStyle = gradient;
            k.fillRect(0, padding, k.canvas.width, diagramMax - padding);
        }
    }
    else if(n=="mix"){
        if(first == true){
            if (showSpectrum == false) {
                k.fillStyle = 'black';                                                    //fill the rectangles with the correct base colors
                k.fillRect(0, padding, k.canvas.width, diagramMax - padding);
            }
            else if (showSpectrum == true) {
                k.fillStyle = gradient;
                k.fillRect(0, padding, k.canvas.width, diagramMax - padding);
            }
            first = false;
        }
    }
    for (var i = 0; i <= spectra.length; i++) {                                     //go through the element's spectral lines one by one
        emitWavelength = spectra[i] / 10;
        
        if(intensity === undefined || intensity.length==0){currentIntensity = 1000;}
        else{ currentIntensity = parseInt(intensity[i]);}
        if(currentIntensity<boost){
            if((currentIntensity+boost)>1000){effectiveIntensity = 1000;}
            else if((currentIntensity+boost)<=1000 && currentIntensity>0){effectiveIntensity = currentIntensity+boost;}
            else if(currentIntensity == 0){effectiveIntensity = 0;}
        }
        else{effectiveIntensity=currentIntensity;}
        
        intensityDecimal = effectiveIntensity/maxIntensity;          

        var convertWav = (emitWavelength - 380) / (750 - 380) * (canvasUnknown.width - 2 * padding) + padding;     // else it is bypassed and this line is unaffected.
        setColor(convertWav);
        hue = selectedColorIndex[0];                                                                        //The color in the previous function places each of the RGBa values into the first four indices of an array...
        saturation = selectedColorIndex[1];                                                                 //These lines take those indices and place them in simpler variables so they mean a little more.
        var baseLightness = selectedColorIndex[2];
        
        if(elementSel !="Sodium"){
            if((baseLightness+brightnessAdd)*intensityDecimal<70){brightnessAdd = 40;}
            else{brightnessAdd = 0;}
        }
        else if(elementSel == "Sodium"){brightnessAdd = 0;}

        if (showSpectrum == false) {
            k.strokeStyle = 'hsl(' + hue + ',' + saturation + '%,' + ((baseLightness+brightnessAdd)*intensityDecimal) + '%)';
        }
        else if (showSpectrum == true) {
            if((baseLightness - (baseLightness+10)*intensityDecimal) <0){
                k.strokeStyle = 'hsl(' + hue + ',' + saturation + '%,' + 0 + '%)';
            }
            else{
                k.strokeStyle = 'hsl(' + hue + ',' + saturation + '%,' + (baseLightness-(baseLightness+10)*intensityDecimal) + '%)';               
            }
        }
        if(convertWav>0){
            if(typeof convertWav !== "undefined"){
                if(isNaN(intensityDecimal)==false){
                    drawLine(convertWav, k);
                    lineCount++;
                }
            }
        }
        plotType = 1;
        positionTracker[positionTracker.length] = Math.round(convertWav);
    }
    lineCount = 0;
}

function plot(e){
    plotElement(e,ctxKnown,"no-mix");
}

function generateUnknownSample(){
    var totalElements = 8;
    var elementTotal = Object.keys(elementalLines).length;
    console.log(elementTotal + " total");
    var randomInt = 0;
    while(elementList.length<totalElements){
        randomInt = Math.floor(Math.random()*elementTotal);
        if(elementList.includes(Object.keys(elementalLines)[randomInt]) === false){elementList.push(Object.keys(elementalLines)[randomInt]);}
    };
    console.log(elementList);
    drawUnknown();
    document.getElementById("count").innerHTML = elementList.length + " elements"; 
}

function drawUnknown(){
    for(var i = 0; i<Object.keys(elementList).length; i++){
        plotElement(elementList[i],ctxUnknown,"mix");
    }
}

function drawLine(position, ctx) {
    positionBuffer = document.getElementById("lineWidth").value;
    ctx.lineWidth = positionBuffer;                                

    ctx.beginPath();
    ctx.moveTo(position, padding);
    ctx.lineTo(position, diagramMax);
    ctx.stroke();
    ctx.closePath();
}

function update() {
    var sel = document.getElementById("elementSelect");
    var els = sel.options[sel.selectedIndex].value;
    plotElement(els, ctxKnown, "no-mix");
    first = true;
    drawUnknown();                    
}

function updateThings(){
    update();
    drawScale();
}

function switchState() {                                    
    showSpectrum = !showSpectrum;
    update();
}
function switchGradient() {                                 
    showExtinction = !showExtinction;
    update();
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
