"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrape = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
class Row {
}
;
function parse_page(htmldata) {
    let arrays = [];
    const table_search = '#readme > div.Box-body.px-5.pb-5 > article > table > tbody > tr > td';
    const $ = cheerio_1.default.load(htmldata);
    let counter = 0;
    let row = new Row();
    let row_index = 0;
    $(table_search).each((index, element) => {
        const parsed_element = $(element);
        let html = remove_extra_spaces($(element).html().replace(/\"/g, "'"));
        const parsed_element_text = parsed_element.text();
        const parsed_text_without_emojis = remove_emojis(parsed_element_text);
        const text = remove_extra_spaces(parsed_text_without_emojis.trim());
        if (counter == 0) {
            row.name = text;
            row.name_html = html;
        }
        if (counter == 1) {
            row.location = text;
            row.location_html = html;
            row.closed = text.includes("Closed");
        }
        if (counter == 2) {
            row.notes = text;
            row.notes_html = html;
            let hrefs = [];
            parsed_element.find('> a').each((index2, element2) => {
                let anchor_text = $(element2).text();
                let link_target = $(element2).attr('href');
                hrefs.push({ anchor_text, link_target });
            });
            row.notes_hrefs = hrefs;
        }
        counter += 1;
        if (counter == 3) {
            row.id = row_index;
            row.index = row_index;
            arrays.push(row);
            row = new Row();
            counter = 0;
            row_index += 1;
        }
    });
    return arrays;
}
function remove_extra_spaces(text) {
    return text.replace(/\s\s+/g, ' ');
}
function remove_emojis(text) {
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
}
async function scrape(url) {
    try {
        const result = await axios_1.default.get(url);
        if (result.status === 200 && result.data) {
            const parsed_page = parse_page(result.data);
            return parsed_page;
        }
        else {
            this.log.error(`fetch ${url} failed with status: ${result.status}`);
        }
    }
    catch (error) {
        this.log.error(`fetch ${url} failed with error: ${error.code || error.response.status}`);
        return [];
    }
}
exports.scrape = scrape;
;
