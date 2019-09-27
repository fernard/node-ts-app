import { DocumentQuery } from 'mongoose';
import { omit } from 'lodash';

export class QueryHandler {
    private mongooseQuery: DocumentQuery<any, any>;
    private readonly queryParams: any;

    constructor(mongooseQuery: DocumentQuery<any, any>, queryParams: any) {
        this.mongooseQuery = mongooseQuery;
        this.queryParams = this.parseInequalityParam(queryParams);
    }

    private parseInequalityParam(queryParams) {
        const queryStr = JSON.stringify(queryParams);
        const queryObj = JSON.parse(queryStr.replace(/\b([gl]te?)\b/g, match => `$${match}`));
        return queryObj;
    }

    private joinBySpace(sortStr) {
        return sortStr
            .split(',')
            .join(' ')
            .trim();
    }

    public getQuery() {
        return this.mongooseQuery;
    }
    public filter() {
        const filteredQuery = omit(this.queryParams, ['page', 'sort', 'limit', 'fields']);
        this.mongooseQuery = this.mongooseQuery.find(filteredQuery);

        return this;
    }
    public sort() {
        const sortBy = this.queryParams.sort ? this.joinBySpace(this.queryParams.sort) : '-createdAt';
        this.mongooseQuery = this.mongooseQuery.sort(sortBy);

        return this;
    }
    public selectFields() {
        const selectedFields = this.queryParams.fields ? this.joinBySpace(this.queryParams.fields) : '-__v';
        this.mongooseQuery = this.mongooseQuery.select(selectedFields);

        return this;
    }
    public paginate() {
        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;
        const skip = (page - 1) * limit;
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        return this;
    }
}
