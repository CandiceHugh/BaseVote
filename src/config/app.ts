export const APP_CONFIG = {
  name: 'BaseVote',
  tagline: 'On-chain proposals and decentralized voting',
  description: '链上提案创建与去中心化投票系统',
  baseAppId: '69c0f11876e804b2a67a9fc3',
  builderCode: 'bc_rvo7lsj1',
  projectIdentifier: '0x62635f72766f376c736a310b0080218021802180218021802180218021',
  verificationMeta: {
    baseAppId: '69c0f11876e804b2a67a9fc3',
    talentappVerification: '7fee53268840f249025863aa99f570339b6b917d3f5dd015d7589a89de2bf82cd9193e56c03940a5d6ad38f9284e9d97c6321701fb712380b0b12ae16ff1b571'
  },
  categories: ['Governance', 'DAO'],
  features: {
    createProposal: true,
    vote: true,
    viewResults: true
  }
} as const;

export const CONTRACT_CONFIG = {
  address: '0x38D0ececE620BC94250B99b4bE84546991234a9b' as `0x${string}`,
  chainId: 8453, // Base mainnet
  defaultCurrency: 'ETH'
} as const;
