var BARSP = 160;

var Label = cc.LabelTTF.extend({
    ctor:function(str,size, border){
        size = size || 18;
        str = str || "";
        border = border || 2;
        this._super(str, res.displayFont.name, size);
        this.enableStroke(cc.color(0, 0, 0, 100), border);
    }
});

var UI = cc.Layer.extend({
    EarthForce:null,
    AlienForce:null,
    listener:null,
    planetUIs:[],
    planetInspector:null,
    ctor:function(){
        this._super();
        this.initEarthUI();
        this.initAlienUI();
        this.initMiscUI();
        this.initStarBarUI();
        this.initListener();
        UI.ins = this;
    },
    initEarthUI:function(){
        var ELabel = new cc.LabelTTF("Earth Federation", res.displayFont.name, 42);
        this.addChild(ELabel);
        ELabel.setPosition(cc.pAdd(cc.visibleRect.topLeft, cc.p(20,-20)));
        ELabel.attr({
            anchorX:0,
            anchorY:1,
            color:HUMANCOLOR
        });
        ELabel.enableStroke(cc.color(0,0,0,100), 5);

        var money = new Label("Budget : $",36);
        this.addChild(money);
        money.attr({
            anchorX:1
        });
        money.setPosition(cc.pAdd(cc.visibleRect.topLeft, cc.p(190,-90)));

        var humanMoney = new Label("100", 36);
        this.addChild(humanMoney);
        humanMoney.attr({
            anchorX:0
        });
        humanMoney.setPosition(cc.pAdd(cc.visibleRect.topLeft, cc.p(190,-90)));
        Game.moneyUI = humanMoney;


        var productionTech = new TechIcon(res.production, Game.human.production, "Production", function(){return Game.lvlUp("production");});
        this.addChild(productionTech);
        productionTech.setPosition(cc.pAdd(cc.visibleRect.topLeft, cc.p(63,-160)));

        var spaceShipTech = new TechIcon(res.spaceShip, Game.human.spaceShip, "Space Ship", function(){return Game.lvlUp("spaceShip");});
        this.addChild(spaceShipTech);
        spaceShipTech.setPosition(cc.pAdd(cc.visibleRect.topLeft, cc.p(63,-260)));

        var terraformingTech = new TechIcon(res.terraforming, Game.human.terraforming, "Terraforming", function(){return Game.lvlUp("terraforming");});
        this.addChild(terraformingTech);
        terraformingTech.setPosition(cc.pAdd(cc.visibleRect.topLeft, cc.p(63,-360)));

        var propulsionTech = new TechIcon(res.propulsion, Game.human.propulsion, "Propulsion", function(){return Game.lvlUp("propulsion");});
        this.addChild(propulsionTech);
        propulsionTech.setPosition(cc.pAdd(cc.visibleRect.topLeft, cc.p(63,-460)));

        var infrastructureTech = new TechIcon(res.infrastructure, Game.human.infrastructure, "Infrastructure", function(){return Game.lvlUp("infrastructure");});
        this.addChild(infrastructureTech);
        infrastructureTech.setPosition(cc.pAdd(cc.visibleRect.topLeft, cc.p(63,-560)));

        this.techIcons = [productionTech,spaceShipTech,terraformingTech,propulsionTech, infrastructureTech];
    },
    initAlienUI:function(){
        var ALabel = new cc.LabelTTF("Alien Invaders", res.displayFont.name, 42);
        this.addChild(ALabel);
        ALabel.setPosition(cc.pAdd(cc.visibleRect.topRight, cc.p(-20,-20)));
        ALabel.attr({
            anchorX:1,
            anchorY:1,
            color:ALIENCOLOR
        });
        ALabel.enableStroke(cc.color(0,0,0,100), 5);
    },
    initMiscUI:function(){
        var YearLabel = new cc.LabelTTF("YEAR : ", res.displayFont.name, 32);
        this.addChild(YearLabel);
        YearLabel.setPosition(cc.pAdd(cc.visibleRect.top, cc.p(0,-20)));
        YearLabel.attr({
            anchorX:1,
            anchorY:1
        });
        YearLabel.enableStroke(cc.color(0,0,0,100), 5);

        var YearCounter = new cc.LabelTTF("", res.displayFont.name, 32);
        this.addChild(YearCounter);
        YearCounter.setPosition(cc.pAdd(cc.visibleRect.top, cc.p(0,-20)));
        YearCounter.attr({
            anchorX:0,
            anchorY:1
        });
        YearCounter.enableStroke(cc.color(0,0,0,100), 5);
        UI.yearCounter = YearCounter;
    },
    initStarBarUI:function(){
        var lay = new cc.LayerColor(cc.color(0,0,0,200),cc.visibleRect.width, 100);
        this.addChild(lay);
        lay.attr({
            anchorX:0,
            anchorY:0,
            opacity:50
        });
        for(var i = 0; i < 9; i++)
        {
            var num = i;
            if(i > 3)
            {
                num++;
            }
            var starcls = PLANETS[i];
            var star = new cc.Sprite(starcls.UIsp);
            lay.addChild(star);
            star.attr({
                x: cc.visibleRect.center.x - ((BARSP * 9) - (BARSP * 4.5) - (BARSP * num)),
                y: 50
            });
            var label = new cc.LabelTTF(starcls.str, res.displayFont.name, 18);
            label.attr({
                x: star.getContentSize().width / 2 + 40,
                anchorY: 0,
                y: (star.getContentSize().height - 80) / 2
            });
            label.enableStroke(cc.color(0, 0, 0, 100), 2);
            star.addChild(label);
            starcls.UI = star;

            var humanShipCounter = new Label("");
            humanShipCounter.attr({
                y:  (star.getContentSize().height - 80) / 2 + 80,
                anchorY: 1,
                color: HUMANCOLOR
            });
            star.addChild(humanShipCounter);

            var alienShipCounter = new Label("");
            alienShipCounter.attr({
                y:  (star.getContentSize().height - 80) / 2 + 80,
                x:  star.getContentSize().width / 2 + 50,
                anchorY: 1,
                color: ALIENCOLOR
            });
            star.addChild(alienShipCounter);

            starcls.humanShipCounter  = humanShipCounter;
            starcls.alienShipCounter = alienShipCounter;
        }

        //asteroid
        var asteroid = new cc.Sprite(res.asteroidsUI);
        lay.addChild(asteroid);
        asteroid.attr({
            x: cc.visibleRect.center.x - ((BARSP * 9) - (BARSP * 4.5) - (BARSP * 4)),
            y: 50
        });
        var label = new cc.LabelTTF("Asteroids", res.displayFont.name, 18);
        label.attr({
            x: asteroid.getContentSize().width / 2 + 40,
            anchorY: 0,
            y: (asteroid.getContentSize().height - 80) / 2
        });
        label.enableStroke(cc.color(0, 0, 0, 100), 2);
        asteroid.addChild(label);
    },
    initListener:function(){
        var inspector = this.planetInspector = new PlanetInspector;
        this.addChild(inspector);
        if(!this.listener)
        {
            this.mouseListener = cc.EventListener.create({
                event:cc.EventListener.MOUSE,
                onMouseMove:function(e){
                    var that = UI.ins;
                    if(Game.downTarget)
                    {
                        //dragging
                        if(!Game.aimer)
                        {
                            var arrow = new AimingVector(Game.downTarget.ins);
                            Sun.ins.addChild(arrow);
                            Game.aimer = arrow;
                        }

                    }
                    var pos = e.getLocation();
                    for(var j = 0; j < that.techIcons.length; j++)
                    {
                        if(cc.rectContainsPoint(that.techIcons[j].getBoundingBoxToWorld(), pos))
                        {
                            that.techIcons[j].showTip();
                        }
                        else{
                            that.techIcons[j].hideTip();
                        }
                    }


                    for(var i = 0; i < PLANETS.length; i++)
                    {
                        var planet = PLANETS[i];
                        if(planet.UI)
                        {
                            if(cc.rectContainsPoint(planet.UI.getBoundingBoxToWorld(), pos))
                            {
                                //console.log(PLANETS[i].str);
                                if(planet.loop)
                                {
                                    planet.loop.setVisible(true);

                                    var productions = planet.ins.getCurProduction();

                                    inspector.attr({
                                        x:pos.x,
                                        y:pos.y,
                                        curTarget:planet
                                    });

                                    if(planet.ins.side === FORCES.HUMAN)
                                    {
                                        var realCost = COSTS[planet.ins.curBase];
                                        if(Game.human.money > realCost && planet.ins.curBase < planet.ins.maxBases[Game.human.infrastructure])
                                        {
                                            inspector.info2 = "Click to build a base for $"+realCost;
                                            //PlanetInspector.ins.refreshStat();
                                        }
                                        else if(planet.ins.curBase >= planet.ins.maxBases[Game.human.infrastructure]){
                                            inspector.info2 = "Infrastructure tech too low";
                                        }
                                        else{
                                            inspector.info2 = "Cannot afford a new base";
                                        }
                                    }
                                    else if(planet.ins.side === FORCES.NEUTRAL)
                                    {
                                        if(planet.ins.terraforming[Game.human.terraforming])
                                        {
                                            inspector.info2 = "Colonisable";
                                        }
                                        else{
                                            inspector.info2 = "Terraforming tech too low";
                                        }
                                    }
                                    else{
                                        inspector.info2 = "Exterminate all Aliens";
                                    }

                                    inspector.refreshStat();
                                    inspector.show();
                                    if(Game.aimer)
                                    {
                                        Game.aimer.setTarget(planet.ins);
                                    }
                                    break;
                                }
                            }
                            else{
                                if(planet.loop)
                                {
                                    planet.loop.setVisible(false);
                                    inspector.hide();
                                }
                            }
                        }
                    }
                    var pos = e.getLocation();
                },
                onMouseDown:function(e){
                    for(var i = 0; i < PLANETS.length; i++) {
                        if (cc.rectContainsPoint(PLANETS[i].UI.getBoundingBoxToWorld(), e.getLocation())) {
                            Game.downTarget = PLANETS[i];
                            break;
                        }
                    }

                },
                onMouseUp:function(e){
                    for(var i = 0; i < PLANETS.length; i++) {
                        if (cc.rectContainsPoint(PLANETS[i].UI.getBoundingBoxToWorld(), e.getLocation())) {
                            Game.upTarget = PLANETS[i];
                            break;
                        }
                    }
                    var that = UI.ins;
                    for(var j = 0; j < that.techIcons.length; j++)
                    {
                        if(cc.rectContainsPoint(that.techIcons[j].getBoundingBoxToWorld(), e.getLocation()))
                        {
                            that.techIcons[j].callback();
                        }
                    }
                    if(Game.upTarget && Game.downTarget === Game.upTarget && Game.downTarget.ins.side === FORCES.HUMAN)
                    {
                        //this is a click
                        var realCost = COSTS[Game.upTarget.ins.curBase];
                        if(Game.human.money > realCost && Game.upTarget.ins.curBase < Game.upTarget.ins.maxBases[Game.human.infrastructure])
                        {
                            Game.human.money -= realCost;
                            Game.upTarget.ins.curBase ++;
                            PlanetInspector.ins.refreshStat();
                        }
                    }
                    else if(Game.upTarget){
                        //this is a drag
                        //get target position
                        var fleet = new Fleet(FORCES.HUMAN, Game.downTarget.ins.getPosition(), Game.downTarget.ins.humanShips, Game.upTarget);
                        Sun.ins.addChild(fleet);
                        Game.downTarget.ins.humanShips.sml /= 2;
                        Game.downTarget.ins.humanShips.med /= 2;
                        Game.downTarget.ins.humanShips.big /= 2;
                        Game.downTarget.ins.hship.setTotalParticles(Game.downTarget.ins.humanShips.sml+Game.downTarget.ins.humanShips.med+Game.downTarget.ins.humanShips.big);
                        //fleet.runAction(cc.moveTo(2, Game.upTarget.ins.getPosition()));
                    }
                    Game.downTarget = null;
                    Game.upTarget = null;
                    if(Game.aimer)
                    {
                        Game.aimer.removeFromParent();
                        Game.aimer = null;
                    }

                }
            });
            cc.eventManager.addListener(this.mouseListener, 1);

        }
    }
});
var TechIcon = cc.Sprite.extend({
    ctor:function(sp, lvl, lab, callback){
        this._super(sp);
        this.lvl0 = new cc.Sprite(res.lvl0);
        this.lvl1 = new cc.Sprite(res.lvl1);
        this.lvl2 = new cc.Sprite(res.lvl2);
        this.lvl3 = new cc.Sprite(res.lvl3);
        this.lvl1.visible = false;
        this.lvl0.visible = false;
        this.lvl2.visible = false;
        this.lvl3.visible = false;
        this.addChild(this.lvl0);
        this.addChild(this.lvl1);
        this.addChild(this.lvl2);
        this.addChild(this.lvl3);
        this.lvl1.setNormalizedPosition(0.5,0.5);
        this.lvl2.setNormalizedPosition(0.5,0.5);
        this.lvl3.setNormalizedPosition(0.5,0.5);
        this.lvl0.setNormalizedPosition(0.5,0.5);

        this.toolTipLay = new cc.LayerColor(cc.color(0,0,0,50), 200, 100);
        this.label = new Label(lab, 28);
        this.addChild(this.toolTipLay);
        this.toolTipLay.addChild(this.label);
        this.toolTipLay.setPosition(100,0);
        this.label.setPosition(100,70);

        this.tooltip = new Label("$100 to lvl1", 28);
        this.toolTipLay.addChild(this.tooltip);
        this.tooltip.setPosition(100,30);

        this["lvl"+lvl].visible = true;

        this.toolTipLay.visible = false;
        if(callback)
        this._callback = callback;
        this.lvl = lvl;
    },
    showTip:function(){
        if(this.lvl === 3)
        {
            this.tooltip.setString("maxed");
        }
        else{
            this.tooltip.setString("$"+COSTS[this.lvl]+ " to lvl"+(this.lvl+1));
        }
        this.toolTipLay.visible = true;
    },
    hideTip:function(){
        this.toolTipLay.visible = false;
    },
    callback:function(){
        if(this._callback)
            var lvl = this._callback();
        else
            console.log("no callback");

        this.lvl1.visible = false;
        this.lvl0.visible = false;
        this.lvl2.visible = false;
        this.lvl3.visible = false;

        if(lvl != null)
        {
            this["lvl"+lvl].visible = true;
            this.lvl = lvl;
        }
    }
});


var AimingVector = cc.Sprite.extend({
    fromPlanet:null,
    ctor:function(planet){
        this._super(res.arrow);
        this.attr({
            anchorX:0,
            scaleX:planet.dts/100,
            fromPlanet:planet
        });
        this.scheduleUpdate();
    },
    update:function(){
        this.setRotation(-cc.radiansToDegrees(this.fromPlanet.curAngle));
    },
    setTarget:function(t){
        if(this.fromPlanet.dts > t.dts)
        {
            //going inwards
            this.scaleX = -(this.fromPlanet.dts - t.dts)/100;
            this.anchorX = (this.fromPlanet.dts/(this.fromPlanet.dts - t.dts));
        }
        else{
            this.scaleX = (t.dts - this.fromPlanet.dts)/100;
            this.anchorX = (this.fromPlanet.dts/(this.fromPlanet.dts - t.dts));
        }
    }

});

var PlanetInspector = cc.LayerColor.extend({
    planetName:"",
    _planetName:null,
    curPop:0,
    _curPop:null,
    techPop:0,
    _techPop:null,
    maxPop:0,
    _maxPop:null,
    curProd:0,
    _curProd:null,
    techProd:0,
    _techProd:null,
    maxProd:0,
    _maxProd:null,
    curBase:0,
    _curBase:null,
    techBase:0,
    _techBase:null,
    maxBase:0,
    _maxBase:null,

    curTarget:null,
    ctor:function(){
        var width = 400;
        var height = 350;
        this._super(NEUTRALCOLOR, width, height);
        this.attr({
            anchorX:0.5,
            anchorY:-0.1,
            opacity:50
        });
        this.ignoreAnchorPointForPosition(false);
        var planetNamelabel = this._planetName = new Label("", 32);
        planetNamelabel.attr({
            anchorX:0,
            y: height-30,
            x:20
        });
        this.addChild(planetNamelabel);

        var curTechMax = new Label("CUR   TECH   MAX", 14);
        curTechMax.attr({
            anchorX:0.5,
            anchorY:-0.5,
            y: height-80,
            x:width/4*3,
            opacity:100
        });
        this.addChild(curTechMax);


        var population = new Label("Population : ", 26);
        population.attr({
            anchorX:1,
            y: height-100,
            x:width/2
        });
        this.addChild(population);

        var curPop = this._curPop = new Label("0", 26);
        curPop.attr({
            anchorX:0.5,
            y: height-100,
            x:width/4*3-width/8
        });
        this.addChild(curPop);
        var techPop = this._techPop = new Label("10", 26);
        techPop.attr({
            anchorX:0.5,
            y: height-100,
            x:width/4*3
        });
        this.addChild(techPop);
        var maxPop = this._maxPop = new Label("100", 26);
        maxPop.attr({
            anchorX:0.5,
            y: height-100,
            x:width/4*3+width/8
        });
        this.addChild(maxPop);

        var bases = new Label("Bases : ", 26);
        bases.attr({
            anchorX:1,
            y: height-140,
            x:width/2
        });
        this.addChild(bases);
        var curBase = this._curBase = new Label("0", 26);
        curBase.attr({
            anchorX:0.5,
            y: height-140,
            x:width/4*3-width/8
        });
        this.addChild(curBase);
        var techBase = this._techBase = new Label("10", 26);
        techBase.attr({
            anchorX:0.5,
            y: height-140,
            x:width/4*3
        });
        this.addChild(techBase);
        var maxBase = this._maxBase = new Label("100", 26);
        maxBase.attr({
            anchorX:0.5,
            y: height-140,
            x:width/4*3+width/8
        });
        this.addChild(maxBase);


        var production = new Label("Production : ", 26);
        production.attr({
            anchorX:1,
            y: height-200,
            x:width/2
        });
        this.addChild(production);

        var curProd = this._curProd = new Label("0", 26);
        curProd.attr({
            anchorX:0.5,
            y: height-200,
            x:width/4*3-width/8
        });
        this.addChild(curProd);
        var techProd = this._techProd = new Label("10", 26);
        techProd.attr({
            anchorX:0.5,
            y: height-200,
            x:width/4*3
        });
        this.addChild(techProd);
        var maxProd = this._maxProd = new Label("100", 26);
        maxProd.attr({
            anchorX:0.5,
            y: height-200,
            x:width/4*3+width/8
        });
        this.addChild(maxProd);
        var smallMedBig = new Label("SML    MED    BIG", 14);
        smallMedBig.attr({
            anchorX:0.5,
            anchorY:-0.5,
            y: height-190,
            x:width/4*3,
            opacity:100
        });
        this.addChild(smallMedBig);



        //if player planet, then tell them that you can colonise, build base with money
        var info2 = new Label("Click to build a base", 24);
        info2.attr({
            x:width/2,
            anchorY:0,
            y:45
        });
        var info1 = new Label("Drag to another planet to attack", 24);
        info1.attr({
            x:width/2,
            anchorY:0,
            y:20
        });
        this.addChild(info2);
        this.addChild(info1);
        this._info1 = info1;
        this._info2 = info2;

        this.hide();
        PlanetInspector.ins = this;
    },
    show:function(){
        this.setVisible(true);
    },
    hide:function(){
        this.setVisible(false);
    },
    refreshStat:function(){
        if(this.curTarget) {

            var prod = this.curTarget.ins.getCurProduction();
            this._planetName.setString(this.curTarget.str);
            this._curBase.setString(this.curTarget.ins.curBase | 0);
            this._curPop.setString(this.curTarget.ins.curPopulation | 0);
            this._curProd.setString(prod.sml);
            this._techBase.setString(this.curTarget.ins.maxBases[Game.human.infrastructure]);
            this._techPop.setString(this.curTarget.ins.terraforming[Game.human.terraforming]);
            this._techProd.setString(prod.med);
            this._maxBase.setString(this.curTarget.ins.maxBases[3]);
            this._maxPop.setString(this.curTarget.ins.terraforming[3]);
            this._maxProd.setString(prod.big);
            if (this.curTarget.ins.side === FORCES.HUMAN) {
                this.setColor(HUMANCOLOR);
                if(this.info1)
                this._info1.setString(this.info1);
                else
                this._info1.setString("Drag to another planet to attack");
                if(this.info2)
                    this._info2.setString(this.info2);
                else
                this._info2.setString("Click to build a base");
            }
            else if (this.curTarget.ins.side === FORCES.ALIEN) {
                this.setColor(ALIENCOLOR);
                if(this.info1)
                    this._info1.setString(this.info1);
                else
                this._info1.setString("Aliens are here");
                if(this.info2)
                    this._info2.setString(this.info2);
                else
                this._info2.setString("");
            }
            else {
                this.setColor(NEUTRALCOLOR);
                if(this.info1)
                    this._info1.setString(this.info1);
                else
                    this._info1.setString("Uninhabited");
                if(this.info2)
                    this._info2.setString(this.info2);
                else
                    this._info2.setString("Colonisable");
            }
        }
    }
});

var LoopSelector = cc.Sprite.extend({
    _visible:false,
    ctor:function(sp){
        this._super(sp);
        this.setBlendFunc(cc.ONE,cc.ONE);
        this.setLocalZOrder(-999);
    }
});

