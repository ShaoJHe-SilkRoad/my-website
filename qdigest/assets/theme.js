/* QDigest-only theme choice; system follows OS dynamically, no provider work. */
(() => {
 const root=document.documentElement,media=matchMedia('(prefers-color-scheme: dark)'),button=document.getElementById('theme-cycle'),status=document.getElementById('theme-status');
 const options=['system','light','dark'],zh=root.lang==='zh-CN';
 const names=zh?['跟随系统','浅色','深色']:['system','light','dark'];
 let preference='system';try{const value=(localStorage.getItem('q3d-reader.theme.v1')||localStorage.getItem('sh-theme'));if(options.includes(value))preference=value}catch{}
 const apply=()=>{const n=options.indexOf(preference);root.dataset.theme=preference==='system'?(media.matches?'dark':'light'):preference;root.dataset.themePreference=preference;
 if(button){button.hidden=false;button.querySelector('span').textContent=['◐','☀','☾'][n];const label=(zh?'外观：':'Appearance: ')+names[n]+(zh?'；点击切换为':'; switch to ')+names[(n+1)%3];button.setAttribute('aria-label',label);button.title=label}
 if(status)status.textContent=(zh?'当前外观：':'Current appearance: ')+names[n]};
 apply();media.addEventListener('change',()=>{if(preference==='system')apply()});
 const set=(value,notify=true)=>{if(!options.includes(value))throw Error('Theme');preference=value;apply();if(notify)window.dispatchEvent(new CustomEvent('qd-theme-change',{detail:{theme:preference}}))};
 window.QDTheme={get:()=>preference,set};
 button?.addEventListener('click',()=>{set(options[(options.indexOf(preference)+1)%3]);if(!window.QDReaderPreferences)try{localStorage.setItem('q3d-reader.theme.v1',preference)}catch{}});
 window.addEventListener('storage',e=>{if(e.key==='q3d-reader.theme.v1'&&!window.QDReaderPreferences){preference=options.includes(e.newValue)?e.newValue:'system';apply()}});
})();
