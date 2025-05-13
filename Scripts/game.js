class Game {
    constructor() {
        let navegador = navigator.userAgent;

        this.app = new PIXI.Application();
        this.cellSize = 180;
        this.cellSize = 180;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.backgroundSize = { x: this.cellSize * 17, y: this.cellSize * 8 };
        this.scale = 1;

        loadMusic();

        this.sheeps = [];
        this.keysPressed = {};

        let promise = this.app.init({ width: this.width, height: this.height });

        this.app.stage.sortableChildren = true;
        promise.then(e => {
            document.body.appendChild(this.app.canvas);
            window.__PIXI_APP__ = this.app;
            setUp();

            window.addEventListener("resourcesLoaded", () => {
                this.uiManager = new UIManager(this);
                this.uiManager.createMainMenu()
            })
        })
    }

    loadBackground() {
        // Create a sprite from the loaded texture
        const background = new PIXI.Sprite(backgroundSprite);
        background.zIndex = -999999999999;

        // Set the position and size of the background


        background.anchor.set(0, 0);
        background.width = this.backgroundSize.x;
        background.height = this.backgroundSize.y;
        background.x = 0;
        background.y = 0;

        this.mainContainer.addChild(background);
    }


    startGame() {
        this.mainContainer = new PIXI.Container();
        this.mainContainer.name = "mainContainer";

        this.app.stage.addChild(this.mainContainer);

        this.sketcher = new PIXI.Graphics();
        this.mainContainer.addChild(this.sketcher);

        this.sheepsAmount = 20;
        this.frameCounter = 0;
        this.isPaused = false;
        this.isGameOver = false;
        this.restantSheeps = this.sheepsAmount;
        this.levelTimer = 4000
        this.sheepsInFarm = 0


        this.loadBackground();
        this.listeners();
        this.grid = new Grid(this, this.cellSize);

        this.placePlayer();
        this.placeFarm();
        this.placeSheeps(this.sheepsAmount);

        this.uiManager.createGameplayUI();

        this.app.ticker.add((e) => {
            this.gameLoop(e);
        });

    }

    coutDown(){
        this.levelTimer -= 1;
        console.log((this.levelTimer/60) |0)
        if (this.levelTimer < 0 || this.sheepsInFarm == this.sheepsAmount) {
            this.gameOver()
        }
    }

    listeners() {
        window.onkeydown = (e) => {
            if (e.key == "Escape") {
                this.pause();
            } else {
                this.keysPressed[e.key] = true;
            }
        };

        window.onkeyup = (e) => {
            this.keysPressed[e.key] = false;
        };

    }

    sheepsInFarm(){
        let sheepsInFarm = [];
        for (let sheep of this.sheeps){
            if (sheep.isInFarm){
                sheepsInFarm.push(sheep)
            }
        }
        return sheepsInFarm;
    }

    handleMovement() {
            if (this.keysPressed["w"] || this.keysPressed["W"]) this.player.moveUp();
            if (this.keysPressed["s"] || this.keysPressed["S"]) this.player.moveDown();
            if (this.keysPressed["a"] || this.keysPressed["A"]) this.player.moveLeft();
            if (this.keysPressed["d"] || this.keysPressed["D"]) this.player.moveRight();
    }

    gameLoop() {
        if (this.player.ready) {
            if (!this.isPaused) {
                this.frameCounter++;
                this.handleMovement();
                this.playerLoop(this.frameCounter);
                this.sheepsLoop(this.frameCounter);
                this.farmLoop(this.frameCounter);
                this.moveCamera();
                this.uiLoop();
                this.coutDown();
            }
        }
    }



    opposite() {
        switch (this.player.currentDirection) {
            case "right": return "left";
            case "left": return "right";
            case "front": return "back";
            case "back": return "front";
            default: return this.player.currentDirection;
        }
    }

    uiLoop(frameCounter){
        this.uiManager.update()
    }


    playerLoop(frameCounter) {
        this.player.update(frameCounter);
        this.player.render();
    }

    sheepsLoop(frameCounter) {
        for (let sheep of this.sheeps) {
            sheep.update(frameCounter);
            sheep.render();
        }
    }

    farmLoop(frameCounter){
        this.farm.update(frameCounter);
        this.farm.render();
    }

    placePlayer() {
        this.player = new MainCharacter(this.backgroundSize.x / 2, this.backgroundSize.y / 2, this, this.playerSprite);
    }

    placeFarm() {
        this.farm = new Farm(this.player.x, this.player.y, this);
        console.log("Granja creada en:", this.farm.x, this.farm.y);
    }


    moveCamera() {
        let playerX = this.player.container.x;
        let playerY = this.player.container.y;

        const halfWindowWidth = window.innerWidth / 2;
        const halfWindowHeight = window.innerHeight / 2;

        // Límites de la cámara
        const minX = 0;
        const maxX = (this.backgroundSize.x - halfWindowWidth - 650);
        const minY = 0;
        const maxY = (this.backgroundSize.y - halfWindowHeight - 300);

        let targetX = playerX - halfWindowWidth;
        let targetY = playerY - halfWindowHeight;

        // Ajustar la posición objetivo para que no salga de los límites
        if (targetX < minX) targetX = minX;
        if (targetX > maxX) targetX = maxX;
        if (targetY < minY) targetY = minY;
        if (targetY > maxY) targetY = maxY;

        // Aplicar el lerp para suavizar el movimiento
        this.mainContainer.pivot.x = lerp(this.mainContainer.pivot.x, targetX, 0.1);
        this.mainContainer.pivot.y = lerp(this.mainContainer.pivot.y, targetY, 0.1);
        this.mainContainer.scale.set(this.scale);
    }


    gameOver() {
        this.app.ticker.stop();
        backgroundMusic.pause()
        this.isGameOver = true;
        this.app.stage.removeChild(this.uiManager.uiContainer);
        this.uiManager.buildGameOverMenu();
    }

    removePlayer() {
        this.mainContainer.removeChild(this.player);
        this.player.sprite.stop()
        this.player.destruction();
    }

    placeSheeps(number = 10) {
        for (let i = 0; i < number; i++) {
            let sheep = new Sheep(Math.random() * this.backgroundSize.x, Math.random() * this.backgroundSize.y, this);
            this.sheeps.push(sheep);
        }
    }

    addSheepsToFarm(){
        for (let sheep of this.sheeps){
            sheep.isInFarm = true;
        }
    }

}