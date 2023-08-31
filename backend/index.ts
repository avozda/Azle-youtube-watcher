import {
  $query,
  $update,
  StableBTreeMap,
  match,
  Result,
  ic,
  Opt,
  Vec,
  Principal,
  $heartbeat
} from "azle";
export {
  get_transactions,
  icrc1_balance_of,
  icrc1_decimals,
  icrc1_fee,
  icrc1_metadata,
  icrc1_minting_account,
  icrc1_name,
  icrc1_supported_standards,
  icrc1_symbol,
  icrc1_total_supply,
  icrc1_transfer
} from './api';
import { state } from "./state";
export { init } from './init';
import { Proposal, ProposalId, ProposalPayload, VoteArgs, User, UserPayload } from "./types";
import { handle_mint } from "./transfer/mint";
import { balance_of, set_account_balance } from "./account";
import { get_video_details } from "./ytbvideo";


export { get_video_details } from "./ytbvideo"

const userStorage = new StableBTreeMap<Principal, User>(0, 63, 1024);
const proposals = new StableBTreeMap<ProposalId, Proposal>(1, 100, 2_000);
let currentVideo: null | string = null;
/**
 * returns A registered User or an error message
 */
$query;
export function getUser(id: Principal): Result<User, string> {
  return match(userStorage.get(id), {
    Some: (user) => Result.Ok<User, string>(user),
    None: () => Result.Err<User, string>(`User with id=${id} not found`),
  });
}

$update;
export function deleteUser(): Result<User, string> {
  return match(userStorage.remove(ic.caller()), {
    Some: (deletedUser) => Result.Ok<User, string>(deletedUser),
    None: () =>
      Result.Err<User, string>(`User with id=${ic.caller()} not found`),
  });
}

$update;
export function registerUser(payload: UserPayload): Result<User, string> {
  if (getUser(ic.caller()).Ok) {
    return Result.Err<User, string>("You are already registered");
  }
  const user: User = {
    id: ic.caller(),
    createdAt: ic.time(),
    ...payload,
  };
  handle_mint({
    amount: 100n, to: { owner: ic.caller(), subaccount: Opt.None },
    created_at_time: Opt.None,
    fee: Opt.None,
    from_subaccount: Opt.None,
    memo: Opt.None,
  }, Opt.Some({ owner: Principal.fromText("ogtn2-u6mfe-z7mit-j3fjj-h5y6f-beq4x-dtvgo-cclzu-4t4n6-cbo2t-uae"), subaccount: Opt.None }))
  userStorage.insert(ic.caller(), user);
  return Result.Ok(user);
}
$update;
export function updateUser(payload: UserPayload): Result<User, string> {
  const userResult = getUser(ic.caller());

  if (userResult.Err) {
    return Result.Err<User, string>("User has no profile");
  }
  const user = userResult.Ok!;
  const newUser = { ...user, ...payload }
  userStorage.insert(ic.caller(), newUser);

  return Result.Ok(newUser);
}

/**
 * Allows a registered user to login
 * 
 */
$update;
export function loginUser(): Result<User, string> {
  const user = getUser(ic.caller());
  if (user.Ok) {
    return Result.Ok<User, string>(user.Ok);
  }
  // return an error message if caller isn't registered
  return Result.Err<User, string>("Caller isn't registered");
}

$update;
export async function addProposal(videoUrl: string): Promise<Result<Proposal, string>> {
  if (!videoUrl.includes("www.youtube.com")) {
    ic.trap("Invalid link")
  }
  const caller = ic.caller();
  const res = deduct_proposal_submission_deposit(caller);
  const hasEnough = match(res, {
    Ok: () => { return false },
    Err: (Err) => { return Err }
  })
  if (typeof (hasEnough) == 'string') {
    return Result.Err<Proposal, string>(hasEnough)
  }
  const id = proposals.len();

  const payload = await get_video_details(videoUrl);

  const proposal: Proposal = {
    id: id,
    timestamp: ic.time(),
    votes_yes: { amount_e8s: 0n },
    votes_no: { amount_e8s: 0n },
    voters: [],
    proposer: caller,
    state: { Open: null },
    payload: payload,
  };

  proposals.insert(id, proposal);
  return match(proposals.get(proposal.id), {
    Some: (proposal) => Result.Ok<Proposal, string>(proposal),
    None: () => Result.Err<Proposal, string>("Something went wrong"),
  });
}

$query;
export function getProposals(): Vec<Proposal> {
  return proposals.values();
}

$update
export function vote(args: VoteArgs): Result<Proposal, string> {
  const proposal = match(proposals.get(args.proposal_id), {
    Some: (proposal) => proposal,
    None: () => ic.trap("Proposal not found"),
  });

  if (proposal.state.Open != undefined) {
    return Result.Err<Proposal, string>("Proposal is not open")
  }

  const voting_tokens = balance_of({ owner: ic.caller(), subaccount: Opt.None })
  if (voting_tokens == 0n) {
    return Result.Err<Proposal, string>("You have no voting power")
  }

  if (proposal.voters.includes(ic.caller())) {
    return Result.Err<Proposal, string>("You have already voted")
  }

  if (args.vote.Yes !== undefined) {
    proposal.votes_yes.amount_e8s += voting_tokens;
  }
  if (args.vote.No !== undefined) {
    proposal.votes_no.amount_e8s += voting_tokens;
  }
  proposal.voters.push(ic.caller())

  if (proposal.votes_yes.amount_e8s > state.proposal_vote_threshold.amount_e8s) {
    set_account_balance(
      { owner: proposal.proposer, subaccount: Opt.None },
      (balance_of({ owner: proposal.proposer, subaccount: Opt.None }) + state.proposal_submission_deposit.amount_e8s))
    proposal.state = { Accepted: null };
  }
  if (proposal.votes_no.amount_e8s > state.proposal_vote_threshold.amount_e8s) {
    proposal.state = { Rejected: null };
  }

  proposals.insert(proposal.id, proposal);
  return Result.Ok(proposal)
}

function deduct_proposal_submission_deposit(caller: Principal): Result<null, string> {

  const balance = balance_of({ owner: caller, subaccount: Opt.None });
  const user = getUser(caller);
  if (!user.Ok) {
    return Result.Err("Caller needs an account to submit a proposal")
  }
  if (balance < state.proposal_submission_deposit.amount_e8s) {
    return Result.Err("Caller's account must have at least " + state.proposal_submission_deposit.amount_e8s + " to submit a proposal");
  } else {
    set_account_balance({ owner: caller, subaccount: Opt.None }, (balance - state.proposal_submission_deposit.amount_e8s))
  }
  return Result.Ok(null);

}

$update
export function execute_accepted_proposals(): void {
  const accepted_proposlas = proposals.values().filter((proposal) => proposal.state.Accepted == null)

  accepted_proposlas.forEach(proposal => {
    execute_proposal(proposal)
  });
}


function execute_proposal(proposal: Proposal): void {

}

$heartbeat
export function heartbeat(): void {
  execute_accepted_proposals()
}