import axios from 'axios';
import SparkMD5 from 'spark-md5';
import sha1 from 'js-sha1';
import { authRequest } from './request';
import { ApiResponse } from './auth';

export interface CreateUploadData {
  upload_id: number;
  part_size: number;
  part_num: number;
  upload_setting: string;
  complete_url: string;
  cloud_type?: string;
  is_upload_end?: number;
  url?: string;
  origin_filename?: string;
  part_now?: number;
}

export interface SignItem {
  host: string;
  dir: string;
  filename: string;
  type: string;
  policy: string;
  signature: string;
  callback: string;
  accessid?: string;
  acl?: string;
  'x-amz-Signature'?: string;
  'x-amz-algorithm'?: string;
  'x-amz-credential'?: string;
  'x-amz-date'?: string;
  upload_id?: number;
  part_now?: number;
  fixed_download_filename?: string;
}

export interface CreateUploadResponse {
  upload_id: number;
  part_size: number;
  part_num: number;
  upload_setting: string;
  complete_url: string;
  cloud_type?: string;
  is_upload_end?: number;
  url?: string;
  origin_filename?: string;
  part_now?: number;
}

export interface CompleteUploadData {
  url: string;
  path: string;
  upload_id: number;
  origin_filename: string;
  type?: string[];
  duration?: number | null;
}

export interface UploadOptions {
  upload_type?: string;
  upload_setting?: string;
  chunk_size?: number;
  enableHash?: boolean;
  onProgress?: (percent: number, stage: 'hashing' | 'uploading') => void;
}

const DEFAULT_CHUNK_SIZE = 200 * 1024;
const HASH_CHUNK_SIZE = 2 * 1024 * 1024;

export function createUpload(body: {
  total_size: number;
  part_size: number;
  file_type: string;
  filename: string;
  upload_type: string;
  upload_setting: string;
  md5?: string;
  sha1?: string;
}) {
  return authRequest.post<ApiResponse<CreateUploadResponse>>('api/uploads', body);
}

export function uploadChunkToCloud(url: string, formData: FormData) {
  return axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    validateStatus: (status) => status >= 200 && status < 300,
  }).then(res => {
    return res;
  });
}

export function uploadChunkToLocal(formData: FormData) {
  return authRequest.post<ApiResponse<null>>('api/upload/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

function isFullUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function completeUpload(uploadId: number, completeUrl?: string) {
  if (completeUrl && isFullUrl(completeUrl)) {
    return axios.put<ApiResponse<CompleteUploadData>>(
      `${completeUrl}${uploadId}`,
      {},
      {
        headers: {
          Authorization: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '',
          'x-isapi': '1',
        },
      }
    );
  }
  if (completeUrl && !isFullUrl(completeUrl)) {
    return authRequest.put<ApiResponse<CompleteUploadData>>(
      `${completeUrl}${uploadId}`
    );
  }
  return authRequest.put<ApiResponse<CompleteUploadData>>(
    `api/upload/cloud/completes/${uploadId}`
  );
}

function computeFileHash(file: File): Promise<{ md5: string; sha1: string } | null> {
  return new Promise((resolve) => {
    const blobSlice = File.prototype.slice;
    const spark = new SparkMD5.ArrayBuffer();
    let sha1Result = '';
    const chunks = Math.ceil(file.size / HASH_CHUNK_SIZE);
    let currentChunk = 0;
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      spark.append(arrayBuffer);
      sha1Result = sha1.sha1(arrayBuffer);

      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve({
          md5: spark.end(),
          sha1: sha1Result,
        });
      }
    };

    fileReader.onerror = () => {
      resolve(null);
    };

    function loadNext() {
      const start = currentChunk * HASH_CHUNK_SIZE;
      const end = start + HASH_CHUNK_SIZE >= file.size ? file.size : start + HASH_CHUNK_SIZE;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
  });
}

function getMediaDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    if (!file.type || (!file.type.startsWith('audio/') && !file.type.startsWith('video/'))) {
      resolve(null);
      return;
    }

    const url = URL.createObjectURL(file);
    const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');
    media.preload = 'metadata';

    media.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Math.round(media.duration));
    };

    media.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    media.src = url;
  });
}

function buildCloudParams(signItem: SignItem, cloudType?: string, fileType?: string): Record<string, string> {
  if (cloudType === 'aws') {
    return {
      key: signItem.dir + signItem.filename,
      'Content-Type': fileType || 'application/octet-stream',
      policy: signItem.policy,
      success_action_status: '200',
      callback: signItem.callback,
      signature: signItem.signature,
      'x-amz-Signature': signItem['x-amz-Signature'] || '',
      'x-amz-algorithm': signItem['x-amz-algorithm'] || '',
      'x-amz-credential': signItem['x-amz-credential'] || '',
      'x-amz-date': signItem['x-amz-date'] || '',
    };
  }

  if (cloudType === 'qcould') {
    return {
      key: signItem.dir + signItem.filename,
      'Content-Type': fileType || 'application/octet-stream',
      policy: signItem.policy,
      success_action_status: '200',
      callback: signItem.callback,
      signature: signItem.signature,
    };
  }

  return {
    key: signItem.dir + signItem.filename,
    'Content-Type': fileType || 'application/octet-stream',
    policy: signItem.policy,
    OSSAccessKeyId: signItem.accessid || '',
    success_action_status: '200',
    callback: signItem.callback,
    signature: signItem.signature,
    'x-oss-object-acl': signItem.acl || '',
  };
}

async function uploadChunksDirectToCloud(
  file: File,
  signList: SignItem[],
  cloudType: string | undefined,
  chunkSize: number,
  onProgress?: (percent: number, stage: 'hashing' | 'uploading') => void,
): Promise<void> {
  const totalParts = signList.length;

  for (let i = 0; i < totalParts; i++) {
    const signItem = signList[i];
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end, file.type);

    const formData = new FormData();
    const params = buildCloudParams(signItem, cloudType, file.type);

    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    formData.append('file', chunk, file.name);

    try {
      await uploadChunkToCloud(signItem.host, formData);
    } catch (err) {
      throw new Error(`Cloud upload part ${i + 1} failed`);
    }

    if (onProgress) {
      const percent = Math.round(((i + 1) / totalParts) * 100);
      onProgress(percent, 'uploading');
    }
  }
}

async function uploadChunksViaBackend(
  file: File,
  uploadId: number,
  chunkSize: number,
  onProgress?: (percent: number, stage: 'hashing' | 'uploading') => void,
): Promise<void> {
  const totalParts = Math.ceil(file.size / chunkSize);

  for (let partNow = 1; partNow <= totalParts; partNow++) {
    const start = (partNow - 1) * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('upload_id', String(uploadId));
    formData.append('part_now', String(partNow));

    await uploadChunkToLocal(formData);

    if (onProgress) {
      const percent = Math.round((partNow / totalParts) * 100);
      onProgress(percent, 'uploading');
    }
  }
}

export async function uploadImage(
  file: File,
  options: UploadOptions = {},
): Promise<CompleteUploadData> {
  const {
    upload_type = 'headimg',
    upload_setting = 'cloud',
    chunk_size = DEFAULT_CHUNK_SIZE,
    enableHash = false,
    onProgress,
  } = options;

  const createBody: Record<string, unknown> = {
    total_size: file.size,
    part_size: chunk_size,
    file_type: file.type || 'application/octet-stream',
    filename: file.name,
    upload_type,
    upload_setting,
  };

  if (enableHash) {
    const hashResult = await computeFileHash(file);
    if (onProgress) onProgress(100, 'hashing');
    if (hashResult) {
      createBody.md5 = hashResult.md5;
      createBody.sha1 = hashResult.sha1;
    }
  }

  const createRes = await createUpload(createBody as Parameters<typeof createUpload>[0]);
  const createResult = createRes.data;
  if (!createResult?.status || !createResult.data) {
    throw new Error(createResult?.error_msg || 'Failed to create upload');
  }

  const {
    upload_id,
    complete_url,
    cloud_type,
    is_upload_end,
    part_size: serverPartSize,
  } = createResult.data;

  const signList = createResult.list as SignItem[] | undefined;

  if (is_upload_end === 1) {
    const duration = await getMediaDuration(file);
    return {
      url: createResult.data.url || '',
      path: '',
      upload_id,
      origin_filename: createResult.data.origin_filename || file.name,
      duration,
    };
  }

  if (is_upload_end === 2) {
    const serverPartNow = createResult.data.part_now || 0;
    const serverPartNum = createResult.data.part_num || 0;
    if (serverPartNow === serverPartNum && serverPartNum > 0) {
      const completeRes = await completeUpload(upload_id, complete_url);
      const completeResult = completeRes.data;
      if (!completeResult?.status || !completeResult.data) {
        throw new Error(completeResult?.error_msg || 'Failed to complete upload');
      }
      return completeResult.data;
    }
  }

  const effectiveChunkSize = serverPartSize || chunk_size;

  if (signList && signList.length > 0) {
    await uploadChunksDirectToCloud(file, signList, cloud_type, effectiveChunkSize, onProgress);
  } else {
    await uploadChunksViaBackend(file, upload_id, effectiveChunkSize, onProgress);
  }

  const finalCompleteUrl = complete_url ? `${complete_url}${upload_id}` : `api/upload/cloud/completes/${upload_id}`;

  const completeRes = await completeUpload(upload_id, complete_url);
  const completeResult = completeRes.data;
  if (!completeResult?.status || !completeResult.data) {
    throw new Error(completeResult?.error_msg || 'Failed to complete upload');
  }

  const duration = await getMediaDuration(file);
  if (duration !== null) {
    completeResult.data.duration = duration;
  }

  return completeResult.data;
}
