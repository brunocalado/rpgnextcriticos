const tableName = 'Acerto Crítico';
//const tableName = 'Erro Crítico';
let cardImage;
let cardBackImage = "modules/rpgnextcriticos/images/dadosacerto/costas-cartas-acerto-critico.jpg";

async function drawFromTable(tableName) {

  let list_compendium = await game.packs.filter(p=>p.documentName=='RollTable');      
  let inside = await list_compendium.find( p=>p.metadata.label=='RPG Next - Tabelas' ).getDocuments();      
  const table = await inside.filter( p=>p.name==tableName )[0];          
  
  if (!table) {
    ui.notifications.warn(`Table ${tableName} not found.`, {});
    return;
  }
  const output = await table.roll();
  const result = output.results[0].img;
  
  cardImage=result;


  // Cria a mensagem com imagem e botão clicável
  const chatMessage = await ChatMessage.create({
    content: `<img src="${result}"><br><button class="show-image-btn" data-image="${result}" style="background: #a83232; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">🔍 Ver Carta Ampliada</button>`
  });
  
  // Usando hook do Foundry para garantir que o event listener funcione
  Hooks.once('renderChatMessage', (message, html) => {
    if (message.id === chatMessage.id) {
      html.find('.show-image-btn').click(function(e) {
        e.preventDefault();
        const imagePath = $(this).data('image');
        showImage(imagePath);
      });
    }
  });
}

const peculiaridades = await drawFromTable(tableName);
const moduleId = "orcnog-card-viewer";

if (game.modules.get(moduleId).active) {

let borderColor = '#543'; // optional
let borderWidth = '5px'; // optional
let shareToAll = true; // optional

OrcnogFancyDisplay({
   front: cardImage,
   back: cardBackImage,
   border: borderColor,
   borderWidth: borderWidth
}).render(shareToAll)

} else {
   ui.notifications.error(`O módulo com ID CARD VIEWER não está instalado ou não está ativo.`);
}

function showImage(myImage) {
  new foundry.applications.apps.ImagePopout({
    window: {
      icon: 'fas fa-times',
      title: "Carta Crítica!",
      resizable: false,
    },
    src: myImage,
    id: 'rpgnext',
  }).render({force: true});    
}