import { balance_of, set_account_balance } from '../account';
import { Opt, ic } from 'azle';
import { state } from '../state';
import {
    Account,
    Transaction,
    TransferArgs,
    TransferResult
} from '../types';

export function handle_burn(args: TransferArgs, from: Account): TransferResult {
    set_account_balance(from, balance_of(from) - args.amount);
    state.total_supply -= args.amount;

    const transaction: Transaction = {
        args: Opt.Some(args),
        fee: 0n,
        from: Opt.Some(from),
        kind: {
            Burn: null
        },
        timestamp: ic.time()
    };

    state.transactions.push(transaction);

    const transfer_result: TransferResult = {
        Ok: args.amount
    };

    return transfer_result;
}
