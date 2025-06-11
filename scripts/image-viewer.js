// image-viewer.js

// Hook que executa sempre que uma mensagem de chat é renderizada
Hooks.on('renderChatMessage', (message, html, data) => {
  // Procura por botões com a classe 'show-image-btn' na mensagem
  html.find('.show-image-btn').each(function() {
    const button = $(this);
    
    // Remove listeners anteriores para evitar duplicação
    button.off('click.imageViewer');
    
    // Adiciona o event listener
    button.on('click.imageViewer', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const imagePath = button.data('image');
      console.log('Image Viewer Buttons | Abrindo imagem:', imagePath);
      
      // Fallback: usa o ImagePopout nativo do Foundry
      new foundry.applications.apps.ImagePopout({
        window: {
          icon: 'fas fa-times',
          title: "Carta Crítica!",
          resizable: false,
        },
        src: imagePath,
        id: 'rpgnext',
      }).render({force: true});    
      
    });
  });
});

// Função auxiliar para criar botões de imagem (opcional)
window.createImageButton = function(imagePath, buttonText = "🔍 Ver Imagem Ampliada") {
  return `<button class="show-image-btn" data-image="${imagePath}" style="background: #a83232; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px;">${buttonText}</button>`;
};
