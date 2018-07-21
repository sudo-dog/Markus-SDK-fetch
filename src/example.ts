/**
 * @author WMXPY
 * @fileoverview Example
 */

import Markus from "./index";

const m = new Markus('http://localhost:8080');

document.getElementById('btn').addEventListener('click', () => {
    const part: HTMLInputElement = document.getElementById('a') as HTMLInputElement;
    const file = part.files[0];
    m.uploadSingleImageByFile(file, 'test', ['sdk-b']);
});
