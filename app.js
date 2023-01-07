"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scrape_page_1 = require("./scrape_page");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
var cors = require('cors');
app.use(cors());
app.get('/', async (req, res) => {
    const results = await (0, scrape_page_1.scrape)("https://github.com/pittcsc/Summer2023-Internships");
    res.send(results);
});
var port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
