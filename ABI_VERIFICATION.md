# 合约 ABI 验证脚本

## 当前配置
- 合约地址: 0xf5f96916b2c13f060b4579a4eb6cc9d91ca6dff2
- 链: Base Mainnet (Chain ID: 8453)
- BaseScan: https://basescan.org/address/0xf5f96916b2c13f060b4579a4eb6cc9d91ca6dff2

## ABI 中的 createPool
```typescript
{
  "inputs": [{ "internalType": "string", "name": "matchName", "type": "string" }],
  "name": "createPool",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}
```

## 你提到的合约定义
```solidity
createPool(uint64 startTime, uint64 endTime, address token, uint16 feeBps) external onlyOwner
```

## 问题分析
这两个函数签名完全不同：
- ABI: createPool(string matchName) - 只需要比赛名称
- 你说的: createPool(uint64, uint64, address, uint16) - 需要时间、代币、手续费

## 可能原因
1. **ABI 是旧版本** - 合约升级后 ABI 未更新
2. **合约地址错误** - 指向了旧合约
3. **你的合约定义是计划中的** - 当前部署的是简化版

## 解决方案
需要从 BaseScan 获取真实的已验证合约 ABI。

如果合约未在 BaseScan 上验证，需要：
1. 从部署时保存的 ABI 文件获取
2. 或者重新部署并验证合约
