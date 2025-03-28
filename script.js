function convertImage() {
    const fileInput = document.getElementById('upload');
    const outputDiv = document.getElementById('output');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecione uma imagem PNG!");
        return;
    }

    // Criar um objeto de imagem
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(e) {
        img.src = e.target.result;
    };

    img.onload = function() {
        // Criar um canvas para desenhar a imagem
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Configurações do ImageTracer
        const options = {
            scale: 1,
            colorsampling: 1,
            numberofcolors: 16,
            pathomit: 8
        };

        // Converter para SVG
        ImageTracer.imageDataToSVG(
            ImageTracer.getImgdata(canvas), // Dados da imagem do canvas
            function(svgstr) {
                outputDiv.innerHTML = svgstr; // Exibir o SVG
                downloadSVG(svgstr); // Oferecer download
            },
            options
        );
    };

    reader.readAsDataURL(file);
}

// Função para baixar o SVG
function downloadSVG(svgstr) {
    const blob = new Blob([svgstr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_image.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
