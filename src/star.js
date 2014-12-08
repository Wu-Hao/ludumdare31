var EARTH = 15;
var EORB  = 10;
//              sun,    mercury         venus    Earth   Mars               jupiter         saturn  uranus  neptune pluto
var scales = [  80,    EARTH*0.38,   EARTH*0.9,  EARTH,  EARTH*0.533,       EARTH*2.2,     EARTH*2,     20,     15,     10];
var dtss   = [   0,     57,             108,     149,     228,              500,            600,      700,   800,    900];
var OPs    = [  0,      EORB *.2,      EORB*.6,  EORB,   EORB*1.8,          EORB*5,         EORB*7,  EORB*9,  EORB*12,  EORB*25];
var ZERO = cc.p(0,0);
var FORCES = {NEUTRAL:0,HUMAN:1, ALIEN:2};
var smallShipProduction = [0, 1, 1.5, 2.0];
var medShipProduction =   [0, 0.1, 0.15, 0.3];
var bigShipProduction =   [0, 0.02, 0.05,    0.15];
var SPEEDS           =   [15, 40, 80, 120];
var NEUTRALCOLOR = cc.color(0,0,0,200);
var HUMANCOLOR = cc.color(255,210,0,200);
var ALIENCOLOR = cc.color(255,86,99,200);
var COSTS = [100, 200, 300];


var Star = cc.Node.extend({
    mass:1,
    radius:10,
    onEnter:function(){
        this._super();
        //this._setRadius();
        this._makeRounded();
    },
    _makeRounded:function(){
        if(Star.whRate && this.sprite)
        {
            this.sprite.setScaleY(this.sprite.getScale()*Star.whRate);
        }

    }
});

var Planet = Star.extend({
    dts:100,//distance to sun
    orbitPeriod:10,//10 second to orbit the sun
    radius:0,
    startAngle:1,
    curAngle:0,
    _orbitSpeed:0,

    //stats
    terraforming:[0,0,0,0],
    smallShipProd:[1,1,1,1],
    medShipProd:[0.1,0.2,0.3],
    bigShipProd:[0.02,0.04, 0.08],
    maxBases:[1,1,1,1],

    //currentstats
    curBase:0,
    curPopulation:0,
    side:FORCES.NEUTRAL,

    humanShips:{sml:0, med:0, big:0},
    alienShips:{sml:0, med:0, big:0},
    ctor:function(){
        this._super();
        this.curAngle = 2*Math.PI*Math.random();
        this.scheduleUpdate();
        this._dts = cc.p(this.dts,0);
        this._orbitSpeed = 2*Math.PI/this.orbitPeriod;
        this.humanShips={sml:0, med:0, big:0};
        this.alienShips={sml:0, med:0, big:0};
        this.hship = new cc.ParticleSystem(res.ships);
        this.hship.setPositionType(cc.ParticleSystem.TYPE_GROUPED);
//        this.hship.setBlendAdditive(true);
        this.hship.setEmissionRate(Infinity);
        this.hship.setStartRadius(this.radius*1.3);
        this.hship.setEndRadius(this.radius*1.3);
//        this.hship.setTotalParticles(this.getNumOfShips(FORCES.HUMAN));
//        this.hship.setTotalParticles(100);
        this.hship._totalParticles = 0;
        this.hship.setPosition(0,0);
        this.hship.setStartColor(HUMANCOLOR);
        this.hship.setEndColor(HUMANCOLOR);
        this.addChild(this.hship);

        this.aship = new cc.ParticleSystem(res.ships);
        this.aship.setPositionType(cc.ParticleSystem.TYPE_GROUPED);
//        this.hship.setBlendAdditive(true);
        this.aship.setEmissionRate(Infinity);
        this.aship.setStartRadius(this.radius*1.3);
        this.aship.setEndRadius(this.radius*1.3);
//        this.hship.setTotalParticles(this.getNumOfShips(FORCES.HUMAN));
//        this.hship.setTotalParticles(100);
        this.aship._totalParticles = 0;
        this.aship.setPosition(0,0);
        this.aship.setStartColor(ALIENCOLOR);
        this.aship.setEndColor(ALIENCOLOR);
        this.addChild(this.aship);
    },
    update:function(dt){
        this.curAngle -= this._orbitSpeed*dt;
        //var pos = cc.pAdd(cc.pRotateByAngle(cc.p(100,0), cc.p(0,0), this.curAngle), cc.visibleRect.center);
        var pos = cc.pRotateByAngle(this._dts, ZERO, this.curAngle);
        this.setPosition(pos);
        this.setLocalZOrder(-pos.y);

        if(this.shadow)
        {
            this.shadow.setRotation(cc.radiansToDegrees(-this.curAngle)+180);
        }
    },
    enableShadow:function(){
        this.shadow = new cc.Sprite(res.shadow);
        this.sprite.addChild(this.shadow);
        var spWidth = this.sprite.getContentSize().width;
        this.shadow.attr({
            x:spWidth/2,
            y:spWidth/2,
            scale:this.radius/EARTH
        });
    },
    getCurProduction:function(){
        var small = this.curBase;
        var med   = this.curBase;
        var big   = this.curBase;
        if(this.side === FORCES.HUMAN)
        {
            small *= smallShipProduction[Game.human.production];
            if(Game.human.spaceShip > 1)
                med   *= medShipProduction[Game.human.production];
            else
                med = 0;

            if(Game.human.spaceShip > 2)
                big   *= bigShipProduction[Game.human.production];
            else
                big = 0;
        }
        else if(this.side === FORCES.ALIEN){
            small *= smallShipProduction[3]*1.5;
            med   *= medShipProduction[1];
            big   *= bigShipProduction[1];
        }
        else{
            small = big = med =0;
        }
        return {sml:small, med:med, big:big};
    },
    getNumOfShips:function(force){
        if(force === FORCES.HUMAN)
        return this.humanShips.sml + this.humanShips.med + this.humanShips.big;
        else
        return this.alienShips.sml + this.alienShips.med + this.alienShips.big;
    },
    updateShipParticle:function(){
        if(this.hship){
            //this.hship.setTotalParticles(this.getNumOfShips(FORCES.HUMAN));
            this.hship._totalParticles = (cc.clampf(this.getNumOfShips(FORCES.HUMAN),0,100));
//            console.log(this.getNumOfShips(FORCES.HUMAN));
        }
        if(this.aship){
            this.aship._totalParticles = (cc.clampf(this.getNumOfShips(FORCES.ALIEN),0,100));
        }



        //
    }
});


var Sun = Star.extend({
    mass: Infinity,
    radius:scales[0],
    sprite:null,
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.sol);
        this.sprite.setBlendFunc(cc.SRC_ALPHA,cc.ONE);
        this.addChild(this.sprite);
        //this._setRadius()
        Sun.ins = this;
    }
});

var Mercury = Planet.extend({
    dts:dtss[1],
    orbitPeriod:OPs[1],
    radius:scales[1],
    terraforming:[0,1,3,5],
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.mercury);
        this.sprite.setColor(new cc.Color(255, 100, 255));
        this.addChild(this.sprite);
        Mercury.ins = this;
    },
    update:function(dt){
        this.curAngle -= this._orbitSpeed*dt;
        //var pos = cc.pAdd(cc.pRotateByAngle(cc.p(100,0), cc.p(0,0), this.curAngle), cc.visibleRect.center);
        var pos = cc.pRotateByAngle(this._dts, ZERO, this.curAngle);
        this.setPosition(pos);
        this.setLocalZOrder(-pos.y);

//        this.setColor(cc.color(1-this.dts+pos.y));
        var perc = cc.clampf((pos.y+this.dts)/(this.dts*2), 0, 1);
        this.sprite.setColor(cc.color(255*perc, 255*perc, 255*perc));
    }
});
Mercury.str = "Mercury";
Mercury.UIsp = res.mercuryUI;

var Venus = Planet.extend({
    dts:dtss[2],
    orbitPeriod:OPs[2],
    radius:scales[2],
    terraforming:[0,3,5,15],
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.venus);
        this.addChild(this.sprite);
        this.enableShadow();
        Venus.ins = this;
    }
});
Venus.str = "Venus";
Venus.UIsp = res.venusUI;

var Earth = Planet.extend({
    dts:dtss[3],
    orbitPeriod:OPs[3],
    radius:EARTH,
    shadow:null,
    //earth stats
    terraforming:[60,60,60,60],
    smallShipProd:[1,1,1,1],
    medShipProd:[0.1,0.2,0.3],
    bigShipProd:[0.02,0.04, 0.08],
    maxBases:[1,2,2,3],

    //currentstats
    curBase:1,
    curPopulation:60,
    side:FORCES.HUMAN,
    hship:null,
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.earth);
        this.addChild(this.sprite);
        this.enableShadow();
        Earth.ins = this;

    }
});
Earth.str = "Earth";
Earth.UIsp = res.earthUI;

var Mars = Planet.extend({
    dts:dtss[4],
    orbitPeriod:OPs[4],
    radius:scales[4],
    terraforming:[0,5,15,25],
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.mars);
        this.addChild(this.sprite);
        this.enableShadow();
        Mars.ins = this;
    }
});
Mars.str = "Mars";
Mars.UIsp = res.marsUI;

var Jupiter = Planet.extend({
    dts:dtss[5],
    orbitPeriod:OPs[5],
    radius:scales[5],
    terraforming:[0,3,5,10],
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.jupiter);
        this.addChild(this.sprite);
        this.enableShadow();
        Jupiter.ins = this;
    }
});
Jupiter.str = "Jupiter";
Jupiter.UIsp = res.jupiterUI;


var Saturn = Planet.extend({
    dts:dtss[6],
    orbitPeriod:OPs[6],
    radius:scales[6],
    terraforming:[0,3,5,10],
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.saturn);
        var ring = new cc.Sprite(res.saturnRing);
        this.addChild(this.sprite);
        this.addChild(ring);
        this.enableShadow();
        Saturn.ins = this;
    }
});
Saturn.str = "Saturn";
Saturn.UIsp = res.saturnUI;


var Uranus = Planet.extend({
    dts:dtss[7],
    orbitPeriod:OPs[7],
    radius:scales[7],
    terraforming:[0,0,0,5],
    curBase:1,
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.uranus);
        this.addChild(this.sprite);
        this.enableShadow();
        Uranus.ins = this;
    }
});
Uranus.str= "Uranus";
Uranus.UIsp = res.uranusUI;

var Neptune = Planet.extend({
    dts:dtss[8],
    orbitPeriod:OPs[8],
    radius:scales[8],
    terraforming:[0,0,0,5],
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.neptune);
        this.addChild(this.sprite);
        this.enableShadow();
        Neptune.ins = this;
    }
});
Neptune.str= "Neptune";
Neptune.UIsp = res.neptuneUI;



var Pluto = Planet.extend({
    dts:dtss[9],
    orbitPeriod:OPs[9],
    radius:scales[9],
    terraforming:[0,0,0,5],
    side:FORCES.ALIEN,
    curBase:1,
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.pluto);
        this.addChild(this.sprite);
        this.enableShadow();
        Pluto.ins = this;
    }
});
Pluto.str= "Pluto";
Pluto.UIsp = res.plutoUI;



var MainBelt = cc.Node.extend({
    dts:(dtss[4]+dtss[5])/2.2,
    orbitPeriod:(OPs[4]+OPs[5])/2,
    _orbitSpeed:0,
    ctor:function(){
        this._super();
        this.sprite = new cc.ParticleSystem(res.asteroids);
        this.addChild(this.sprite);
        this.sprite.setStartRadius(this.dts);
        this.sprite.setEndRadius(this.dts);
        this.sprite.setPosition(0,0);
        this._orbitSpeed = -360/this.orbitPeriod;
        this.sprite.setRotatePerSecond(this._orbitSpeed);
        this.sprite.setEmissionRate(Infinity);
        this.sprite.setLife(Infinity);
    }
});


var Luna = Planet.extend({
    dts:18,
    orbitPeriod:1.2,
    radius:scales[4]/2,
    ctor:function(){
        this._super();
        this.sprite = new cc.Sprite(res.sun);
        this.addChild(this.sprite);
    }
});

var Fleet = cc.ParticleSystem.extend({
    side:FORCES.HUMAN,
    ships:null,
    angle:null,
    isGoingIn:false,
    ctor:function(force,fromPos, ships, target){
        this.ships = {sml:ships.sml/2, med:ships.med/2, big:ships.big/2};
        this.side = force;
        this._super(res.ships);
        this.setPosition(fromPos);
        this.setRotatePerSecond(0);
        this.setEmissionRate(Infinity);
        this.setLife(Infinity);
        this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);
        this.setSpeed(40);
        this.setSpeedVar(target.ins.radius*0.25);
        this.setRadialAccel(-40);
        this.setRadialAccelVar(target.ins.radius*0.25);
//        this.setStartRadius(15);
//        this.setEndRadius(15);
        //this.hship.setTotalParticles(this.getNumOfShips(FORCES.HUMAN));
        this.setTotalParticles(this.ships.sml+this.ships.med+this.ships.big);
        this.setPositionType(cc.ParticleSystem.TYPE_GROUPED);
        this.goingto = target;
//        this.scheduleUpdate();
        this.schedule(this.myUpdate,0);
        this.angle = cc.pToAngle(fromPos);
        if(force === FORCES.ALIEN)
        {
            this.setStartColor(ALIENCOLOR);
            this.setEndColor(ALIENCOLOR);
        }
        else if(force === FORCES.HUMAN)
        {
            this.setStartColor(HUMANCOLOR);
            this.setEndColor(HUMANCOLOR);
        }

        if(target.ins.dts < cc.pDistance(fromPos, cc.p(0,0)))
        {
            this.isGoingIn = true;
            this.angle += Math.PI;
        }
    },
    myUpdate:function(dt){
        //get ship speed;
        if(this.side === FORCES.HUMAN) {
            var speed = SPEEDS[Game.human.propulsion];
        }
        else {
            var speed = SPEEDS[Game.alien.propulsion];
        }
            var tarLoop = this.goingto.ins.dts;
            //check if we are at tarloop
            if((this.isGoingIn && !(cc.pDistance(this.getPosition(),cc.p(0,0))< tarLoop)) || (!this.isGoingIn && !(cc.pDistance(this.getPosition(),cc.p(0,0))> tarLoop)))
            {
                var newPos = cc.pRotateByAngle(cc.p(speed*dt,0), cc.p(0,0), this.angle);
                newPos = cc.pAdd(this.getPosition(), newPos);
                this.setPosition(newPos);
            }

            //check if we have arrived
            if(cc.pDistance(this.getPosition(),this.goingto.ins.getPosition())< 20)
            {
                this.removeFromParent();
                if(this.side === FORCES.HUMAN)
                {
                    this.goingto.ins.humanShips.sml += this.ships.sml;
                    this.goingto.ins.humanShips.med += this.ships.med;
                    this.goingto.ins.humanShips.big += this.ships.big;
                }
                else{
                    this.goingto.ins.alienShips.sml += this.ships.sml;
                    this.goingto.ins.alienShips.med += this.ships.med;
                    this.goingto.ins.alienShips.big += this.ships.big;
                }
            }


    }
});

var Explosion = cc.Sprite.extend({
    ctor:function(p){
        this._super(res.explosion);
//        this.setPosition(cc.p(cc.randomMinus1To1()* p.radius,cc.p(cc.randomMinus1To1()* p.radius)));
        this.runAction(cc.scaleTo(0.5,2));
        this.runAction(cc.sequence(cc.fadeOut(0.6),cc.removeSelf()));
        this.setBlendFunc(cc.ONE,cc.ONE);

        p.addChild(this, -99);
    }
});

var PLANETS = [Mercury,Venus,Earth,Mars,Jupiter,Saturn,Uranus,Neptune,Pluto];