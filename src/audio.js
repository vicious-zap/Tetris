export class AudioSystem{
 constructor(){this.ctx=null;this.sfx=true;this.music=false;this.volume=.45;this.musicTimer=null}
 init(){if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)()}
 tone(freq=220,duration=.06,type='sine',gain=.08){if(!this.sfx)return;this.init();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain*this.volume,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+duration);o.connect(g).connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+duration)}
 play(name){const map={move:[150,.025,'square'],rotate:[350,.05,'triangle'],soft:[110,.025,'sine'],drop:[75,.12,'sawtooth'],lock:[120,.06,'square'],line:[540,.18,'triangle'],combo:[720,.2,'sine'],tetris:[920,.35,'sawtooth'],level:[780,.4,'triangle'],over:[65,.7,'sawtooth']};this.tone(...(map[name]||map.move))}
 toggleMusic(){this.music=!this.music;clearInterval(this.musicTimer);if(this.music){this.init();let n=0;this.musicTimer=setInterval(()=>{if(this.music){this.tone([110,138,165,220][n++%4],.18,'sine',.025)}},420)}return this.music}
}
