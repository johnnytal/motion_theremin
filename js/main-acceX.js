var gameMain = function(game){   
    var osc, rev, accelY, frequency, frequency_check, volume;
    var note, last_frequency, wave, scale, reverb, tempo;
    var attack, release, vibrato;
    var watchID, tryToShowAd;
    
    musicPlayed = false;
    
    notes = {
    	'Chromatic' : ['G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5','F5','F#5','G5','G#5','A5','A#5','B5',
        'C6','C#6','D6','D#6','E6','F6','F#6','G6'],
    	
    	'Major' : ['A3','B3','C4','D4','E4','F4','G4','A4','B4',
        'C5','D5','E5','F5','G5','A5','B5',
        'C6','D6','E6','F6','G6','A6','B6','C7','D7'],
    	
    	'Minor' : ['Ab3','Bb3','C4','D4','Eb4','F4','G4','Ab4','Bb4',
        'C5','D5','Eb5','F5','G5','Ab5','Bb5',
        'C6','D6','D#6','F6','G6','Ab6','Bb6','C7','D7'],
    	
    	'Blues' : ['G3','Bb3','C4','Eb4','F4','Gb4','G4','Bb4',
        'C5','Eb5','F5','Gb5','G5','Bb5','C6','Eb6','F6','Gb6','G6','Bb6','C7','Eb7', 'F7', 'F#7', 'G7'],
    	
    	'Pentatonic': ['C3','D3','F3','G3','A3',
        'C4','D4','F4','G4','A4', 
        'C5','D5','F5','G5','A5',
        'C6','D6','F6','G6','A6','C7', 
        'D7','F7','G7','A7', 'C8'],
    	
    	'Hijaz': [ 'Ab3','B3','C4','Db4','E4','F4','G4','Ab4','B4',
        'C5','Db5','E5','F5','G5','Ab5','B5',
        'C6','Db6','E6','F6','G6','Ab6','B6','C7', 'Db7'],
    	
    	'None' : ''
    };

    reverbs = [0, 0.3, 0.5, 0.7, 1];
    labelsAmount = ['0%', '25%', '50%', '75%', '100%'];
    waves = ['sin', 'saw', 'tri'];
    scales = ['Chromatic', 'Major', 'Minor', 'Blues', 'Pentatonic', 'Hijaz', 'None'];
    tempos = ['None', 60, 120, 180, 240];
    
    attacks = [10, 150, 400, 600];
	releases = [600 ,1000, 1750, 2500];
	vibratos = [0, 2, 4, 7, 9];
	divisions = [8, 12, 18, 24];
};

gameMain.prototype = {
    create: function(){  
        note = 10; 
        last_frequency = -1;

        wave = 2;
        scale = 3;
        reverb = 1;
        tempo = 0;
        volume = 0.4;
        
        attack = 0;
        release = 1;
        vibrato = 1;
        division = 1;

        bg = game.add.image(0, 0, 'bg');
        bg.alpha = 0.35;
        
        loadSounds();

        buttons_labels();

        setTimeout(function(){
        	watchReading();
        }, 1000);
        
        setTimeout(function(){
            try{
            	window.plugins.insomnia.keepAwake();
        	} catch(e){}	
        }, 2500);
        
        initAd();
    }
};

function watchReading(){
    watchID = navigator.accelerometer.watchAcceleration(readAccel, onError, { frequency: 50 });
}

function getReading(){
    var freq = 60000 / tempos[tempo];
    watchID = navigator.accelerometer.watchAcceleration(readAccel, onError, { frequency: freq });
}

function readAccel(acceleration){    
    accelY = Math.round(acceleration.y + 11);
 
    accelY = Math.round(accelY / (24/divisions[division]));

    if (accelY < 0) accelY = 0;
    else if (accelY > 24) accelY = 24;   
    
    frequency_check = Math.round(65 + ((acceleration.y + 11) * 74));
    frequency_text = "";

    if (scale != 6){
        var theScale = scales[scale];
    	var theNotes = notes[theScale];
    	var theOneNote = theNotes[accelY];
    	
    	try{
    		frequency = teoria.note(theOneNote).fq();
    	}catch(e){}
    	
    	frequency_text = theOneNote;
    }

    else{
        frequency = frequency_check; 
        frequency_text = Math.round(frequency) + "Hz"; 
    }
	    
    try{
	    var r = Math.round(acceleration.y + 11) * 7;
        var g = Math.abs(Math.round(acceleration.y) * 15);
        var b = 155 - Math.round(acceleration.y + 11) * 5;
	    
	    game.stage.backgroundColor = 'rgb(' + r + ',' + g + ',' + b +')';
    } catch(e){}
	    
	if (frequency != last_frequency){  
	    var frequency_text_correct = frequency_text.replace("#", "♯");
	    debug_label.text = 'AccelY :  ' + Math.round(acceleration.y * 10) / 10 + '  =  ' + frequency_text_correct;

	    osc = T("cosc", {wave:waves[wave], beats:vibratos[vibrato], mul:volume});
	    osc.set({freq: frequency});
	    
	    rev = T("reverb", {room:0.9, damp:0.4, mix:reverbs[reverb]}, osc);
	    
	    T("perc", {a: attacks[attack], d:3000, s:4800, r: releases[release]}, rev).on("ended", function() {
	        this.pause();
	    }).bang().play();
	    
	    last_frequency = frequency;
    }
}

function buttons_labels(){
    waveBtn = game.add.sprite(50, 350, 'next');
    waveBtn.inputEnabled = true;
    waveBtn.events.onInputDown.add(function(){
        wave++;
        if (wave > 2) wave = 0;
        Label_wave.text = waves[wave];

	    if (waves[wave] == 'sin') volume = 0.55;
	    else if (waves[wave] == 'tri') volume = 0.4;
	    else if (waves[wave] == 'saw') volume = 0.25;
    }, this);
    
    scaleBtn = game.add.sprite(50, 550, 'next');
    scaleBtn.inputEnabled = true;
    scaleBtn.events.onInputDown.add(function(){
    	stopMusic();
        scale++;
        if (scale > 6) scale = 0;
        Label_scale.text = scales[scale];
    }, this);
    
    divisionBtn = game.add.sprite(50, 750, 'next');
    divisionBtn.inputEnabled = true;
    divisionBtn.events.onInputDown.add(function(){
        division++;
        if (division > 3) division = 0;
        Label_division.text = divisions[division];
    }, this);
    
    tempoBtn = game.add.sprite(50, 950, 'next');
    tempoBtn.inputEnabled = true;
    tempoBtn.events.onInputDown.add(function(){
        if (tempo < 4){
            tempo++;
            Label_tempo.text = tempos[tempo] + " bpm";  
            changeTempo();
        } 
        else if (tempo == 4){
            tempo = 0;
            Label_tempo.text = tempos[tempo] + " bpm";  
            changeTempo();
        } 
    }, this);
	
	
    text5 = game.add.text(50, 275, 'Waveform', {
        font: '40px ' + font, fill: 'yellow', fontWeight: 'bold', align: 'center'
    });
    text6 = game.add.text(50, 475, 'Scale', {
        font: '40px ' + font, fill: 'lightyellow', fontWeight: 'bold', align: 'center'
    });
    text7 = game.add.text(50, 675, 'Division', {
        font: '40px ' + font, fill: 'yellow', fontWeight: 'bold', align: 'center'
    });
    text8 = game.add.text(50, 875, 'Tempo', {
        font: '40px ' + font, fill: 'lightyellow', fontWeight: 'bold', align: 'center'
    });


    Label_wave = game.add.text(70, waveBtn.y + waveBtn.height / 2, waves[wave], {
        font: '47px ' + font, fill: 'whitesmoke', fontWeight: 'bold', align: 'center'
    });
    Label_wave.anchor.set(0, 0.5);

    Label_scale = game.add.text(70, scaleBtn.y + waveBtn.height / 2, scales[scale], {
        font: '47px ' + font, fill: 'whitesmoke', fontWeight: 'bold', align: 'center'
    });
    Label_scale.anchor.set(0, 0.5);

    Label_division = game.add.text(70, divisionBtn.y + waveBtn.height / 2, divisions[division], {
        font: '47px ' + font, fill: 'whitesmoke', fontWeight: 'bold', align: 'center'
    });
    Label_division.anchor.set(0, 0.5);

    Label_tempo = game.add.text(70, tempoBtn.y + waveBtn.height / 2, tempos[tempo], {
        font: '47px ' + font, fill: 'whitesmoke', fontWeight: 'bold', align: 'center'
    });
    Label_tempo.anchor.set(0, 0.5);


 	attackBtn = game.add.sprite(450, 350, 'next');
    attackBtn.inputEnabled = true;
    attackBtn.events.onInputDown.add(function(){
        attack++;
        if (attack > 3) attack = 0;
        Label_attack.text = attacks[attack];
    }, this);
    
    releaseBtn = game.add.sprite(450, 550, 'next');
    releaseBtn.inputEnabled = true;
    releaseBtn.events.onInputDown.add(function(){
        release++;
        if (release > 3) release = 0;
        Label_release.text = releases[release];
    }, this);
    
    reverbBtn = game.add.sprite(450, 750, 'next');
    reverbBtn.inputEnabled = true;
    reverbBtn.events.onInputDown.add(function(){
        if (reverb < 4) reverb++;
        else if (reverb == 4) reverb = 0;
        Label_reverb.text = labelsAmount[reverb];
    }, this);
    
    vibratoBtn = game.add.sprite(450, 950, 'next');
    vibratoBtn.inputEnabled = true;
    vibratoBtn.events.onInputDown.add(function(){
        if (vibrato < 4) vibrato++;
        else if (vibrato == 4) vibrato = 0;
        Label_vibrato.text = labelsAmount[vibrato];
    }, this);
    
    band_btn = game.add.sprite(50, 130, 'band_btn');
    band_btn.inputEnabled = true;
    band_btn.events.onInputDown.add(function(){
		playMusic();
    }, this);

    text1 = game.add.text(450, 275, 'Attack', {
        font: '40px ' + font, fill: 'yellow', fontWeight: 'bold', align: 'center'
    });
    text2 = game.add.text(450, 475, 'Release', {
        font: '40px ' + font, fill: 'lightyellow', fontWeight: 'bold', align: 'center'
    });
    text3 = game.add.text(450, 675, 'Reverb', {
        font: '40px ' + font, fill: 'yellow', fontWeight: 'bold', align: 'center'
    });
    text4 = game.add.text(450, 875, 'Vibrato', {
        font: '40px ' + font, fill: 'lightyellow', fontWeight: 'bold', align: 'center'
    });
    
    
    Label_attack = game.add.text(470, waveBtn.y + waveBtn.height / 2, attacks[attack], {
        font: '47px ' + font, fill: 'whitesmoke', fontWeight: 'bold', align: 'center'
    });
    Label_attack.anchor.set(0, 0.5);

    Label_release = game.add.text(470, scaleBtn.y + waveBtn.height / 2, releases[release], {
        font: '47px ' + font, fill: 'whitesmoke', fontWeight: 'bold', align: 'center'
    });
    Label_release.anchor.set(0, 0.5);

    Label_reverb = game.add.text(470, divisionBtn.y + waveBtn.height / 2, labelsAmount[reverb], {
        font: '47px ' + font, fill: 'whitesmoke', fontWeight: 'bold', align: 'center'
    });
    Label_reverb.anchor.set(0, 0.5);

    Label_vibrato = game.add.text(470, tempoBtn.y + waveBtn.height / 2, labelsAmount[vibrato], {
        font: '47px ' + font, fill: 'whitesmoke', fontWeight: 'bold', align: 'center'
    });
    Label_vibrato.anchor.set(0, 0.5);

    debug_label = game.add.text(50, 50, "AccelY: 0.0  =  A4", 
    {font: '46px ' + font, fill: 'white', fontWeight: 'bold', align: 'center'});

    reset_btn = game.add.sprite(540, 50, 'reset');
    reset_btn.inputEnabled = true;
    reset_btn.events.onInputDown.add(function(){
    	stopMusic();
        game.state.start("Game");  
    }, this);

    home_btn = game.add.sprite(390, 50, 'home_btn');
    home_btn.inputEnabled = true;
    home_btn.events.onInputDown.add(function(){
    	stopMusic();
		game.state.start("Menu");
    }, this);
    
    var labels = [Label_vibrato, Label_reverb, Label_release, Label_attack, 
    Label_scale, Label_wave, Label_division, Label_tempo,
    text1, text2, text3, text4, text5, text6, text7, text8, 
    vibratoBtn, reverbBtn, releaseBtn, attackBtn, scaleBtn, waveBtn, divisionBtn, tempoBtn,
    reset_btn, home_btn, band_btn];
    
    lock_btn = game.add.sprite(690, 50, 'lock');
    lock_btn.inputEnabled = true;
    lock_btn.events.onInputDown.add(function(){
    	 
         for(n=0; n<labels.length; n++){
         	if (labels[labels.length-1].alpha == 1){
         		game.add.tween(labels[n]).to( { alpha: 0 }, 500, "Linear", true);
         		labels[n].inputEnabled = false;
         	}
         	else{
         		game.add.tween(labels[n]).to( { alpha: 1 }, 500, "Linear", true);
         		labels[n].inputEnabled = true;
         	}
         } 
    }, this);
}

function playMusic(){
	if (!musicPlayed){
		band_btn.frame = 1;
		musicPlayed = true;
		
		if (scales[scale] == 'None'){			
			allMusic[game.rnd.integerInRange(0, 3)].play();
		}
		else if (scales[scale] == 'Chromatic'){
			allMusic[game.rnd.integerInRange(0, 3)].play();
		}
		else if (scales[scale] == 'Major'){
			sfxAcoustic.play();
		}
		else if (scales[scale] == 'Minor'){
			sfxClean.play();
		}
		else if (scales[scale] == 'Blues'){
			sfxBlues.play();
		}
		else if (scales[scale] == 'Pentatonic'){
			sfxFunky.play();
		}
		else if (scales[scale] == 'Hijaz'){
			sfxClean.play();
		}
	}
	else{
		stopMusic();
	}
}

function stopMusic(){
	band_btn.frame = 0;
	musicPlayed = false;
		
	for (m=0; m<4; m++){
		if (allMusic[m].isPlaying){
			allMusic[m].stop();
		}
	}	
}

function loadSounds(){
	sfxAcoustic = game.add.audio('acoustic', 0.9, true);
	sfxBlues = game.add.audio('blues', 0.9, true);
	sfxClean = game.add.audio('clean', 0.9, true);
	sfxFunky = game.add.audio('funky', 0.9, true);
	
	allMusic = [sfxAcoustic, sfxBlues, sfxClean, sfxFunky];
}

function changeTempo(){
    if (tempo != 0){
        navigator.accelerometer.clearWatch(watchID);
        getReading();
    }
    
    else {
        Label_tempo.text = tempos[tempo];
        navigator.accelerometer.clearWatch(watchID);
        watchReading();
    }
}

function onError() {
    alert('Sorry, No acceleration reading detected!');
};