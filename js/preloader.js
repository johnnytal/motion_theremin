var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){ 
        progressTxt = this.progress = this.game.add.text(0, this.game.world.centerY - 30, '0%',{
             font: '32px', fill: 'white', fontWeight: 'normal', align: 'center'
        });
        progressTxt.x = this.game.world.centerX - progressTxt.width / 2;
        this.progress.anchor.setTo(0.5, 0.5);
        this.game.load.onFileComplete.add(this.fileComplete, this);
  
        loadingTxt = this.add.text(0,  this.game.world.centerY - 150, "Loading...", {
            font: '24px', fill: 'lightgrey', fontWeight: 'normal', align: 'center'
        });
        loadingTxt.x = this.game.world.centerX - loadingTxt.width / 2;
        
        game.load.image('bg', 'assets/images/new_bg.png');
        game.load.image('xtraBg', 'assets/images/bg.png');
        game.load.image('next', 'assets/images/next.png');
        game.load.image('info', 'assets/images/info.png');
        game.load.image('return', 'assets/images/return.png');
        game.load.image('reset', 'assets/images/reset.png');
        game.load.image('lock', 'assets/images/lock.png');
        game.load.image('theremin_btn', 'assets/images/menu/theremin.png');
        game.load.image('home_btn', 'assets/images/home.png');
        game.load.image('info_btn', 'assets/images/menu/info.png');
        game.load.image('logo', 'assets/images/menu/logo.png');

        game.load.spritesheet('band_btn', 'assets/images/band_btn.png', 251/2, 101);
 
        game.load.audio('acoustic', 'assets/audio/acoustic_CM_104.ogg');
        game.load.audio('blues', 'assets/audio/blues_CM120.ogg');
        game.load.audio('clean', 'assets/audio/clean_Am_120.ogg');
        game.load.audio('funky', 'assets/audio/funky_Cm_120.ogg');

    },
    
    create: function(){
        game.state.start("Menu"); 
    }
};

preloader.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
    this.progress.text = progress+"%";
};