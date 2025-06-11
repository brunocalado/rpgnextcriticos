const deckName = 'Acerto Crítico';
//const deckName = 'Erro Crítico';
const peculiaridades = await drawFromDeck(deckName);


async function drawFromDeck(deckName) {
  const deck = await game.cards.find((t) => t.name == deckName);
  
  if (!deck) {
    ui.notifications.warn(`Deck ${deckName} not found.`, {});
    return;
  }

  await deck.recall({ chatNotification: false });
  await deck.shuffle({ chatNotification: false });  
  
  let cardsDrawn = deck._drawCards(1, CONST.CARD_DRAW_MODES.TOP);
  let updates = cardsDrawn.map((v) => {
    return {
      _id: v.id,
      drawn: true,
    };
  });

  await deck.updateEmbeddedDocuments('Card', updates);
  
  const result = cardsDrawn[0].faces[0].img;
  
  // Agora usando a função do módulo para criar o botão
  const imageButton = window.createImageButton ? 
    window.createImageButton(result) : 
    `<button class="show-image-btn" data-image="${result}" style="background: #4b9cd3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px;">🔍 Ver Imagem Ampliada</button>`;
  
  await ChatMessage.create({
    content: `<img src="${result}"><br>${imageButton}`
  });
  
  showImage(result);
  
  await deck.recall({ chatNotification: false });
  await deck.shuffle({ chatNotification: false });  

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
