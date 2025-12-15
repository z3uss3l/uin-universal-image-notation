// OpenCV.js Status
let cvReady = false;
let originalImage = null;
let cannyImage = null;

// OpenCV.js laden
if (typeof cv !== 'undefined') {
    cv['onRuntimeInitialized'] = () => {
        console.log('OpenCV.js geladen');
        cvReady = true;
        document.getElementById('processBtn').disabled = false;
        document.getElementById('autoBtn').disabled = false;
    };
}

// File Upload Handling
document.getElementById('imageInput').addEventListener('change', handleImageUpload);

// Drag & Drop
const dropZone = document.querySelector('.drop-zone');
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '#f0f7ff';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = 'white';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = 'white';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
});

// Bild laden
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            displayImage(img, 'originalCanvas');
            
            // Auto-detect Canny thresholds
            setTimeout(autoDetect, 100);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
}

// Bild anzeigen
function displayImage(img, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    // Canvas auf Bildgröße setzen (max 512px)
    const scale = Math.min(512 / img.width, 512 / img.height);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// Canny Edge Detection
function processCanny() {
    if (!cvReady || !originalImage) {
        alert('Bitte warte bis OpenCV geladen ist und lade ein Bild hoch.');
        return;
    }
    
    const low = parseInt(document.getElementById('lowThreshold').value);
    const high = parseInt(document.getElementById('highThreshold').value);
    
    // Originalbild in Canvas
    const srcCanvas = document.getElementById('originalCanvas');
    const srcCtx = srcCanvas.getContext('2d');
    
    // Bilddaten extrahieren
    const imgData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
    
    // OpenCV Mat erstellen
    const src = cv.imread(srcCanvas);
    const dst = new cv.Mat();
    const gray = new cv.Mat();
    
    // Zu Graustufen konvertieren
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    
    // Gaussian Blur anwenden
    const blurred = new cv.Mat();
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 1.5, 1.5);
    
    // Canny Edge Detection
    cv.Canny(blurred, dst, low, high, 3, false);
    
    // Ergebnis anzeigen
    cv.imshow('cannyCanvas', dst);
    
    // Invertieren für bessere Sichtbarkeit
    const inverted = new cv.Mat();
    cv.bitwise_not(dst, inverted);
    cv.imshow('cannyCanvas', inverted);
    
    // Canny-Bild für Export speichern
    const exportCanvas = document.getElementById('cannyCanvas');
    cannyImage = exportCanvas.toDataURL('image/png');
    
    // Speicher freigeben
    src.delete();
    dst.delete();
    gray.delete();
    blurred.delete();
    inverted.delete();
    
    updateJSONPreview();
}

// Auto-Detect Thresholds
function autoDetect() {
    if (!cvReady || !originalImage) return;
    
    // Otsu's Methode für automatische Thresholds
    const srcCanvas = document.getElementById('originalCanvas');
    const src = cv.imread(srcCanvas);
    const gray = new cv.Mat();
    
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    
    // Otsu's Threshold berechnen
    const otsu = new cv.Mat();
    cv.threshold(gray, otsu, 0, 255, cv.THRESH_OTSU);
    
    // Threshold-Werte extrahieren
    const mean = cv.mean(gray)[0];
    const low = Math.max(1, Math.min(mean * 0.5, 100));
    const high = Math.max(low * 2, Math.min(mean * 1.5, 200));
    
    // Slider aktualisieren
    document.getElementById('lowThreshold').value = Math.round(low);
    document.getElementById('highThreshold').value = Math.round(high);
    document.getElementById('lowValue').textContent = Math.round(low);
    document.getElementById('highValue').textContent = Math.round(high);
    
    // Canny anwenden
    processCanny();
    
    src.delete();
    gray.delete();
    otsu.delete();
}

// Slider Updates
document.getElementById('lowThreshold').addEventListener('input', function() {
    document.getElementById('lowValue').textContent = this.value;
    if (originalImage) {
        processCanny();
    }
});

document.getElementById('highThreshold').addEventListener('input', function() {
    document.getElementById('highValue').textContent = this.value;
    if (originalImage) {
        processCanny();
    }
});

// Beispiel laden
function loadExample() {
    const exampleImg = new Image();
    exampleImg.onload = function() {
        originalImage = exampleImg;
        displayImage(exampleImg, 'originalCanvas');
        
        // Beispiel-Prompt setzen
        document.getElementById('prompt').value = "A serene park at golden hour, with a person sitting on a wooden bench under a large oak tree. Soft sunlight filtering through leaves, creating dappled shadows on the grass. In the background, a small pond reflects the sky. Photorealistic, 35mm lens, cinematic lighting, shallow depth of field.";
        document.getElementById('lighting').value = "golden_hour";
        document.getElementById('style').value = "cinematic";
        document.getElementById('camera').value = "35mm";
        document.getElementById('negativePrompt').value = "blurry, distorted, ugly, watermark, text";
        
        autoDetect();
    };
    exampleImg.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
}

// Farbe ändern
function changeColor(element) {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = element.dataset.color;
    colorPicker.onchange = function() {
        element.style.backgroundColor = this.value;
        element.dataset.color = this.value;
        updateJSONPreview();
    };
    colorPicker.click();
}

// JSON Vorschau aktualisieren
function updateJSONPreview() {
    if (!cannyImage) return;
    
    const capsule = {
        format: "uin-capsule-v1",
        edges: cannyImage.split(',')[1], // Base64 ohne Data-URL Prefix
        attributes: {
            prompt: document.getElementById('prompt').value,
            lighting: document.getElementById('lighting').value,
            style: document.getElementById('style').value,
            camera: document.getElementById('camera').value,
            palette: Array.from(document.querySelectorAll('.color')).map(c => c.dataset.color),
            negative_prompt: document.getElementById('negativePrompt').value,
            canny_thresholds: {
                low: parseInt(document.getElementById('lowThreshold').value),
                high: parseInt(document.getElementById('highThreshold').value)
            },
            timestamp: new Date().toISOString(),
            version: "uin-v0.6-hybrid"
        }
    };
    
    document.getElementById('jsonPreview').innerHTML = 
        `<code>${JSON.stringify(capsule, null, 2)}</code>`;
}

// Initialisierung
window.onload = function() {
    // Slider Werte anzeigen
    document.getElementById('lowValue').textContent = 
        document.getElementById('lowThreshold').value;
    document.getElementById('highValue').textContent = 
        document.getElementById('highThreshold').value;
    
    // Beispiel nach 2 Sekunden laden
    setTimeout(() => {
        if (!originalImage) {
            loadExample();
        }
    }, 2000);
};
