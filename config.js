/* ===== PLAYER 01: ARIEF — settings you can edit ===== */
window.ARIEF_CONFIG = {
  // Put Arief's photo in the assets folder with this exact name (JPG or PNG).
  // Then set photo below to 'assets/arief-photo.jpg'. Empty = the hand-drawn pixel sprite.
  photo: '',   // e.g. 'assets/arief-photo.jpg'

  // Crop of the photo. Arief stands on the LEFT of the original photo.
  photoX: 0.27,     // 0 = left edge, 1 = right edge (centre of the crop)
  photoY: 0.40,     // 0 = top, 1 = bottom
  photoZoom: 1.15,  // 1 = wide crop (head + shoulders), 3 = very close

  instance: 'web',  // change this to reset everyone's saved progress
  hotkeys: true     // keyboard: 1/2/3 skills in battle, A-D in quiz, Esc closes popups
};
