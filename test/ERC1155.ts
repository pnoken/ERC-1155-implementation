import { ethers, waffle } from 'hardhat';
import { Contract, Signer } from 'ethers';
import { expect } from 'chai';

const { deployContract } = waffle;

describe('ERC1155', function () {
  let erc1155: Contract;
  let owner: Signer;
  let recipient: Signer;
  let operator: Signer;

  before(async function () {
    [owner, recipient, operator] = await ethers.getSigners();

    const ERC1155 = await ethers.getContractFactory('ERC1155');
    erc1155 = await deployContract(owner, ERC1155);
  });

  it('should deploy the ERC1155 contract', async function () {
    expect(erc1155.address).to.not.equal(0);
  });

  it('should allow safeTransferFrom with valid parameters', async function () {
    const tokenId = 1;
    const value = 10;
    const data = '0x';

    await erc1155.mint(owner.getAddress(), tokenId, value);

    await expect(
      erc1155
        .connect(owner)
        .safeTransferFrom(owner.getAddress(), recipient.getAddress(), tokenId, value, data)
    )
      .to.emit(erc1155, 'TransferSingle')
      .withArgs(owner.getAddress(), owner.getAddress(), recipient.getAddress(), tokenId,
