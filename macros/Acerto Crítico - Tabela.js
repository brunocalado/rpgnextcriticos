const tableName = 'Acerto Crítico';
//const tableName = 'Erro Crítico';
const peculiaridades = await drawFromTable(tableName);

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
  
  // Agora usando a função do módulo para criar o botão
  const imageButton = window.createImageButton ? 
    window.createImageButton(result) : 
    `<button class="show-image-btn" data-image="${result}" style="background: #4b9cd3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px;">🔍 Ver Imagem Ampliada</button>`;
  
  await ChatMessage.create({
    content: `<img src="${result}"><br>${imageButton}`
  });
  
  showImage(result);
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
