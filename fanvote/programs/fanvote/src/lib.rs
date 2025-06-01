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
        banner_url: String,
        platform_fee_percentage: u8, // Platform fee percentage (0-100)
    ) -> Result<()> {
        // Validate inputs
        require!(title.len() <= 100, ErrorCode::TitleTooLong);
        require!(banner_url.len() <= 200, ErrorCode::UrlTooLong);
        require!(platform_fee_percentage <= 20, ErrorCode::FeeTooHigh); // Max 20% fee
        require!(start_time < end_time, ErrorCode::InvalidTimeRange);
        require!(end_time > Clock::get()?.unix_timestamp, ErrorCode::EndTimeInPast);

        let campaign = &mut ctx.accounts.campaign;
        campaign.title = title;
        campaign.start_time = start_time;
        campaign.end_time = end_time;
        campaign.total_votes = 0;
        campaign.is_active = true;
        campaign.creator = ctx.accounts.user.key();
        campaign.banner_url = banner_url;
        campaign.contestant_count = 0;
        campaign.platform_fee_percentage = platform_fee_percentage;
        
        // Initialize top voters array
        campaign.top_voters = [TopVoter::default(); 3];
        
        Ok(())
    }

    // Instruction to edit an existing voting campaign
    pub fn edit_campaign(
        ctx: Context<EditCampaign>,
        end_time: Option<i64>,
        banner_url: Option<String>,
        platform_fee_percentage: Option<u8>,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;

        // Only the campaign creator can edit the campaign
        require!(campaign.creator == ctx.accounts.user.key(), ErrorCode::Unauthorized);

        // Update end time if provided and valid
        if let Some(new_end_time) = end_time {
            require!(new_end_time > Clock::get()?.unix_timestamp, ErrorCode::InvalidEndTime);
            require!(new_end_time > campaign.start_time, ErrorCode::InvalidEndTime);
            campaign.end_time = new_end_time;
        }

        // Update banner URL if provided
        if let Some(new_banner_url) = banner_url {
            require!(new_banner_url.len() <= 200, ErrorCode::UrlTooLong);
            campaign.banner_url = new_banner_url;
        }

        // Update platform fee if provided
        if let Some(new_fee) = platform_fee_percentage {
            require!(new_fee <= 20, ErrorCode::FeeTooHigh);
            campaign.platform_fee_percentage = new_fee;
        }

        Ok(())
    }

    // Instruction to pause a campaign
    pub fn pause_campaign(ctx: Context<ToggleCampaignActive>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;

        require!(campaign.creator == ctx.accounts.user.key(), ErrorCode::Unauthorized);
        require!(campaign.is_active, ErrorCode::CampaignAlreadyPaused);

        campaign.is_active = false;
        Ok(())
    }

    // Instruction to activate a paused campaign
    pub fn activate_campaign(ctx: Context<ToggleCampaignActive>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;

        require!(campaign.creator == ctx.accounts.user.key(), ErrorCode::Unauthorized);
        require!(!campaign.is_active, ErrorCode::CampaignAlreadyActive);
        require!(Clock::get()?.unix_timestamp < campaign.end_time, ErrorCode::CampaignEnded);

        campaign.is_active = true;
        Ok(())
    }

    // Instruction to cast a vote in a campaign
    pub fn cast_vote(ctx: Context<CastVote>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let voter = &mut ctx.accounts.voter;
        let contestant = &mut ctx.accounts.contestant;

        // Validate voting conditions
        require!(campaign.is_active, ErrorCode::CampaignNotActiveOrEnded);
        let current_time = Clock::get()?.unix_timestamp;
        require!(current_time >= campaign.start_time, ErrorCode::CampaignNotStarted);
        require!(current_time <= campaign.end_time, ErrorCode::CampaignNotActiveOrEnded);
        require!(amount > 0, ErrorCode::ZeroAmount);
        require!(contestant.campaign == campaign.key(), ErrorCode::InvalidContestant);

        // Calculate platform fee
        let platform_fee_amount = amount
            .checked_mul(campaign.platform_fee_percentage as u64)
            .and_then(|v| v.checked_div(100))
            .ok_or(ErrorCode::InvalidFeeCalculation)?;
        
        let amount_to_campaign = amount
            .checked_sub(platform_fee_amount)
            .ok_or(ErrorCode::InvalidFeeCalculation)?;

        // Transfer amount minus fee to campaign's USDC account
        if amount_to_campaign > 0 {
            let transfer_to_campaign_accounts = Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.campaign_token_account.to_account_info(),
                authority: ctx.accounts.voter_authority.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx_to_campaign = CpiContext::new(cpi_program, transfer_to_campaign_accounts);
            token::transfer(cpi_ctx_to_campaign, amount_to_campaign)?;
        }

        // Transfer platform fee to treasury
        if platform_fee_amount > 0 {
            let transfer_to_treasury_accounts = Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.platform_treasury_token_account.to_account_info(),
                authority: ctx.accounts.voter_authority.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx_to_treasury = CpiContext::new(cpi_program, transfer_to_treasury_accounts);
            token::transfer(cpi_ctx_to_treasury, platform_fee_amount)?;
        }

        // Update vote counts
        campaign.total_votes = campaign.total_votes
            .checked_add(amount)
            .ok_or(ErrorCode::VoteOverflow)?;
        
        voter.total_usdc_voted = voter.total_usdc_voted
            .checked_add(amount)
            .ok_or(ErrorCode::VoteOverflow)?;
        
        contestant.vote_count = contestant.vote_count
            .checked_add(amount)
            .ok_or(ErrorCode::VoteOverflow)?;

        // Update voter info
        voter.voter_authority = ctx.accounts.voter_authority.key();
        voter.campaign = campaign.key();

        // Update top voters list
        update_top_voters(campaign, ctx.accounts.voter_authority.key(), voter.total_usdc_voted)?;

        Ok(())
    }

    // Instruction to add a contestant to a campaign
    pub fn add_contestant(
        ctx: Context<AddContestant>,
        name: String,
        image_url: String,
        bio: String,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let contestant = &mut ctx.accounts.contestant;

        // Validate inputs
        require!(campaign.creator == ctx.accounts.user.key(), ErrorCode::Unauthorized);
        require!(name.len() > 0 && name.len() <= 50, ErrorCode::InvalidName);
        require!(image_url.len() <= 200, ErrorCode::UrlTooLong);
        require!(bio.len() <= 500, ErrorCode::BioTooLong);
        require!(campaign.contestant_count < 50, ErrorCode::TooManyContestants); // Limit contestants

        contestant.campaign = campaign.key();
        contestant.contestant_id = campaign.contestant_count;
        contestant.name = name;
        contestant.image_url = image_url;
        contestant.bio = bio;
        contestant.vote_count = 0;

        campaign.contestant_count = campaign.contestant_count
            .checked_add(1)
            .ok_or(ErrorCode::ContestantOverflow)?;

        Ok(())
    }

    // Instruction to edit an existing contestant
    pub fn edit_contestant(
        ctx: Context<EditContestant>,
        name: Option<String>,
        image_url: Option<String>,
        bio: Option<String>,
    ) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let contestant = &mut ctx.accounts.contestant;

        require!(campaign.creator == ctx.accounts.user.key(), ErrorCode::Unauthorized);
        require!(contestant.campaign == campaign.key(), ErrorCode::InvalidContestant);

        if let Some(new_name) = name {
            require!(new_name.len() > 0 && new_name.len() <= 50, ErrorCode::InvalidName);
            contestant.name = new_name;
        }

        if let Some(new_image_url) = image_url {
            require!(new_image_url.len() <= 200, ErrorCode::UrlTooLong);
            contestant.image_url = new_image_url;
        }

        if let Some(new_bio) = bio {
            require!(new_bio.len() <= 500, ErrorCode::BioTooLong);
            contestant.bio = new_bio;
        }

        Ok(())
    }

    // Instruction to withdraw fees from the platform treasury
    pub fn withdraw_fees(
        ctx: Context<WithdrawFees>,
        amount: u64,
    ) -> Result<()> {
        let authority_bump = ctx.bumps.treasury_authority;
        let authority_seeds: &[&[u8]] = &[b"treasury", &[authority_bump]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.platform_treasury_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.treasury_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let signer_seeds: &[&[&[u8]]] = &[&authority_seeds];
        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program,
            cpi_accounts,
            signer_seeds
        );

        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}

// Helper function to update top voters
fn update_top_voters(campaign: &mut Campaign, voter_key: Pubkey, total_voted: u64) -> Result<()> {
    let new_voter = TopVoter {
        voter: voter_key,
        total_voted,
    };

    // Check if voter already exists in top voters
    let mut existing_index = None;
    for (i, top_voter) in campaign.top_voters.iter().enumerate() {
        if top_voter.voter == voter_key {
            existing_index = Some(i);
            break;
        }
    }

    if let Some(index) = existing_index {
        // Update existing voter
        campaign.top_voters[index] = new_voter;
    } else {
        // Try to add new voter
        // Find the position to insert (sort by total_voted descending)
        let mut insert_pos = None;
        for (i, top_voter) in campaign.top_voters.iter().enumerate() {
            if top_voter.voter == Pubkey::default() || total_voted > top_voter.total_voted {
                insert_pos = Some(i);
                break;
            }
        }

        if let Some(pos) = insert_pos {
            // Shift elements to make room
            for i in (pos + 1..3).rev() {
                if i > 0 {
                    campaign.top_voters[i] = campaign.top_voters[i - 1];
                }
            }
            campaign.top_voters[pos] = new_voter;
        }
    }

    // Sort top voters by total_voted descending
    campaign.top_voters.sort_by(|a, b| {
        if a.voter == Pubkey::default() && b.voter == Pubkey::default() {
            std::cmp::Ordering::Equal
        } else if a.voter == Pubkey::default() {
            std::cmp::Ordering::Greater
        } else if b.voter == Pubkey::default() {
            std::cmp::Ordering::Less
        } else {
            b.total_voted.cmp(&a.total_voted)
        }
    });

    Ok(())
}

// Accounts for initializing the program
#[derive(Accounts)]
pub struct Initialize {}

// Accounts for creating a new campaign
#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateCampaign<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + // discriminator
        4 + 100 + // title (String)
        8 + // start_time
        8 + // end_time
        8 + // total_votes
        1 + // is_active
        32 + // creator
        4 + 200 + // banner_url (String)
        4 + // contestant_count
        1 + // platform_fee_percentage
        3 * (32 + 8), // top_voters array
        seeds = [b"campaign", title.as_bytes()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Accounts for editing an existing campaign
#[derive(Accounts)]
pub struct EditCampaign<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
}

// Accounts for pausing/activating a campaign
#[derive(Accounts)]
pub struct ToggleCampaignActive<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
}

// Accounts for casting a vote
#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init_if_needed, 
        payer = voter_authority, 
        space = 8 + 32 + 32 + 8, // discriminator + campaign + voter_authority + total_usdc_voted
        seeds = [b"voter", campaign.key().as_ref(), voter_authority.key().as_ref()], 
        bump
    )]
    pub voter: Account<'info, Voter>,

    #[account(
        mut,
        seeds = [b"contestant", campaign.key().as_ref(), &contestant.contestant_id.to_le_bytes()], 
        bump
    )]
    pub contestant: Account<'info, Contestant>,

    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub campaign_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub platform_treasury_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub voter_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

// Accounts for adding a contestant
#[derive(Accounts)]
pub struct AddContestant<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init,
        payer = user,
        space = 8 + // discriminator
        32 + // campaign
        4 + // contestant_id
        4 + 50 + // name (String)
        4 + 200 + // image_url (String)
        4 + 500 + // bio (String)
        8, // vote_count
        seeds = [b"contestant", campaign.key().as_ref(), &campaign.contestant_count.to_le_bytes()],
        bump
    )]
    pub contestant: Account<'info, Contestant>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Accounts for editing an existing contestant
#[derive(Accounts)]
pub struct EditContestant<'info> {
    pub campaign: Account<'info, Campaign>,

    #[account(
        mut,
        seeds = [b"contestant", campaign.key().as_ref(), &contestant.contestant_id.to_le_bytes()],
        bump
    )]
    pub contestant: Account<'info, Contestant>,

    #[account(mut)]
    pub user: Signer<'info>,
}

// Accounts for withdrawing fees from the platform treasury
#[derive(Accounts)]
pub struct WithdrawFees<'info> {
    #[account(mut)]
    pub platform_treasury_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [b"treasury"],
        bump
    )]
    /// CHECK: This is the PDA authority for the treasury
    pub treasury_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub withdraw_authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

// Account structures
#[account]
pub struct Campaign {
    pub title: String,
    pub start_time: i64,
    pub end_time: i64,
    pub total_votes: u64,
    pub is_active: bool,
    pub creator: Pubkey,
    pub banner_url: String,
    pub contestant_count: u32,
    pub platform_fee_percentage: u8,
    pub top_voters: [TopVoter; 3],
}

#[account]
pub struct Voter {
    pub campaign: Pubkey,
    pub voter_authority: Pubkey,
    pub total_usdc_voted: u64,
}

#[account]
pub struct Contestant {
    pub campaign: Pubkey,
    pub contestant_id: u32,
    pub name: String,
    pub image_url: String,
    pub bio: String,
    pub vote_count: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Default)]
pub struct TopVoter {
    pub voter: Pubkey,
    pub total_voted: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The campaign is not active or the voting period has ended.")]
    CampaignNotActiveOrEnded,
    #[msg("You have already voted in this campaign.")]
    AlreadyVoted,
    #[msg("Vote amount is too small to calculate fee.")]
    AmountTooSmallForFee,
    #[msg("Invalid fee calculation.")]
    InvalidFeeCalculation,
    #[msg("Unauthorized to perform this action.")]
    Unauthorized,
    #[msg("Invalid end time for the campaign.")]
    InvalidEndTime,
    #[msg("Invalid contestant account.")]
    InvalidContestant,
    #[msg("Campaign voting period has ended.")]
    CampaignEnded,
    #[msg("Campaign is already paused.")]
    CampaignAlreadyPaused,
    #[msg("Campaign is already active.")]
    CampaignAlreadyActive,
    #[msg("Campaign has not started yet.")]
    CampaignNotStarted,
    #[msg("Title is too long.")]
    TitleTooLong,
    #[msg("URL is too long.")]
    UrlTooLong,
    #[msg("Platform fee is too high (maximum 20%).")]
    FeeTooHigh,
    #[msg("Invalid time range.")]
    InvalidTimeRange,
    #[msg("End time cannot be in the past.")]
    EndTimeInPast,
    #[msg("Amount cannot be zero.")]
    ZeroAmount,
    #[msg("Vote count overflow.")]
    VoteOverflow,
    #[msg("Invalid name length.")]
    InvalidName,
    #[msg("Bio is too long.")]
    BioTooLong,
    #[msg("Too many contestants in campaign.")]
    TooManyContestants,
    #[msg("Contestant count overflow.")]
    ContestantOverflow,
}