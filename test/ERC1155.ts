import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract, ContractFactory } from 'ethers';

describe('ERC1155', function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let erc1155: Contract;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const ERC1155: ContractFactory = await ethers.getContractFactory('ERC1155');
    erc1155 = await ERC1155.deploy();
    await erc1155.deployed();
  });

  it('Should transfer tokens between accounts', async function () {
    // Mint tokens to the owner
    await erc1155.mint(owner.address, 0, 10);

    // Transfer tokens from owner to user
    await erc1155.safeTransferFrom(owner.address, user.address, 0, 5, []);

    // Check balances after transfer
    const ownerBalance: number = await erc1155.balanceOf(owner.address, 0);
    const userBalance: number = await erc1155.balanceOf(user.address, 0);

    expect(ownerBalance).to.equal(5);
    expect(userBalance).to.equal(5);
  });

  it('Should set and check operator approval', async function () {
    // Approve user as an operator for the owner
    await erc1155.setApprovalForAll(user.address, true);

    // Check operator approval status
    const isApproved: boolean = await erc1155.isApprovedForAll(owner.address, user.address);
    expect(isApproved).to.equal(true);

    // Revoke operator approval
    await erc1155.setApprovalForAll(user.address, false);

    // Check operator approval status again
    const isRevoked: boolean = await erc1155.isApprovedForAll(owner.address, user.address);
    expect(isRevoked).to.equal(false);
  });

  it('Should return the correct balance', async function () {
    // Mint tokens to the owner
    await erc1155.mint(owner.address, 1, 15);

    // Check owner's balance
    const ownerBalance: number = await erc1155.balanceOf(owner.address, 1);

    expect(ownerBalance).to.equal(15);
  });
});
