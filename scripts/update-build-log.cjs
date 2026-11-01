#!/usr/bin/env node
// Refreshes the AUV build log (commits, weekly activity, releases, languages) from the public
// GitHub repository, then rewrites content/homepage-content.js. Milestones stay hand-written.
// Usage: node scripts/update-build-log.cjs [--dry-run]   (set GITHUB_TOKEN to raise the API limit)
'use strict';
const fs = require('fs');
const path = require('path');

const repo = 'ShaoJHe-SilkRoad/UMA';
const file = path.join(__dirname, '..', 'content', 'homepage-content.js');
const dryRun = process.argv.includes('--dry-run');
const prefix = 'window.SHAOTING_HOME_CONTENT = ';
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

async function api(route, attempt = 0) {
  const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'shaotinghe.com build-log' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = 'Bearer ' + process.env.GITHUB_TOKEN;
  const response = await fetch('https://api.github.com/repos/' + repo + route, { headers });
  // GitHub computes statistics on demand and answers 202 until they are ready.
  if (response.status === 202 && attempt < 6) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return api(route, attempt + 1);
  }
  if (!response.ok) throw new Error(route + ': GitHub answered ' + response.status);
  return response;
}

async function collect() {
  const commitPage = await api('/commits?per_page=1');
  const last = /[?&]page=(\d+)>; rel="last"/.exec(commitPage.headers.get('link') || '');
  const commits = last ? Number(last[1]) : (await commitPage.json()).length;

  const activity = await (await api('/stats/commit_activity')).json();
  const first = activity.findIndex(week => week.total > 0);
  const weeks = activity.slice(first);
  // A week that has only just started and has no commits yet is not a break in the streak.
  if (weeks.length && weeks[weeks.length - 1].total === 0 && Date.now() - weeks[weeks.length - 1].week * 1000 < 7 * 864e5) weeks.pop();
  let streak = 0;
  for (let i = weeks.length - 1; i >= 0 && weeks[i].total > 0; i -= 1) streak += 1;

  const releases = (await (await api('/releases?per_page=100')).json()).filter(r => !r.draft).length;

  const bytes = await (await api('/languages')).json();
  const total = Object.values(bytes).reduce((sum, n) => sum + n, 0);
  const shares = Object.entries(bytes).map(([name, n]) => [name, Math.round(n / total * 1000) / 10]);
  const languages = shares.slice(0, 5);
  const other = Math.round(shares.slice(5).reduce((sum, l) => sum + l[1], 0) * 10) / 10;
  if (other > 0) languages.push(['Other', other]);

  return { commits, streak, releases, weeks, languages, start: new Date(weeks[0].week * 1000), today: new Date() };
}

function apply(content, data) {
  const top = data.languages[0];
  const from = data.start, to = data.today;
  const sameYear = from.getUTCFullYear() === to.getFullYear();
  const log = {
    en: {
      note: 'From the public GitHub repository · as of ' + to.getDate() + ' ' + months[to.getMonth()].slice(0, 3) + ' ' + to.getFullYear(),
      weeksLabel: 'Commits per week, ' + months[from.getUTCMonth()] + (sameYear ? '' : ' ' + from.getUTCFullYear()) + ' to ' + months[to.getMonth()] + ' ' + to.getFullYear(),
      stats: [[String(data.commits), 'Commits'], [String(data.streak), 'Weeks in a row with commits'], [String(data.releases), 'Public releases'], [Math.round(top[1]) + '%', 'Written in ' + top[0]]]
    },
    'zh-Hans': {
      note: '数据来自公开的 GitHub 仓库 · 截至 ' + to.getFullYear() + ' 年 ' + (to.getMonth() + 1) + ' 月 ' + to.getDate() + ' 日',
      weeksLabel: '每周提交次数，' + (sameYear ? to.getFullYear() + ' 年 ' : from.getUTCFullYear() + ' 年 ') + (from.getUTCMonth() + 1) + ' 月至' + (sameYear ? '' : ' ' + to.getFullYear() + ' 年') + ' ' + (to.getMonth() + 1) + ' 月',
      stats: [[String(data.commits), '次提交'], [String(data.streak), '周连续有提交'], [String(data.releases), '个公开版本'], [Math.round(top[1]) + '%', top[0] + ' 代码']]
    }
  };
  for (const lang of Object.keys(log)) {
    const target = content[lang].projects.find(p => p.id === 'uma').log;
    Object.assign(target, log[lang], { weeks: data.weeks.map(w => w.total), languages: data.languages });
  }
  // The contact section quotes the release count too.
  content.en.contact.offer.bring = content.en.contact.offer.bring.map(s => s.replace(/\d+ public releases/, data.releases + ' public releases'));
  content['zh-Hans'].contact.offer.bring = content['zh-Hans'].contact.offer.bring.map(s => s.replace(/发布 \d+ 个公开版本/, '发布 ' + data.releases + ' 个公开版本'));
}

(async () => {
  const source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf(prefix) + prefix.length;
  const end = source.indexOf('\n};\n', start) + 2;
  const content = JSON.parse(source.slice(start, end));
  const data = await collect();
  apply(content, data);
  console.log(`commits ${data.commits} · streak ${data.streak} weeks · releases ${data.releases} · ${data.weeks.length} weeks charted · ` +
    data.languages.map(l => l[0] + ' ' + l[1] + '%').join(', '));
  if (dryRun) return console.log('Dry run: content not written.');
  fs.writeFileSync(file, source.slice(0, start) + JSON.stringify(content, null, 2) + source.slice(end));
  console.log('Updated ' + path.relative(process.cwd(), file) + '. Run node scripts/build-homepage.cjs next.');
})().catch(error => { console.error(error.message); process.exit(1); });
