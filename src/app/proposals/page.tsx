'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { 
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { BASE_VOTE_ABI } from '@/lib/abi/baseVote';
import { CONTRACT_CONFIG } from '@/config/app';
import { trackTransaction } from '@/utils/track';
import Link from 'next/link';

type Proposal = {
  id: number;
  title: string;
  description: string;
  deadline: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  exists: boolean;
  ended: boolean;
};

export default function ProposalsPage() {
  const { address, isConnected } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [voteSupport, setVoteSupport] = useState<boolean>(true);

  const { data: proposalCount } = useReadContract({
    address: CONTRACT_CONFIG.address,
    abi: BASE_VOTE_ABI,
    functionName: 'proposalCount',
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!proposalCount) return;
    const count = Number(proposalCount);
    
    const fetchProposals = async () => {
      const fetched: Proposal[] = [];
      for (let i = 1; i <= count; i++) {
        try {
          const response = await fetch('/api/proposal?id=' + i);
          const data = await response.json();
          if (data.exists) {
            fetched.push({
              id: i,
              ...data,
              ended: Date.now() / 1000 >= Number(data.deadline)
            });
          }
        } catch (err) {
          console.error('Failed to fetch proposal', i, err);
        }
      }
      setProposals(fetched.reverse());
    };

    fetchProposals();
  }, [proposalCount]);

  const handleVote = (proposalId: number, support: boolean) => {
    if (!isConnected) return;
    setSelectedId(proposalId);
    setVoteSupport(support);

    writeContract({
      address: CONTRACT_CONFIG.address,
      abi: BASE_VOTE_ABI,
      functionName: 'vote',
      args: [BigInt(proposalId), support],
    });
  };

  if (isSuccess && hash && address) {
    trackTransaction('app-00X', 'BaseVote', address, hash);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold">← BaseVote</Link>
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </header>

        <main>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">所有提案</h1>
            <Link 
              href="/create"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition"
            >
              + 创建新提案
            </Link>
          </div>

          {!isConnected ? (
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6 text-center">
              <p className="text-yellow-400">请先连接钱包查看提案</p>
            </div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>暂无提案</p>
            </div>
          ) : (
            <div className="space-y-6">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">#{proposal.id} {proposal.title}</h3>
                      <p className="text-gray-400">{proposal.description}</p>
                    </div>
                    {proposal.ended && (
                      <span className="bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-sm">
                        已结束
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                      <p className="text-green-400 text-sm mb-1">赞成</p>
                      <p className="text-3xl font-bold">{proposal.yesVotes.toString()}</p>
                    </div>
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                      <p className="text-red-400 text-sm mb-1">反对</p>
                      <p className="text-3xl font-bold">{proposal.noVotes.toString()}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400 mb-4">
                    截止时间: {new Date(Number(proposal.deadline) * 1000).toLocaleString('zh-CN')}
                  </div>

                  {!proposal.ended && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVote(proposal.id, true)}
                        disabled={isPending || isConfirming}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 py-3 rounded-lg font-bold transition"
                      >
                        ✓ 赞成
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, false)}
                        disabled={isPending || isConfirming}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 py-3 rounded-lg font-bold transition"
                      >
                        ✗ 反对
                      </button>
                    </div>
                  )}

                  {selectedId === proposal.id && isPending && (
                    <p className="text-yellow-400 text-sm mt-2">等待钱包确认...</p>
                  )}
                  {selectedId === proposal.id && isConfirming && (
                    <p className="text-blue-400 text-sm mt-2">交易确认中...</p>
                  )}
                  {selectedId === proposal.id && isSuccess && (
                    <p className="text-green-400 text-sm mt-2">✅ 投票成功！</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mt-6">
              <p className="text-red-400 text-sm">错误: {error.message}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
