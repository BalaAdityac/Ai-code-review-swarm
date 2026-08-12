import { NextResponse } from 'next/server';
import { recallContext, retainInsight } from '@/lib/hindsight';
import { generateReview } from '@/lib/claude';

export const maxDuration = 60; // Allow 60s for API calls

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // 1. Recall memory (past rules, previous feedback) related to this code
    const memories = await recallContext(code);
    
    const formattedMemories = memories.map((m: any, i: number) => 
      `Memory ${i + 1}: ${m.content}`
    ).join('\n');

    // 2. Generate review using Claude, passing in the recalled memory
    const reviewResult = await generateReview(code, formattedMemories);

    // 3. Retain any new insights the LLM found
    if (reviewResult.newInsights && Array.isArray(reviewResult.newInsights)) {
      for (const insight of reviewResult.newInsights) {
        if (typeof insight === 'string' && insight.length > 10) {
          await retainInsight(insight);
        }
      }
    }

    // Return the comments and the memories we used for transparency in the UI
    return NextResponse.json({
      comments: reviewResult.comments || [],
      memories: memories || []
    });

  } catch (error: any) {
    console.error('Review API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during code review' },
      { status: 500 }
    );
  }
}