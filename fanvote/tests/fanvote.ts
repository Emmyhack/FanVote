import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Fanvote } from "../target/types/fanvote";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { expect } from "chai";
import { Transaction, sendAndConfirmTransaction } from "@solana/web3.js";

describe("fanvote", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Fanvote as Program<Fanvote>;

  // Test accounts
  let campaignCreator: Keypair;
  let voter1: Keypair;
  let voter2: Keypair;
  let treasuryAuthority: Keypair;

  // Token accounts
  let usdcMint: PublicKey;
  let campaignTokenAccount: PublicKey;
  let platformTreasuryTokenAccount: PublicKey;
  let voter1TokenAccount: PublicKey;
  let voter2TokenAccount: PublicKey;
  let treasuryWithdrawAccount: PublicKey;

  // Program derived addresses
  let campaignPda: PublicKey;
  let campaignBump: number;
  let treasuryAuthorityPda: PublicKey;
  let treasuryBump: number;

  const campaignTitle = "Test Campaign";
  const startTime = Math.floor(Date.now() / 1000);
  const endTime = startTime + 86400; // 24 hours later
  const bannerUrl = "https://example.com/banner.jpg";
  const platformFeePercentage = 5; // 5%

  before(async () => {
    // Create test keypairs
    campaignCreator = Keypair.generate();
    voter1 = Keypair.generate();
    voter2 = Keypair.generate();
    treasuryAuthority = Keypair.generate();

    // Airdrop SOL to test accounts
    await provider.connection.requestAirdrop(
      campaignCreator.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      voter1.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      voter2.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      treasuryAuthority.publicKey,
      2 * LAMPORTS_PER_SOL
    );

    // Wait for airdrop confirmations
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create USDC mint
    usdcMint = await createMint(
      provider.connection,
      campaignCreator,
      campaignCreator.publicKey,
      null,
      6 // USDC has 6 decimals
    );

    // Find treasury authority PDA
    [treasuryAuthorityPda, treasuryBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    );
    console.log("Treasury Authority PDA: ", treasuryAuthorityPda.toBase58());

    // Find campaign PDA
    [campaignPda, campaignBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("campaign"), Buffer.from(campaignTitle)],
      program.programId
    );

    // Create associated token accounts for voters using getAssociatedTokenAddress
    voter1TokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      voter1.publicKey
    );

    voter2TokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      voter2.publicKey
    );

    treasuryWithdrawAccount = await getAssociatedTokenAddress(
      usdcMint,
      treasuryAuthority.publicKey
    );

    // Create the actual token accounts if they don't exist
    const createVoter1TokenAccountIx = createAssociatedTokenAccountInstruction(
      campaignCreator.publicKey, // payer
      voter1TokenAccount,
      voter1.publicKey, // owner
      usdcMint
    );

    const createVoter2TokenAccountIx = createAssociatedTokenAccountInstruction(
      campaignCreator.publicKey, // payer
      voter2TokenAccount,
      voter2.publicKey, // owner
      usdcMint
    );

    const createTreasuryWithdrawAccountIx =
      createAssociatedTokenAccountInstruction(
        campaignCreator.publicKey, // payer
        treasuryWithdrawAccount,
        treasuryAuthority.publicKey, // owner
        usdcMint
      );

    // Create token accounts transaction
    const createTokenAccountsTx = new Transaction()
      .add(createVoter1TokenAccountIx)
      .add(createVoter2TokenAccountIx)
      .add(createTreasuryWithdrawAccountIx);

    await sendAndConfirmTransaction(
      provider.connection,
      createTokenAccountsTx,
      [campaignCreator]
    );

    // Get associated token addresses for PDAs
    platformTreasuryTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      treasuryAuthorityPda,
      true // allowOwnerOffCurve - this is important for PDAs
    );

    campaignTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      campaignPda,
      true // allowOwnerOffCurve - this is important for PDAs
    );

    // CREATE THE PDA TOKEN ACCOUNTS - This was missing!
    const createCampaignTokenAccountIx =
      createAssociatedTokenAccountInstruction(
        campaignCreator.publicKey, // payer
        campaignTokenAccount,
        campaignPda, // owner (PDA)
        usdcMint
      );

    const createTreasuryTokenAccountIx =
      createAssociatedTokenAccountInstruction(
        campaignCreator.publicKey, // payer
        platformTreasuryTokenAccount,
        treasuryAuthorityPda, // owner (PDA)
        usdcMint
      );

    const createPdaTokenAccountsTx = new Transaction()
      .add(createCampaignTokenAccountIx)
      .add(createTreasuryTokenAccountIx);

    await sendAndConfirmTransaction(
      provider.connection,
      createPdaTokenAccountsTx,
      [campaignCreator]
    );

    // Mint USDC to voter accounts
    await mintTo(
      provider.connection,
      campaignCreator,
      usdcMint,
      voter1TokenAccount,
      campaignCreator,
      1000 * 10 ** 6 // 1000 USDC
    );

    await mintTo(
      provider.connection,
      campaignCreator,
      usdcMint,
      voter2TokenAccount,
      campaignCreator,
      1000 * 10 ** 6 // 1000 USDC
    );

    // Initialize the program
    await program.methods.initialize().rpc();
  });

  it("Create a campaign", async () => {
    await program.methods
      .createCampaign(
        campaignTitle,
        new anchor.BN(startTime),
        new anchor.BN(endTime),
        bannerUrl,
        platformFeePercentage
      )
      .accounts({
        campaign: campaignPda,
        user: campaignCreator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([campaignCreator])
      .rpc();

    // Verify campaign was created correctly
    const campaign = await program.account.campaign.fetch(campaignPda);
    expect(campaign.title).to.equal(campaignTitle);
    expect(campaign.startTime.toNumber()).to.equal(startTime);
    expect(campaign.endTime.toNumber()).to.equal(endTime);
    expect(campaign.bannerUrl).to.equal(bannerUrl);
    expect(campaign.platformFeePercentage).to.equal(platformFeePercentage);
    expect(campaign.isActive).to.be.true;
    expect(campaign.creator.toString()).to.equal(
      campaignCreator.publicKey.toString()
    );
    expect(campaign.totalVotes.toNumber()).to.equal(0);
    expect(campaign.contestantCount).to.equal(0);
  });

  it("Edit campaign", async () => {
    const newEndTime = endTime + 3600; // Add 1 hour
    const newBannerUrl = "https://example.com/new-banner.jpg";
    const newFeePercentage = 10;

    await program.methods
      .editCampaign(new anchor.BN(newEndTime), newBannerUrl, newFeePercentage)
      .accounts({
        campaign: campaignPda,
        user: campaignCreator.publicKey,
      })
      .signers([campaignCreator])
      .rpc();

    const campaign = await program.account.campaign.fetch(campaignPda);
    expect(campaign.endTime.toNumber()).to.equal(newEndTime);
    expect(campaign.bannerUrl).to.equal(newBannerUrl);
    expect(campaign.platformFeePercentage).to.equal(newFeePercentage);
  });

  it("Add contestants to campaign", async () => {
    const contestants = [
      {
        name: "Contestant 1",
        imageUrl: "https://example.com/contestant1.jpg",
        bio: "Bio for contestant 1",
      },
      {
        name: "Contestant 2",
        imageUrl: "https://example.com/contestant2.jpg",
        bio: "Bio for contestant 2",
      },
    ];

    for (let i = 0; i < contestants.length; i++) {
      // FIXED: Proper byte array conversion for contestant ID
      const contestantIdBytes = new Uint8Array(4);
      contestantIdBytes[0] = i;
      contestantIdBytes[1] = 0;
      contestantIdBytes[2] = 0;
      contestantIdBytes[3] = 0;

      const [contestantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("contestant"), campaignPda.toBuffer(), contestantIdBytes],
        program.programId
      );

      await program.methods
        .addContestant(
          contestants[i].name,
          contestants[i].imageUrl,
          contestants[i].bio
        )
        .accounts({
          campaign: campaignPda,
          contestant: contestantPda,
          user: campaignCreator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([campaignCreator])
        .rpc();

      // Verify contestant was added
      const contestant = await program.account.contestant.fetch(contestantPda);
      expect(contestant.name).to.equal(contestants[i].name);
      expect(contestant.imageUrl).to.equal(contestants[i].imageUrl);
      expect(contestant.bio).to.equal(contestants[i].bio);
      expect(contestant.contestantId).to.equal(i);
      expect(contestant.voteCount.toNumber()).to.equal(0);
    }

    // Verify campaign contestant count was updated
    const campaign = await program.account.campaign.fetch(campaignPda);
    expect(campaign.contestantCount).to.equal(2);
  });

  it("Cast votes", async () => {
    const voteAmount = 100 * 10 ** 6; // 100 USDC
    const contestant1Id = 0;
    const contestant2Id = 1;

    // FIXED: Proper byte array conversion for contestant IDs
    const contestant1IdBytes = new Uint8Array(4);
    contestant1IdBytes[0] = contestant1Id;
    contestant1IdBytes[1] = 0;
    contestant1IdBytes[2] = 0;
    contestant1IdBytes[3] = 0;

    const contestant2IdBytes = new Uint8Array(4);
    contestant2IdBytes[0] = contestant2Id;
    contestant2IdBytes[1] = 0;
    contestant2IdBytes[2] = 0;
    contestant2IdBytes[3] = 0;

    // Find PDAs for contestants and voters
    const [contestant1Pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("contestant"), campaignPda.toBuffer(), contestant1IdBytes],
      program.programId
    );

    const [contestant2Pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("contestant"), campaignPda.toBuffer(), contestant2IdBytes],
      program.programId
    );

    const [voter1Pda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("voter"),
        campaignPda.toBuffer(),
        voter1.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [voter2Pda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("voter"),
        campaignPda.toBuffer(),
        voter2.publicKey.toBuffer(),
      ],
      program.programId
    );

    // Voter 1 votes for contestant 1
    await program.methods
      .castVote(new anchor.BN(voteAmount))
      .accounts({
        campaign: campaignPda,
        voter: voter1Pda,
        contestant: contestant1Pda,
        fromTokenAccount: voter1TokenAccount,
        campaignTokenAccount: campaignTokenAccount,
        platformTreasuryTokenAccount: platformTreasuryTokenAccount,
        voterAuthority: voter1.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
      })
      .signers([voter1])
      .rpc();

    // Voter 2 votes for contestant 2
    await program.methods
      .castVote(new anchor.BN(voteAmount))
      .accounts({
        campaign: campaignPda,
        voter: voter2Pda,
        contestant: contestant2Pda,
        fromTokenAccount: voter2TokenAccount,
        campaignTokenAccount: campaignTokenAccount,
        platformTreasuryTokenAccount: platformTreasuryTokenAccount,
        voterAuthority: voter2.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
      })
      .signers([voter2])
      .rpc();

    // Verify votes were recorded
    const campaign = await program.account.campaign.fetch(campaignPda);
    expect(campaign.totalVotes.toNumber()).to.equal(voteAmount * 2);

    const contestant1 = await program.account.contestant.fetch(contestant1Pda);
    expect(contestant1.voteCount.toNumber()).to.equal(voteAmount);

    const contestant2 = await program.account.contestant.fetch(contestant2Pda);
    expect(contestant2.voteCount.toNumber()).to.equal(voteAmount);

    const voter1Account = await program.account.voter.fetch(voter1Pda);
    expect(voter1Account.totalUsdcVoted.toNumber()).to.equal(voteAmount);

    const voter2Account = await program.account.voter.fetch(voter2Pda);
    expect(voter2Account.totalUsdcVoted.toNumber()).to.equal(voteAmount);

    // FIXED: Use the updated fee percentage from edit campaign (10%)
    const campaignTokenAccountInfo = await getAccount(
      provider.connection,
      campaignTokenAccount
    );
    const expectedCampaignAmount = (voteAmount * 2 * (100 - 10)) / 100; // 10% fee from edit
    expect(Number(campaignTokenAccountInfo.amount)).to.equal(
      expectedCampaignAmount
    );

    const treasuryTokenAccountInfo = await getAccount(
      provider.connection,
      platformTreasuryTokenAccount
    );
    const expectedTreasuryAmount = (voteAmount * 2 * 10) / 100; // 10% fee from edit
    expect(Number(treasuryTokenAccountInfo.amount)).to.equal(
      expectedTreasuryAmount
    );
  });

  it("Edit contestant", async () => {
    const contestant1Id = 0;
    const contestant1IdBytes = new Uint8Array(4);
    contestant1IdBytes[0] = contestant1Id;
    contestant1IdBytes[1] = 0;
    contestant1IdBytes[2] = 0;
    contestant1IdBytes[3] = 0;

    const [contestant1Pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("contestant"), campaignPda.toBuffer(), contestant1IdBytes],
      program.programId
    );

    const newName = "Updated Contestant 1";
    const newBio = "Updated bio for contestant 1";

    await program.methods
      .editContestant(newName, null, newBio)
      .accounts({
        campaign: campaignPda,
        contestant: contestant1Pda,
        user: campaignCreator.publicKey,
      })
      .signers([campaignCreator])
      .rpc();

    const contestant = await program.account.contestant.fetch(contestant1Pda);
    expect(contestant.name).to.equal(newName);
    expect(contestant.bio).to.equal(newBio);
  });

  it("Pause and activate campaign", async () => {
    // Pause campaign
    await program.methods
      .pauseCampaign()
      .accounts({
        campaign: campaignPda,
        user: campaignCreator.publicKey,
      })
      .signers([campaignCreator])
      .rpc();

    let campaign = await program.account.campaign.fetch(campaignPda);
    expect(campaign.isActive).to.be.false;

    // Activate campaign
    await program.methods
      .activateCampaign()
      .accounts({
        campaign: campaignPda,
        user: campaignCreator.publicKey,
      })
      .signers([campaignCreator])
      .rpc();

    campaign = await program.account.campaign.fetch(campaignPda);
    expect(campaign.isActive).to.be.true;
  });

  it("Withdraw fees from treasury", async () => {
    const treasuryTokenAccountInfo = await getAccount(
      provider.connection,
      platformTreasuryTokenAccount
    );
    const withdrawAmount = Number(treasuryTokenAccountInfo.amount);

    await program.methods
      .withdrawFees(new anchor.BN(withdrawAmount))
      .accounts({
        platformTreasuryTokenAccount: platformTreasuryTokenAccount,
        toTokenAccount: treasuryWithdrawAccount,
        treasuryAuthority: treasuryAuthorityPda,
        withdrawAuthority: treasuryAuthority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([treasuryAuthority])
      .rpc();

    // Verify tokens were withdrawn
    const updatedTreasuryTokenAccountInfo = await getAccount(
      provider.connection,
      platformTreasuryTokenAccount
    );
    expect(Number(updatedTreasuryTokenAccountInfo.amount)).to.equal(0);

    const withdrawAccountInfo = await getAccount(
      provider.connection,
      treasuryWithdrawAccount
    );
    expect(Number(withdrawAccountInfo.amount)).to.equal(withdrawAmount);
  });

  it("Fail to vote on paused campaign", async () => {
    // Pause the campaign first
    await program.methods
      .pauseCampaign()
      .accounts({
        campaign: campaignPda,
        user: campaignCreator.publicKey,
      })
      .signers([campaignCreator])
      .rpc();

    const voteAmount = 50 * 10 ** 6; // 50 USDC
    const contestant1Id = 0;
    const contestant1IdBytes = new Uint8Array(4);
    contestant1IdBytes[0] = contestant1Id;
    contestant1IdBytes[1] = 0;
    contestant1IdBytes[2] = 0;
    contestant1IdBytes[3] = 0;

    const [contestant1Pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("contestant"), campaignPda.toBuffer(), contestant1IdBytes],
      program.programId
    );

    const [voter1Pda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("voter"),
        campaignPda.toBuffer(),
        voter1.publicKey.toBuffer(),
      ],
      program.programId
    );

    try {
      await program.methods
        .castVote(new anchor.BN(voteAmount))
        .accounts({
          campaign: campaignPda,
          voter: voter1Pda,
          contestant: contestant1Pda,
          fromTokenAccount: voter1TokenAccount,
          campaignTokenAccount: campaignTokenAccount,
          platformTreasuryTokenAccount: platformTreasuryTokenAccount,
          voterAuthority: voter1.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
        })
        .signers([voter1])
        .rpc();

      expect.fail("Should have failed to vote on paused campaign");
    } catch (error) {
      expect(error.message).to.include("CampaignNotActiveOrEnded");
    }
  });

  it("Fail unauthorized operations", async () => {
    const unauthorizedUser = Keypair.generate();
    await provider.connection.requestAirdrop(
      unauthorizedUser.publicKey,
      LAMPORTS_PER_SOL
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Try to edit campaign with unauthorized user
    try {
      await program.methods
        .editCampaign(null, "unauthorized-banner.jpg", null)
        .accounts({
          campaign: campaignPda,
          user: unauthorizedUser.publicKey,
        })
        .signers([unauthorizedUser])
        .rpc();

      expect.fail("Should have failed with unauthorized user");
    } catch (error) {
      expect(error.message).to.include("Unauthorized");
    }
  });
});
