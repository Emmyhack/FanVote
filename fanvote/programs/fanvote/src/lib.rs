use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("6SWeYkc2DXhud9dGajgQnTPK2iLShae1Xt4Ng4LqASbf");

#[program]
pub mod fanvote {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    // Instruction to create a new voting campaign
    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        title: String,
        start_time: i64,
        end_time: i64,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.title = title;
        campaign.start_time = start_time;
        campaign.end_time = end_time;
        campaign.total_votes = 0;
        campaign.is_active = true;
        campaign.creator = ctx.accounts.user.key();
        Ok(())
    }

    // Instruction to cast a vote in a campaign
    pub fn cast_vote(ctx: Context<CastVote>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let voter = &mut ctx.accounts.voter;

        // Check if the campaign is active and voting is within the time frame
        let clock = Clock::get()?;
        if !campaign.is_active || clock.unix_timestamp < campaign.start_time || clock.unix_timestamp > campaign.end_time {
            return Err(ErrorCode::CampaignNotActiveOrEnded.into());
        }

        // Check if the voter has already voted in this campaign
        if voter.has_voted {
            return Err(ErrorCode::AlreadyVoted.into());
        }

        // Transfer USDC from the voter to the platform treasury (or campaign account)
        let cpi_accounts = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.voter_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update vote count
        campaign.total_votes += amount; // Assuming 1 USDC = 1 vote for simplicity initially

        // Mark voter as having voted and link to campaign
        voter.has_voted = true;
        voter.campaign = campaign.key();

        Ok(())
    }
}

// Accounts for initializing the program (default Anchor initialize)
#[derive(Accounts)]
pub struct Initialize {}

// Accounts for creating a new campaign
#[derive(Accounts)]
pub struct CreateCampaign<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 8 + 8 + 8 + 1 + 4 + 100)] // Adjusted space for creator field
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Accounts for casting a vote
#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(
        init,
        payer = voter_authority,
        space = 8 + 32 + 1,
        seeds = [b"voter", campaign.key().as_ref(), voter_authority.key().as_ref()],
        bump
    )]
    pub voter: Account<'info, Voter>,
    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>, // Voter's USDC account
    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>, // Platform's USDC treasury account
    #[account(mut)]
    pub voter_authority: Signer<'info>, // The voter
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

// Account to store Campaign information
#[account]
pub struct Campaign {
    pub title: String,
    pub start_time: i64,
    pub end_time: i64,
    pub total_votes: u64,
    pub is_active: bool,
    pub creator: Pubkey, // Creator of the campaign
}

// Account to track voter status for a campaign
#[account]
pub struct Voter {
    pub campaign: Pubkey, // Link to the campaign
    pub has_voted: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The campaign is not active or the voting period has ended.")]
    CampaignNotActiveOrEnded,
    #[msg("You have already voted in this campaign.")]
    AlreadyVoted,
}