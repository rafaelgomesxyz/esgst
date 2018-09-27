import Module from '../../class/Module';
import {common} from '../Common';

const
  createElements = common.createElements.bind(common)
;

class GeneralEmbeddedVideos extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Embeds any YouTube/Vimeo videos found in a comment (in any page) into the comment.</li>
        <li>Videos are only embedded if their links are in the [URL](URL) format and are the only content in a line. For example, "[https://youtu.be/ihd9dKek2gc](https://youtu.be/ihd9dKek2gc)" gets embedded, but "[Watch this!](https://youtu.be/ihd9dKek2gc)" and "Watch this: [https://youtu.be/ihd9dKek2gc](https://youtu.be/ihd9dKek2gc)" do not.</li>
      </ul>
    `,
      id: `ev`,
      load: this.ev,
      name: `Embedded Videos`,
      sg: true,
      st: true,
      type: `general`
    };
  }

  ev() {
    this.esgst.endlessFeatures.push(this.ev_getVideos);
  }

  ev_getVideos(context, main, source, endless) {
    let types, i, numTypes, type, videos, j, numVideos, video, previous, next, embedUrl, url, text, title;
    types = [`youtube.com`, `youtu.be`, `vimeo.com`];
    for (i = 0, numTypes = types.length; i < numTypes; ++i) {
      type = types[i];
      videos = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} a[href*="${type}"], .esgst-es-page-${endless}a[href*="${type}"]` : `a[href*="${type}"]`}`);
      for (j = 0, numVideos = videos.length; j < numVideos; ++j) {
        video = videos[j];
        previous = video.previousSibling;
        next = video.nextSibling;
        if ((!previous || !previous.textContent.trim()) && (!next || !next.textContent.trim())) {
          // video is the only content in the line
          url = video.getAttribute(`href`);
          embedUrl = this.ev_getEmbedUrl(i, url);
          if (embedUrl) {
            text = video.textContent;
            if (url !== text) {
              title = `<div>${text}</div>`;
            } else {
              title = ``;
            }
            createElements(video, `outer`, [{
              type: `div`,
              children: [{
                text: title,
                type: `node`
              }, {
                attributes: {
                  allowfullscreen: `0`,
                  frameborder: `0`,
                  height: `360`,
                  src: embedUrl,
                  width: `640`
                },
                type: `iframe`
              }]
            }]);
          }
        }
      }
    }
  }

  ev_getEmbedUrl(i, url) {
    let regExps, regExp, match, baseUrls, baseUrl, code;
    regExps = [
      /youtube.com\/watch\?v=(.+?)(\/.*)?(&.*)?$/,
      /youtu.be\/(.+?)(\/.*)?$/,
      /vimeo.com\/(.+?)(\/.*)?$/
    ];
    regExp = regExps[i];
    match = url.match(regExp);
    if (match) {
      baseUrls = [
        `https://www.youtube.com/embed/`,
        `https://www.youtube.com/embed/`,
        `https://player.vimeo.com/video/`
      ];
      baseUrl = baseUrls[i];
      code = match[1];
      return `${baseUrl}${code}`;
    } else {
      return null;
    }
  }
}

export default GeneralEmbeddedVideos;