import { blob, int, nat, nat8, nat64, Opt, Principal, Variant, Record, Vec, text } from 'azle';
import { Tuple } from 'azle';
export type Account = Record<{
    owner: Principal;
    subaccount: Opt<Subaccount>;
}>;

export type User = Record<{
    id: Principal;
    username: string;
    nftURL: string;
    about: string;
    twitterLink: string;
    createdAt: nat64;
}>;

export type UserPayload = Record<{
    username: string;
    nftURL: string;
    about: string;
    twitterLink: string;
}>;

export type InitArgs = Record<{
    decimals: nat8;
    fee: nat;
    initial_account_balances: Vec<InitialAccountBalance>;
    metadata: Vec<Metadatum>;
    minting_account: Opt<Account>;
    name: string;
    permitted_drift_nanos: Opt<nat64>;
    supported_standards: Vec<SupportedStandard>;
    symbol: string;
    transaction_window_nanos: Opt<nat64>;
}>;

export type InitialAccountBalance = Record<{
    account: Account;
    balance: nat;
}>;

export type Metadatum = Tuple<[string, Value]>;

export type OwnerKey = string;

export type State = Record<{
    /*     accounts: Record<{
            [key: OwnerKey]: | Record<{ [key: SubaccountKey]: nat | undefined; }> | undefined;
        }>; */
    accounts: Vec<Account>;
    decimals: nat8;
    fee: nat;
    metadata: Vec<Metadatum>;
    minting_account: Opt<Account>;
    name: string;
    permitted_drift_nanos: nat64;
    supported_standards: Vec<SupportedStandard>;
    symbol: string;
    total_supply: nat;
    transactions: Vec<Transaction>;
    transaction_window_nanos: nat64;
    proposal_vote_threshold: Tokens;
    proposal_submission_deposit: Tokens;
}>;

export type Subaccount = blob;

export type SubaccountKey = string;

export type SupportedStandard = Record<{
    name: string;
    url: string;
}>;

export type Transaction = Record<{
    args: Opt<TransferArgs>;
    fee: nat;
    from: Opt<Account>;
    kind: TransactionKind;
    timestamp: nat64;
}>;

export type TransactionKind = Variant<{
    Burn: null;
    Mint: null;
    Transfer: null;
}>;

export type TransferArgs = Record<{
    amount: nat;
    created_at_time: Opt<nat64>;
    fee: Opt<nat>;
    from_subaccount: Opt<Subaccount>;
    memo: Opt<blob>;
    to: Account;
}>;

export type TransferError = Variant<{
    BadBurn: Record<{ min_burn_amount: nat }>;
    BadFee: Record<{ expected_fee: nat }>;
    CreatedInFuture: Record<{ ledger_time: nat64 }>;
    Duplicate: Record<{ duplicate_of: nat }>;
    GenericError: Record<{ error_code: nat; message: string }>;
    InsufficientFunds: Record<{ balance: nat }>;
    TemporarilyUnavailable: null;
    TooOld: null;
}>;

export type TransferResult = Variant<{
    Ok: nat;
    Err: TransferError;
}>;

export type ValidateTransferResult = Variant<{
    ok: boolean;
    err: TransferError;
}>;

export type Value = Variant<{
    Blob: blob;
    Int: int;
    Nat: nat;
    Text: string;
}>;

export type ProposalId = nat;
export type Tokens = Record<{ amount_e8s: nat }>;

export type ProposalPayload = Record<{
    videoId: string;
    title: string;
    duration: nat;
    channelTile: string;
    thumbnailUrl: string;
}>;

export type Proposal = Record<{
    id: nat;
    timestamp: nat64;
    votes_yes: Tokens;
    votes_no: Tokens;
    voters: Vec<Principal>;
    state: ProposalState;
    proposer: Principal;
    payload: ProposalPayload;
}>;



export type ProposalState = Variant<{
    // A failure occurred while executing the proposal
    Failed: text;
    // The proposal is open for voting
    Open: null;
    // The proposal is currently being executed
    Executing: null;
    // Enough "no" votes have been cast to reject the proposal, and it will not be executed
    Rejected: null;
    // The proposal has been successfully executed
    Succeeded: null;
    // Enough "yes" votes have been cast to accept the proposal, and it will soon be executed
    Accepted: null;
}>;

export type Vote = Variant<{
    Yes: null,
    No: null
}>


export type VoteArgs = Record<{
    proposal_id: nat,
    vote: Vote,
}>