import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Fanvote } from "../target/types/fanvote";
import * as spl from "@solana/spl-token";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";

describe("fanvote", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.fanvote as Program<Fanvote>;

  // Keypairs for test accounts
  const campaignCreator = anchor.web3.Keypair.generate();
  const voter = anchor.web3.Keypair.generate();
  const treasury = anchor.web3.Keypair.generate(); // This will hold the treasury token account

  // Mock USDC mint and associated token accounts
  let usdcMint: anchor.web3.PublicKey;
  let voterUsdcAccount: anchor.web3.PublicKey;
  let treasuryUsdcAccount: anchor.web3.PublicKey;

  // Campaign account to be used across tests
  let campaignAccount: anchor.web3.PublicKey;

  it("Airdrop SOL to accounts", async () => {
    await provider.connection.requestAirdrop(
      campaignCreator.publicKey,
      100 * LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      voter.publicKey,
      100 * LAMPORTS_PER_SOL
    );
    // The treasury keypair is just for signing; the token account will be owned by the program or another designated authority in a real scenario.
    // For this test, we'll make it simple and have it funded.
    await provider.connection.requestAirdrop(
      treasury.publicKey,
      100 * LAMPORTS_PER_SOL
    );

    // Confirm balances
    const creatorBalance = await provider.connection.getBalance(campaignCreator.publicKey);
    const voterBalance = await provider.connection.getBalance(voter.publicKey);
    const treasuryBalance = await provider.connection.getBalance(treasury.publicKey);

    console.log("Campaign Creator SOL balance:", creatorBalance);
    console.log("Voter SOL balance:", voterBalance);
    console.log("Treasury SOL balance:", treasuryBalance);

    // Add assertions to ensure airdrop was successful
    anchor.assert.ok(creatorBalance > 0);
    anchor.assert.ok(voterBalance > 0);
    anchor.assert.ok(treasuryBalance > 0);

  });

  it("Initialize mock USDC mint and token accounts", async () => {
    // Create a new mock USDC mint
    usdcMint = await spl.createMint(
      provider.connection,
      campaignCreator, // Payer
      campaignCreator.publicKey, // Mint authority
      campaignCreator.publicKey, // Freeze authority
      6 // Decimals (standard for USDC)
    );

    console.log("Mock USDC Mint address:", usdcMint.toBase58());

    // Get the associated token account address for the voter and treasury
    voterUsdcAccount = await spl.getAssociatedTokenAddress(
      usdcMint,
      voter.publicKey
    );

    treasuryUsdcAccount = await spl.getAssociatedTokenAddress(
        usdcMint,
        treasury.publicKey
    );

    console.log("Voter USDC ATA address:", voterUsdcAccount.toBase58());
    console.log("Treasury USDC ATA address:", treasuryUsdcAccount.toBase58());

    // Create the associated token accounts
    await spl.createAssociatedTokenAccount(
        provider.connection,
        voter, // Payer
        usdcMint,
        voter.publicKey
    );

    await spl.createAssociatedTokenAccount(
        provider.connection,
        treasury, // Payer
        usdcMint,
        treasury.publicKey
    );

    // Mint some USDC to the voter's account
    await spl.mintTo(
      provider.connection,
      campaignCreator, // Payer
      usdcMint,        // Mint
      voterUsdcAccount, // Destination
      campaignCreator.publicKey, // Authority (mint authority)
      1000 * (10 ** 6) // Amount (1000 USDC with 6 decimals)
    );

    // Verify voter's USDC balance
    const voterUsdcBalance = await provider.connection.getTokenAccountBalance(voterUsdcAccount);
    console.log("Voter USDC balance:", voterUsdcBalance.value.uiAmount);
    anchor.assert.ok(voterUsdcBalance.value.uiAmount === 1000);

  });

  it("Create a voting campaign", async () => {
    const campaignTitle = "Test Show Voting";
    const now = Math.floor(Date.now() / 1000);
    const startTime = now - 60; // Start 1 minute ago
    const endTime = now + 3600; // End in 1 hour

    // Derive the campaign account address
    const [campaignPubKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("campaign"), Buffer.from(campaignTitle)],
        program.programId
    );
    campaignAccount = campaignPubKey;

    await program.methods.createCampaign(campaignTitle, startTime, endTime)
      .accounts({
        campaign: campaignAccount,
        user: campaignCreator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([campaignCreator])
      .rpc();

    // Fetch the created campaign account and verify its data
    const campaign = await program.account.campaign.fetch(campaignAccount);
    console.log("Created Campaign:", campaign);

    anchor.assert.ok(campaign.title === campaignTitle);
    anchor.assert.ok(campaign.startTime.toNumber() === startTime);
    anchor.assert.ok(campaign.endTime.toNumber() === endTime);
    anchor.assert.ok(campaign.totalVotes.toNumber() === 0);
    anchor.assert.ok(campaign.isActive === true);
    anchor.assert.ok(campaign.creator.equals(campaignCreator.publicKey));

  });

  it("Cast a vote", async () => {
    const voteAmount = 10 * (10 ** 6); // Vote with 10 USDC

    // Derive the voter account address
    const [voterPubKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("voter"), campaignAccount.toBuffer(), voter.publicKey.toBuffer()],
        program.programId
    );

    // Get initial balances
    const initialVoterUsdcBalance = await provider.connection.getTokenAccountBalance(voterUsdcAccount);
    const initialTreasuryUsdcBalance = await provider.connection.getTokenAccountBalance(treasuryUsdcAccount);
    const initialTotalVotes = (await program.account.campaign.fetch(campaignAccount)).totalVotes.toNumber();

    await program.methods.castVote(new anchor.BN(voteAmount))
      .accounts({
        campaign: campaignAccount,
        voter: voterPubKey,
        fromTokenAccount: voterUsdcAccount,
        toTokenAccount: treasuryUsdcAccount,
        voterAuthority: voter.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
      })
      .signers([voter])
      .rpc();

    // Fetch updated balances and campaign data
    const updatedVoterUsdcBalance = await provider.connection.getTokenAccountBalance(voterUsdcAccount);
    const updatedTreasuryUsdcBalance = await provider.connection.getTokenAccountBalance(treasuryUsdcAccount);
    const updatedCampaign = await program.account.campaign.fetch(campaignAccount);
    const voterAccount = await program.account.voter.fetch(voterPubKey);

    console.log("Initial Voter USDC balance:", initialVoterUsdcBalance.value.uiAmount);
    console.log("Updated Voter USDC balance:", updatedVoterUsdcBalance.value.uiAmount);
    console.log("Initial Treasury USDC balance:", initialTreasuryUsdcBalance.value.uiAmount);
    console.log("Updated Treasury USDC balance:", updatedTreasuryUsdcBalance.value.uiAmount);
    console.log("Initial Total Votes:", initialTotalVotes);
    console.log("Updated Total Votes:", updatedCampaign.totalVotes.toNumber());
    console.log("Voter account has_voted:", voterAccount.hasVoted);

    // Assertions
    anchor.assert.ok(updatedVoterUsdcBalance.value.uiAmount === initialVoterUsdcBalance.value.uiAmount - (voteAmount / (10**6)));
    anchor.assert.ok(updatedTreasuryUsdcBalance.value.uiAmount === initialTreasuryUsdcBalance.value.uiAmount + (voteAmount / (10**6)));
    anchor.assert.ok(updatedCampaign.totalVotes.toNumber() === initialTotalVotes + voteAmount);
    anchor.assert.ok(voterAccount.hasVoted === true);

  });

  it("Attempt to vote again (should fail)", async () => {
    const voteAmount = 5 * (10 ** 6); // Attempt to vote with 5 USDC again

    // Derive the voter account address
    const [voterPubKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("voter"), campaignAccount.toBuffer(), voter.publicKey.toBuffer()],
        program.programId
    );

    try {
      await program.methods.castVote(new anchor.BN(voteAmount))
        .accounts({
          campaign: campaignAccount,
          voter: voterPubKey,
          fromTokenAccount: voterUsdcAccount,
          toTokenAccount: treasuryUsdcAccount,
          voterAuthority: voter.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
        })
        .signers([voter])
        .rpc();
      // If the transaction succeeds, the test should fail
      throw new Error("Voting twice did not fail.");
    } catch (error: any) {
      // Check if the error is the expected AlreadyVoted error
      anchor.assert.equal(error.error.errorCode.code, "AlreadyVoted");
      console.log("Successfully caught expected error:", error.error.errorCode.code);
    }
  });

});
