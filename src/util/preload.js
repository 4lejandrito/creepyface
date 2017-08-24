import loadImages from 'image-promise';
import isFirefox from 'is-firefox';

function showAndHideImages(imgs) {
    imgs.forEach(img => {
        img.style.position = 'fixed';
        img.style.height = '0px';
        document.body.appendChild(img);
        setTimeout(() => document.body.removeChild(img), 1000);
    });
}

export default function preload(img, srcs) {
    return loadImages(srcs).then(imgs => {
        img.creepyFaceReachableImages = imgs;
        if (isFirefox) showAndHideImages(imgs);
    });
};
