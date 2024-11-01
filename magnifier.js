const canvas = document.getElementById("known");
const ctx = canvas.getContext("2d");
const magnifierToggle = document.getElementById("magnifier-toggle");
const lens = document.getElementById("magnifier-lens");
const lensCtx = lens.getContext("2d");

const magnificationLevel = 2; // Magnification level
const lensRadius = 50; // Radius of magnifier lens
const lensDiameter = lensRadius * 2;

// Event listeners
magnifierToggle.addEventListener("change", (e) => {
  if (e.target.checked) {
    lens.style.display = "block";
    canvas.addEventListener("mousemove", moveMagnifier);
  } else {
    lens.style.display = "none";
    canvas.removeEventListener("mousemove", moveMagnifier);
  }
});

// Function to move the magnifier lens
// Function to move the magnifier lens
function moveMagnifier(event) {
    const rect = canvas.getBoundingClientRect();
    
    // Cursor position relative to the canvas
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    // Position the magnifier lens centered on the cursor
    lens.style.left = `${event.clientX - lensRadius}px`;
    lens.style.top = `${event.clientY - lensRadius}px`;
  
    // Clear the previous magnified content
    lensCtx.clearRect(0, 0, lensDiameter, lensDiameter);
  
    // Calculate the starting position for the magnified area
    // Divide lensRadius by magnification level to keep the object centered
    const srcX = x - lensRadius / magnificationLevel;
    const srcY = y - lensRadius / magnificationLevel;
  
    // Draw the magnified area in the lens
    lensCtx.drawImage(
      canvas,
      srcX,
      srcY,
      lensDiameter / magnificationLevel,    // Width of the magnified area on canvas
      lensDiameter / magnificationLevel,    // Height of the magnified area on canvas
      0,
      0,
      lensDiameter,
      lensDiameter
    );
  }