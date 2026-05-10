import { expect } from 'chai';
import { ethers } from 'hardhat';
import { AgentRegistry, AgentDelegation } from '../typechain-types';
import { IERC20 } from '../typechain-types';

describe('Agent Performance League', function () {
  let agentRegistry: AgentRegistry;
  let agentDelegation: AgentDelegation;
  let usdc: IERC20;
  let owner: any;
  let agent1: any;
  let delegator1: any;

  beforeEach(async function () {
    [owner, agent1, delegator1] = await ethers.getSigners();

    // Deploy AgentRegistry
    const AgentRegistry = await ethers.getContractFactory('AgentRegistry');
    agentRegistry = await AgentRegistry.deploy();
    await agentRegistry.waitForDeployment();

    // Deploy mock USDC for testing
    const MockERC20 = await ethers.getContractFactory('MockERC20');
    usdc = await MockERC20.deploy('USDC', 'USDC', 6) as unknown as IERC20;
    await usdc.waitForDeployment();

    // Deploy AgentDelegation
    const AgentDelegation = await ethers.getContractFactory('AgentDelegation');
    agentDelegation = await AgentDelegation.deploy(await usdc.getAddress(), await agentRegistry.getAddress());
    await agentDelegation.waitForDeployment();

    // Set delegation contract address in AgentRegistry
    await agentRegistry.setDelegationContract(await agentDelegation.getAddress());

    // Grant delegator some USDC
    await usdc.mint(delegator1.address, ethers.parseUnits('10000', 6));
  });

  describe('Agent Registration', function () {
    it('Should register a new agent', async function () {
      await agentRegistry.registerAgent(
        agent1.address,
        'Test Agent',
        'A test agent',
        'QmTest'
      );

      const agent = await agentRegistry.getAgent(agent1.address);
      expect(agent.name).to.equal('Test Agent');
      expect(agent.isActive).to.be.true;
    });

    it('Should not allow duplicate registration', async function () {
      await agentRegistry.registerAgent(
        agent1.address,
        'Test Agent',
        'A test agent',
        'QmTest'
      );

      await expect(
        agentRegistry.registerAgent(
          agent1.address,
          'Test Agent 2',
          'Another test',
          'QmTest2'
        )
      ).to.be.revertedWith('Agent already registered');
    });
  });

  describe('Performance Tracking', function () {
    beforeEach(async function () {
      await agentRegistry.registerAgent(
        agent1.address,
        'Test Agent',
        'A test agent',
        'QmTest'
      );
    });

    it('Should update agent statistics', async function () {
      await agentRegistry.updateStats(
        agent1.address,
        450, // 4.5% ROI
        ethers.parseEther('1.8'), // 1.8 Sharpe ratio
        215, // 2.15% max drawdown
        10, // total trades
        7, // winning trades
        5000 // avg trade size
      );

      const stats = await agentRegistry.getStats(agent1.address);
      expect(stats.totalROI).to.equal(450);
      expect(stats.totalTrades).to.equal(10);
      expect(stats.winningTrades).to.equal(7);
    });

    it('Should calculate correct win rate', async function () {
      await agentRegistry.updateStats(
        agent1.address,
        450,
        ethers.parseEther('1.8'),
        215,
        10,
        7,
        5000
      );

      const winRate = await agentRegistry.getWinRate(agent1.address);
      expect(winRate).to.equal(7000); // 70% in basis points
    });
  });

  describe('Delegation', function () {
    beforeEach(async function () {
      await agentRegistry.registerAgent(
        agent1.address,
        'Test Agent',
        'A test agent',
        'QmTest'
      );

      // Approve delegation contract
      const usdc = await ethers.getContractAt(
        'IERC20',
        await agentDelegation.stablecoin()
      );
      await usdc
        .connect(delegator1)
        .approve(await agentDelegation.getAddress(), ethers.parseUnits('5000', 6));
    });

    it('Should allow delegation', async function () {
      const delegationAmount = ethers.parseUnits('1000', 6);

      await agentDelegation
        .connect(delegator1)
        .delegate(agent1.address, delegationAmount);

      const delegation = await agentDelegation.getDelegation(
        delegator1.address,
        agent1.address
      );
      expect(delegation.capitalAmount).to.equal(delegationAmount);
      expect(delegation.active).to.be.true;
    });

    it('Should track total capital managed', async function () {
      const delegationAmount = ethers.parseUnits('1000', 6);

      await agentDelegation
        .connect(delegator1)
        .delegate(agent1.address, delegationAmount);

      const agent = await agentRegistry.getAgent(agent1.address);
      expect(agent.totalCapitalManaged).to.equal(delegationAmount);
    });
  });

  describe('Performance Recording', function () {
    beforeEach(async function () {
      await agentRegistry.registerAgent(
        agent1.address,
        'Test Agent',
        'A test agent',
        'QmTest'
      );
    });

    it('Should record performance history', async function () {
      await agentRegistry.recordPerformance(
        agent1.address,
        ethers.parseEther('100'), // $100 PnL
        5,
        450 // 4.5% ROI
      );

      const history = await agentRegistry.getPerformanceHistory(agent1.address);
      expect(history.length).to.equal(1);
      expect(history[0].roi).to.equal(450);
    });

    it('Should track multiple performance records', async function () {
      await agentRegistry.recordPerformance(agent1.address, ethers.parseEther('100'), 5, 450);
      await agentRegistry.recordPerformance(agent1.address, ethers.parseEther('150'), 10, 900);

      const history = await agentRegistry.getPerformanceHistory(agent1.address);
      expect(history.length).to.equal(2);
    });
  });
});
