import { Storage } from 'aws-amplify';

const PICTURE = 'picture';
const PROTECTED = 'protected';

async function get(cognitoId) {
  try {
    const result = await Storage.get(PICTURE, {
      download: true,
      identityId: cognitoId,
      level: PROTECTED,
    });

    const blob = new Blob([new Uint8Array(result.Body)], { type: 'image/jpeg' });

    return URL.createObjectURL(blob);
  } catch {
    return '/icon-512x512.png';
  }
}

async function put(pictureBlob) {
  // This will save the picture to the following path in S3: protected/[cognitoId]/picture
  // where [cognitoId] is the logged-in user's cognitoId.
  const response = await Storage.put(PICTURE, pictureBlob, { level: PROTECTED });

  return response;
}

async function remove() {
  // This will remove the logged-in user's picture.
  const response = await Storage.remove(PICTURE, { level: PROTECTED });

  return response;
}

export default { get, put, remove };
