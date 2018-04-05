import Reflux from "reflux";
import createStore from "reflux-core/lib/createStore";
import Immutable from "immutable";
import SearchActions from "../actions/search.js";
import ObjectID from "bson-objectid";
import {
  merge,
  mapValues,
  forEach,
  omit,
  chunk,
  filter,
  reduce,
  trimStart,
  forIn
} from "lodash";
import DateTimeFormat from "date-and-time";
import axios from "axios";
import { serverURL } from "../appsettings.js";
import { AUTH_TOKEN, ACCESS_KEY, eventsLimit } from "../appsettings.js";
//axios.defaults.headers.common["accesskey"] = ACCESS_KEY;
const AppStore = Reflux.createStore({
  listenables: [SearchActions],
  _allEvents: Immutable.Map({}),
  _skip: 0,
  _limit: eventsLimit,
  _key: "",
  _totalPages: Immutable.Map(),
  init: function() {
    this.state = Immutable.Map({
      events: Immutable.Map(),
      totalPage: 0,
      currentPage: 0,
      searchedResults: 0,
      showLoader: false
    });
  },
  updateState: function(newState, suppressTrigger) {
    if (this.state.equals(newState)) {
      return;
    }
    if (newState) {
      this.state = newState;
    }

    if (!suppressTrigger) {
      this.trigger(this.state);
    }
  },
  next: function() {
    let pageNo = this.state.get("currentPage"),
      totalPage = this.state.get("totalPage");
    if (!totalPage) {
      return;
    }
    this.updateState(
      this.state.set("currentPage", Math.min(pageNo + 1, totalPage - 1)),
      true
    );
    this.getEvents();
  },
  prev: function() {
    let pageNo = this.state.get("currentPage");
    this.updateState(
      this.state.set("currentPage", Math.max(pageNo - 1, 0)),
      true
    );
    this.getEvents();
  },
  jumpTo: function(pageNo) {
    this.updateState(this.state.set("currentPage", pageNo), true);
    this.getEvents();
  },
  getAfterTotal: function() {
    return axios({
      url: `${serverURL}/svc/api/Events`,
      method: "GET",
      params: {
        filter: {
          where: {
            or: [
              { Title: { like: `.*${this._key}.*`, options: "i" } },
              { Tags: { regexp: `^${this._key}.*/i` } }
            ]
          },
          fields: ["id"]
        }
      }
    }).then(response => {
      let { data } = response;
      this.updateState(
        this.state
          .set("totalPage", Math.ceil(data.length / this._limit))
          .set("searchedResults", data.length)
          .set("currentPage", 0)
      );
      return this.getEvents();
    });
  },
  getEvents: function() {
    let pageNo = this.state.get("currentPage");
    this._skip = this._limit * pageNo;
    return axios({
      url: `${serverURL}/svc/api/Events`,
      method: "GET",
      params: {
        filter: {
          where: {
            or: [
              { Title: { like: `.*${this._key}.*`, options: "i" } },
              {
                Tags: { regexp: `^${this._key}.*/i` }
              }
            ]
          },
          limit: this._limit,
          skip: this._skip
        }
      }
    }).then(response => {
      let { data } = response,
        events = Immutable.Map();
      data.forEach(event => {
        events = events.set(event.id, Immutable.Map(event));
      });
      this.updateState(
        this.state
          .set(
            "events",
            this._skip ? this.state.get("events").merge(events) : events
          )
          .set("showLoader", false)
      );
    });
  },
  loadEvents: function(key) {
    this._key = key;
    this.updateState(this.state.set("showLoader", true));
    return this.getAfterTotal();
  },
  triggerState: function() {
    this.trigger(this.state);
  },
  reset: function() {
    this._skip = 0;
    this.updateState(
      this.state
        .set("currentPage", 0)
        .set("totalPage", 0)
        .set("events", Immutable.Map())
        .set("searchedResults", 0)
        .set("showLoader", false)
    );
  }
});

export default AppStore;
