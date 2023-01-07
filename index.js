"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const scrape_page_1 = require("./scrape_page");
const handler = async (event, context, callback) => {
    const results = await (0, scrape_page_1.scrape)(process.env.WEBSCRAPE_PAGE);
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(results)
    };
    return response;
};
exports.handler = handler;
