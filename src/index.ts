/**
 * @author WMXPY
 * @fileoverview Markus-SDK-Fetch
 */
export enum MARKUS_RESPONSE {
    SUCCEED = "SUCCEED",
    FAILED = "FAILED",
}

export interface IMarkusResponse {
    status: MARKUS_RESPONSE;
    data: {
        original: string;
        id: string;
    }
}

export default class Markus {
    private domain: string;
    constructor(domain: string) {
        this.domain = domain;
    }

    uploadSingleImageByFile(file: File, key: string, tags: string[]): Promise<IMarkusResponse> {
        return new Promise<IMarkusResponse>((resolve, reject) => {
            let data = new FormData();

            data.append('image', file);
            data.append('key', key);
            data.append('tag', JSON.stringify(tags));

            fetch(this.domain + '/m/buffer', {
                method: 'POST',
                mode: 'cors',
                body: data,
            })
                .then(function (response: Response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log(response);
                    }
                }).then(function (data: IMarkusResponse) {
                    resolve(data);
                });
        })
    }
}
