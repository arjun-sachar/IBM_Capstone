import moment from "moment";
import _ from "lodash";

const FiltersObject = {};

export default {
  // Meta
  addFilter(filterObj) {
    if (!(filterObj.name in FiltersObject)) {
      // name, type, getData, params, label, defaultValue
      FiltersObject[filterObj.name] = {
        type: filterObj.type ? filterObj.type : "default",
        selected: filterObj.defaultValue || null,
        data: filterObj.data,
        maxCount: filterObj.maxCount || 10,
        label: filterObj.label || "",
        all: filterObj.all || false,
        show: filterObj.defaultOpen || false,
      };
      FiltersObject[filterObj.name]._originalSelected = _.cloneDeep(
        FiltersObject[filterObj.name].selected
      );
      return new Promise((resolve) => {
        filterObj
          .data(filterObj.params)
          .then((resp) => {
            FiltersObject[filterObj.name].values = resp;
            resolve();
          })
          .catch(() => {
            FiltersObject[filterObj.name].values = [];
            resolve();
          });
      });
    }
  },
  addFilters(filterObjs) {
    const promises = [];
    filterObjs.forEach((filterObj, ind) => {
      if (!(filterObj.name in FiltersObject)) {
        // name, type, getData, params, label, defaultValue
        promises.push(
          new Promise((resolve, reject) => {
            FiltersObject[filterObj.name] = {
              type: filterObj.type ? filterObj.type : "default",
              label: filterObj.label || "",
              maxCount: filterObj.maxCount || 10,
              index: ind,
              all: filterObj.all || false,
              show: filterObj.defaultOpen || false,
              group: filterObj.group || "dropdown",
            };
            if (
              filterObj.data == null &&
              FiltersObject[filterObj.name].group == "date"
            ) {
              FiltersObject[filterObj.name].values = null;
              FiltersObject[filterObj.name].selected =
                filterObj.defaultValue != undefined
                  ? filterObj.defaultValue
                  : null;
              FiltersObject[filterObj.name].data = function (current) {
                if (
                  "date" in filterObj &&
                  "minDate" in filterObj.date &&
                  "maxDate" in filterObj.date
                ) {
                  return (
                    current < moment(filterObj.date.minDate) ||
                    current > moment(filterObj.date.maxDate)
                  );
                } else if ("date" in filterObj && "minDate" in filterObj.date) {
                  return current < moment(filterObj.date.minDate);
                } else if ("date" in filterObj && "maxDate" in filterObj.date) {
                  return current > moment(filterObj.date.maxDate);
                } else {
                  return false;
                }
              };
              FiltersObject[filterObj.name]._originalSelected = _.cloneDeep(
                FiltersObject[filterObj.name].selected
              );
              resolve(true);
            } else {
              const setValuesAndResolve = (resp) => {
                FiltersObject[filterObj.name].values = resp;
                FiltersObject[filterObj.name].selected =
                  filterObj.defaultValue != undefined
                    ? filterObj.defaultValue
                    : filterObj.all
                    ? "all"
                    : resp[0].key;
                FiltersObject[filterObj.name]._originalSelected = _.cloneDeep(
                  FiltersObject[filterObj.name].selected
                );
                resolve(true);
              };
              if (typeof filterObj.data === "function") {
                filterObj
                  .data(filterObj.params)
                  .then((resp) => {
                    setValuesAndResolve(resp);
                  })
                  .catch((e) => {
                    FiltersObject[filterObj.name].values = [];
                    FiltersObject[filterObj.name].selected = [];
                    resolve(true);
                  });
              } else {
                setValuesAndResolve(filterObj.data);
              }
            }
          })
        );
      }
    });
    return Promise.all(promises);
  },
  getFilter(name) {
    return FiltersObject[name];
  },
  setFilterSingleValue(name, value) {
    FiltersObject[name].selected = value;
  },
  getSelected(name) {
    return FiltersObject[name].selected;
  },
  getValues(name) {
    return FiltersObject[name].values;
  },
  resetFilter(name) {
    FiltersObject[selected] = FiltersObject[selected]._originalSelected;
  },
  resetFilters() {
    for (const key in FiltersObject) {
      if (Object.prototype.hasOwnProperty.call(FiltersObject, key)) {
        FiltersObject[key].selected = FiltersObject[key]._originalSelected;
      }
    }
  },
  hideFilters(name) {
    for (const key in FiltersObject) {
      if (
        Object.prototype.hasOwnProperty.call(FiltersObject, key) &&
        key != name
      ) {
        FiltersObject[key].show = false;
      }
    }
  },
  getFilterNames() {
    return Object.keys(FiltersObject);
  },
  getFilters() {
    const filterArr = [];
    for (const key in FiltersObject) {
      if (Object.prototype.hasOwnProperty.call(FiltersObject, key)) {
        const filterObj = FiltersObject[key];
        filterObj.name = key;
        filterArr.push(filterObj);
      }
    }
    filterArr.sort(function (a, b) {
      return a.index - b.index;
    });
    return filterArr;
  },
  changedFilters(newFilters, oldFilters) {
    const changed = [];
    newFilters.forEach((n) => {
      const oldFilter = oldFilters.find((o) => o.name === n.name);
      if (JSON.stringify(oldFilter.selected) != JSON.stringify(n.selected)) {
        changed.push(n);
      }
    });
    return changed;
  },
};
