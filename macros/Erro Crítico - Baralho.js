//const deckName = 'Acerto Crítico';
const deckName = 'Falha Crítica';
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
  // Cria a mensagem com imagem e botão clicável
  const chatMessage = await ChatMessage.create({
    content: `<img src="${result}"><br><button class="show-image-btn" data-image="${result}" style="background: #a83232; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">🔍 Ver Carta Ampliada</button>`
  });
  
  //const popout = new ImagePopout(result).render(true);
  //popout.shareImage();
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
