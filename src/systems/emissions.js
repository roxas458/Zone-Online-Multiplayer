function nextEmission(state,roll=Math.random){if(state==='calm'&&roll()<.16)return 'warning';if(state==='warning'&&roll()<.45)return 'active';if(state==='active')return 'cooldown';if(state==='cooldown')return 'calm';return state||'calm';}
module.exports={nextEmission};
