export type ServerResponse = {
  [key: string]: any;
};

export const sendImagesToServer = async (imageStack: string[]): Promise<ServerResponse> => {
  try {
    const formData = new FormData();

    imageStack.forEach((uri, index) => {
      const fileName = uri.split('/').pop() || `photo${index}.jpg`;
      const fileType = 'image/jpeg';

      formData.append('files', {
        uri,
        name: fileName,
        type: fileType,
      } as any);
    });

    const response = await fetch(process.env.EXPO_PUBLIC_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const json: ServerResponse = await response.json();
    return json;
  } catch (err) {
    console.error('ERROR: Error uploading images:', err);
    return { error: 'ERROR: Upload failed' };
  }
};
