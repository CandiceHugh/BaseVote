'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { APP_CONFIG } from '@/config/app';
import Link from 'next/link';

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">{APP_CONFIG.name}</h1>
          <ConnectButton />
        </header>

        <main className="space-y-8">
          <section className="text-center py-12">
            <h2 className="text-5xl font-bold mb-4">{APP_CONFIG.name}</h2>
            <p className="text-xl text-gray-400 mb-8">{APP_CONFIG.description}</p>
            {!isConnected && (
              <div className="text-sm text-yellow-400">
                ⚠️ 请先连接钱包以使用投票功能
              </div>
            )}
          </section>

          {isConnected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                href="/create"
                className="bg-blue-600 hover:bg-blue-700 p-8 rounded-lg text-center transition"
              >
                <h3 className="text-2xl font-bold mb-2">创建提案</h3>
                <p className="text-gray-300">发起新的治理提案</p>
              </Link>

              <Link 
                href="/proposals"
                className="bg-purple-600 hover:bg-purple-700 p-8 rounded-lg text-center transition"
              >
                <h3 className="text-2xl font-bold mb-2">查看提案</h3>
                <p className="text-gray-300">浏览和投票现有提案</p>
              </Link>
            </div>
          )}

          <section className="bg-gray-800 rounded-lg p-6 mt-12">
            <h3 className="text-xl font-bold mb-4">如何使用</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>连接你的钱包（需要 Base 网络）</li>
              <li>创建新提案或查看现有提案</li>
              <li>对提案投赞成或反对票</li>
              <li>投票期结束后查看结果</li>
            </ol>
          </section>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>合约地址: {APP_CONFIG.builderCode}</p>
        </footer>
      </div>
    </div>
  );
}
