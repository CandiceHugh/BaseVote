'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
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

export default function CreateProposalPage() {
  const { address, isConnected } = useAccount();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState(7);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !title || !description) return;

    const durationSeconds = durationDays * 24 * 60 * 60;

    writeContract({
      address: CONTRACT_CONFIG.address,
      abi: BASE_VOTE_ABI,
      functionName: 'createProposal',
      args: [title, description, BigInt(durationSeconds)],
    });
  };

  if (isSuccess && hash && address) {
    trackTransaction('app-00X', 'BaseVote', address, hash);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
          <h1 className="text-4xl font-bold mb-8">创建新提案</h1>

          {!isConnected ? (
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6 text-center">
              <p className="text-yellow-400">请先连接钱包</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">提案标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="例如：增加社区基金预算"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">提案描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 h-32"
                  placeholder="详细说明提案内容、原因和预期效果..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">投票期限（天）</label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  min={1}
                  max={30}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
                <p className="text-sm text-gray-400 mt-1">投票将在 {durationDays} 天后自动结束</p>
              </div>

              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed py-4 rounded-lg font-bold text-lg transition"
              >
                {isPending && '等待钱包确认...'}
                {isConfirming && '提交中...'}
                {!isPending && !isConfirming && '创建提案'}
              </button>

              {isSuccess && (
                <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 text-center">
                  <p className="text-green-400 font-bold mb-2">✅ 提案创建成功！</p>
                  <Link href="/proposals" className="text-blue-400 hover:underline">
                    查看所有提案 →
                  </Link>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                  <p className="text-red-400 text-sm">错误: {error.message}</p>
                </div>
              )}
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
