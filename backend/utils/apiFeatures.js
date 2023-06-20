class ApiFeatures {
  constructor(query, querystr) {
    (this.query = query), (this.querystr = querystr);
  }

  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  filter() {
    const copyQuery = { ...this.querystr };

    // remove some field ---
    const removfield = ["keyword", "page", "limit"];

    removfield.forEach((key) => delete copyQuery[key]);

    // filter for price and rating --
    let queryStrWithPriceAndRatingFilter = JSON.stringify(copyQuery);
    queryStrWithPriceAndRatingFilter = queryStrWithPriceAndRatingFilter.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(queryStrWithPriceAndRatingFilter));

    return this;
  }

  pagination(resultperpage) {
    const currentPage = Number(this.querystr.page) || 1;

    const skip = resultperpage * (currentPage - 1);

    this.query = this.query.limit(resultperpage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
