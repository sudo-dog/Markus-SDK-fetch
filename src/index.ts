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
    public constructor(domain: string) {
        this.domain = domain;
    }

    public uploadSingleImageByFile(file: File, key: string, tags: string[]): Promise<IMarkusResponse> {
        return new Promise<IMarkusResponse>((resolve, reject) => {
            let data = new FormData();

            data.append('image', file);
            data.append('key', key);
            data.append('tag', JSON.stringify(tags));

            fetch(this.domain + '/m/buffer', {
                method: 'POST',
                mode: 'cors',
                body: data,
            }).then(function (response: Response) {
                return response.json();
            }).then(function (data: IMarkusResponse) {
                if (data.status === MARKUS_RESPONSE.SUCCEED) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }

    public uploadMultipleImageByFiles(files: File[], key: string, tags: string[]): Promise<IMarkusResponse[]> {
        const resultList: IMarkusResponse[] = [];
        const filesLength = files.length;
        const Upload = (callback: () => any, whenErr: (err: Error) => any) => {
            const file = files.shift();
            if (file) {
                this.uploadSingleImageByFile(file, key, tags).then((result: any) => {
                    resultList.push(result);
                    Upload(callback, whenErr);
                }).catch((err: Error) => {
                    whenErr(err);
                });
            } else {
                callback();
            }
        };

        return new Promise<IMarkusResponse[]>((resolve, reject) => {
            const loop = files.length <= 5 ? files.length : 5;
            for (let i = 0; i < loop; i++) {
                Upload(() => {
                    if (resultList.length === filesLength) {
                        resolve(resultList);
                    }
                }, (err: Error) => {
                    reject(err);
                });
            }
        });
    }

    public uploadMultipleImageByFileList(fileList: FileList, key: string, tags: string[]): Promise<IMarkusResponse[]> {
        const files: File[] = []
        for (let i = 0; i < fileList.length; i++) {
            files.push(fileList[i]);
        }
        return new Promise<IMarkusResponse[]>((resolve, reject) => {
            this.uploadMultipleImageByFiles(files, key, tags).then((result: IMarkusResponse[]) => {
                resolve(result);
            }).catch((reason: any) => {
                reject(reason);
            });
        });
    }
}
