// Extrae el contenido en ingles de los HTML originales
const fs=require('fs');
function ext(file){
  const h=fs.readFileSync(file,'utf8');
  const s=h.split('<script>')[1].split('</script>')[0];
  const head=s.split('let state=')[0];
  const dp=s.match(/function devPlan\(\)\{([\s\S]*?)return \{cont/)[1].replace(/const sorted[\s\S]*?const CONT/,'const CONT');
  const f=new Function(head+dp+';return {EXCEL,SCORED_WHAT,PHASES,PROFILES,CONT,START,COMMIT,DISC};');
  const o=f();
  return {
    d:o.PHASES.map(p=>p.choices.map(c=>c.d)),
    en:{excel:o.EXCEL.map(x=>({w:x.w,a:x.a})),scored:o.SCORED_WHAT,
      phases:o.PHASES.map(p=>({title:p.title,narrative:p.narrative,choices:p.choices.map(c=>({l:c.l,t:c.t,imm:c.imm,del:c.del,why:c.why}))})),
      profiles:Object.fromEntries(Object.entries(o.PROFILES).map(([k,v])=>[k,{name:v.name,sum:v.sum,str:v.str,risk:v.risk}])),
      plan:{CONT:o.CONT,START:o.START,COMMIT:o.COMMIT,DISC:o.DISC},
      excelNames:o.EXCEL.map(x=>x.n)}
  };
}
const U='/root/.claude/uploads/03132bec-05fb-5d7a-8a0f-a6ff47897b7e/';
fs.writeFileSync(__dirname+'/leader.en.json',JSON.stringify(ext(U+'90ec7aa5-The_Mike_Case___Leadership_Simulation__1_.html'),null,1));
fs.writeFileSync(__dirname+'/peer.en.json',JSON.stringify(ext(U+'7365db6e-The_Mike_Case___As_a_Peer__1_.html'),null,1));
console.log('ok');
