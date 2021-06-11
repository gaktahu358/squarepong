window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1000,
		height: 600,
		type: Phaser.AUTO,
		physics:{
			default : 'arcade',
			arcade: {
				gravity: { y : 20 },
			}
		},
        backgroundColor: "#123C69",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		}
	});
	
	game.scene.add("Boot", Boot, true);

});

class Boot extends Phaser.Scene {
	init(){

	this.paddleRightVelocity = new Phaser.Math.Vector2(0,0)

	this.leftScore = 0
	this.rightScore = 0 


	}

	preload()
    {
		
	}

	create() {

		this.physics.world.setBounds(-100, 0, 10500, 600)

		this.ball = this.add.rectangle(400, 250, 20, 20, 0x348238)
		this.physics.add.existing(this.ball)
		this.ball.body.setBounce(1, 1)

		this.ball.body.setCollideWorldBounds(true, 1, 1)

		this.resetBall()

		const angle = Phaser.Math.Between(0, 360)
		const vec = this.physics.velocityFromAngle(angle, 200)

		this.ball.body.setVelocity(vec.x, vec.y)

		this.paddleLeft = this.add.rectangle(50, 250, 30, 100, 0xC3073F)
		this.physics.add.existing(this.paddleLeft, true)

		this.paddleRight = this.add.rectangle(950, 250, 30, 100,0xC3073F)
		this.physics.add.existing(this.paddleRight, true)

		
		this.physics.add.collider(this.paddleLeft, this.ball)
		this.physics.add.collider(this.paddleRight, this.ball)

        const scoreStyle = {
			fontSize: 48
		}

        this.leftScoreLabel =  this.add.text(300, 125, '0',scoreStyle)
		 .setOrigin(0.5, 0.5)
		 
		this.rightScoreLabel =  this.add.text(600, 375, '0',scoreStyle)
		 .setOrigin(0.5, 0.5)

		this.cursors = this.input.keyboard.createCursorKeys()


	}

    update()
	{
		/** @type {Phaser.Physics.Arcade.Body} */
		const body = this.paddleLeft.body

       if(this.cursors.up.isDown)
	   {
		   console.log('up pressed')
		   this.paddleLeft.y -=12
		   body.updateFromGameObject()

	   } 
	   else if(this.cursors.down.isDown)
	   {
		   console.log('down')
		   this.paddleLeft.y +=12
		   body.updateFromGameObject()
	   }

	   const diff = this.ball.y - this.paddleRight.y
	   if (Math.abs(diff) < 40){
		   return
	   }

	   const aiSpeed = 10
	   if (diff < 0)
	   {
          this.paddleRightVelocity.y =-aiSpeed
		  if (this.paddleRightVelocity.y < -10)
		{
			this.paddleRightVelocity.y = -10
		}
	   }
	   else if(diff > 0)
	   {
		this.paddleRightVelocity.y =aiSpeed
		if (this.paddleRightVelocity.y > 10)
		{
			this.paddleRightVelocity.y = 10
		}
	   }

	   this.paddleRight.y += this.paddleRightVelocity.y
	   this.paddleRight.body.updateFromGameObject()
	   
	   if(this.ball.x < 0)
	   {
		   //score kiri
		   this.resetBall()
		   this.incrementLeftScore()

	   }
	   else if(this.ball.x > 1000)
	   {
		   //score kanan
		   this.resetBall()
		   this.incrementRightScore()
		   
	   }

	}

	incrementLeftScore()
	{
		this.rightScore += 1
		this.rightScoreLabel.text = this.rightScore
	}

	incrementRightScore()
	{
		this.leftScore += 1
		this.leftScoreLabel.text = this.leftScore
	}
	
	resetBall(){

		this.ball.setPosition(400,250)

		const angle = Phaser.Math.Between(0, 360)
		const vec = this.physics.velocityFromAngle(angle, 200)

		this.ball.body.setVelocity(vec.x, vec.y)

	}
}