class Sheep extends Entity {
    constructor(x, y, game) {

        super(x, y, game);

        this.id = "Sheep" + generateRandomID()
        this.container.name = this.id;
        this.width = 22;
        this.height = 20;

        this.speedMax = 0;
        this.accMax = 1;


        this.factorGroup = 0.01;
        this.separationFactor = 0.05;
        this.limitToBeClose = 50;
        this.alignFactor = 0.03;
        this.averagePositionVector = { x: 0, y: 0 };

        this.chaseFactor = 2;

        this.isInFarm = false;
        this.isSheep = true;
        this.expGain = false;
        this.isActive = true;
        this.animatedSprite();
    }
    async animatedSprite() {
        let json = sheepSprite;
        this.animations ={
            run: json.animations["run"],
            idle: json.animations["idle"]
        }
        this.sprite = new PIXI.AnimatedSprite(this.animations["idle"]);
        this.sprite.animationSpeed = 0.07;
        this.sprite.loop = true;
        this.sprite.play();
        this.container.addChild(this.sprite);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.height = this.sprite.height;
        this.sprite.width = this.sprite.width;
        this.container.pivot.x = this.sprite.anchor.x;
        this.container.pivot.y = this.sprite.anchor.y;
        this.sprite.currentFrame = Math.floor(Math.random() * 2)
        this.ready = true
    }

    cambiarVelocidadDeReproduccionDelSpriteAnimado() {
        this.sprite.animationSpeed = Math.abs(this.speed.x) * 0.1
    }

    handleSpriteDirection(){
        if (this.speedMax > 0) {
            this.sprite.textures = this.animations["run"]
            this.sprite.play();
        }
        else {
            this.sprite.textures = this.animations["idle"]
        }
    }


    update(actualFrame) {
        if (!this.ready || !this.isActive || this.isInFarm) return
        super.update();
        if (!this.isSheep) return;
        this.sheepsNear = this.findNearSheepsUsingGrid();
        this.cohesion(this.sheepsNear);
        this.separation(this.sheepsNear);
        this.alignment(this.sheepsNear);
        this.actions();
        this.handleSpriteDirection();

        this.fixMap();

    }

    fixMap() {
        if (this.x > this.game.backgroundSize.x || this.x < 0) {
            this.x = this.game.backgroundSize.x / 2
        }
        if (this.y > this.game.backgroundSize.y || this.y < 0) {
            this.y = this.game.backgroundSize.y / 2
        }
    }

    actions() {
        let player = this.findPlayerNearUsingGrid();
        if (player) {
            let findNearSheepsPlayer = player.findNearSheepsUsingGrid();
            if (player.findNearSheepsUsingGrid().length > 0 &&
            findNearSheepsPlayer.every(sheep => sheep.sheep.isSheep)
            ) {
                this.chase(player);
                this.speedMax = 5;
            } 
        }else {
            this.speedMax = 0;
        }
    }

    cohesion(sheepsNear) {
        if (sheepsNear.length == 0) return;

        let avgX = 0;
        let avgY = 0;
        let total = 0;
        for (let sheep of sheepsNear) {
            if (sheep.dist > this.limitToBeClose) {
                total++;
                avgX += sheep.sheep.x;
                avgY += sheep.sheep.y;
            }
        }

        if (total == 0) return;

        avgX /= total;
        avgY /= total;

        this.PointsToAveragePositionsForGrouping = {
            x: avgX - this.x,
            y: avgY - this.y,
        };

        this.applyForce(
            this.PointsToAveragePositionsForGrouping.x *
            this.factorGroup,
            this.PointsToAveragePositionsForGrouping.y *
            this.factorGroup
        );
    }

    separation(sheepsNear) {
        let avgX = 0;
        let avgY = 0;

        if (sheepsNear.length == 0) return;

        let total = 0;
        for (let sheep of sheepsNear) {
            if (sheep.dist < this.limitToBeClose) {
                total++;
                avgX += sheep.sheep.x;
                avgY += sheep.sheep.y;
            }
        }
        if (total == 0) return;

        avgX /= total;
        avgY /= total;

        this.averagePositionVector = {
            x: this.x - avgX,
            y: this.y - avgY,
        };

        this.applyForce(
            this.averagePositionVector.x * this.separationFactor,
            this.averagePositionVector.y * this.separationFactor
        );
    }

    alignment(sheepsNear) {
        if (sheepsNear.length == 0) return;

        let avgSpeedX = 0;
        let avgSpeedY = 0;

        for (let sheep of sheepsNear) {
            avgSpeedX += sheep.sheep.speed.x;
            avgSpeedY += sheep.sheep.speed.y;
        }

        avgSpeedX /= sheepsNear.length;
        avgSpeedY /= sheepsNear.length;

        this.averageSpeedsOfNeighbors = { x: avgSpeedX, y: avgSpeedY };

        let force = {
            x: this.averageSpeedsOfNeighbors.x - this.speed.x,
            y: this.averageSpeedsOfNeighbors.y - this.speed.y,
        };

        this.applyForce(
            force.x * this.alignFactor,
            force.y * this.alignFactor
        );
    }

    chase(player) {
        if (!player || !player.ready) return;

        let vectorToTarget = { x: player.x - this.x, y: player.y - this.y };

        // Normalizar el vector
        let normalizedVector = normalizeVector(vectorToTarget);

        // El vector de velocidad para llegar al objetivo
        let normalizedWishSpeed = {
            x: normalizedVector.x * this.chaseFactor,
            y: normalizedVector.y * this.chaseFactor,
        };

        this.applyForce(normalizedWishSpeed.x, normalizedWishSpeed.y);


        if (normalizedWishSpeed.x > 0) {
            this.sprite.scale.x = 1;
        } else if (normalizedWishSpeed.x < 0) {
            this.sprite.scale.x = -1;
        }
    }

    findPlayerNearUsingGrid() {
        if (this.cell) {
            if (this.nearEntities.length > 0) {
                return this.nearEntities.find(entity => entity.id.substring(0, 42) == "player");
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    destroy() {
        this.cell.delete(this);
        this.game.sheeps = this.game.sheeps.filter((k) => k.id != this.id);
        this.game.mainContainer.removeChild(this.container);
        this.sprite.destroy();
        this.container.destroy()
        this.expGain = true;
    }

    enterOnFarm(){
        this.game.sheepsInFarm += 1;
        this.soundEffect();
        this.destroy();
    }

    soundEffect(){
        this.sound = new Audio('Sound/sound-effect.mp3')
        this.sound.volume = 0.1;
        this.sound.loop = false;
        this.sound.play();  
    }
}

