import {scrape} from './scrape_page';

export const handler = async(event, context, callback) => {
    const results = await scrape(process.env.WEBSCRAPE_PAGE);
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(results)
    };
    return response;
};



