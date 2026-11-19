function addInfluence(control,amount){return Math.max(0,Math.min(100,(Number(control)||0)+amount));}
function resolveControl(owner,claimant,control){return control>=100?{owner:claimant,control:55}:{owner,control};}
module.exports={addInfluence,resolveControl};
