var menu = function(game){};

menu.prototype = {
    create: function(){  
    	game.stage.backgroundColor = '#000';
    	
        bg = game.add.image(0, 0, 'bg');
        bg.alpha = 0;
	    game.add.tween(bg).to( { alpha: .8}, 600, Phaser.Easing.Linear.None, true);

        logo = game.add.image(30, 1100 - 210, 'logo');

        theremin_btn = game.add.image(40, 310, 'theremin_btn');
        theremin_btn.x = game.world.centerX - theremin_btn.width / 2;
        theremin_btn.alpha = .8;
      
        info_btn = game.add.image(440, 630, 'info_btn');
        info_btn.alpha = .9;
        info_btn.x = game.world.centerX - info_btn.width / 2;
        
	    thereminText = game.add.text(theremin_btn.x + theremin_btn.width / 2, theremin_btn.y + theremin_btn.height / 4
	    	, 'Play the\nTheremin', {
	        font: '56px ' + font, fill: '#f7f7f7', fontWeight: 'bold', align: 'center', stroke:'purple', strokeThickness: 2
	    });

	    instructText = game.add.text(30, 40
	    	, 'Motion Theremin', {
	        font: '64px ' + font, fill: '#f7f7f7', fontWeight: 'bold', align: 'center', stroke:'orange', strokeThickness: 2
	    });
	    instructText2 = game.add.text(30, 115
	    	, 'Music with a gesture', {
	        font: '42px ' + font, fill: '#f7f7f7', fontWeight: 'bold', align: 'center', stroke:'purple', strokeThickness: 2
	    });
	    instructText2.alpha = 0.9;
	    
	    instructText.x = game.world.centerX - instructText.width / 2;
	    instructText2.x = game.world.centerX - instructText2.width / 2;
	    
	    instructText3 = game.add.text(30, 1020
	    	,'Make sure to check out\nCompass theremin & Light theremin on Google Play!', {
	        font: '22px ' + font, fill: '#f7f7f7', fontWeight: 'bold', align: 'center', stroke:'purple', strokeThickness: 1
	    });
	    instructText3.x = game.world.centerX - instructText3.width / 2;
	    
	    theremin_btn.inputEnabled = true;
	    theremin_btn.events.onInputDown.add(function(){
	        game.state.start("Game");
	    }, this);
	    
	    info_btn.inputEnabled = true;
	    info_btn.events.onInputDown.add(function(){
			game.state.start("Info");
			initAd();
	    }, this);
            
        setTimeout(function(){
            try{
                StatusBar.hide;
            } catch(e){}
        }, 2500);  
        
        loadSounds();
    }
};

function initAd(){
    var admobid = {};

    admobid = {
        interstitial: 'ca-app-pub-9795366520625065/6987972342',
        banner: 'ca-app-pub-9795366520625065/4118266427'
    };

    if(AdMob) AdMob.createBanner({
    	adId: admobid.banner,
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow: true
    });

    if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );  
}
