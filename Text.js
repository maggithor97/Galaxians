function Text(ctx, text, x, y, font) {
  ctx.save();
  ctx.translate(x, y);

  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') continue;
    
    let letter = font[text[i]];
    let fx = (i * (font.size[0] + 3));

    ctx.drawImage(g_images.sheet, 
                  letter[0], letter[1],
                  7, 7,
                  fx, 0,
                  font.size[0], font.size[1]);
  }

  ctx.restore();
}