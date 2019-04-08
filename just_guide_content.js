const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const just_guide_content = (html) => {

    const { document } = (new JSDOM(html)).window;
    const main_content = document.querySelector("div[role='main']").innerHTML;

    // Remove extra whitespace before returning
    return main_content.replace(/\n|(\s+)/g, ' ');
};

exports.just_guide_content = just_guide_content;