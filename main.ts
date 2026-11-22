// Tiny stack VM: a correct interpreter of make.fun's tiny stack ISA v1
// (kit ISA.md + reference vm.mjs). 32-bit wrapping, exact traps, 1M steps, 64K out.
import{mkdirSync as k,readdirSync as d,readFileSync as f,writeFileSync as w}from"node:fs";
import{join as j}from"node:path";
function run(p,q){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,pc=0,st=0,ip=0,ol=0;
 const t=x=>[o.slice(0,ol),x];
 for(;;){
  if(st===1e6)return t(10);
  if(pc<0||pc>=p.length)return t(9);
  const op=p[pc];
  if(op>7&&(op<16||op>34||op==31)&&(op<48||op>52)&&op!=64&&op!=65&&(op<80||op>83))return t(5);
  const m=op==1?1:op==2?4:op>47&&op<52?2:0;
  if(pc+m>=p.length)return t(9);
  st++;
  const nx=pc+1+m;
  let u,v;
  if(op<8){u=op<3?0:op<5?1:op<7?2:3;v=op==0||op==3?0:op==4||op==5?2:op==6||op==7?3:1}
  else if(op<35){u=op==23||op==27?1:2;v=1}
  else if(op<53){u=op==49||op==50?1:0;v=0}
  else if(op<66){u=op==64?1:2;v=op==64?1:0}
  else{u=op==82?0:1;v=op==82?1:0}
  if(s<u)return t(2);
  if(s-u+v>256)return t(3);
  pc=nx;
  if(op>15&&op<35&&op!=23&&op!=27){
   const b=D[s-1],a=D[s-2];
   if(!b&&op>18&&op<23)return t(4);
   let e;
   if(op==16)e=(a+b)|0;
   else if(op==17)e=(a-b)|0;
   else if(op==18)e=Math.imul(a,b);
   else if(op==19)e=(a/b)|0;
   else if(op==20)e=a%b|0;
   else if(op==21)e=Math.floor((a>>>0)/(b>>>0))|0;
   else if(op==22)e=(a>>>0)%(b>>>0)|0;
   else if(op==24)e=a&b;
   else if(op==25)e=a|b;
   else if(op==26)e=a^b;
   else if(op==28)e=a<<(b&31);
   else if(op==29)e=a>>(b&31);
   else if(op==30)e=(a>>>(b&31))|0;
   else if(op==32)e=a==b?1:0;
   else if(op==33)e=a<b?1:0;
   else e=(a>>>0)<(b>>>0)?1:0;
   s-=2;D[s++]=e;continue;
  }
  switch(op){
   case 0:return t(0);
   case 1:D[s++]=(p[nx-1]<<24)>>24;break;
   case 2:D[s++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const x=D[s-1];D[s-1]=D[s-2];D[s-2]=x;break}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;break}
   case 23:D[s-1]=-D[s-1]|0;break;
   case 27:D[s-1]=~D[s-1];break;
   case 48:pc=nx+(((p[nx-2]|p[nx-1]<<8)<<16)>>16);break;
   case 49:case 50:{const y=D[--s],e=(p[nx-2]|p[nx-1]<<8)<<16>>16;if((op==49)==(y==0))pc=nx+e;break}
   case 51:if(c==64)return t(7);C[c++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
   case 52:if(!c)return t(8);pc=C[--c];break;
   case 64:{const a=D[s-1];if(a<0||a>255)return t(6);D[s-1]=M[a];break}
   case 65:{const a=D[s-1];if(a<0||a>255)return t(6);M[a]=D[s-2];s-=2;break}
   case 80:{const b=String(D[s-1]);if(ol+b.length>65536)return t(11);s--;for(let i=0;i<b.length;i++)o[ol++]=b.charCodeAt(i);break}
   case 81:if(ol>=65536)return t(11);o[ol++]=D[--s]&255;break;
   case 82:D[s++]=ip<q.length?q[ip++]:-1;break;
   case 83:return t(D[--s]&255);
   default:return t(5);
  }
 }
}
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
for(const id of d(I).sort()){
 const[out,code]=run(new Uint8Array(f(j(I,id,"program.bin"))),new Uint8Array(f(j(I,id,"input.bin"))));
 k(j(O,id),{recursive:true});
 w(j(O,id,"stdout.bin"),out);
 w(j(O,id,"exit.txt"),code+"\n");
}
