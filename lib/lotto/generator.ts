import type { DreamResult } from '@/lib/validation/dream';
export type LottoPick={number:number;reason:string};
const known:Record<string,number>={거미:8,돼지:12,뱀:7,돈:24,집:4,물:9,불:30,달:15,별:5,가족:6,아기:1,용:45,호랑이:3,똥:21};
function secure(max:number){const values=new Uint32Array(1);crypto.getRandomValues(values);return values[0]/(0xffffffff+1)*max|0}
function symbolNumber(name:string){for(const [key,value] of Object.entries(known))if(name.includes(key))return value;let hash=2166136261;for(const c of name){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619)}return (Math.abs(hash)%45)+1}
export function generateLotto(symbols:DreamResult['symbols']):LottoPick[]{const map=new Map<number,string>();for(const s of symbols){let n=symbolNumber(s.symbolName);while(map.has(n))n=n%45+1;map.set(n,`${s.symbolName}에서 연결한 숫자`)}while(map.size<6){const n=secure(45)+1;if(!map.has(n))map.set(n,'상징에서 확장한 무작위 행운 숫자')}return [...map].map(([number,reason])=>({number,reason})).sort((a,b)=>a.number-b.number).slice(0,6)}
export function generateGames(symbols:DreamResult['symbols'],count=5){return Array.from({length:count},()=>generateLotto(symbols))}
