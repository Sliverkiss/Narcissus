export default class MongoDB {
    /**
     * Initializes MongoDB client
     * @param {*} BASE_URL Base URL of the API
     * @param {*} DATA_SOURCE Data source name
     * @param {*} DATABASE Database name
     * @param {*} COLLECTION Collection name
     * @param {*} API_KEY API key for authentication
     */
    constructor(BASE_URL, DATA_SOURCE, DATABASE, COLLECTION, API_KEY) {
        this.BASE_URL = BASE_URL;
        this.dataSource = DATA_SOURCE;
        this.database = DATABASE;
        this.collection = COLLECTION;
        this.apiKey = API_KEY;
    }

    // Public method for making POST requests
    async commonPost(options) {
        const { url: u, headers: h, body: b, method: m = "POST" } = options;

        const opts = {
            method: m,
            headers: {
                "api-key": this.apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...h
            },
            body: JSON.stringify({
                dataSource: this.dataSource,
                database: this.database,
                collection: this.collection,
                ...b
            })
        };

        try {
            const response = await fetch(`${this.BASE_URL}${u}`, opts);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error:', error);
            throw error;
        }
    }

    // Find a single document
    async findOne(document) {
        const opts = {
            url: "/findOne",
            body: { filter: document }
        };
        return await this.commonPost(opts);
    }

    // Find multiple documents
    async find(document) {
        const opts = {
            url: "/find",
            body: { filter: document }
        };
        return await this.commonPost(opts);
    }

    // Insert a single document
    async insertOne(document) {
        const opts = {
            url: "/insertOne",
            body: { document: document }
        };
        return await this.commonPost(opts);
    }

    // Insert multiple documents
    async insertMany(documents) {
        const opts = {
            url: "/insertMany",
            body: { documents: documents }
        };
        return await this.commonPost(opts);
    }

    // Update a single document
    async updateOne(filter, document) {
        const opts = {
            url: "/updateOne",
            body: { filter: filter, update: document }
        };
        return await this.commonPost(opts);
    }

    // Update multiple documents
    async updateMany(filter, document) {
        const opts = {
            url: "/updateMany",
            body: { filter: filter, update: document }
        };
        return await this.commonPost(opts);
    }

    // Delete a single document
    async deleteOne(filter) {
        const opts = {
            url: "/deleteOne",
            body: { filter: filter }
        };
        return await this.commonPost(opts);
    }

    // Delete multiple documents
    async deleteMany(filter) {
        const opts = {
            url: "/deleteMany",
            body: { filter: filter }
        };
        return await this.commonPost(opts);
    }
}