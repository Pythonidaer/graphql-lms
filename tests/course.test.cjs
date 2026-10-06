const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path'),root=path.resolve(__dirname,'..');
const course=JSON.parse(fs.readFileSync(path.join(root,'course.json'),'utf8'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.deepEqual(JSON.parse(html.match(/<script id="lms-course-data"[^>]*>(.*?)<\/script>/s)[1]),course,'Embedded and editable course must match');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'lms-runtime.js'),'utf8')+';globalThis.api=LMS;',context);
const model=context.api.validate(course);assert.equal(context.api.ready(model).length,0);
const sources=JSON.parse(fs.readFileSync(path.join(root,'source-manifest.json'),'utf8')).sources;
assert.equal(sources.length,35);assert.equal(new Set(sources.map(s=>s.url)).size,35);
const lessons=context.api.flatten(model.sections);assert.equal(lessons.filter(n=>n.type==='slides').length,38);assert.equal(lessons.filter(n=>n.type==='quiz').length,6);
for(const source of sources)assert.ok(lessons.some(n=>n.id===source.lessonId));
for(const lesson of lessons.filter(n=>n.type==='slides'))for(const slide of lesson.slides){assert.ok(slide.body.length<20000);assert.equal((slide.body.match(/^```/gm)||[]).length%2,0,'Code fences: '+slide.id);}
for(const quiz of [...lessons.filter(n=>n.type==='quiz'),model.finalQuiz])for(const q of quiz.questions){assert.ok(q.answer>=0&&q.answer<q.options.length);assert.ok(q.explanation);assert.equal(new Set(q.options).size,q.options.length);}
console.log('PASS: course validation, 35 source mappings, embedded parity, code fences and assessments');
