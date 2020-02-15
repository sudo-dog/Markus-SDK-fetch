/**
 * @author WMXPY
 * @fileoverview Example
 */

import Markus from "./index";

const m = new Markus('http://localhost:8080');

document.getElementById('btn')?.addEventListener('click', () => {
    const element: HTMLInputElement = document.getElementById('a') as HTMLInputElement;
    const file: any = element.files;
    console.log(file);
    m.uploadMultipleImageByFileList(file, 'test', ['sdk-b']).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });
});
