// UIN Capsule exportieren
function exportUIN() {
    if (!cannyImage) {
        alert('Bitte zuerst ein Bild verarbeiten!');
        return;
    }
    
    const capsule = {
        format: "uin-capsule-v1",
        edges: cannyImage.split(',')[1],
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
    
    const dataStr = JSON.stringify(capsule, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    downloadFile(dataBlob, `uin_capsule_${Date.now()}.uin`);
}

// Nur Canny PNG exportieren
function exportPNG() {
    if (!cannyImage) {
        alert('Bitte zuerst ein Bild verarbeiten!');
        return;
    }
    
    const link = document.createElement('a');
    link.href = cannyImage;
    link.download = `canny_edges_${Date.now()}.png`;
    link.click();
}

// Nur JSON exportieren
function exportJSON() {
    const attributes = {
        format: "uin-attributes-v1",
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
    };
    
    const dataStr = JSON.stringify(attributes, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    downloadFile(dataBlob, `uin_attributes_${Date.now()}.json`);
}

// Datei Download Helper
function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Download-Link anzeigen
    const downloadLinks = document.getElementById('downloadLinks');
    downloadLinks.innerHTML = `
        <div class="download-success">
            ✅ Datei heruntergeladen: <strong>${filename}</strong>
            <br>
            <small>Verwende diese Datei in Stable Diffusion mit ControlNet (canny)</small>
        </div>
    `;
}

// A1111/ComfyUI Integration
function generateA1111Prompt() {
    const prompt = document.getElementById('prompt').value;
    const negative = document.getElementById('negativePrompt').value;
    const style = document.getElementById('style').value;
    
    return {
        prompt: `${prompt}, ${style}, masterpiece, best quality`,
        negative_prompt: `${negative}, worst quality, low quality, normal quality`,
        steps: 30,
        cfg_scale: 7,
        width: 512,
        height: 512,
        sampler_index: "DPM++ 2M Karras",
        alwayson_scripts: {
            ControlNet: {
                args: [{
                    input_image: cannyImage,
                    module: "canny",
                    model: "control_v11p_sd15_canny",
                    weight: 1.0,
                    guidance_start: 0,
                    guidance_end: 1,
                    processor_res: 512,
                    threshold_a: parseInt(document.getElementById('lowThreshold').value),
                    threshold_b: parseInt(document.getElementById('highThreshold').value)
                }]
            }
        }
    };
}

// Für direkte A1111 Integration
function copyA1111Config() {
    const config = generateA1111Prompt();
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
        .then(() => alert('A1111 Konfiguration kopiert!'))
        .catch(err => console.error('Copy failed:', err));
}
