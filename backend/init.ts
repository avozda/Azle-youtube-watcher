import { ic, $init, match, Opt } from 'azle';
import { state } from './state';
import { handle_mint } from './transfer/mint';
import { is_subaccount_valid, stringify } from './transfer/validate';
import {
    Account,
    InitArgs,
    InitialAccountBalance,
    TransferArgs
} from './types';

$init
export function init(args: InitArgs): void {
    state.decimals = args.decimals;
    state.fee = args.fee;
    state.name = args.name;
    state.minting_account = validate_minting_account(args.minting_account);
    match(args.permitted_drift_nanos, {
        Some: (ok) => {
            state.permitted_drift_nanos = ok
        },
        None: (err) => {
            state.permitted_drift_nanos = state.permitted_drift_nanos
        }
    })

    state.supported_standards = [
        {
            name: 'ICRC-1',
            url: 'https://github.com/dfinity/ICRC-1'
        },
        ...args.supported_standards
    ];
    state.symbol = args.symbol;
    match(args.transaction_window_nanos, {
        Some: (ok) => {
            state.transaction_window_nanos = ok
        },
        None: (err) => {
            state.transaction_window_nanos = state.transaction_window_nanos
        }
    })
    state.metadata = [
        ['icrc1:decimals', { Nat: BigInt(state.decimals) }],
        ['icrc1:fee', { Nat: state.fee }],
        ['icrc1:name', { Text: state.name }],
        ['icrc1:symbol', { Text: state.symbol }],
        ...args.metadata
    ];
    for (const acc of args.initial_account_balances) {
        initialize_account_balance(acc)
    }

}

function validate_minting_account(minting_account: Opt<Account>): Opt<Account> {
    match(minting_account, {
        Some: (acc) => {
            if (
                is_subaccount_valid(acc.subaccount) === false
            ) {
                ic.trap(`subaccount for minting account must be 32 bytes in length`);
            }
            return minting_account;
        },
        None: (Err) => { ic.trap(`subaccount for minting account must be 32 bytes in length`); }
    })

    return minting_account;
}

function initialize_account_balance(
    initial_account_balance: InitialAccountBalance
) {
    if (
        is_subaccount_valid(initial_account_balance.account.subaccount) ===
        false
    ) {
        ic.trap(
            `subaccount for initial account ${initial_account_balance.account.owner.toText()} must be 32 bytes in length`
        );
    }

    const args: TransferArgs = {
        amount: initial_account_balance.balance,
        created_at_time: Opt.Some(ic.time()),
        fee: Opt.None,
        from_subaccount: Opt.None,
        memo: Opt.None,
        to: initial_account_balance.account
    };

    const mint_result = handle_mint(args, state.minting_account);

    if ('Err' in mint_result) {
        ic.trap(stringify(mint_result.Err));
    }
}
