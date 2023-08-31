import { balance_of } from '../account';
import { blob, ic, match, nat, nat64, Opt, Principal } from 'azle';
import { state } from '../state';
import { is_minting_account } from '../transfer/mint';
import {
    Account,
    Subaccount,
    TransferArgs,
    ValidateTransferResult
} from '../types';

export function validate_transfer(
    args: TransferArgs,
    from: Account
): ValidateTransferResult {
    const from_is_anonymous = is_anonymous(from.owner);

    if (from_is_anonymous === true) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'anonymous user is not allowed to transfer funds'
                }
            }
        };
    }

    const from_subaccount_is_valid = is_subaccount_valid(args.from_subaccount);

    if (from_subaccount_is_valid === false) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'from_subaccount must be 32 bytes in length'
                }
            }
        };
    }

    const to_subaccount_is_valid = is_subaccount_valid(args.to.subaccount);

    if (to_subaccount_is_valid === false) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'to.subaccount must be 32 bytes in length'
                }
            }
        };
    }

    const memo_is_valid = is_memo_valid(args.memo);

    if (memo_is_valid === false) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'memo must be a maximum of 32 bytes in length'
                }
            }
        };
    }

    const created_at_time_is_in_future = is_created_at_time_in_future(
        args.created_at_time
    );

    if (created_at_time_is_in_future === true) {
        return {
            err: {
                CreatedInFuture: {
                    ledger_time: ic.time()
                }
            }
        };
    }

    const created_at_time_too_old = is_created_at_time_too_old(
        args.created_at_time
    );

    if (created_at_time_too_old === true) {
        return {
            err: {
                TooOld: null
            }
        };
    }

    const duplicate_transaction_index = find_duplicate_transaction_index(args, from);

    const is_duplicate = match(duplicate_transaction_index, {
        Some: (ok) => {
            if (ok !== null) {
                return {
                    err: {
                        Duplicate: {
                            duplicate_of: ok
                        }
                    }
                };
            }
        },
        None: (err) => { }
    })
    if (is_duplicate?.err) {
        return is_duplicate;
    }



    const from_is_minting_account = is_minting_account(from.owner);

    const from_is_minter = match(args.fee, {
        Some: (ok) => {
            if (from_is_minting_account === true && (ok ?? 0n) !== 0n) {
                return {
                    err: {
                        BadFee: {
                            expected_fee: 0n
                        }
                    }
                };
            }
        },
        None: (err) => { }
    })
    if (from_is_minter?.err) {
        return from_is_minter;
    }


    const to_is_minting_account = is_minting_account(args.to.owner);

    const to_is_minter = match(args.fee, {
        Some: (ok) => {
            if (to_is_minting_account === true) {
                if ((ok ?? 0n) !== 0n) {
                    return {
                        err: {
                            BadFee: {
                                expected_fee: 0n
                            }
                        }
                    };
                }

                if (args.amount < state.fee) {
                    return {
                        err: {
                            BadBurn: {
                                min_burn_amount: state.fee
                            }
                        }
                    };
                }
            }
        },
        None: (err) => { }
    })
    if (to_is_minter?.err) {
        return to_is_minter;
    }


    const fee_err = match(args.fee, {
        Some: (ok) => {
            if (!from_is_minting_account && !to_is_minting_account) {
                if ((ok ?? state.fee) !== state.fee) {
                    return {
                        err: {
                            BadFee: {
                                expected_fee: state.fee
                            }
                        }
                    };
                }
            }
        },
        None: (er) => { }
    })
    if (fee_err?.err) {
        return fee_err;
    }


    const from_balance = balance_of(from);

    if (
        from_is_minting_account === false &&
        from_balance < args.amount + state.fee
    ) {
        return {
            err: {
                InsufficientFunds: {
                    balance: from_balance
                }
            }
        };
    }

    return {
        ok: true
    };
}

function is_anonymous(principal: Principal): boolean {
    return principal.toText() === '2vxsx-fae';
}

export function is_subaccount_valid(subaccount: Opt<Subaccount>): boolean {
    const is_valid = match(subaccount, {
        Some: (ok) => { return ok.length === 4 },
        None: (er) => { return true }
    })
    return is_valid;
}

function is_memo_valid(memo: Opt<blob>): boolean {
    const is_valid = match(memo, {
        Some: (ok) => { return ok.length <= 4 },
        None: (er) => { return true }
    })
    return is_valid;
}

function is_created_at_time_in_future(created_at_time: Opt<nat64>): boolean {
    const now = ic.time();
    const tx_time = created_at_time ?? now;

    const is_future = match(tx_time, {
        Some: (ok) => {
            if (ok > now && ok - now > state.permitted_drift_nanos) {
                return true;
            } else {
                return false;
            }
        },
        None: (er) => { return false }
    })
    return is_future;

}

function is_created_at_time_too_old(created_at_time: Opt<nat64>): boolean {
    const now = ic.time();
    const tx_time = created_at_time ?? now;

    const is_old = match(tx_time, {
        Some: (ok) => {
            if (
                ok < now &&
                now - ok > state.transaction_window_nanos + state.permitted_drift_nanos
            ) {
                return true;
            } else {
                return false;
            }
        },
        None: (er) => { return false }
    })
    return is_old;
}

function find_duplicate_transaction_index(
    transfer_args: TransferArgs,
    from: Account
): Opt<nat> {
    const now = ic.time();

    for (let i = 0; i < state.transactions.length; i++) {
        const transaction = state.transactions[i];

        if (
            stringify({
                ...transfer_args,
                from
            }) === stringify({
                ...transaction.args,
                from: transaction.from
            }) &&
            transaction.timestamp < now + state.permitted_drift_nanos &&
            now - transaction.timestamp <
            state.transaction_window_nanos + state.permitted_drift_nanos
        ) {
            return Opt.Some(BigInt(i));
        }
    }

    return Opt.None
}

export function stringify(value: any): string {
    return JSON.stringify(value, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    );
}
