export class AudioSystem{
 constructor(){this.ctx=null;this.sfx=true;this.music=true;this.volume=.45;this.timer=null;}
 ready(){this.ctx??=new(window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume();}
 tone(freq=220,duration=.05,type='sine',gain=.1){if(!this.sfx)return;this.ready();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain*this.volume,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+duration);o.connect(g).connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+duration);}
 play(name){const map={move:[170,.025],rotate:[330,.05],soft:[120,.02],drop:[75,.14],lock:[110,.07],line:[660,.18],tetris:[880,.4],hold:[260,.08],level:[990,.3],over:[55,.7]};this.tone(...(map[name]||[220,.05]),name==='drop'?'sawtooth':'square');}
 setMusic(on){this.music=on;clearInterval(this.timer);if(on){let n=0;this.timer=setInterval(()=>this.tone([110,138,165,220][n++%4],.12,'triangle',.025),420);}}
}
