function limitMagnitude(vector, maxMagnitude) {
    // Calcular la magnitud actual del vector
    const currentMagnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

    // Si la magnitud actual es mayor que la máxima permitida, limitar el vector
    if (currentMagnitude > maxMagnitude) {
        const scale = maxMagnitude / currentMagnitude;
        vector.x *= scale;
        vector.y *= scale;
    }

    return vector;
}

function generateRandomID(length = 8) {
    // Conjunto de caracteres alfanuméricos (mayúsculas, minúsculas y dígitos)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    // Genera un ID al azar
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}

function distance(obj1, obj2) {
    return Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
}

function calcDistance(obj1, obj2) {
    if (obj1.id == obj2.id) return 0;
    return distance(obj1, obj2);
}

function normalizeVector(vector) {
    // Calcula la magnitud del vector
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

    // Si la magnitud es 0, devuelve el vector original (o maneja el caso de magnitud cero de otra manera)
    if (magnitude === 0) {
        return vector;
    }

    // Divide cada componente del vector por la magnitud
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude,
    };
}

function isOverlap(rect1, rect2) {
    const { x: x1, y: y1, width: w1, height: h1 } = rect1;
    const { x: x2, y: y2, width: w2, height: h2 } = rect2;

    const rect1Left = x1 - w1 / 2;
    const rect1Right = x1 + w1 / 2;
    const rect1Top = y1;
    const rect1Bottom = y1 + h1;

    const rect2Left = x2 - w2 / 2;
    const rect2Right = x2 + w2 / 2;
    const rect2Top = y2;
    const rect2Bottom = y2 + h2;

    const isOverlapping = rect1Left < rect2Right &&
        rect1Right > rect2Left &&
        rect1Top < rect2Bottom &&
        rect1Bottom > rect2Top;

    return isOverlapping;
}

function isOverlapCircle(circle1, circle2) {
    const { x: x1, y: y1, radius: r1 } = circle1;
    const { x: x2, y: y2, radius: r2 } = circle2;

    // Calcula la diferencia en las coordenadas
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Calcula el cuadrado de la distancia entre los centros
    const distanceSquared = dx * dx + dy * dy;

    // Calcula el cuadrado de la suma de los radios
    const radiusSum = r1 + r2;
    const radiusSumSquared = radiusSum * radiusSum;

    // Verifica si el cuadrado de la distancia es menor o igual al cuadrado de la suma de los radios
    return distanceSquared <= radiusSumSquared;
}


function arrayUnique(arr) {
    return [...new Set(arr)];
}

function mixArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function lerp(a, b, t) {
    t = Math.max(0, Math.min(1, t));

    return a + (b - a) * t;
}

async function setUp() {
    try {
        // Mostrar pantalla de carga
        this.showLoadingScreen();

        // Inicializar y cargar recursos
        await PIXI.Assets.init({ manifest: "./Sprites/manifest.json" });
        await this.loadGameElements();

        // Cargar música
        this.loadMusic();

        // Verificar que todo está listo
        if (
            this.playerReady &&
            this.enemyReady &&
            this.backgroundReady &&
            this.farmReady
        ) {
            // Emitir evento cuando los recursos estén listos
            const event = new Event("resourcesLoaded");
            window.dispatchEvent(event);
        } else {
            throw new Error("Algunos recursos no se cargaron correctamente.");
        }

        // Ocultar pantalla de carga
        this.hideLoadingScreen();

    } catch (error) {
        console.error("Error al configurar el juego:", error);
    }
}

async function loadGameElements() {
    await Promise.all([
        this.loadPlayer(),
        this.loadSheeps(),
        this.loadBackground(),
        this.loadFarm()
    ]);
}

function showLoadingScreen() {
    const loadingScreen = document.createElement("div");
    loadingScreen.id = "loading-screen";
    loadingScreen.style.position = "fixed";
    loadingScreen.style.top = "0";
    loadingScreen.style.left = "0";
    loadingScreen.style.width = "100%";
    loadingScreen.style.height = "100%";
    loadingScreen.style.backgroundColor = "000";
    loadingScreen.style.display = "flex";
    loadingScreen.style.justifyContent = "center";
    loadingScreen.style.alignItems = "center";
    loadingScreen.style.color = "#fff";
    loadingScreen.style.fontFamily = "Silkscreen,Arial, sans-serif";
    loadingScreen.style.fontSize = "24px";
    loadingScreen.innerText = "Cargando...";
    document.body.appendChild(loadingScreen);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        document.body.removeChild(loadingScreen);
    }
}

async function loadPlayer() {
    let resources = await PIXI.Assets.loadBundle('player-bundle');
    this.playerSprite = resources["character"]
    this.playerReady = true;
}

async function loadSheeps() {
    let resources = await PIXI.Assets.loadBundle('sheep-bundle');
    this.sheepSprite = resources["sheep"];
    this.enemyReady = true;
}

async function loadBackground() {
    let resources = await PIXI.Assets.loadBundle('bakground-bundle');
    this.backgroundSprite = resources["background"]
    this.backgroundSprite.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.backgroundReady = true;
}

async function loadFarm() {
    let resources = await PIXI.Assets.loadBundle('farm-bundle');
    this.farmSprite = resources["farm"]
    this.farmSprite.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.farmReady = true;
}

function loadMusic() {
    // Cargar la música de fondo
    this.backgroundMusic = new Audio('Sound/Music.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.04;
}