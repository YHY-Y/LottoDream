import { GoogleGenAI } from '@google/genai';
import { dreamResultSchema, type DreamResult } from '@/lib/validation/dream';
import { SYSTEM_PROMPT } from './prompt';

const schema = {type:'object',required:['title','summary','interpretation','symbols','category','closingMessage'],properties:{title:{type:'string'},summary:{type:'string'},interpretation:{type:'string'},symbols:{type:'array',minItems:1,maxItems:5,items:{type:'object',required:['symbolName','symbolMeaning'],properties:{symbolName:{type:'string'},symbolMeaning:{type:'string'}}}},category:{type:'string'},closingMessage:{type:'string'}}};
export const mockResult: DreamResult = {title:'집으로 찾아온 거미가 전하는 변화',summary:'집 안에 들어온 커다란 거미와 머물러 있던 모습이 인상적인 꿈입니다.',interpretation:'전통적인 해몽에서 거미는 관계나 재물의 흐름을 엮는 상징으로 보기도 합니다. 심리적으로는 쉽게 해결되지 않는 일에 계속 신경을 쓰고 있는 상태가 반영됐을 수 있어요. 꿈의 느낌과 최근 상황을 함께 돌아보세요.',symbols:[{symbolName:'거미',symbolMeaning:'촘촘한 관계, 인내와 준비를 떠올리게 하는 상징이에요.'},{symbolName:'집',symbolMeaning:'일상과 내면의 안정감을 나타내는 공간으로 해석할 수 있어요.'},{symbolName:'어둠',symbolMeaning:'아직 분명하지 않은 감정이나 상황을 비출 수 있어요.'}],category:'동물·집 꿈',closingMessage:'서두르기보다 얽힌 일을 하나씩 살펴보라는 마음의 신호로 가볍게 받아들여 보세요.'};
export async function interpretDream(dream:string):Promise<DreamResult>{
  if(process.env.NODE_ENV !== 'production' && process.env.USE_MOCK_AI === 'true') return mockResult;
  if(!process.env.GEMINI_API_KEY) throw new Error('CONFIG');
  const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),15000);
  try {const response=await ai.models.generateContent({model:process.env.GEMINI_MODEL||'gemini-2.5-flash-lite',contents:`다음 꿈을 분석하세요.\n<dream>\n${dream}\n</dream>`,config:{systemInstruction:SYSTEM_PROMPT,responseMimeType:'application/json',responseJsonSchema:schema,maxOutputTokens:1200,temperature:.6,abortSignal:controller.signal}}); return dreamResultSchema.parse(JSON.parse(response.text||''));} finally {clearTimeout(timer)}
}
