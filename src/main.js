require('gsap');
var loadRube = require('./loadrube');
var Box2D = require("box2dweb");

'use strict';

var b2Common = Box2D.Common,
    b2Math = Box2D.Common.Math,
    b2Collision = Box2D.Collision,
    b2Shapes = Box2D.Collision.Shapes,
    b2Dynamics = Box2D.Dynamics,
    b2Contacts = Box2D.Dynamics.Contacts,
    b2Controllers = Box2D.Dynamics.Controllers,
    b2Joints = Box2D.Dynamics.Joints;

var w = window.innerWidth,
    h = window.innerHeight,
    SCALE = 200, // pixels per metre
    world,
    debugOn = false;

window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

init();

function init() {
    world = new b2Dynamics.b2World(new b2Math.b2Vec2(0, 10), true);

    // add debug canvas if necessary
    if (debugOn) {
        addDebugCanvas();
    }

    createWallsAndFloor();

    // create display obejct
    var div = document.createElement('div');
    div.style.width = '40px';
    div.style.height = '40px';
    div.style.marginTop = '-20px';
    div.style.marginLeft = '-20px';

    document.body.appendChild(div);

    // create body
    var boxBody = createBox(40);
    boxBody.SetUserData(div);

    // div needs a reference to body for adding mouse joint
    div.body = boxBody;

    // start rendering
    tick();
}

function createWallsAndFloor() {
    // create walls and floor
    var fixDef = new b2Dynamics.b2FixtureDef();
    fixDef.density = 1;
    fixDef.friction = .5;

    var bodyDef = new b2Dynamics.b2BodyDef();
    bodyDef.type = b2Dynamics.b2Body.b2_staticBody;

    // FLOOR
    var floorShape = new b2Shapes.b2PolygonShape();
    floorShape.SetAsBox(w / 2 / SCALE, 10 / SCALE);

    fixDef.shape = floorShape;

    bodyDef.position.x = w / 2 / SCALE;
    bodyDef.position.y = (h + 10) / SCALE;

    var floor = world.CreateBody(bodyDef);
    floor.CreateFixture(fixDef);

    // WALLS
    var wallShape = new b2Shapes.b2PolygonShape();
    wallShape.SetAsBox(10 / SCALE, h / 2 / SCALE);

    // left wall
    fixDef.shape = wallShape;

    bodyDef.position.x = -10 / SCALE;
    bodyDef.position.y = h / 2 / SCALE;

    var leftWall = world.CreateBody(bodyDef);
    leftWall.CreateFixture(fixDef);

    // right wall
    bodyDef.position.x = (w + 10) / SCALE;

    var rightWall = world.CreateBody(bodyDef);
    rightWall.CreateFixture(fixDef);
}

function createBox(size) {
    var bodyDef = new b2Dynamics.b2BodyDef();
    bodyDef.type = b2Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.x = Math.random() * w / SCALE;
    bodyDef.position.y = 0;

    var shape = new b2Shapes.b2PolygonShape();
    shape.SetAsBox(size / 2 / SCALE, size / 2 / SCALE);

    var fixDef = new b2Dynamics.b2FixtureDef();
    fixDef.density = 1;
    fixDef.friction = .5;
    fixDef.restitution = .25;
    fixDef.shape = shape;

    var boxBody = world.CreateBody(bodyDef);
    boxBody.CreateFixture(fixDef);

    boxBody.SetAngularVelocity(Math.random() * 10 - 5);

    return boxBody;
}

function addDebugCanvas() {
    var debugCanvas = document.createElement('canvas');
    debugCanvas.className = 'debug-canvas';
    debugCanvas.width = w;
    debugCanvas.height = h;
    document.body.appendChild(debugCanvas);

    var debugDraw = new b2Dynamics.b2DebugDraw();
    debugDraw.SetSprite(debugCanvas.getContext('2d'));
    debugDraw.SetFillAlpha(.35);
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFlags(b2Dynamics.b2DebugDraw.e_shapeBit | b2Dynamics.b2DebugDraw.e_jointBit);

    world.SetDebugDraw(debugDraw);
}

function tick() {
    world.Step(1 / 60, 8, 2);
    world.ClearForces();

    var div;

    for (var body = world.GetBodyList(); body; body = body.GetNext()) {
        if (body.GetType() == b2Dynamics.b2Body.b2_dynamicBody) {
            div = body.GetUserData();

            // set position
            div.style.left = body.GetPosition().x * SCALE + 'px';
            div.style.top = body.GetPosition().y * SCALE + 'px';

            // set rotation
            div.style.webkitTransform =
                div.style.mozTransform =
                    div.style.oTransform =
                        div.style.msTransform =
                            div.style.transform =
                                'rotate(' + body.GetAngle() + 'rad)';
        }
    }

    // draw debug data if using debug canvas
    if (debugOn) {
        world.DrawDebugData();
    }

    requestAnimFrame(tick);
}