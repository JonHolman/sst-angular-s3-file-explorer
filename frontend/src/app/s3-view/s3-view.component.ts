import { Component, OnInit } from '@angular/core';
import { Storage, Predictions } from "aws-amplify";
import { Observable, firstValueFrom, of } from 'rxjs';
import { config } from '../../config';
import { HttpClient } from "@angular/common/http";

class s3Object {
    eTag?: string | undefined;
    key: string | undefined;
    lastModified?: Date | undefined;
    size?: number | undefined;
    folder?: boolean;
}

@Component({
    selector: 'app-s3-view',
    templateUrl: './s3-view.component.html',
    styleUrls: ['./s3-view.component.css']
})
export class S3ViewComponent implements OnInit {
    currentFolder = '';
    s3Contents!: Observable<s3Object[]>;
    previewObjectKeyLeft = '';
    previewLeftImageUrl = '';
    previewTextUrl = '';
    previewLeftTextContent = '';
    previewRightTextContent = '';
    uploadStatus = '';
    loading = false;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.refreshS3Contents()
    }

    clearPreviews() {
        this.previewObjectKeyLeft = '';
        this.previewLeftImageUrl = '';
        this.previewTextUrl = '';
        this.previewLeftTextContent = '';
        this.previewRightTextContent = '';
    }

    async objectClick(elem: s3Object) {
        // clear previous previews
        this.clearPreviews();

        if ('folder' in elem && elem.folder) {
            if (elem.key == '..') {
                const foldersInCurrentPath = this.currentFolder.split('/');
                this.currentFolder = foldersInCurrentPath.slice(0, foldersInCurrentPath.length - 2).join('/');
                if (this.currentFolder)
                    this.currentFolder += '/';
            } else {
                this.currentFolder += elem.key + '/'
            }
        } else {
            const key = this.currentFolder + elem.key

            try {
                const presignedUrl = await Storage.get(key);

                // set the key to be displayed above the preview
                this.previewObjectKeyLeft = key;

                // Doing a small get request using the range header to find out the content-type, the pre-signed URL does not work for HEAD requests.
                const data = await firstValueFrom(this.http.get(presignedUrl, { responseType: 'blob', headers: { 'Range': 'bytes=0-1' } }));
                const fileContentType = data.type;
                switch (fileContentType) {
                    case 'image/png':
                    case 'image/jpeg':
                        this.previewLeftImageUrl = presignedUrl;
                        break;
                    case 'text/plain':
                        try {
                            const downloadResponse = await Storage.get(key, { download: true });
                            this.previewLeftTextContent = await (<Blob>downloadResponse.Body).text()
                        } catch (err) {
                            console.log('Error getting file\'s content:', err)
                        }
                        break;
                    default:
                        alert('No preview yet for ' + fileContentType)
                }
            } catch (err) {
                console.log('Error retrieving presigned URL for preview:', err)
            }
        }
        this.refreshS3Contents();
    }

    async refreshS3Contents() {
        // console.log('this.currentFolder:', this.currentFolder)

        try {
            const items = await Storage.list(this.currentFolder);

            // console.log('item:', item)
            const { files, folders } = this.processStorageList(items);

            // console.log('files:', files);
            // console.log('folders:', folders);

            let displayFolders: s3Object[] = [];
            if (this.currentFolder !== '')
                displayFolders.push({ key: '..', folder: true })
            displayFolders = displayFolders.concat(folders.map(folder => ({ key: <string>folder, folder: true })));

            this.s3Contents = of(displayFolders.concat(files))
        } catch (err) {
            console.log('Error:', err);
            this.s3Contents = of([])
        }
    }

    async renameFile(elem: s3Object) {
        const currentKey = this.currentFolder + elem.key
        const newFileKey = prompt('Enter new key for ' + currentKey, currentKey);

        // copy object to the new key, then remove the old object
        try {
            await Storage.copy({ key: currentKey }, { key: <string>newFileKey })
            try {
                await Storage.remove(currentKey)
                this.refreshS3Contents();
            } catch (err) {
                console.log('Error removing old file:', err)
            }
        } catch (err) {
            console.log('Error creating new file:', err)
        }
    }

    getBreadcrumbs() {
        const foldersInCurrentPath = this.currentFolder.split('/');
        const path = foldersInCurrentPath.slice(0, foldersInCurrentPath.length - 1)
        let cumulativePath = ''
        return path.map(i => {
            cumulativePath += i + '/'
            return { item: i, cumulativePath: cumulativePath };
        });
    }

    jumpToFolder(dest: string) {
        this.currentFolder = dest;
        this.refreshS3Contents();
    }

    async createFolder() {
        const newFolderName = prompt('Enter name for the new folder: ');
        if (newFolderName) {
            try {
                await Storage.put(this.currentFolder + newFolderName + '/', '',)
                this.refreshS3Contents()
            } catch (err) {
                console.log('Error creating folder:', err)
            }
        }
    }

    // originally from: https://docs.amplify.aws/lib/storage/list/q/platform/js/
    processStorageList(result: s3Object[]) {
        const files: s3Object[] = [];
        const foldersSet = new Set();
        let possibleFolder;
        result.forEach((res: s3Object) => {
            if (res.size) {
                if (res.key?.includes(this.currentFolder) && res.key.replace(this.currentFolder, '').indexOf('/') == -1) {
                    const item = res;
                    item.key = item.key?.replace(this.currentFolder, '')
                    files.push(item)
                }
                // sometimes files declare a folder with a / within the key
                possibleFolder = res.key?.split('/').slice(0, -1).join('/')
                if (possibleFolder && possibleFolder.includes(this.currentFolder) && possibleFolder.replace(this.currentFolder, '').indexOf('/') == -1) {
                    // console.log('possibleFolder', possibleFolder)
                    foldersSet.add(possibleFolder.replace(this.currentFolder, ''))
                }
            } else {
                const folder = res.key
                const pathAfterCurrentFolder: string | undefined = folder?.replace(this.currentFolder, '')
                if (pathAfterCurrentFolder?.indexOf('/') !== -1) {
                    const immediateSubfolder: string | undefined = pathAfterCurrentFolder?.split('/')[0]
                    foldersSet.add(immediateSubfolder)
                }
            }
        })
        // console.log(files)
        const folders = [...foldersSet]
        return { files, folders }
    }

    clickUploadButton() {
        // learned this from https://www.youtube.com/watch?v=-k25QvjnIpY
        (<HTMLInputElement>document.getElementById('upload-file')).click();
    }

    async deleteObject(elem: s3Object) {
        if (window.confirm(`Are you sure you want to delete the ${elem.folder ? 'folder' : 'file'} ${this.currentFolder + elem.key}?`)) {
            if (!elem.folder) {
                try {
                    await Storage.remove(this.currentFolder + elem.key)
                    this.refreshS3Contents()
                } catch (err) {
                    console.log('Error deleting file:', err)
                }
            } else {
                try {
                    const ls = await Storage.list(this.currentFolder + elem.key + '/')
                    if (ls.length === 0 || (ls.length === 1 && ls[0].key === this.currentFolder + elem.key + '/')) {
                        try {
                            await Storage.remove(this.currentFolder + elem.key + '/')
                            this.refreshS3Contents()
                        } catch (err) {
                            console.log('Error deleting folder:', err)
                        }
                    } else {
                        alert('directory is not empty, not deleting')
                    }
                } catch (err) {
                    console.log('Error getting folder\'s directory listing:', err);
                }
            }
        }
    }

    // refered by https://github.com/sw-yx/demo-amplify-storage-file-upload/blob/main/src/DownloadButton.svelte
    // https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
    downloadBlob(blob: Blob, filename: string) {
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename || "download";
            const clickHandler = () => {
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    a.removeEventListener("click", clickHandler);
                }, 150);
            };
            a.addEventListener("click", clickHandler, false);
            a.click();
            return a;
        } else {
            return;
        }
    }

    // help from https://github.com/sw-yx/demo-amplify-storage-file-upload/blob/main/src/DownloadButton.svelte
    async fileDownload(elem: s3Object) {
        const foldersInPath = elem?.key?.split('/');
        if (foldersInPath) {
            const fileName: string = foldersInPath[foldersInPath.length - 1]
            try {
                const downloadResponse = await Storage.get(this.currentFolder + elem.key, { download: true });
                this.downloadBlob(<Blob>downloadResponse.Body, fileName)
            } catch (err) {
                console.log('Error downloading file:', err)
            }
        }
    }

    async fileUpload(event: Event) {
        const MAX_ATTACHMENT_SIZE: number = 10 * 1000 * 1000;
        const htmlInputElement: HTMLInputElement = (event.target as HTMLInputElement)
        const file: File = (htmlInputElement.files as FileList)[0];

        if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
            (<HTMLInputElement>document.getElementById('upload-file')).value = '';
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }
        const key = this.currentFolder + file.name;
        // console.log('will create key ' + key)

        try {
            await Storage.put(key, file, {
                progressCallback: (progress) => {
                    this.uploadStatus = `Uploading ${key} - ${Math.round((progress.loaded / progress.total) * 1000) / 10}% complete`
                    setTimeout(() => this.uploadStatus = '', 10000); // clear the message after 10 seconds
                }, contentType: file.type
            })
            this.refreshS3Contents()
        } catch (err) {
            console.log('Error uploading file:', err)
        }
    }

    // original from: https://github.com/awslabs/aws-js-s3-explorer/blob/v2-alpha/explorer.js
    // Utility to convert bytes to readable text e.g. "2 KB" or "5 MB"
    bytesToSize(bytesString: string) {
        const bytes = parseInt(bytesString)
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        const ii: number = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${Math.round(bytes * 10 / (1024 ** ii)) / 10} ${sizes[ii]}`;
    }

    displayedColumns: string[] = ['key', 'size', 'lastModified', 'actions'];

    async clickOcrButton() {
        try {
            this.loading = true
            const ocrResults = await Predictions.identify({ text: { source: { key: this.previewObjectKeyLeft } } })
            this.loading = false
            this.previewRightTextContent = ocrResults.text.lines.join('\n');
        } catch (err) {
            console.log('Error running OCR on file:', err)
        }
    }

    async clickSaveButton() {
        const newFileKey = prompt('Enter key to save this object:', '');
        if (newFileKey) {
            try {
                await Storage.put(newFileKey, this.previewRightTextContent, { contentType: "text/plain" })
                this.clearPreviews();
                this.refreshS3Contents()
            } catch (err) {
                console.log('Error creating new file:', err)
            }
        }
    }

    async clickTranslateButton() {
        try {
            this.loading = true
            const translateResults = await Predictions.convert({ translateText: { source: { text: this.previewLeftTextContent, language: "en" }, targetLanguage: "es" } })
            this.loading = false
            this.previewRightTextContent = translateResults.text;
        } catch (err) {
            console.log('Error translating text:', err)
        }
    }
}
