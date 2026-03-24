import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { BASE_VOTE_ABI } from '@/lib/abi/baseVote';
import { CONTRACT_CONFIG } from '@/config/app';

const client = createPublicClient({
  chain: base,
  transport: http(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing proposal id' }, { status: 400 });
  }

  try {
    const data = await client.readContract({
      address: CONTRACT_CONFIG.address,
      abi: BASE_VOTE_ABI,
      functionName: 'proposals',
      args: [BigInt(id)],
    });

    const [title, description, deadline, yesVotes, noVotes, exists] = data as [string, string, bigint, bigint, bigint, boolean];

    return NextResponse.json({
      title,
      description,
      deadline: deadline.toString(),
      yesVotes: yesVotes.toString(),
      noVotes: noVotes.toString(),
      exists,
    });
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
  }
}
