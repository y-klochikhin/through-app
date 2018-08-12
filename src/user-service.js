export class UserService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    getUrl({path = '', params = {}}) {
        let queryString = Object.keys(params)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');

        queryString = queryString ? '?' + queryString : '';

        return this.baseUrl + path + queryString;
    }

    request({path = '', params = {}, init = {}}) {
        return fetch(this.getUrl({path: path, params: params}), init)
            .then(response => response.json());
    }

    getUsers(offset = 0, limit = 20) {
        return this.request({params: {offset: offset, limit: limit}});
    }

    getUser(id) {
        return this.request({path: '/' + id});
    }

    getTransactions(userId, dateFrom, dateTo) {
        if (!dateFrom) {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            dateFrom = date.toISOString();
        }
        else {
            dateFrom = dateFrom.toISOString();
        }

        if (!dateTo) {
            dateTo = (new Date()).toISOString();
        }
        else {
            dateTo = dateTo.toISOString();
        }

        dateFrom = dateFrom.split('.')[0] + 'Z';
        dateTo = dateTo.split('.')[0] + 'Z';

        return this.request({
            path: '/' + userId + '/transactions',
            params: {
                datetime_from: dateFrom,
                datetime_to: dateTo
            }
        });
    }
}