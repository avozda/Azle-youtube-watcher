import { $update, ic, Opt, match } from 'azle';
import { handle_burn } from '../transfer/burn';
import { handle_mint, is_minting_account } from '../transfer/mint';
import { handle_transfer } from '../transfer/transfer';
import { validate_transfer } from '../transfer/validate';
import {
    Account,
    TransferArgs,
    TransferResult
} from '../types';
$update
export function icrc1_transfer(args: TransferArgs): TransferResult {
    const from: Account = {
        owner: ic.caller(),
        subaccount: args.from_subaccount
    };

    const validate_transfer_result = validate_transfer(args, from);

    if (validate_transfer_result.err) {

        return { Err: validate_transfer_result.err }
    }

    const from_is_minting_account = is_minting_account(from.owner);
    const to_is_minting_account = is_minting_account(args.to.owner);

    if (from_is_minting_account === true) {
        return handle_mint(args, Opt.Some(from));
    }

    if (to_is_minting_account === true) {
        return handle_burn(args, from);
    }

    return handle_transfer(args, from);
}
