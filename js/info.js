var info = function(game){};

info.prototype = {
    preload: function(){},
    
    create: function(){  
        info_text = game.add.text(35, 75, 
        "1. Motion theremin uses readings from your device's acceleration sensor\nto alternate the frequency of an occilator.\n\n" +
        "2. Tilt your device on the Y axis to change the tone - \nThe lower you tilt - the lower the frequency.\n\n" +
        "3. Experiment with the different options:\n" +
        "  WAVEFORM - Sin for relaxing, Saw for rock'n'roll, Tri's nice for anything"+ '\n'+
        "  SCALE - Can't go wrong with Blues / Pentatonic, Hijaz is fun,\n    try 'no scale' for a true theremin challenge."+ '\n'+
        "  DIVISION - How many notes you want in your scale.\n    More notes will increase sensor sensitivity."+ '\n'+
        "  TEMPO - How often the sensor is reading, e.g 120 BPM = reading every 500ms."+ '\n'+
        "  ATTACK - The time it takes the sound to reach maximum level."+ '\n'+
        "  RELEASE - The time it takes the sound to fade out to nothing."+ '\n'+
        "  REVERB - Reverberation amount..."+ '\n'+
        "  VIBRATO - Amount of sound vibrations."+ '\n\n'+
        "❤ Please rate this free app so others may find and enjoy it too! ❤\n\n" +
        "Created by Johnny Tal, iLyichArts - johnnytal9@gmail.com\n\n", {
            font: '28px ' + font, fill: 'white', align: 'left', stroke:'#ffffff', strokeThickness: 0
        });
        
        home_btn = game.add.sprite(300, 935, 'home_btn');
        home_btn.inputEnabled = true;
        home_btn.events.onInputDown.add(function(){
            if(AdMob) AdMob.showInterstitial();
            game.state.start("Menu");  
        }, this);
        
        game.add.text(120, 890, '(An ad will be displayed before return to main screen)', {
            font: '22px ' + font, fill: 'white', fontWeight: 'normal', align: 'center'
        });
        
        game.stage.backgroundColor = '#000';
    }
};

function initInterAd(){
	if(AdMob) AdMob.prepareInterstitial( {adId: 'ca-app-pub-9795366520625065/6987972342', autoShow:false} );
}


