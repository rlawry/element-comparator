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
    canvas.addEventListener("mousemove", moveMagnifier);
    canvas.addEventListener("mouseenter", showMagnifier);
    canvas.addEventListener("mouseleave", hideMagnifier);
  } else {
    hideMagnifier(); // Ensure it's hidden when toggled off
    canvas.removeEventListener("mousemove", moveMagnifier);
    canvas.removeEventListener("mouseenter", showMagnifier);
    canvas.removeEventListener("mouseleave", hideMagnifier);
  }
});

function showMagnifier() {
  lens.style.display = "block";
}

// Function to hide the magnifier
function hideMagnifier() {
  lens.style.display = "none";
}


// Function to move the magnifier lens
// Function to move the magnifier lens
function moveMagnifier(event) {
  const rect = canvas.getBoundingClientRect();

  // Calculate scaling ratios
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  // Cursor position relative to the canvas, adjusted for any CSS scaling
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  // Position the magnifier lens centered on the cursor
  lens.style.left = `${event.clientX - lensRadius}px`;
  lens.style.top = `${event.clientY - lensRadius}px`;

  // Clear previous magnified content
  lensCtx.clearRect(0, 0, lensDiameter, lensDiameter);

  // Calculate the source coordinates for the magnified area on the canvas
  const srcX = x - (lensRadius / magnificationLevel);
  const srcY = y - (lensRadius / magnificationLevel);

  // Draw the magnified area in the lens canvas
  lensCtx.fillStyle = "black";
  lensCtx.fillRect(0,0,lensDiameter,lensDiameter);
  lensCtx.drawImage(
    canvas,
    srcX,
    srcY,
    lensDiameter / magnificationLevel, // Width of the area on the main canvas to magnify
    lensDiameter / magnificationLevel, // Height of the area on the main canvas to magnify
    0,
    0,
    lensDiameter,
    lensDiameter
  );
}