var SolarDef = cc.Scene.extend({
    ctor:function(){
        this._super();
        var background = new cc.Sprite(res.background);
        this.addChild(background);
        background.setPosition(cc.visibleRect.center);




        this.addChild(new SolarSystem);
        this.addChild(new UI);
    }
});



var SolarSystem = cc.Layer.extend({
    onEnter:function () {
        this._super();


        var offset = 180;
        var whRate = cc.visibleRect.width/(cc.visibleRect.height-offset);
        this.setScaleY(1/whRate);
        Star.whRate = whRate;

        var sun = new Sun();
        sun.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, offset/2)));
        this.addChild(sun);



        //planets

        var mercury = new Mercury;
        sun.addChild(mercury);

        var venus = new Venus;
        sun.addChild(venus);

        var earth = new Earth;
        sun.addChild(earth);

        var mars = new Mars;
        sun.addChild(mars);

        var astBelt = new MainBelt;
        sun.addChild(astBelt);

        var jupiter = new Jupiter;
        sun.addChild(jupiter);

        var saturn = new Saturn;
        sun.addChild(saturn);

        var uranus = new Uranus;
        sun.addChild(uranus);

        var neptune = new Neptune;
        sun.addChild(neptune);

        var pluto = new Pluto;
        sun.addChild(pluto);


//        //Satellites
//        var luna = new Luna;
//        earth.addChild(luna);



        //loop selector
        for(var i = 0; i<9;i++)
        {
            var loop = new LoopSelector(res.earthLoop);
            sun.addChild(loop);
            PLANETS[i].loop = loop;
            loop.attr({
                scale:dtss[i+1]/dtss[3]
            })
        }
//        var eloop = new LoopSelector(res.earthLoop);
//        sun.addChild(eloop);
//        Earth.loop = eloop;

        this.schedule(this.gameStep, 10/12, cc.REPEAT_FOREVER);
        this.schedule(this.solveFight, 0.35, cc.REPEAT_FOREVER);
        this.schedule(this.AI, 2);
        Game.step();
    },
    gameStep:function(){
        Game.step();
    },
    solveFight:function(){
        Game.solveFight();
    },
    AI:function(){
        Game.AI();
    }
});

