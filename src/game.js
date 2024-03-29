// Game.prototype.step method calls Game.prototype.move on all the objects, 
// and Game.prototype.checkCollisions checks for colliding objects.

// Game.prototype.draw(ctx) draws the game.
// Keeps track of dimensions of the space; wraps objects around when they drift off the screen.

import Goat from './goat';
import WaterBalloon from './water-balloon';
import OilBalloon from './oil-balloon';
import InputHandler from './input_handle';
import Arrows from './arrow';
import { throws } from 'assert';
// LEVELS grass 1: this.gameHeight - 40, 2: -70, 3:-110, 4:-140, 5: -170


let grass = document.getElementById("grass-image")
let gardenBackground = document.getElementById("garden-background")



export default class Game {

    constructor(gameWidth, gameHeight) {

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameOver = false;

        this.totalWaterballoons = 4;
        this.waterballoonsArr= [];
        this.MissedWaterballoons = 0;
        this.score = 0;
        this.totalScore = 0;

        this.OilBalloonsTotal = 1;
        this.oilballoonsArr = [];
        this.HitOilBalloons = 0;

        this.totalshots = 1;
        this.shots = [];

        this.remove = false;
        this.paused = true;

        this.currentLevel = 1;
    }

 

    start(){
        this.theGoat = new Goat(this);

         // For OIL Balloons Generation
         for (let k = 0; k < this.OilBalloonsTotal ; k++) {
            let newOilPos = this.generateRandomBalloonPosLevel1();
            this.oilballoonsArr.push(new OilBalloon(newOilPos[0], {positionX: newOilPos[1], speedY: newOilPos[2]}));  
        }

        // For Water Balloons Generation
        for (let i = 0; i < this.totalWaterballoons; i++) {
            let newPos = this.generateRandomBalloonPosLevel1();
            this.waterballoonsArr.push(new WaterBalloon(newPos[0], {positionX: newPos[1], speedY: newPos[2]}));
        }

        this.inputHandler = new InputHandler(this.theGoat);

    }

    restart(){
        // UPDATE BASED ON CURRENT LEVEL and based on oilballoonsHit // WAterballoonsMissed
        
        this.totalWaterballoons = 4;
        this.waterballoonsArr= [];
        this.MissedWaterballoons = 0;
        this.score = 0;
        this.totalScore = 0;
        

        this.OilBalloonsTotal = 1;
        this.oilballoonsArr = [];
        this.HitOilBalloons = 0;

        this.totalshots = 1;
        this.shots = [];

        this.remove = false;
        this.paused = false;

        this.currentLevel = 1;
        this.inputHandler = new InputHandler(this.theGoat);

        this.start();
    }
        


    update(dt) {
        this.theGoat.update(dt);
       
        this.updateWaterBalloons(dt);
        this.updateOilBalloons(dt);

        if (this.inputHandler.keylogger.fire && this.shots.length < this.totalshots) {
            this.shots.push([this.theGoat.position.x +50, this.theGoat.position.y - this.theGoat.height/2, 3, 100]);
        }

        this.moveShot();
        this.hitTest();

        this.DetectMissedWaterballoons(); 
        this.DetectMissedOilballoons();

    }

    draw(ctx, grassHeight) {
        ctx.drawImage(gardenBackground, 0, 0, this.gameWidth, this.gameHeight)
        ctx.drawImage(grass, 0, this.gameHeight - grassHeight, this.gameWidth, 170)
        this.theGoat.draw(ctx);
        this.drawShot(ctx)
        this.drawWaterBalloons(ctx);
        this.drawOilBalloons(ctx);
        this.drawScore(ctx);  
    }

    generateRandomBalloonPosLevel1(){
        let NEWpositionX = Math.floor(Math.random() * 600)
                while (NEWpositionX < 100) {
                    NEWpositionX = Math.floor(Math.random() * 600)
        }
        // debugger;
        let NEWspeedY = Math.random() * 1.2 + 0.5;
        let NEWcreateWb = [this, NEWpositionX, NEWspeedY];
        return NEWcreateWb;
    }

    generateRandomBalloonPosLevel2(){
        let NEWpositionX = Math.floor(Math.random() * 600)
                while (NEWpositionX < 100) {
                    NEWpositionX = Math.floor(Math.random() * 600)
        }
        // debugger;
        let NEWspeedY = Math.random() * 1 + 0.6;
        let NEWcreateWb = [this, NEWpositionX, NEWspeedY];
        return NEWcreateWb;
    }

    generateRandomBalloonPosLevel3(){
        let NEWpositionX = Math.floor(Math.random() * 600)
                while (NEWpositionX < 100) {
                    NEWpositionX = Math.floor(Math.random() * 600)
        }
        // debugger;
        let NEWspeedY = Math.random() * 1 + 0.8;
        let NEWcreateWb = [this, NEWpositionX, NEWspeedY];
        return NEWcreateWb;
    }

    generateRandomBalloonPosLevel4(){
        let NEWpositionX = Math.floor(Math.random() * 600)
                while (NEWpositionX < 100) {
                    NEWpositionX = Math.floor(Math.random() * 600)
        }
        // debugger;
        let NEWspeedY = Math.random() * 1 + 1.1;
        let NEWcreateWb = [this, NEWpositionX, NEWspeedY];
        return NEWcreateWb;
    }


    generateRandomBalloonPosLevel5(){
        let NEWpositionX = Math.floor(Math.random() * 600)
                while (NEWpositionX < 100) {
                    NEWpositionX = Math.floor(Math.random() * 600)
        }
        // debugger;
        let NEWspeedY = Math.random() * 1 + 1.5;
        let NEWcreateWb = [this, NEWpositionX, NEWspeedY];
        return NEWcreateWb;
    }



    hitTest() {
        // Water Balloon hit test
        for (let l = 0; l < this.shots.length; l++) {
          for (let j = 0; j < this.waterballoonsArr.length; j++) {
            //   debugger;
            if (this.shots[l][1] <= (this.waterballoonsArr[j].position.y + this.waterballoonsArr[j].dims.height) && this.shots[l][0] >= this.waterballoonsArr[j].position.x && this.shots[l][0] <= (this.waterballoonsArr[j].position.x + this.waterballoonsArr[j].dims.width) ) {

                this.remove = true;

                this.waterballoonsArr.splice(j, 1);
                this.score += 1;
                this.totalScore += 1;
                console.log(this.score);

                // let newWaterPos = this.generateRandomBalloonPosLevel1();
                // this.WaterballoonsArr.push(new WaterBalloon(newWaterPos[0], 
                //     {positionX: newWaterPos[1], speedY: newWaterPos[2]}));

                if (this.currentLevel === 1) {
                let newWaterPos = this.generateRandomBalloonPosLevel1();
                this.waterballoonsArr.push(new WaterBalloon(newWaterPos[0], 
                    {positionX: newWaterPos[1], speedY: newWaterPos[2]}));
                } else if (this.currentLevel === 2) {
                    let newWaterPos2 = this.generateRandomBalloonPosLevel2();
                    this.waterballoonsArr.push(new WaterBalloon(newWaterPos2[0], 
                        {positionX: newWaterPos2[1], speedY: newWaterPos2[2]}));
                } else if (this.currentLevel === 3) {
                    let newWaterPos3 = this.generateRandomBalloonPosLevel3();
                    this.waterballoonsArr.push(new WaterBalloon(newWaterPos3[0], 
                        {positionX: newWaterPos3[1], speedY: newWaterPos3[2]})); 
                } else if (this.currentLevel === 4) {
                    let newWaterPos4 = this.generateRandomBalloonPosLevel4();
                    this.waterballoonsArr.push(new WaterBalloon(newWaterPos4[0], 
                        {positionX: newWaterPos4[1], speedY: newWaterPos4[2]})); 
                } else if (this.currentLevel >= 5) {
                    let newWaterPos5 = this.generateRandomBalloonPosLevel5();
                    this.waterballoonsArr.push(new WaterBalloon(newWaterPos5[0], 
                        {positionX: newWaterPos5[1], speedY: newWaterPos5[2]})); 
                }
            }
          }

          if (this.remove == true){
            this.shots.splice(l, 1);
            this.remove = false;
          }
        }

        // oilballoonsArr
        for (let m = 0; m < this.shots.length; m++) {
            for (let n = 0; n < this.oilballoonsArr.length; n++) {
                // debugger;
              if (this.shots[m][1] <= (this.oilballoonsArr[n].position.y + this.oilballoonsArr[n].dims.height) && this.shots[m][0] >= this.oilballoonsArr[n].position.x && this.shots[m][0] <= (this.oilballoonsArr[n].position.x + this.oilballoonsArr[n].dims.width) ) {

                this.removee = true;
                this.oilballoonsArr.splice(n, 1);
                this.HitOilBalloons += 1;

                // let newOilPos = this.generateRandomBalloonPosLevel1();
                // this.oilballoonsArr.push(new OilBalloon(newOilPos[0], 
                //     {positionX: newOilPos[1], speedY: newOilPos[2]}));
                
                if (this.currentLevel === 1) {
                    let newOilPos = this.generateRandomBalloonPosLevel1();
                    this.oilballoonsArr.push(new OilBalloon(newOilPos[0], 
                        {positionX: newOilPos[1], speedY: newOilPos[2]}));
                    } else if (this.currentLevel === 2) {
                        let newOilPos2 = this.generateRandomBalloonPosLevel2();
                        this.oilballoonsArr.push(new OilBalloon(newOilPos2[0], 
                            {positionX: newOilPos2[1], speedY: newOilPos2[2]}));
                    } else if (this.currentLevel === 3) {
                        let newOilPos3 = this.generateRandomBalloonPosLevel3();
                        this.oilballoonsArr.push(new OilBalloon(newOilPos3[0], 
                            {positionX: newOilPos3[1], speedY: newOilPos3[2]})); 
                    } else if (this.currentLevel === 4) {
                        let newOilPos4 = this.generateRandomBalloonPosLevel4();
                        this.oilballoonsArr.push(new OilBalloon(newOilPos4[0], 
                            {positionX: newOilPos4[1], speedY: newOilPos4[2]})); 
                    } else if (this.currentLevel >= 5) {
                        let newOilPos5 = this.generateRandomBalloonPosLevel5();
                        this.oilballoonsArr.push(new OilBalloon(newOilPos5[0], 
                            {positionX: newOilPos5[1], speedY: newOilPos5[2]})); 
                    }
                }
            }
  
            if (this.removee === true){
              this.shots.splice(m, 1);
              this.removee = false;
            }
          }
  




    } 
      
    DetectMissedWaterballoons(){
        for (var j = 0; j < this.waterballoonsArr.length; j++) { 
            if ( this.waterballoonsArr[j].position.y > (this.gameHeight - this.waterballoonsArr[j].dims.height)) {
                
                this.waterballoonsArr.splice(j, 1);
                this.MissedWaterballoons += 1;

                console.log(this.MissedWaterballoons);

                // let newWatPos = this.generateRandomBalloonPosLevel1();
                // this.waterballoonsArr.push(new WaterBalloon(newWatPos[0], {positionX: newWatPos[1], speedY: newWatPos[2]}));
        
            
                if (this.currentLevel === 1) {
                    let newWaterPos = this.generateRandomBalloonPosLevel1();
                    this.waterballoonsArr.push(new WaterBalloon(newWaterPos[0], 
                        {positionX: newWaterPos[1], speedY: newWaterPos[2]}));
                    } else if (this.currentLevel === 2) {
                        let newWaterPos2 = this.generateRandomBalloonPosLevel2();
                        this.waterballoonsArr.push(new WaterBalloon(newWaterPos2[0], 
                            {positionX: newWaterPos2[1], speedY: newWaterPos2[2]}));
                    } else if (this.currentLevel === 3) {
                        let newWaterPos3 = this.generateRandomBalloonPosLevel3();
                        this.waterballoonsArr.push(new WaterBalloon(newWaterPos3[0], 
                            {positionX: newWaterPos3[1], speedY: newWaterPos3[2]})); 
                    } else if (this.currentLevel === 4) {
                        let newWaterPos4 = this.generateRandomBalloonPosLevel4();
                        this.waterballoonsArr.push(new WaterBalloon(newWaterPos4[0], 
                            {positionX: newWaterPos4[1], speedY: newWaterPos4[2]})); 
                    } else if (this.currentLevel >= 5) {
                        let newWaterPos5 = this.generateRandomBalloonPosLevel5();
                        this.waterballoonsArr.push(new WaterBalloon(newWaterPos5[0], 
                            {positionX: newWaterPos5[1], speedY: newWaterPos5[2]})); 
                    }
                
            }
        }  
    }


    DetectMissedOilballoons(){
        for (var j = 0; j < this.oilballoonsArr.length; j++) { 
            if ( this.oilballoonsArr[j].position.y > (this.gameHeight - this.oilballoonsArr[j].dims.height)) {
                
                this.oilballoonsArr.splice(j, 1);
                this.Missedoilballoons += 1;
                
                console.log(this.Missedoilballoons);

                // let newOilPos = this.generateRandomBalloonPosLevel1();
                // this.oilballoonsArr.push(new OilBalloon(newOilPos[0], {positionX: newOilPos[1], speedY: newOilPos[2]}));
                
                if (this.currentLevel === 1) {
                    let newOilPos = this.generateRandomBalloonPosLevel1();
                    this.oilballoonsArr.push(new OilBalloon(newOilPos[0], 
                        {positionX: newOilPos[1], speedY: newOilPos[2]}));
                    } else if (this.currentLevel === 2) {
                        let newOilPos2 = this.generateRandomBalloonPosLevel2();
                        this.oilballoonsArr.push(new OilBalloon(newOilPos2[0], 
                            {positionX: newOilPos2[1], speedY: newOilPos2[2]}));
                    } else if (this.currentLevel === 3) {
                        let newOilPos3 = this.generateRandomBalloonPosLevel3();
                        this.oilballoonsArr.push(new OilBalloon(newOilPos3[0], 
                            {positionX: newOilPos3[1], speedY: newOilPos3[2]})); 
                    } else if (this.currentLevel === 4) {
                        let newOilPos4 = this.generateRandomBalloonPosLevel4();
                        this.oilballoonsArr.push(new OilBalloon(newOilPos4[0], 
                            {positionX: newOilPos4[1], speedY: newOilPos4[2]})); 
                    } else if (this.currentLevel >= 5) {
                        let newOilPos5 = this.generateRandomBalloonPosLevel5();
                        this.oilballoonsArr.push(new OilBalloon(newOilPos5[0], 
                            {positionX: newOilPos5[1], speedY: newOilPos5[2]})); 
                    }
            }
        }  
    }
   

    drawShot(ctx) {
        if (this.shots.length)
          for (let i = 0; i < this.shots.length; i++) {
            ctx.fillStyle = 'brown';
            ctx.fillRect(this.shots[i][0],this.shots[i][1],this.shots[i][2],this.shots[i][3])
        }
    }

    moveShot() {
        for (var i = 0; i < this.shots.length; i++) {
          if (this.shots[i][1] > -10) {
            this.shots[i][1] -= 22;
          } else if (this.shots[i][1] < -10) {
            this.shots.splice(i, 1);
          }
        }
    }


    drawWaterBalloons(ctx) {
        for (var i = 0; i < this.waterballoonsArr.length; i++) {
            this.waterballoonsArr[i].draw(ctx)
        }
    }

    updateWaterBalloons(dt) {
        for (var i = 0; i < this.waterballoonsArr.length; i++) {
            this.waterballoonsArr[i].update(dt)
        }
    }

    drawOilBalloons(ctx) {
        for (var i = 0; i < this.oilballoonsArr.length; i++) {
            this.oilballoonsArr[i].draw(ctx)
        }
    }

    updateOilBalloons(dt) {
        for (var i = 0; i < this.oilballoonsArr.length; i++) {
            this.oilballoonsArr[i].update(dt)
        }
    }



    drawScore(ctx) {
        ctx.font = "20px Orbitron";
        ctx.fillStyle = "brown";
        ctx.fillText("Water Balloons Missed: "+ this.MissedWaterballoons, 610, 40);

        ctx.fillStyle = "brown";
        ctx.fillText("Oil Balloons Hit: " + this.HitOilBalloons, 695, 20);

        ctx.fillStyle = "green";
        ctx.fillText("Score: "+ this.totalScore, 8, 20);

        ctx.fillText("Level: "+ this.currentLevel, 8, 40);
    }
}



    // allObjects() {
    //     return [].concat(this.waterballoonsArr, this.oilBalloonsArr, this.arrowsArr);
    // }
    

    // add(object) {
    //     if (object instanceof WaterBalloon) {
    //       this.waterballoonsArr.push(object);
    //     } else if (object instanceof OilBalloon) {
    //       this.oilballoonsArr.push(object);
    //     } else if (object instanceof Arrows) {
    //       this.arrowsArr.push(object);
    //     } else {
    //       throw new Error("unknown type of object");
    //     }

    //     // object.draw(ctx)
    // }



    // if ( !this.gameOver && ( this.waterb.position.y > (this.gameHeight - this.waterb.dims.height) ) ) 
        // {
        //     this.waterb.speed.y = 0;
        //     this.waterb.speed.x = 0;
        //     this.waterb.position.y = this.gameHeight - this.waterb.dims.height
        //     console.log("you lose bitch") 
        //     this.gameOver = true;
        //     return;
        // }
        
        // let a = this.waterb.position.x;
        // let b = this.waterb.position.y

        // if ( !this.gameOver && ( this.waterb.position.y > (this.theGoat.position.y - this.waterb.dims.height) ) && (this.waterb.position.x > (this.theGoat.position.x) ) && (this.waterb.position.x < ( this.gameWidth - this.theGoat.position.x))  ) 
        // {
        //     this.waterb.speed.y = 0;
        //     this.waterb.speed.x = 0;
        //     this.waterb.position.y = b;
        //     this.waterb.position.x = a;
        //     console.log("you lose bitch") 
        //     this.gameOver = true;
        //     return;
        // }