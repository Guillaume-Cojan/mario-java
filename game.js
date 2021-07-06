kaboom({
    global: true,
    fullscreen: true,
    scale: 1.2,
    debug: true,
    clearColor: [0, 0, 1, 1],
});

const MOVE_SPEED = 120;
const JUMP_FORCE = 330;
const BIG_JUMP_FORCE = 450;
let CURRENT_JUMP_FORCE = JUMP_FORCE;

loadRoot("https://i.imgur.com/");
loadSprite("coin", "oK9pLe4.png");
loadSprite("evil", "uMgcPCL.png");
loadSprite("brick", "4RXQiBA.png");
loadSprite("block", "mXdUi4q.png");
loadSprite("mario", "FPbuY2w.png");
loadSprite("mushroom", "oI5WtGI.png");
loadSprite("surprise", "g0PliBo.png");
loadSprite("unboxed", "2eLvbFw.png");
loadSprite("pipe-top-left", "Y8r4Fhh.png");
loadSprite("pipe-top-right", "Y8r4Fhh.png");
loadSprite("pipe-bottom-left", "Y8r4Fhh.png");
loadSprite("pipe-bottom-right", "Y8r4Fhh.png");

scene("game", () => {
    layer(["bg", "obj", "ui"], "obj");

    const map = [
        "                                                ",
        "                                                ",
        "                                                ",
        "          %                                     ",
        "                                                ",
        "                                                ",
        "                                                ",
        "          =====     %                           ",
        "                                                ",
        "                                                ",
        "                                                ",
        "                 =====                          ",
        "                                                ",
        "                                               =",
        "     %   =*=%=                                 =",
        "                             ===               =",
        "                                      (        =",
        "=                ^      ^                      =",
        "=======  =======================    ============",
    ];

    const levelCfg = {
        width: 20,
        height: 20,
        "=": [sprite("block"), solid()],
        $: [sprite("coin"), "coin"],
        "%": [sprite("surprise"), solid(), "coin-surprise"],
        "*": [sprite("surprise"), solid(), "mushroom-surprise"],
        "}": [sprite("unboxed"), solid()],
        "(": [sprite("pipe-bottom-left"), solid(), scale(2.2)],
        ")": [sprite("pipe-bottom-right"), solid()],
        "-": [sprite("pipe-top-left"), solid()],
        "+": [sprite("pipe-top-right"), solid()],
        "^": [sprite("evil"), solid(), scale(1.2)],
        "#": [sprite("mushroom"), solid(), "mushroom", body()],
    };

    const gameLevel = addLevel(map, levelCfg);

    const scoreLabel = add([
        text("score:"),
        pos(30, 6),
        layer("ui"),
        {
            value: "score:",
        },
    ]);

    add([text("level" + "1", pos(4, 6))]);

    function big() {
        let timer = 0;
        let isBig = false;
        return {
            update() {
                if (isBig) {
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
                    timer -= dt();
                    if (timer <= 0) {
                        this.smallify();
                    }
                }
            },
            isBig() {
                return isBig;
            },
            smallify() {
                CURRENT_JUMP_FORCE = JUMP_FORCE;
                this.scale = vec2(1.4);
                timer = 0;
                isBig = false;
            },
            biggify(time) {
                this.scale = vec2(2);
                timer = time;
                isBig = true;
            },
        };
    }

    const player = add([
        sprite("mario"),
        solid(),
        scale(1.4),
        pos(30, 0),
        body(),
        big(),
        origin("bot"),
    ]);

    action("mushroom", (m) => {
        m.move(15, 0);
    });

    player.on("headbump", (obj) => {
        if (obj.is("coin-surprise")) {
            gameLevel.spawn("$", obj.gridPos.sub(0, 1));
            destroy(obj);
            gameLevel.spawn("}", obj.gridPos.sub(0, 0));
        }
        if (obj.is("mushroom-surprise")) {
            gameLevel.spawn("#", obj.gridPos.sub(0, 1));
            destroy(obj);
            gameLevel.spawn("}", obj.gridPos.sub(0, 0));
        }
    });

    player.collides("mushroom", (m) => {
        destroy(m);
        player.biggify(10);
    });

    player.collides("coin", (c) => {
        destroy(c);
        scoreLabel.value++;
        scoreLabel.text = scoreLabel.value;
    });

    keyDown("left", () => {
        player.move(-MOVE_SPEED, 0);
    });
    keyDown("right", () => {
        player.move(MOVE_SPEED, 0);
    });
    keyPress("space", () => {
        if (player.grounded()) {
            player.jump(CURRENT_JUMP_FORCE);
        }
    });
});

start("game");
