# Cartas Críticas do RPG Next para D&D 5e

Está jogando D&D e tirou um 20 no ataque e não sabe o que fazer além de aplicar o dano crítico?

Ou acabou tirando “1” num ataque e não sabe o que fazer além de dizer que foi um erro?

Seus problemas se acabaram!!! (ou começaram, uma vez que usar essas cartas pode ser mortal!)

Chegou o APP das CARTAS CRÍTICAS para D&D 5e! Sua versão contém 52 Cartas de Acerto Crítico e 52 Cartas de Falha Crítica !

Mais emoção nos Acertos Críticos e Falhas Críticas na sua mesa de RPG com D&D 5e. Utilize toda vez que um acerto crítico ou falha crítica sair em um ataque. Basta clicar no botão da carta correspondente e aplicar o resultado!

<table>
<thead>
  <tr>
    <th><p align="center">
  <img width="300" src="images/guide/acerto.jpg">
</p></th>
    <th><p align="center">
  <img width="300" src="images/guide/falha.jpg">
</p></th>
  </tr>
</thead>
</table>

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Donate-red?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/mestredigital)

# Instalação

## Instalação pelo Foundry VTT

1. Vá na interface de adminstração do Foundry VTT
2. Vá na guia Módulos. Procure por RPG Next. Instale.

## Instalação Manual

1. Vá em **Módulos** e use o link abaixo: 
Use this: 

```
https://raw.githubusercontent.com/brunocalado/rpgnextcriticos/main/module.json
```

# Como Usar

A ativação é feita por uma API global, que pode ser chamada de qualquer macro, módulo ou do sistema:

```js
RPGNext.Critical("sucesso"); // sorteia e revela uma carta de Acerto Crítico
RPGNext.Critical("falha");   // sorteia e revela uma carta de Falha Crítica
```

Também aceita os apelidos `"acerto"` e `"erro"` (não diferencia maiúsculas/minúsculas). A carta é sorteada aleatoriamente (pode repetir) e exibida para todos os jogadores pelo módulo [Epic 3D Card Reveal](https://github.com/brunocalado/epic-3d-card-reveal) (pré-requisito), que também cuida da mensagem de chat. Aparência (brilho, som, estilo do reveal) é configurada nas opções do próprio Epic 3D Card Reveal.

Leia também a documentação que está nos registros em compêndio dentro do módulo.

# Mudanças

Podem ver alterações nas versões em [CHANGELOG](CHANGELOG.md)

# Credits and License

- Released under the [LICENSE](LICENSE).

These items are from the **RPG Next**. They were publish with consent from **Rafael Quarenta E Sete** (https://www.facebook.com/rbl047).

You can also get them from: https://www.rpgnext.com.br/aplicativo/app-das-cartas-criticas-para-dnd-5e/
