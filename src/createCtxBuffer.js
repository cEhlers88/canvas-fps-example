export const createCtxBuffer = (width, height) => {
    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    return buffer.getContext('2d');
}