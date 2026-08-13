import { HindsightClient } from '@vectorize-io/hindsight-client';

// Initialize Hindsight client
// Connects to local Docker container on 8888 by default as specified in GUIDE
const client = new HindsightClient({
  baseUrl: process.env.HINDSIGHT_BASE_URL || 'http://localhost:8888',
});

const BANK_ID = 'team-rules';

export async function retainInsight(content: string) {
  try {
    const response = await client.retain(BANK_ID, content);
    return response;
  } catch (error) {
    console.error('Hindsight retain error:', error);
    // Non-blocking failure for MVP, we just log it
    return null;
  }
}

export async function recallContext(query: string, limit = 3) {
  try {
    const response = await client.recall(BANK_ID, query);
    // @ts-ignore - response shape from types in the generated code might be slightly different
    return response.items || response.chunks || response.memories || [];
  } catch (error) {
    console.error('Hindsight recall error:', error);
    // Return empty array on failure so review can still proceed
    return [];
  }
}