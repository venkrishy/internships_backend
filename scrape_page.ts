import axios, { AxiosRequestConfig } from 'axios';
import cheerio from 'cheerio';

class Row {
    index: number;
    id: number;
    name: string; name_html: string; location: string; location_html: string;
    closed: boolean; notes: string; notes_html: string; notes_hrefs: string[]
};

function parse_page(htmldata) {
    let arrays: Row[] = []

    const table_search = '#readme > div.Box-body.px-5.pb-5 > article > table > tbody > tr > td';
    const $ = cheerio.load(htmldata);
    let counter = 0
    let row = new Row();
    let row_index = 0;
    $(table_search).each((index, element) => {
        const parsed_element = $(element);
        let html = remove_extra_spaces($(element).html().replace(/\"/g, "'"));
        const parsed_element_text = parsed_element.text();
        const parsed_text_without_emojis = remove_emojis(parsed_element_text);
        const text = remove_extra_spaces(parsed_text_without_emojis.trim());
        if (counter == 0) {
            row.name = text
            row.name_html = html
        }
        if (counter == 1) {
            row.location = text
            row.location_html = html
        }
        if (counter == 2) {
            row.notes = text
            row.notes_html = html
            let hrefs = [];
            parsed_element.find('> a').each((index2, element2) => {
                let anchor_text = $(element2).text();
                let link_target = $(element2).attr('href');
                hrefs.push({ anchor_text, link_target });
            });
            row.notes_hrefs = hrefs;
        }
        counter += 1
        if (counter == 3) {
            row.id = row_index;
            row.index = row_index;
            row.closed = (row.notes.indexOf("Closed") >= 0)
            if (!row.closed) {
                arrays.push(row)
            }
            row = new Row();
            counter = 0
            row_index += 1;

        }
    });
    return arrays.reverse();
}

function remove_extra_spaces(text) {
    return text.replace(/\s\s+/g, ' ');
}
function remove_emojis(text) {
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
}

export async function scrape(url: string) {
    try {
        console.log("SCRAPE PAGE URL IS ", url);
        const result = await axios.get(url);
        if (result.status === 200 && result.data) {
            const parsed_page = parse_page(result.data);
            return parsed_page;
        } else {
            this.log.error(`fetch ${url} failed with status: ${result.status}`);
        }
    } catch (error: any) {
        this.log.error(`fetch ${url} failed with error: ${error.code || error.response.status}`);
        return [];
    }
};



