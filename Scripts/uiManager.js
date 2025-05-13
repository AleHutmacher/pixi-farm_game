class UIManager {
  constructor(game) {
    this.font = "StardewValley2";
    this.font2 = "StardewValley";
    this.game = game;
    this.scaleFactor = 1;

    this.sheepsInFarm = this.game.sheepsInFarm;
  }

  createMainMenu() {
    document.fonts.ready.then(() => {
      // Título del juego
      const gameTitle = document.createElement("p");
      gameTitle.textContent = "UN PASEO POR LA GRANJA";
      gameTitle.style.fontFamily = this.font2;
      gameTitle.style.position = "absolute";
      gameTitle.style.top = `${25 * this.scaleFactor}%`;
      gameTitle.style.left = "50%";
      gameTitle.style.transform = "translate(-50%, -50%)";
      gameTitle.style.padding = "0";
      gameTitle.style.margin = "0";
      gameTitle.style.whiteSpace = "nowrap";
      gameTitle.style.fontSize = `${100 * this.scaleFactor}px`;
      gameTitle.style.color = "#DEB887";
      gameTitle.style.textAlign = "center";
      document.body.appendChild(gameTitle);

      // Botón de inicio
      const startButton = document.createElement("button");
      startButton.textContent = "Start Game";
      startButton.style.position = "absolute";
      startButton.style.top = `${90 * this.scaleFactor}%`;
      startButton.style.left = "50%";
      startButton.style.transform = "translate(-50%, -50%)";
      startButton.style.padding = `${15 * this.scaleFactor}px ${
        30 * this.scaleFactor
      }px`;
      startButton.style.fontSize = `${30 * this.scaleFactor}px`;
      startButton.style.fontFamily = this.font;
      startButton.style.backgroundColor = "#FF5733";
      startButton.style.color = "#FFFFFF";
      startButton.style.border = "none";
      startButton.style.cursor = "pointer";
      startButton.style.borderRadius = `${10 * this.scaleFactor}px`;
      document.body.appendChild(startButton);

      const textLore = document.createElement("p");
      textLore.textContent = "Ayuda al granjero a recuperar a sus ovejas";
      textLore.style.fontFamily = this.font;
      textLore.style.position = "fixed";
      textLore.style.top = `${40 * this.scaleFactor}%`;
      textLore.style.left = "50%";
      textLore.style.transform = "translate(-50%, -50%)";
      textLore.style.padding = "0";
      textLore.style.margin = "0";
      textLore.style.whiteSpace = "nowrap";
      textLore.style.fontSize = `${50 * this.scaleFactor}px`;
      textLore.style.color = "#dbe10f";
      textLore.style.textAlign = "center";
      document.body.appendChild(textLore);

      // Instrucciones (sección separada)
      const instructions = document.createElement("div");
      instructions.style.fontFamily = this.font;
      instructions.style.position = "fixed";
      instructions.style.top = `${65 * this.scaleFactor}%`;
      instructions.style.left = "50%";
      instructions.style.transform = "translate(-50%, -50%)";
      instructions.style.padding = "10px";
      instructions.style.margin = "0";
      instructions.style.width = `${80 * this.scaleFactor}%`;
      instructions.style.fontSize = `${35 * this.scaleFactor}px`;
      instructions.style.color = "#6eefeb";
      instructions.style.textAlign = "center";
      instructions.innerHTML = `
            <p>Utiliza <b>WASD</b> para mover al Granjero.</p>
            <p>Si el tiempo se acaba, finaliza el juego.</p>`;
      document.body.appendChild(instructions);

      // Evento del botón
      startButton.addEventListener("click", () => {
        // Reproducir música de fondo
        backgroundMusic
          .play()
          .then(() => {
            console.log("Música de fondo iniciada");
          })
          .catch((error) => {
            console.error("Error al reproducir música:", error);
          });

        // Eliminar elementos del menú
        document.body.removeChild(startButton);
        document.body.removeChild(gameTitle);
        document.body.removeChild(textLore);
        document.body.removeChild(instructions);
        this.game.startGame();
      });
    });
  }

  createGameplayUI() {
    this.uiContainer = new PIXI.Container();
    this.uiContainer.name = "UIContainer";
    this.pointsText = new PIXI.Text({
      text: `Tiempo: ${this.game.levelTimer / 60}`,
      style: {
        fontFamily: this.font,
        fontSize: 40 * this.scaleFactor,
        fill: "#cdcfcc",
        align: "center",
      },
    });
    this.pointsText.anchor.set(0.5);
    this.pointsText.x = 70;
    this.pointsText.y = 15;

    this.uiContainer.addChild(this.pointsText);

    this.upperText = new PIXI.Text({
      text: `A despertar a las ovejas! `,
      style: {
        fontFamily: this.font,
        fontSize: 40 * this.scaleFactor,
        fill: "#000000",
        align: "center",
      },
    });
    this.upperText.anchor.set(0.5);
    this.upperText.x = this.game.width / 2;
    this.upperText.y = 15;

    this.uiContainer.addChild(this.upperText);

    this.collectedSheepText = new PIXI.Text({
      text: `Ovejas recolectadas: ${this.sheepsInFarm}`,
      style: {
        fontFamily: this.font,
        fontSize: 40 * this.scaleFactor,
        fill: "#000000",
        align: "center",
      },
    });
    this.collectedSheepText.anchor.set(0.5);
    this.collectedSheepText.x = this.game.width / 2;
    this.collectedSheepText.y = 0 + 50;

    this.uiContainer.addChild(this.collectedSheepText);
    this.game.app.stage.addChild(this.uiContainer);
  }

  update(actualFrames) {
    this.sheepsInFarm = this.game.sheepsInFarm;
    this.collectedSheepText.text = `Ovejas recolectadas: ${this.sheepsInFarm}`;
    this.pointsText.text = `Tiempo: ${(this.game.levelTimer / 60) | 0}`;
  }

  buildGameOverMenu() {
    this.gameOverMenu = new PIXI.Graphics();
    this.gameOverMenu.clear();
    this.gameOverMenu.beginFill("#000000", 1);
    this.gameOverMenu.drawRect(0, 0, this.width, this.height);
    this.gameOverMenu.endFill();

    const gameOverText = new PIXI.Text({
      text: "JUEGO FINALIZADO!",
      style: {
        fontFamily: this.font,
        fontSize: 120 * this.scaleFactor,
        fill: "#1FEBC3",
        align: "center",
        stroke: "#000000",
        strokeThickness: 3,
      },
    });
    gameOverText.anchor.set(0.5);
    gameOverText.x = (this.game.width / 2) * (this.game.isMobile ? 0.9 : 1);
    gameOverText.y = 100;

    const finalPoints = new PIXI.Text({
      text: `Puntaje Final: ${this.sheepsInFarm}`,
      style: {
        fontFamily: this.font,
        fontSize: 40 * this.scaleFactor,
        fill: "#cdcfcc",
        align: "center",
        stroke: "#000000",
        strokeThickness: 3,
      },
    });
    finalPoints.anchor.set(0.5);
    finalPoints.x = this.game.width / 2;
    finalPoints.y = this.game.height / 2 + 300;

    // Estilo para el botón de reinicio
    const restartStyle = new PIXI.TextStyle({
      fontSize: 40 * this.scaleFactor,
      fontFamily: this.font,
      fill: "#cdcfcc", // Color verde para "Restart"
      stroke: "#000000",
      strokeThickness: 3,
    });

    const restartText = new PIXI.Text(`F5 para reiniciar`, restartStyle);
    restartText.anchor.set(0.5);
    restartText.x = this.game.width / 2;
    restartText.y = this.game.height / 2 + 400;

    const pointsStyle = new PIXI.TextStyle({
      fontSize: 40 * this.scaleFactor,
      fontFamily: this.font,
      fill: "#000000",
      stroke: "#cdcfcc",
      strokeThickness: 3,
    });

    /*const topText = new PIXI.Text(`Top puntuaciones:`, restartStyle);
    topText.anchor.set(0.5);
    topText.x = this.game.width / 2;
    topText.y = this.game.height / 2 - 130;

    this.pointsTexts = [];

    const pointsText0 = new PIXI.Text(`Puntuacion0`, restartStyle);
    pointsText0.anchor.set(0.5);
    pointsText0.x = this.game.width / 2;
    pointsText0.y = this.game.height / 2 + 100;

    const pointsText1 = new PIXI.Text(`Puntuacion1`, restartStyle);
    pointsText1.anchor.set(0.5);
    pointsText1.x = this.game.width / 2;
    pointsText1.y = this.game.height / 2 + 130;

    const pointsText2 = new PIXI.Text(`Puntuacion2`, restartStyle);
    pointsText2.anchor.set(0.5);
    pointsText2.x = this.game.width / 2;
    pointsText2.y = this.game.height / 2 + 160;

    const pointsText3 = new PIXI.Text(`Puntuacion3`, restartStyle);
    pointsText3.anchor.set(0.5);
    pointsText3.x = this.game.width / 2;
    pointsText3.y = this.game.height / 2 + 190;

    const pointsText4 = new PIXI.Text(`Puntuacion4`, restartStyle);
    pointsText4.anchor.set(0.5);
    pointsText4.x = this.game.width / 2;
    pointsText4.y = this.game.height / 2 + 220;
    this.pointsTexts.push(pointsText0);
    this.pointsTexts.push(pointsText1);
    this.pointsTexts.push(pointsText2);
    this.pointsTexts.push(pointsText3);
    this.pointsTexts.push(pointsText4);*/

    // Agregar los textos después del fondo, al mismo contenedor
    this.gameOverMenu.addChild(finalPoints);
    this.gameOverMenu.addChild(gameOverText);
    this.gameOverMenu.addChild(restartText);
    /*this.gameOverMenu.addChild(topText);
    this.gameOverMenu.addChild(pointsText0);
    this.gameOverMenu.addChild(pointsText1);
    this.gameOverMenu.addChild(pointsText2);
    this.gameOverMenu.addChild(pointsText3);
    this.gameOverMenu.addChild(pointsText4);
    this.mostrarPuntuaciones();*/

    // Finalmente, agregar el menú al stage
    this.game.app.stage.addChild(this.gameOverMenu);
  }

  //consumir api
  /*async fetchPuntuaciones() {
    try {
      const response = await fetch(
        "https://backend-pixi.vercel.app/top-puntuaciones"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener puntuaciones:", error);
      return [];
    }
  }

  async mostrarPuntuaciones() {
    const puntuaciones = await this.fetchPuntuaciones();

    puntuaciones.forEach((item, index) => {
      const texto = this.pointsTexts[index];
      texto.text = `${index + 1}. ${item.nombre}: ${item.puntuacion}`;
    });
  }*/
}
