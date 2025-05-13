class MainCharacter extends Entity {
    constructor(x, y, game, sprite) {
        super(x, y, game);
        this.width = 12;
        this.height = 10;
        this.texture = sprite;
        
        this.animatedSprites = {};

        this.id = "player";
        this.container.name = this.id;
        this.speedMax = 6;
        this.accMax = 2;

        this.walkAcc = 1;

        this.currentDirection = "front";

        this.animatedSprite();

    }

    animatedSprite() {
        let json  = playerSprite;
        this.animations = {
            front: json.animations["front"],
            back: json.animations["back"],
            left: json.animations["left"],
            right: json.animations["right"],
        };
        this.sprite = new PIXI.AnimatedSprite(this.animations.front);
        this.sprite.animationSpeed = 0.1
        this.sprite.loop = true
        this.sprite.play()
        this.container.addChild(this.sprite)

        this.sprite.anchor.set(0.55, 0.8);
        this.container.pivot.x = this.sprite.anchor.x / 2;
        this.container.pivot.y = this.sprite.anchor.y;
        this.sprite.currentFrame = Math.floor(Math.random() * 5)

        this.ready = true
    }

    makeGraf() {
        this.grafico = new PIXI.Graphics()
            .circle(0, 0, this.raduis)
            .fill(0xff0000);
        this.container.addChild(this.grafico);
    }

    changePlaySpeedOfAnimatedSprite() {
        try {
            this.sprite.animationSpeed = Math.sqrt(this.speed.x ** 2 + this.speed.y ** 2) * 0.025;

        } catch (error) {
            console.log("no esta listo el sprite");
        }
    }

    handleSpriteDirection() {
        let newDirection = this.currentDirection;

        // Calcular la magnitud absoluta del movimiento en X y Y
        const absSpeedX = Math.abs(this.speed.x);
        const absSpeedY = Math.abs(this.speed.y);

        // Si el movimiento horizontal es mayor al vertical
        if (absSpeedX > absSpeedY) {
            if (this.speed.x > 0) newDirection = "right";  // Movimiento hacia la derecha
            else if (this.speed.x < 0) newDirection = "left";  // Movimiento hacia la izquierda
        } else {
            // Si el movimiento vertical es mayor
            if (this.speed.y > 0) newDirection = "front";  // Movimiento hacia abajo
            else if (this.speed.y < 0) newDirection = "back";  // Movimiento hacia arriba
        }

        // Cambiar la animación solo si la dirección es diferente
        if (newDirection !== this.currentDirection) {
            this.sprite.textures = this.animations[newDirection];
            this.sprite.play();
            this.currentDirection = newDirection;
        }

        // Dar vuelta el sprite si va a la izquierda
        if (this.speed.x < 0) {
            this.sprite.scale.x = -1;
            this.sprite.anchor.x = 1;
        } else if (this.speed.x > 0 || newDirection !== "right") {
            this.sprite.scale.x = 1;
            this.sprite.anchor.x = 0;
        }
    }
    moveLeft() {
        this.applyForce(-this.walkAcc, 0);
    }
    moveRight() {
        this.applyForce(this.walkAcc, 0);
    }
    moveUp() {
        this.applyForce(0, -this.walkAcc);
    }
    moveDown() {
        this.applyForce(0, this.walkAcc);
    }
    update(actualFrames) {
        if (!this.ready) return;
        super.update();
        this.handleSpriteDirection();
        this.changePlaySpeedOfAnimatedSprite();
    }
    gameOver() {
        this.game.gameOver();
    }

}


