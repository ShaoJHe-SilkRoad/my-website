// Run node scripts/build-homepage.cjs after editing homepage content or markup.
const fs=require('fs'),vm=require('vm');
const root=require('path').resolve(__dirname,'..');
const context={window:{}};vm.runInNewContext(fs.readFileSync(root+'/content/homepage-content.js','utf8'),context);
const c=context.window.SHAOTING_HOME_CONTENT.en, render=require(root+'/homepage.js');
const escape=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
fs.writeFileSync(root+'/index.html',`<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.meta.title}</title>
<meta name="description" content="${escape(c.meta.description)}">
<meta property="og:title" content="${escape(c.meta.title)}">
<meta property="og:description" content="${escape(c.meta.description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Shaoting He">
<meta property="og:url" content="https://shaotinghe.com/">
<meta property="og:image" content="https://shaotinghe.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Shaoting He">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(c.meta.title)}">
<meta name="twitter:description" content="${escape(c.meta.description)}">
<meta name="twitter:image" content="https://shaotinghe.com/og-image.png">
<link rel="canonical" href="https://shaotinghe.com/">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta name="theme-color" content="#030d1b">
<meta name="color-scheme" content="dark light">
<meta name="robots" content="index, follow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="homepage.css?v=scroll-20260904-8">
<script>(function(){try{var t=localStorage.getItem('sh-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark';}catch(e){}})();</script>
<script defer src="content/homepage-content.js?v=scroll-20260904-8"></script>
<script defer src="ambient.js?v=scroll-20260904-8"></script>
<script defer src="homepage.js?v=scroll-20260904-8"></script>
</head>
<body>
<div class="ambient-backdrop" aria-hidden="true"><canvas id="ambient-field" aria-hidden="true"></canvas></div>
<div id="app">${render(c,'en')}</div>
</body>
</html>
`);
