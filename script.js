const canvas = document.getElementById('nebula-canvas');
const ctx = canvas.getContext('2d');
const colorButtons = document.querySelectorAll('.color-btn');
const brushSize = document.getElementById('brush-size');
const brushOpacity = document.getElementById('brush-opacity');
const glowEffectBtn = document.getElementById('glow-effect');
const blurEffectBtn = document.getElementById('blur-effect');
const saveBtn = document.getElementById('save-btn');
const textInput = document.getElementById('text-input');
const addTextBtn = document.getElementById('add-text');
const fontSizeInput = document.getElementById('font-size');
const fontFamilySelect = document.getElementById('font-family');
const textAlignSelect = document.getElementById('text-align');
const strokeWidthInput = document.getElementById('stroke-width');
const strokeColorInput = document.getElementById('stroke-color');
const textRotationInput = document.getElementById('text-rotation');

// Initialize canvas
canvas.width = window.innerWidth - 300;
canvas.height = window.innerHeight;
ctx.fillStyle = '#0d0d1a';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Drawing state
let isDrawing = false;
let currentColor = '#ff0000';
let currentBrushSize = 10;
let currentOpacity = 0.8;
let textMode = false;
let textToAdd = '';
let fontSize = 30;
let fontFamily = 'Arial';
let textAlign = 'left';
let strokeWidth = 0;
let strokeColor = '#000000';
let textRotation = 0;

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e.touches[0]);
}, { passive: false });

canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e.touches[0]);
}, { passive: false });

// Text mode event listeners
textInput.addEventListener('input', (e) => {
    textToAdd = e.target.value;
});

fontSizeInput.addEventListener('input', (e) => {
    fontSize = parseInt(e.target.value);
});

fontFamilySelect.addEventListener('change', (e) => {
    fontFamily = e.target.value;
});

textAlignSelect.addEventListener('change', (e) => {
    textAlign = e.target.value;
});

strokeWidthInput.addEventListener('input', (e) => {
    strokeWidth = parseInt(e.target.value);
});

strokeColorInput.addEventListener('input', (e) => {
    strokeColor = e.target.value;
});

textRotationInput.addEventListener('input', (e) => {
    textRotation = parseInt(e.target.value);
});

addTextBtn.addEventListener('click', () => {
    if (textToAdd) {
        textMode = true;
        canvas.style.cursor = 'text';
    }
});

canvas.addEventListener('click', (e) => {
    if (textMode && textToAdd) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(textRotation * Math.PI / 180);
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = textAlign;
        ctx.fillStyle = currentColor;
        ctx.globalAlpha = currentOpacity;
        
        if (strokeWidth > 0) {
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.strokeText(textToAdd, 0, 0);
        }
        
        ctx.fillText(textToAdd, 0, 0);
        ctx.restore();

        // Reset text mode
        textMode = false;
        textToAdd = '';
        textInput.value = '';
        canvas.style.cursor = 'crosshair';
    }
});

// Drawing functions
function startDrawing(e) {
    if (!textMode) {
        isDrawing = true;
        draw(e);
    }
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing || textMode) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalAlpha = currentOpacity;
    ctx.lineWidth = currentBrushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Color selection
colorButtons.forEach(btn => btn.addEventListener('click', setColor));

function setColor(e) {
    currentColor = e.target.dataset.color;
    colorButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
}

// Brush settings
brushSize.addEventListener('input', updateBrushSize);
brushOpacity.addEventListener('input', updateOpacity);

function updateBrushSize() {
    currentBrushSize = this.value;
}

function updateOpacity() {
    currentOpacity = this.value;
}

// Effects
glowEffectBtn.addEventListener('click', toggleGlow);
blurEffectBtn.addEventListener('click', toggleBlur);

function toggleGlow() {
    ctx.shadowBlur = ctx.shadowBlur ? 0 : 20;
    ctx.shadowColor = currentColor;
}

function toggleBlur() {
    ctx.filter = ctx.filter ? 'none' : 'blur(2px)';
}

// Save artwork
saveBtn.addEventListener('click', saveArtwork);

function saveArtwork() {
    const link = document.createElement('a');
    link.download = `nebula-artwork-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 300;
    canvas.height = window.innerHeight;
});
