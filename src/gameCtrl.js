var getShipCount = function(shipObj){
    return shipObj.sml + shipObj.med + shipObj.big;
};
var Game = {
    date:null,
    mouseListener:null,
    init:function(){
        this.reset();
        this.mouseListener = cc.EventListener.create({
            event:cc.EventListener.MOUSE,
            onMouseMove:function(e){
                var pos = e.getLocation();
                pos.y *= 1;
            }
        });
        cc.eventManager.addListener(this.mouseListener, 1);

    },
    reset:function(){
        this.date = new Date();
        this.date.setMonth(this.date.getMonth()-5);
        this.human = {
            terraforming:0,
            production:1,
            spaceShip:1,
            infrastructure:1,
            propulsion:0,
            money:100
        };
        this.alien = {
            terraforming:2,
            production:2,
            spaceShip:2,
            infrastructure:2,
            propulsion:2,
            money:100
        }
    },
    lvlUp:function(key){
        if(this.human[key]<3) {

            var realcost = COSTS[this.human[key]];
            if (this.human.money > realcost) {
                this.human.money -= realcost;
                this.human[key]++;
            }
            return this.human[key];
        }
    },
    //called every game month
    step:function(){
        this.date.setMonth(this.date.getMonth()+1);
        UI.yearCounter.setString(this.date.getFullYear()+"-"+(this.date.getMonth()+1));

        for(var i = 0; i < PLANETS.length; i++)
        {
            var planet = PLANETS[i];
            if(planet.ins.side === FORCES.HUMAN) {
                var key = "human";
                var key2 = "humanShips";
                this.human.money = Math.round((planet.ins.curPopulation*0.06 + this.human.money)*100)/100;
            }
            else if(planet.ins.side === FORCES.ALIEN){
                var key = "alien";
                var key2 = "alienShips";
            }
            if(planet.ins.side !== FORCES.HUMAN)
            {
                if(getShipCount(planet.ins.humanShips) && !getShipCount(planet.ins.alienShips) && planet.ins.terraforming[Game.human.terraforming])
                {
                    planet.ins.side = FORCES.HUMAN;
                    planet.ins.curBase = 0;
                    planet.ins.curPopulation = 0;
                }
            }
            if(planet.ins.side !== FORCES.ALIEN)
            {
                if(getShipCount(planet.ins.alienShips) && !getShipCount(planet.ins.humanShips))
                {
                    planet.ins.side = FORCES.ALIEN;
                    planet.ins.curBase = planet.ins.maxBases[3];
                    planet.ins.curPopulation = 0;
                }
            }
            if(key) {
                //update population
                if(planet.ins.side !== FORCES.NEUTRAL) {
                    if (planet.ins.curPopulation < planet.ins.terraforming[this[key].terraforming]) {
                        planet.ins.curPopulation += ((planet.ins.terraforming[this[key].terraforming] + 1) / (planet.ins.curPopulation + 1)) * 0.01;
                    }
                }
                //update ships
                var prod = planet.ins.getCurProduction();
                if (prod.sml) {
                    planet.ins[key2].sml += (prod.sml * 0.8);
                }
                if (prod.med) {
                    planet.ins[key2].med += (prod.med * 0.8);
                }
                if (prod.big) {
                    planet.ins[key2].big += (prod.big * 0.8);
                }

                //var displayed = (planet.ins.humanShips.sml|0) + "\n" + (planet.ins.humanShips.sml|0)+ "\n" + (planet.ins.humanShips.sml|0);
            }



            var count = (planet.ins.humanShips.sml|0) +  (planet.ins.humanShips.med|0) +(planet.ins.humanShips.big|0);
            var displayed = (planet.ins.humanShips.sml|0) + "\n" + (planet.ins.humanShips.med|0)+ "\n" + (planet.ins.humanShips.big|0);
            if(count)
                planet.humanShipCounter.setString(displayed);
            else
                planet.humanShipCounter.setString("");

            var count = (planet.ins.alienShips.sml|0) +  (planet.ins.alienShips.med|0) +(planet.ins.alienShips.big|0);
            var displayed = (planet.ins.alienShips.sml|0) + "\n" + (planet.ins.alienShips.med|0)+ "\n" + (planet.ins.alienShips.big|0);
            if(count)
                planet.alienShipCounter.setString(displayed);
            else{
                planet.alienShipCounter.setString("");
            }
            planet.ins.updateShipParticle();
            PlanetInspector.ins.refreshStat();
            this.moneyUI.setString(this.human.money);
        }
    },
    solveFight:function(){
        for(var i = 0; i < PLANETS.length; i ++)
        {
            var planet = PLANETS[i].ins;
            if(getShipCount(planet.humanShips) && getShipCount(planet.alienShips))
            {
                var Adamage = planet.humanShips.sml * 0.1;
                Adamage += planet.humanShips.med;
                Adamage += planet.humanShips.big*3;

                var Bdamage = planet.alienShips.sml * 0.1;
                Bdamage += planet.alienShips.med;
                Bdamage += planet.alienShips.big*3;

                planet.humanShips.sml = cc.clampf(planet.humanShips.sml - (Bdamage / (planet.humanShips.sml*0.3) * Math.random()+Adamage/0.5*Math.random())*0.2,0,999);
                planet.humanShips.med = cc.clampf(planet.humanShips.med - (Bdamage / (planet.humanShips.med*7.5) * Math.random() +Adamage/15* Math.random()) *0.2,0,999);
                planet.humanShips.big = cc.clampf(planet.humanShips.big - (Bdamage / (planet.humanShips.med*20) * Math.random()  +Adamage/60*  Math.random())*0.2,0,999);

                planet.alienShips.sml = cc.clampf(planet.alienShips.sml - (Adamage / (planet.alienShips.sml*0.3) * Math.random()+Adamage/0.5*Math.random()) *0.2,0,999);
                planet.alienShips.med = cc.clampf(planet.alienShips.med - (Adamage / (planet.alienShips.med*7.5) * Math.random() +Adamage/15* Math.random()) *0.2,0,999);
                planet.alienShips.big = cc.clampf(planet.alienShips.big - (Adamage / (planet.alienShips.med*20) * Math.random()  +Adamage/60*  Math.random())*0.2,0,999);

                var displayed = (planet.humanShips.sml|0) + "\n" + (planet.humanShips.med|0)+ "\n" + (planet.humanShips.big|0);
                PLANETS[i].humanShipCounter.setString(displayed);
                planet.hship._totalParticles = getShipCount(planet.humanShips);

                var displayed = (planet.alienShips.sml|0) + "\n" + (planet.alienShips.med|0)+ "\n" + (planet.alienShips.big|0);
                PLANETS[i].alienShipCounter.setString(displayed);
                planet.aship._totalParticles = getShipCount(planet.alienShips);

                var explosion = new Explosion(planet);
//                Sun.ins.addChild(explosion);
                cc.audioEngine.playEffect(res.nutfall);
            }
        }
    },
    AI:function(){
        for(var i = 0; i < PLANETS.length; i ++)
        {
            var planet = PLANETS[i].ins;
            if(getShipCount(planet.alienShips) > 170 && !getShipCount(planet.humanShips))//if a planet with more than 170 alien ships, then move them to new planet
            {
                //attack another planet
                var nearest = null;
                var neardist = 9999999;
                for(var j = 0; j < PLANETS.length; j++)
                {
                    var dist = cc.pDistance(PLANETS[i].ins.getPosition(), PLANETS[j].ins.getPosition());
                    var anglediff = PLANETS[i].ins.curAngle%(2*Math.PI) - PLANETS[j].ins.curAngle%(2*Math.PI);
                    if(dist < neardist && PLANETS[i] !== PLANETS[j] && getShipCount(PLANETS[i].ins.alienShips)>getShipCount(PLANETS[j].ins.humanShips)*2)
                    {
                        neardist = dist;
                        nearest = PLANETS[j];
                    }
                }
                if(nearest)
                {
                    var fleet = new Fleet(FORCES.ALIEN, PLANETS[i].ins.getPosition(), PLANETS[i].ins.alienShips, nearest);
                    Sun.ins.addChild(fleet);
                    PLANETS[i].ins.alienShips.sml /= 2;
                    PLANETS[i].ins.alienShips.med /= 2;
                    PLANETS[i].ins.alienShips.big /= 2;
                    PLANETS[i].ins.aship.setTotalParticles(getShipCount(PLANETS[i].ins.alienShips));
                    //fleet.runAction(cc.moveTo(2, Game.upTarget.ins.getPosition()));
                    console.log(PLANETS[i].str, "attack", nearest.str);
                }

            }
        }
    }
};