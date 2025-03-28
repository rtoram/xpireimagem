function convertAndDownload() {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecione uma imagem PNG!");
        return;
    }

    // Criar um objeto de imagem para conversão
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(e) {
        img.src = e.target.result;
    };

    img.onload = function() {
        // Criar um canvas temporário para processar a imagem
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Configurações para o ImageTracer
        const options = {
            scale: 1,           // Escala da imagem
            colorsampling: 1,   // Amostragem de cores
            numberofcolors: 16, // Número de cores no SVG
            pathomit: 8,        // Simplificação de caminhos
            ltres: 1,           // Resolução de linhas
            qtres: 1,           // Resolução de curvas
            strokewidth: 0.5    // Largura do traço
        };

        // Converter para SVG e baixar
        ImageTracer.imageDataToSVG(
            ImageTracer.getImgdata(canvas),
            function(svgstr) {
                downloadSVG(svgstr, file.name.replace('.png', '.svg'));
            },
            options
        );
    };

    reader.readAsDataURL(file);
    fileInput.value = ''; // Reseta o input após o upload
}

// Função para baixar o SVG gerado
function downloadSVG(svgstr, filename) {
    const blob = new Blob([svgstr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'converted_image.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
