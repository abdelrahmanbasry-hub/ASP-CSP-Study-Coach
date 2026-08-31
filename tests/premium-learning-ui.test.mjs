import "./helpers/register-tsx.mjs";
import assert from "node:assert/strict";
import { after, afterEach, test } from "node:test";
import { Window } from "happy-dom";
import { readCoachRoute, coachRouteHref } from "../app/coachRoutes.ts";
import { emptyStudySystemState } from "../app/studySystemState.ts";
import { emptyLearningProgress } from "../app/learningProgress.ts";
import { emptyPracticeV2Progress, loadPracticeV2Progress, savePracticeV2Progress, recordPracticeV2Answer } from "../app/practiceV2.ts";
const window = new Window({url:"http://localhost/?view=practice"});
const globals = ["window","document","HTMLElement","SVGElement","Node","Event","MouseEvent","KeyboardEvent","FocusEvent"];
const previous = new Map(globals.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
for(const key of globals)Object.defineProperty(globalThis,key,{value:key==="window"?window:window[key],configurable:true,writable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const {act,createElement,useState}=await import("react");
const {createRoot}=await import("react-dom/client");
const {default:Practice}=await import("../app/PracticeV2View.tsx");
const {default:Library}=await import("../app/StudyLibrary.tsx");
const {default:Search}=await import("../app/GlobalSmartSearch.tsx");
const {default:Activity}=await import("../app/LearningActivity.tsx");
const {ChapterMasteryMap,StudyNotebook,notebookTarget}=await import("../app/StudySystem.tsx");
const {PRACTICE_V2_QUESTIONS}=await import("../app/practiceV2Catalog.ts");
const {FLASHCARDS}=await import("../app/studyLibraryData.ts");
let root,container;
async function flush(){await act(()=>new Promise(resolve=>window.requestAnimationFrame(resolve)));}
async function mount(component,props={}){
 container=document.createElement("div");document.body.append(container);root=createRoot(container);
 await act(()=>root.render(createElement(component,{system:emptyStudySystemState(),onSystem(){},...props})));await flush();
}
function button(text){const result=[...container.querySelectorAll("button")].find(b=>b.textContent.trim()===text);assert.ok(result,text);return result;}
async function click(el){assert.ok(el);await act(()=>el.click());await flush();}
async function type(el,value){await act(()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set.call(el,value);el.dispatchEvent(new window.Event("input",{bubbles:true}));});}
afterEach(async()=>{if(root)await act(()=>root.unmount());root=null;container?.remove();document.body.innerHTML="";window.localStorage.clear();window.history.replaceState(null,"","/?view=practice");});
after(()=>{window.happyDOM.abort();for(const key of globals){const old=previous.get(key);if(old)Object.defineProperty(globalThis,key,old);else delete globalThis[key];}delete globalThis.IS_REACT_ACT_ENVIRONMENT;});

test("resource routes preserve actionable context on reload",()=>{
 for(const target of [
  {view:"library",libraryTab:"formulas",query:"ventilation",category:"Industrial Hygiene",formulaSet:"frequent"},
  {view:"library",libraryTab:"flashcards",deck:"Calculations"},
  {view:"practice",chapterId:"ch02",practiceFocus:"unseen",practiceTags:["ventilation"],practiceQuestionIds:["real-id"]},
  {view:"review",reviewSource:"chapter",query:"Ventilation"},
  {view:"notebook",query:"noise"},
  {view:"mastery",chapterId:"ch02"},
  {view:"key-information",chapterNumber:5,itemId:"key-point:5:0"},
 ]){
  const restored=readCoachRoute(new URL(coachRouteHref(target.view,target),"http://localhost")).target;
  for(const [key,value] of Object.entries(target))assert.deepEqual(restored[key],value,key);
 }
});

test("no-mistake Practice has an honest disabled start and a working recovery",async()=>{
 await mount(Practice,{searchTarget:{view:"practice",practiceFocus:"mistakes",requestKey:1}});
 assert.equal(button("Start practice").disabled,true);
 assert.match(container.textContent,/No recorded mistakes/);
 await click(button("Use Balanced"));
 assert.equal(button("Start practice").disabled,false);
 assert.equal(button("Balanced").getAttribute("aria-pressed"),"true");
 assert.match(window.location.search,/focus=balanced/);
});

test("multiple chapter selection can be empty without silently choosing a chapter",async()=>{
 await mount(Practice);
 await click(button("Multiple chapters"));
 await click(container.querySelector('.practice-v2-chapters input:checked'));
 assert.match(container.textContent,/0 chapters selected/);
 assert.equal(button("Start practice").disabled,true);
});

test("Practice answers persist once, completion is visible, and revisiting cannot double-submit",async()=>{
 const q=PRACTICE_V2_QUESTIONS[0];
 await mount(Practice,{searchTarget:{view:"practice",itemId:q.id,requestKey:1}});
 assert.equal(document.activeElement.tagName,"H1");
 await click(container.querySelectorAll(".answer")[q.correctOptionIndex]);
 await click(button("Check answer"));
 assert.equal(loadPracticeV2Progress(window.localStorage).attempts[q.id].attempts,1);
 assert.ok([...container.querySelectorAll(".answer")].every(b=>b.disabled));
 await click(button("Finish session"));
 assert.match(container.querySelector("h1").textContent,/Practice complete/);
 assert.match(container.textContent,/1 \/ 1/);
 await click(button("Review my answers"));
 assert.equal(container.querySelectorAll(".answer")[q.correctOptionIndex].getAttribute("aria-pressed"),"true");
 assert.equal([...container.querySelectorAll("button")].some(b=>b.textContent.includes("Check answer")),false);
 assert.equal(loadPracticeV2Progress(window.localStorage).attempts[q.id].attempts,1);
});

test("Chapter Practice activity is readable in Analytics without mixing adaptive evidence",async()=>{
 const q=PRACTICE_V2_QUESTIONS[0];let opened;
 savePracticeV2Progress(window.localStorage,recordPracticeV2Answer(emptyPracticeV2Progress(),q.id,false,true,new Date().toISOString(),q.chapterId,q.chapterTitle));
 await mount(Activity,{view:"stats",target:{view:"stats",reviewSource:"chapter"},learning:emptyLearningProgress(),onOpen:t=>{opened=t;},children:createElement("main",null,"Adaptive evidence only")});
 assert.match(container.textContent,/1answers recorded/);
 assert.match(container.textContent,/High-confidence miss/);
 assert.doesNotMatch(container.textContent,/Adaptive evidence only/);
 await click(button("Practice again"));
 assert.deepEqual(opened,{view:"practice",itemId:q.id});
});

test("chapter resource links open the correct library tab and preserve the chapter topic",async()=>{
 let opened;
 await mount(ChapterMasteryMap,{learning:emptyLearningProgress(),attempts:[],onOpen:(...args)=>{opened=args;}});
 const tile=[...container.querySelectorAll(".mastery-tile")].find(b=>b.textContent.includes("Ventilation"));
 assert.ok(tile);
 await click(tile);
 assert.equal(document.activeElement.getAttribute("aria-label"),"Selected chapter resources");
 await click(button("FormulasFind related equations"));
 assert.equal(opened[0],"library");
 assert.match(opened[1],/Ventilation/);
 assert.equal(opened[3].libraryTab,"formulas");
});

test("Notebook removal is undoable without losing notes or legacy identity",async()=>{
 const entry={id:"hazard:ref-arc-flash",kind:"hazard",title:"Arc flash",note:"My original note",createdAt:1,updatedAt:2};let state;
 function Harness(){const [system,setSystem]=useState({...emptyStudySystemState(),notebook:{[entry.id]:entry}});state=system;return createElement(StudyNotebook,{system,onChange:setSystem,onOpen(){}});}
 await mount(Harness);
 await click(container.querySelector('[aria-label="Remove Arc flash"]'));
 assert.equal(state.notebook[entry.id],undefined);
 await click(button("Undo removal"));
 assert.deepEqual(state.notebook[entry.id],entry);
 assert.equal(container.querySelector("textarea").value,"My original note");
 assert.deepEqual(notebookTarget(entry),{view:"hazards",itemId:"HL-ELEC-001"});
});

test("flashcard rating advances to the next unreviewed card, with a true due count",async()=>{
 let progress;
 function Harness(){const [learning,setLearning]=useState(emptyLearningProgress());progress=learning;return createElement(Library,{progress:learning,onProgress:setLearning,system:emptyStudySystemState(),onSystem(){},mistakeAttempts:[],onOpen(){}});}
 await mount(Harness);
 assert.equal(container.querySelector(".flashcard h3").textContent,FLASHCARDS[0].front);
 await click(container.querySelector(".flashcard"));
 await click(button("GoodAdaptive interval"));
 assert.equal(progress.flashcards[FLASHCARDS[0].id].reviews,1);
 assert.equal(container.querySelector(".flashcard h3").textContent,FLASHCARDS[1].front);
 assert.match(container.textContent,/1 reviewed · 79 due/);
});

test("search has a stable accessible name, contained keyboard focus and Escape focus return",async()=>{
 function Harness(){const [open,setOpen]=useState(false);return createElement("main",null,createElement("button",{onClick:()=>setOpen(true)},"Open search"),createElement(Search,{open,examName:"ASP",practiceBank:[],attempts:[],onClose:()=>setOpen(false),onOpenResult:()=>setOpen(false)}));}
 await mount(Harness);
 const trigger=button("Open search");trigger.focus();await click(trigger);
 assert.ok(document.getElementById(container.querySelector('[role="dialog"]').getAttribute("aria-labelledby")));
 const input=container.querySelector('[role="combobox"]');
 assert.equal(document.activeElement,input);
 await type(input,"ventilation");
 const before=input.getAttribute("aria-activedescendant");
 await act(()=>input.dispatchEvent(new window.KeyboardEvent("keydown",{key:"ArrowDown",bubbles:true,cancelable:true})));
 assert.notEqual(input.getAttribute("aria-activedescendant"),before);
 const select=container.querySelector("select");select.focus();
 await act(()=>select.dispatchEvent(new window.KeyboardEvent("keydown",{key:"Tab",bubbles:true,cancelable:true})));
 assert.equal(document.activeElement,input);
 await act(()=>input.dispatchEvent(new window.KeyboardEvent("keydown",{key:"Escape",bubbles:true,cancelable:true})));
 assert.equal(container.querySelector('[role="dialog"]'),null);
 assert.equal(document.activeElement,trigger);
});

test("invalid formula deep links offer an effective clear-filters recovery",async()=>{
 await mount(Library,{progress:emptyLearningProgress(),onProgress(){},mistakeAttempts:[],onOpen(){},searchTarget:{view:"library",libraryTab:"formulas",itemId:"missing-formula",requestKey:1}});
 assert.match(container.textContent,/No formulas match/);
 await click(button("Clear filters"));
 assert.ok(container.querySelectorAll(".formula-card").length>0);
 assert.doesNotMatch(window.location.search,/itemId/);
});
test("chart represents 0, 50, 80 and 100 percent on the same scale and exposes all values in a table",async()=>{
 const {ScoreHistory}=await import("../app/ui/ScoreHistory.tsx");
 await mount(ScoreHistory,{records:[0,50,80,100].map((value,i)=>({id:String(i),value,count:20,date:"2026-08-31"}))});
 assert.deepEqual([...container.querySelectorAll(".score-bar-track > i")].map(e=>e.style.height),["0%","50%","80%","100%"]);
 assert.equal(container.querySelectorAll("tbody tr").length,4);
 assert.deepEqual([...container.querySelectorAll("tbody td:last-child")].map(e=>e.textContent),["0%","50%","80%","100%"]);
 assert.match(container.querySelector(".score-threshold").textContent,/80% reference/);
});
test("Practice-only chapters have distinct identifiers and no misleading Homework action",async()=>{
 await mount(ChapterMasteryMap,{learning:emptyLearningProgress(),attempts:[],initialChapterId:"ch-40",onOpen(){}});
 assert.match(container.querySelector(".chapter-hub .eyebrow").textContent,/Practice chapter 40/);
 assert.equal(button("HomeworkNo assignment available").disabled,true);
 const labels=[...container.querySelectorAll(".mastery-tile > span")].map(e=>e.textContent);
 assert.equal(new Set(labels).size,labels.length);
});
test("switching Library tabs does not leak an exact formula ID into flashcards",async()=>{
 await mount(Library,{progress:emptyLearningProgress(),onProgress(){},mistakeAttempts:[],onOpen(){},searchTarget:{view:"library",libraryTab:"formulas",itemId:"missing-formula",requestKey:1}});
 await click(button("Flashcards"));
 assert.ok(container.querySelector(".flashcard"));
 assert.doesNotMatch(container.textContent,/No cards match/);
});

