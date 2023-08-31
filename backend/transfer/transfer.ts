import { balance_of, set_account_balance } from '../account';
import { Opt, ic, match } from 'azle';
import { state } from '../state';
import {
    Account,
    Transaction,
    TransactionKind,
    TransferArgs,
    TransferResult
} from '../types';

export function handle_transfer(args: TransferArgs, from: Account): TransferResult {
    const kind: TransactionKind = {
        Transfer: null
    };

    const fee = args.fee ?? state.fee;
    match(fee, {
        Some: (ok) => { set_account_balance(from, balance_of(from) - args.amount - ok); },
        None: (er) => { set_account_balance(from, balance_of(from) - args.amount) }
    })

    set_account_balance(args.to, balance_of(args.to) + args.amount);

    match(state.minting_account, {
        Some: (ok) => {
            match(fee, {
                Some: (feee) => {
                    if (state.minting_account !== null) {
                        set_account_balance(
                            ok,
                            balance_of(ok) + feee
                        );
                    }

                    state.total_supply -= feee;
                },
                None: (err) => { }
            })
        },
        None: (er) => {
        }
    })

    const transaction: Transaction = match(fee, {
        Some: (ok) => {
            return {
                args: Opt.Some(args),
                fee: ok,
                from: Opt.Some(from),
                kind,
                timestamp: ic.time()
            };
        },
        None: (er) => {
            return {
                args: Opt.Some(args),
                fee: 0n,
                from: Opt.Some(from),
                kind,
                timestamp: ic.time()
            };
        }
    })


    state.transactions.push(transaction);

    const transfer_result: TransferResult = {
        Ok: args.amount
    };

    return transfer_result;
}
