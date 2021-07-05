kaboom({
    global: true,
    fullscreen: true,
    scale: 1.2,
    debug: true,
    clearColor: [0, 0, 1, 1],
});

loadRoot("https://i.imgur.com/");
loadSprite("coin", "oK9pLe4.png");
loadSprite("evil", "uMgcPCL.png");
loadSprite("brick", "4RXQiBA.png");
loadSprite("block", "mXdUi4q.png");
loadSprite("mario", "FPbuY2w.png");
loadSprite("mushroom", "oI5WtGI.png");
loadSprite("surprise", "g0PliBo.png");
loadSprite("unboxed", "2eLvbFw.png");
loadSprite("pipe-top-left", "14ECLLo.png");
loadSprite("pipe-top-right", "14ECLLo.png");
loadSprite("pipe-bottom-left", "14ECLLo.png");
loadSprite("pipe-bottom-right", "14ECLLo.png");

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
        $: [sprite("coin")],
        "%": [sprite("surprise"), solid(), "coin-surprise"],
        "*": [sprite("surprise"), solid(), "mushroom-surprise"],
        "}": [sprite("unboxed"), solid()],
        "(": [sprite("pipe-bottom-left"), solid(), scale(2.2)],
        ")": [sprite("pipe-bottom-right"), solid()],
        "-": [sprite("pipe-top-left"), solid()],
        "+": [sprite("pipe-top-right"), solid()],
        "^": [sprite("evil"), solid()],
        "#": [sprite("mushroom"), solid()],
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

    const player = add([
        sprite("mario"),
        solid(),
        pos(30, 0),
        body(),
        origin("bot"),
    ]);

    const MOVE_SPEED = 120;
    const JUMP_FORCE = 400;

    keyDown("left", () => {
        player.move(-MOVE_SPEED, 0);
    });
    keyDown("right", () => {
        player.move(MOVE_SPEED, 0);
    });
    keyPress("space", () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE);
        }
    });
});

start("game");
