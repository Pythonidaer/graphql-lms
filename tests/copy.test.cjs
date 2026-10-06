const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{let server,browser;try{
server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost'),file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(data);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url='http://127.0.0.1:'+server.address().port;
let args=[];if(process.env.CHROMIUM_BUNDLE)args=(await import(process.env.CHROMIUM_BUNDLE)).default.args;
browser=await chromium.launch({headless:true,args,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined});
const context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(url);await page.waitForSelector('#lms-heading');
const button=page.getByRole('button',{name:'Copy entire course text'});await page.locator('[data-lms="outline"]').click();
await button.scrollIntoViewIfNeeded();assert.ok(await button.isVisible());
assert.ok(await page.evaluate(()=>{const a=document.querySelector('[data-id="graphql-final"]'),b=document.querySelector('[data-lms="copy-course"]');return !!(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);}));
// Collapsed sections and final gating must not limit the exported model.
await page.evaluate(()=>document.querySelectorAll('details[data-lms-section]').forEach(el=>el.open=false));
await button.click();await page.waitForFunction(()=>document.querySelector('.lms-copy-status').textContent.startsWith('Entire course copied'));
const exported=await page.evaluate(()=>navigator.clipboard.readText());
const coverage=await page.evaluate(text=>{const c=JSON.parse(document.querySelector('#lms-course-data').textContent),missing=[],plain=body=>{const el=document.createElement('div');el.innerHTML=LMSMarkdown(body);return el;};let slides=0,questions=0,previous=0;
const walk=n=>{const title=n.title.replace(/^(\d+)\s*[·•]\s*/,'$1 '),pos=text.indexOf(title,previous);if(pos<previous)missing.push(n.id+': order/title');else previous=pos;
if(n.type==='section')n.children.forEach(walk);
if(n.type==='slides')for(const slide of n.slides){slides++;if(!text.includes(slide.title))missing.push(slide.id+': title');const el=plain(slide.body);const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const t=walker.currentNode.textContent.trim();if(t.length>3&&!text.includes(t))missing.push(slide.id+': body '+t.slice(0,40));}for(const code of el.querySelectorAll('pre'))if(!text.includes(code.textContent))missing.push(slide.id+': code');}
if(n.type==='quiz')for(const q of n.questions){questions++;if(!text.includes(q.prompt)||!text.includes(q.explanation)||!text.includes('Correct answer: '+(q.answer+1)+'. '+q.options[q.answer]))missing.push(q.id);for(const option of q.options)if(!text.includes(option))missing.push(q.id+': choice');}};c.sections.forEach(walk);walk(c.finalQuiz);return {missing,slides,questions};},exported);
assert.deepEqual(coverage.missing,[]);assert.equal(coverage.slides,442);assert.equal(coverage.questions,62);assert.ok(exported.includes('https://graphql.org/learn/'));assert.ok(!exported.includes('<fieldset'));assert.ok(exported.length>100000);
await page.setViewportSize({width:1440,height:900});await button.scrollIntoViewIfNeeded();assert.ok(await button.isVisible());
// Clipboard denial still exposes the complete article for manual copy.
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}}));await button.click();await page.waitForSelector('.lms-copy-fallback textarea');assert.equal(await page.locator('.lms-copy-fallback textarea').inputValue(),exported);assert.ok((await page.locator('.lms-copy-status').textContent()).includes('blocked'));assert.equal(await button.isDisabled(),false);
await button.click();assert.equal(await page.locator('.lms-copy-fallback').count(),1);assert.deepEqual(errors,[]);
console.log('PASS: complete ordered copy, 442 slides, 62 quiz questions/answers, source URLs/code, mobile/desktop button, clipboard success and manual fallback ('+exported.length+' characters)');
}finally{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exit(1)});
