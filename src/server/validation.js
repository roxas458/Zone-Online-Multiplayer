// Input sanitization and player-state normalization.
function clean(value, max = 80) {
  return String(value ?? '').replace(/[<>\u0000-\u001f]/g, '').trim().slice(0, max);
}

function validId(value) {
  return /^[a-f0-9-]{16,64}$/i.test(String(value || ''));
}

function createSafeState(FACTIONS, LOCATIONS) {
  return function safeState(input) {
    const s = input && typeof input === 'object' ? input : {};
    return {
      name: clean(s.name, 24) || 'Сталкер',
      faction: FACTIONS.has(s.faction) ? s.faction : 'Одиночки',
      characterCreated: s.characterCreated === true,
      loc: LOCATIONS.has(s.loc) ? s.loc : 'cordon',
      money: Math.max(0, Math.min(99999999, Number(s.money) || 0)),
      hp: Math.max(0, Math.min(100, Number(s.hp) || 100)),
      xp: Math.max(0, Math.min(1e7, Number(s.xp) || 0)),
      rep: Math.max(-1000, Math.min(1000, Number(s.rep) || 0)),
      state: s
    };
  };
}

module.exports = { clean, validId, createSafeState };
