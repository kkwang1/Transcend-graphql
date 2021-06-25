const db = require('./db');

const Query =
{
  searchTerm: (root, args, context, info) => {
    const  mapFn = (entry => { // entry is [key, value]
      const objList = (entry[1])[0];
      return [entry[0], objList.map(obj => obj.text)];
      // returns [key, list_of_selected]
    });
    selectedList = (Object.entries(args.options)).map(mapFn);

    const reduceAnd = ((total, bool) => total && bool);
    const reduceOr = ((total, bool) => total || bool);
    const filterFn = (item => {
      /*
      map [key, list_of_selected] for each type of filter; map to true if
      the item is contained in list_of_selected, false otherwise. 
      fitsFilters is true if all the filters are satisfied.
      */
      const fitsFilters = selectedList.map(filterInfo => {
        if ((filterInfo[1]).length == 0) {
          return true;
        } else {
          return ((filterInfo[1]).includes(item[(filterInfo[0])]));
        }
      });

      if(args.term === "") {
        return fitsFilters.reduce(reduceAnd);
      } else {
        // if the search term is non-empty, include results with any of the
        // words in args.term (case-insensitive, ignoring punctuation)
        const wordArr = args.term.split(/[\s,.!?:;]+/);
        return (wordArr.map((word) => 
            (item.name).toLowerCase().includes(word.toLowerCase())).reduce(reduceOr)
          ) && (fitsFilters.reduce(reduceAnd));
      }
    });
    return db.test.list().filter(filterFn);
  },
  allResults: () => db.test.list()
}

const Mutation = {
  createDummy:(root,args,context,info) => {
     return db.test.create({
      isParent:false,
      ageRange:-1,
      state:-1,
      transitionState:-1,
      IDEACategories:[],
      need: false})
  }
}
module.exports = { Query, Mutation }
