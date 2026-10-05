// Genera liderazgo.html y par.html a partir de template.html + contenidos por idioma
const fs=require('fs'),path=require('path');
const tpl=fs.readFileSync(path.join(__dirname,'template.html'),'utf8');
const enUI=require('./en_ui.js');
function shape(o){if(Array.isArray(o))return o.map(shape);if(o&&typeof o==='object')return Object.fromEntries(Object.keys(o).sort().map(k=>[k,shape(o[k])]));return typeof o;}
for(const [id,out] of [['leader','liderazgo.html'],['peer','par.html']]){
  const base=require(`./${id}.en.json`);
  const excelNames=base.en.excelNames; delete base.en.excelNames;
  const t={en:{ui:enUI[id],...base.en},es:require(`./${id}.es.js`),pt:require(`./${id}.pt.js`)};
  const ref=JSON.stringify(shape(t.en));
  for(const l of ['es','pt']){
    if(JSON.stringify(shape(t[l]))!==ref)throw new Error(`estructura distinta: ${id}.${l}`);
    if(/[—–]/.test(JSON.stringify(t[l])))throw new Error(`guion largo en ${id}.${l}`);
  }
  const data=JSON.stringify({id,excelNames,d:base.d,t}).replace(/</g,'\\u003c');
  fs.writeFileSync(path.join(__dirname,'..',out),tpl.replace('/*__DATA__*/null',()=>data));
  console.log(out,'ok');
}
