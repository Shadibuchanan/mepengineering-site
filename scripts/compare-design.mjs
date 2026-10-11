import sharp from 'sharp';
const meta = await sharp('Website_Design.png').metadata();
console.log({reference: {width:meta.width,height:meta.height}});
// The reference is a two-column presentation of a single scrolling page.
// Its left column contains the hero, introduction, and selected projects.
const sourceWidth = Math.round(meta.width * .573);
const sourceHeroHeight = Math.round(meta.height * .405);
const sourceHero = await sharp('Website_Design.png').extract({left:0,top:0,width:sourceWidth,height:sourceHeroHeight}).resize({width:1000}).toBuffer();
const implementationHero = await sharp('qa/home-desktop.png').extract({left:0,top:0,width:1440,height:830}).resize({width:1000}).toBuffer();
await sharp({create:{width:2024,height:590,channels:3,background:'#eeeeea'}}).composite([{input:sourceHero,top:0,left:0},{input:implementationHero,top:0,left:1024}]).png().toFile('qa/hero-comparison.png');
await sharp('qa/home-desktop.png').extract({left:0,top:0,width:1440,height:1050}).toFile('qa/home-desktop-top.png');
await sharp('qa/home-mobile.png').extract({left:0,top:0,width:390,height:1100}).toFile('qa/home-mobile-top.png');
await sharp('qa/contact-mobile.png').resize({width:390}).toFile('qa/contact-mobile-review.png');
await sharp('qa/project-desktop.png').extract({left:0,top:0,width:1440,height:1250}).resize({width:1000}).toFile('qa/project-desktop-top.png');
const srcFull = await sharp('Website_Design.png').extract({left:0,top:0,width:sourceWidth,height:meta.height}).resize({width:700}).toBuffer();
const implFull = await sharp('qa/home-desktop.png').extract({left:0,top:0,width:1440,height:2170}).resize({width:700}).toBuffer();
await sharp({create:{width:1424,height:1100,channels:3,background:'#eeeeea'}}).composite([{input:srcFull,top:0,left:0},{input:implFull,top:0,left:724}]).png().toFile('qa/sections-comparison.png');
