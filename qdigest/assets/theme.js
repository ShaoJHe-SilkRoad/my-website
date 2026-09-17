/* QDigest-only theme choice; system follows OS dynamically, no provider work. */
(() => {
 const root=document.documentElement,media=matchMedia('(prefers-color-scheme: dark)'),button=document.getElementById('theme-cycle'),status=document.getElementById('theme-status');
 const options=['system','light','dark'],zh=root.lang==='zh-CN';
 const names=zh?['跟随系统','浅色','深色']:['system','light','dark'];
 let preference='system';try{const value=localStorage.getItem('sh-theme');if(options.includes(value))preference=value}catch{}
 const apply=()=>{const n=options.indexOf(preference);root.dataset.theme=preference==='system'?(media.matches?'dark':'light'):preference;root.dataset.themePreference=preference;
 if(button){button.hidden=false;button.querySelector('span').textContent=['◐','☀','☾'][n];const label=(zh?'外观：':'Appearance: ')+names[n]+(zh?'；点击切换为':'; switch to ')+names[(n+1)%3];button.setAttribute('aria-label',label);button.title=label}
 if(status)status.textContent=(zh?'当前外观：':'Current appearance: ')+names[n]};
 apply();media.addEventListener('change',()=>{if(preference==='system')apply()});
 button?.addEventListener('click',()=>{preference=options[(options.indexOf(preference)+1)%3];try{localStorage.setItem('sh-theme',preference)}catch{}apply()});
 window.addEventListener('storage',e=>{if(e.key==='sh-theme'){preference=options.includes(e.newValue)?e.newValue:'system';apply()}});
})();
