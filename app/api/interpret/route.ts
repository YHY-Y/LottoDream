import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { interpretDream } from '@/lib/ai/gemini';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { dreamInputSchema } from '@/lib/validation/dream';
export const runtime='nodejs';
export async function POST(request:NextRequest){try{const input=dreamInputSchema.parse(await request.json());const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||request.headers.get('x-real-ip')||'unknown';const rate=await checkRateLimit(ip);if(rate.configurationError)return NextResponse.json({message:'운영 요청 제한 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.'},{status:503});if(!rate.ok)return NextResponse.json({message:'오늘의 무료 해몽 5회를 모두 사용했어요. 내일 다시 찾아주세요.'},{status:429});const result=await interpretDream(input.dream);return NextResponse.json({result,remaining:rate.remaining});}catch(error){if(error instanceof ZodError)return NextResponse.json({message:error.issues[0]?.message||'입력 내용을 확인해 주세요.'},{status:400});console.error('Interpretation request failed',error instanceof Error?error.name:'Unknown');const message=error instanceof Error&&error.message==='CONFIG'?'AI 서비스 설정이 필요합니다. 잠시 후 다시 이용해 주세요.':error instanceof Error&&error.name==='AbortError'?'응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.':'꿈을 해석하지 못했어요. 잠시 후 다시 시도해 주세요.';return NextResponse.json({message},{status:503})}}
