class Entity {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;

        this.container = new PIXI.Container();
        this.container.name = "MainContainer"
        this.innerContainer = new PIXI.Container();
        this.innerContainer.name = "innerContainer"
        this.container.addChild(this.innerContainer);

        this.game = game;
        this.game.mainContainer.addChild(this.container);

        this.cell;
        this.nearEntities = [];

        this.vision = 100;
        this.ready = false;

        this.speed = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
    }

    checkLimitScreen() {
        let margin = 50;
        if (this.x > this.game.backgroundSize.x - margin) {
            //margen derecho
            this.speed.x = -Math.abs(this.speed.x)
        } else if (this.x < margin) {
            //margen izq
            this.speed.x = Math.abs(this.speed.x)
        }

        if (this.y > this.game.backgroundSize.y - margin) {
            this.speed.y = -Math.abs(this.speed.y)
        } else if (this.y < margin) {
            this.speed.y = Math.abs(this.speed.y)
        }


    }

    update() {
        if (!this.ready) return

        this.acc = limitMagnitude(this.acc, this.accMax);
        this.speed.x += this.acc.x;
        this.speed.y += this.acc.y;
        this.acc.x = 0;
        this.acc.y = 0;

        this.speed = limitMagnitude(this.speed, this.speedMax);

        this.changeZOrder()

        this.x += this.speed.x;
        this.y += this.speed.y;
        this.checkLimitScreen();

        this.friction()
        this.refreshPositionOnGrid();

    }


    applyForce(x, y) {
        this.acc.x += x;
        this.acc.y += y;
    }

    render() {
        this.innerContainer.rotation = this.angulo;
        this.container.x = this.x;
        this.container.y = this.y;
    }

    friction() {
        this.speed.x *= 0.9;
        this.speed.y *= 0.9;
    }

    changeZOrder() {
        this.container.zIndex = this.y
    }

    InTheSameCellPreviousFrame() {
        if (isNaN(this.xPrevious) || isNaN(this.yPrevious)) return false;

        let gridX = Math.floor(this.x / this.game.cellSize);
        let gridY = Math.floor(this.y / this.game.cellSize);

        let gridXPrevious = Math.floor(this.xPrevious / this.game.cellSize);
        let gridYPrevious = Math.floor(this.yAnterior / this.game.cellSize);

        if (gridX == gridXPrevious && gridY == gridYPrevious) {
            return true;
        }

        return false;
    }

    refreshPositionOnGrid() {
        this.game.grid.updateEntityPosition(this);
    }

    findNearSheepsUsingGrid() {
        let ret = [];
        if (this.cell) {
            for (let i = 0; i < this.nearEntities.length; i++) {
                let dep = this.nearEntities[i];
                if ((dep.id.substring(0, 5) == "Sheep") && dep != this) {
                    let dist = calcDistance(dep, this);
                    ret.push({ sheep: dep, dist: dist });
                }
            }
        } else {
            return [];
        }

        return ret;
    }
}