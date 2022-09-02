function addPagination(req, res, next) {
    let { limit, page, direction, orderBy } = req.query;

    limit = limit || 10;
    page = page ? Math.abs(page - 1) : 0; // mozda samo page || 0
    direction = direction || "desc";
    orderBy = orderBy || "createdAt";

    req.params.pagination = {
        orderBy: orderBy,
        direction: direction,
        offset: page * limit,
        limit: limit
    };
    
    next();
}

module.exports = {
    addPagination,
};
