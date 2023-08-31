import { State } from './types';
import { Opt } from 'azle';
export let state: State = {
    accounts: [],
    decimals: 0,
    fee: 0n,
    metadata: [],
    minting_account: Opt.None,
    name: 'Azle Bootcamp Token',
    permitted_drift_nanos: 60_000_000_000n,
    supported_standards: [],
    symbol: 'ABCT',
    total_supply: 0n,
    transactions: [],
    transaction_window_nanos: 24n * 60n * 60n * 1_000_000_000n,
    proposal_submission_deposit: { amount_e8s: 50n },
    proposal_vote_threshold: { amount_e8s: 300n }
};
