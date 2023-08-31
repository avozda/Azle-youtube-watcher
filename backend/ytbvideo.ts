import {
    managementCanister
} from 'azle/canisters/management';
import { match, ic, Opt, $update, nat } from 'azle';
import decodeUtf8 from 'decode-utf8';
import { ProposalPayload } from './types';

$update
export async function get_video_details(videoUrl: string): Promise<ProposalPayload> {
    const videoId = youtube_parser(videoUrl);
    const result = await managementCanister.http_request({
        url: "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" + videoId + "&key=AIzaSyAHfgitSqGemoXmaay_RthVJmipFv8anrM",
        max_response_bytes: Opt.None,
        method: {
            get: null
        },
        headers: [],
        body: Opt.None,
        transform: Opt.None
    }).cycles(1_603_120_000n).call();
    return match(result, {
        Ok: (httpResponse) => {
            const res = JSON.parse(decodeUtf8(Uint8Array.from(httpResponse.body)));
            const payload: ProposalPayload = {
                videoId: res.items[0].id,
                title: res.items[0].snippet.title,
                duration: convert_time(res.items[0].contentDetails.duration),
                thumbnailUrl: res.items[0].snippet.thumbnails.default.url,
                channelTile: res.items[0].snippet.channelTitle
            }
            return payload;
        },
        Err: (err) => { ic.trap(err) }
    })
}


function convert_time(durationString: string): nat {
    const a = durationString.match(/\d+/g)
    let duration = 0

    if (a?.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a?.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a?.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return BigInt(duration);
}

function youtube_parser(url: string) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}