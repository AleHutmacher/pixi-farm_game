class Farm extends Entity {
    constructor(x, y, game) {

        super(x, y, game);

        this.id = "Farm" + generateRandomID()
        this.container.name = this.id;
        this.width = 715;
        this.height = 426;
        this.staticSprite();
    }

    async staticSprite() {
        this.sprite = new PIXI.Sprite(farmSprite);
        this.sprite.anchor.set(1, 1);
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        this.container.addChild(this.sprite);
        this.ready = true;
    }

    update(actualFrame) {
        super.update();
        this.actions();

    }

    findSheepNearUsingGrid() {
        if (this.cell && this.nearEntities.length > 0) {
            return this.nearEntities.find(entity => 
                entity.isSheep && entity.isActive && !entity.isInFarm
            );
        }
        return null;
    }
    
    actions() {
        let sheep = this.findSheepNearUsingGrid();
        if (sheep) {
            sheep.enterOnFarm();
            console.log("Oveja entró en la granja:", sheep.id);
        }
    }
}